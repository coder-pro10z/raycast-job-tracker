"""
Gmail JD Automator
------------------
Reads Gmail drafts that contain a job-description screenshot + recruiter
address, OCRs the JD, asks Claude to write a tailored outreach email
grounded in your actual resume, attaches your resume, and saves the
result as a NEW Gmail draft for you to review (or sends it directly if
SEND_MODE=send in .env).

Run `python main.py` after completing the setup steps in README.md.
"""

import os
import io
import re
import json
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from PIL import Image
import pytesseract

import anthropic

load_dotenv()

SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.compose",
]
CREDENTIALS_FILE = "credentials/credentials.json"
TOKEN_FILE = "credentials/token.json"
PROCESSED_LOG = "processed_drafts.json"
REVIEW_LOG = "review_log.csv"

RESUME_PATH = os.getenv("RESUME_PATH")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-5")
SEND_MODE = os.getenv("SEND_MODE", "draft")  # "draft" or "send"
MAX_DRAFTS = int(os.getenv("MAX_DRAFTS", "0"))  # 0 = no limit
YOUR_NAME = os.getenv("YOUR_NAME", "")
YOUR_PHONE = os.getenv("YOUR_PHONE", "")
YOUR_LINKEDIN = os.getenv("YOUR_LINKEDIN", "")

# Optional: NextApply Job Tracker integration
# If set, each processed draft is logged as a Job record in the tracker via webhook.
NEXTAPPLY_API_URL = os.getenv("NEXTAPPLY_API_URL", "")   # e.g. http://localhost:5089
NEXTAPPLY_API_KEY = os.getenv("NEXTAPPLY_API_KEY", "")   # same key used by the frontend

SOURCE_LABEL = "JD-Automator/Source-Processed"
GENERATED_LABEL = "JD-Automator/Generated"

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None


# ---------- Gmail auth ----------

def gmail_auth():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        os.makedirs("credentials", exist_ok=True)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return build("gmail", "v1", credentials=creds)


def ensure_label(service, name):
    labels = service.users().labels().list(userId="me").execute().get("labels", [])
    for lbl in labels:
        if lbl["name"] == name:
            return lbl["id"]
    created = service.users().labels().create(
        userId="me",
        body={"name": name, "labelListVisibility": "labelShow", "messageListVisibility": "show"},
    ).execute()
    return created["id"]


# ---------- Local state ----------

def load_processed():
    if os.path.exists(PROCESSED_LOG):
        with open(PROCESSED_LOG) as f:
            return set(json.load(f))
    return set()


def save_processed(ids):
    with open(PROCESSED_LOG, "w") as f:
        json.dump(sorted(ids), f, indent=2)


def log_row(row):
    is_new = not os.path.exists(REVIEW_LOG)
    with open(REVIEW_LOG, "a", encoding="utf-8") as f:
        if is_new:
            f.write("draft_id,recipient,status,subject\n")
        f.write(",".join(f'"{str(c).replace(chr(34), chr(39))}"' for c in row) + "\n")


# ---------- Resume ----------

def extract_resume_text(path):
    if path.lower().endswith(".pdf"):
        import pdfplumber
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
        return text
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


# ---------- Draft parsing ----------

def find_recipient(headers):
    for h in headers:
        if h["name"].lower() == "to":
            return h["value"]
    return None


def walk_parts(part, service, msg_id, collected):
    mime_type = part.get("mimeType", "")
    body = part.get("body", {})
    if mime_type.startswith("image/"):
        data = body.get("data")
        attachment_id = body.get("attachmentId")
        if not data and attachment_id:
            att = service.users().messages().attachments().get(
                userId="me", messageId=msg_id, id=attachment_id
            ).execute()
            data = att.get("data")
        if data:
            collected["images"].append(base64.urlsafe_b64decode(data))
    elif mime_type == "text/plain":
        data = body.get("data")
        if data:
            collected["text"] += base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
    for sub in part.get("parts", []):
        walk_parts(sub, service, msg_id, collected)


def ocr_images(images):
    text = ""
    for img_bytes in images:
        try:
            img = Image.open(io.BytesIO(img_bytes))
            text += pytesseract.image_to_string(img) + "\n"
        except Exception as e:
            print(f"    (OCR failed on one image: {e})")
    return text


# ---------- Claude ----------

def generate_email(jd_text, resume_text):
    prompt = f"""You are helping a job seeker write a short, professional outreach email to a recruiter about a specific job opening.

JOB DESCRIPTION (OCR'd from an image, may have minor errors — use your best interpretation):
---
{jd_text[:6000]}
---

CANDIDATE'S RESUME:
---
{resume_text[:6000]}
---

Write:
1. A concise, specific subject line referencing the exact role title from the JD.
2. A short email body (120-180 words) that:
   - Opens with "Hi," (no recruiter name is available)
   - Names the specific role and, if visible, the company
   - Draws 2-3 concrete, honest connections between the candidate's ACTUAL resume experience and the JD's requirements
   - Mentions that the resume is attached
   - Closes with a simple, low-pressure call to action
   - Does NOT invent skills, titles, years of experience, or qualifications not present in the resume
   - Sounds like a real person wrote it, not a form letter

Respond with ONLY valid JSON, no markdown fences, no commentary:
{{"subject": "...", "body": "..."}}"""

    resp = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = resp.content[0].text.strip()
    raw = re.sub(r"^```(json)?|```$", "", raw, flags=re.MULTILINE).strip()
    try:
        parsed = json.loads(raw)
        return parsed["subject"], parsed["body"]
    except (json.JSONDecodeError, KeyError):
        return "Regarding your open role", raw


# ---------- Message building ----------

def build_message(to, subject, body_text, resume_path):
    message = MIMEMultipart()
    message["to"] = to
    message["subject"] = subject
    message.attach(MIMEText(body_text, "plain"))

    with open(resume_path, "rb") as f:
        part = MIMEApplication(f.read(), Name=os.path.basename(resume_path))
    part["Content-Disposition"] = f'attachment; filename="{os.path.basename(resume_path)}"'
    message.attach(part)

    return {"raw": base64.urlsafe_b64encode(message.as_bytes()).decode()}


# ---------- Main ----------

def main():
    if not RESUME_PATH or not os.path.exists(RESUME_PATH):
        print("ERROR: set RESUME_PATH in .env to a valid resume file (.pdf or .txt).")
        return
    if not ANTHROPIC_API_KEY:
        print("ERROR: set ANTHROPIC_API_KEY in .env (get one at console.anthropic.com).")
        return
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"ERROR: missing {CREDENTIALS_FILE} — see README.md step 1.")
        return

    print(f"Mode: {SEND_MODE.upper()}" + (" (will SEND emails directly!)" if SEND_MODE == "send" else " (safe — creates drafts only)"))

    service = gmail_auth()
    source_label_id = ensure_label(service, SOURCE_LABEL)
    generated_label_id = ensure_label(service, GENERATED_LABEL)

    resume_text = extract_resume_text(RESUME_PATH)
    processed = load_processed()

    drafts = []
    request = service.users().drafts().list(userId="me", maxResults=500)
    while request is not None:
        response = request.execute()
        drafts.extend(response.get("drafts", []))
        request = service.users().drafts().list_next(request, response)
    print(f"Found {len(drafts)} drafts total. {len(processed)} already processed in previous runs.")

    handled = 0
    for d in drafts:
        if MAX_DRAFTS and handled >= MAX_DRAFTS:
            print(f"\nReached MAX_DRAFTS={MAX_DRAFTS}. Stopping (raise/remove the limit in .env to continue).")
            break

        draft_id = d["id"]
        if draft_id in processed:
            continue

        full = service.users().drafts().get(userId="me", id=draft_id, format="full").execute()
        message = full["message"]
        label_ids = message.get("labelIds", [])
        if source_label_id in label_ids or generated_label_id in label_ids:
            processed.add(draft_id)
            continue

        headers = message["payload"].get("headers", [])
        recipient = find_recipient(headers)
        if not recipient:
            print(f"Skipping draft {draft_id}: no recipient in 'To' field.")
            continue

        collected = {"images": [], "text": ""}
        walk_parts(message["payload"], service, message["id"], collected)

        jd_text = collected["text"]
        if collected["images"]:
            jd_text += "\n" + ocr_images(collected["images"])
        jd_text = jd_text.strip()

        if len(jd_text) < 50:
            print(f"Skipping draft {draft_id} ({recipient}): couldn't extract enough JD text — flagging for manual look.")
            log_row([draft_id, recipient, "SKIPPED - low OCR text", ""])
            processed.add(draft_id)
            save_processed(processed)
            continue

        print(f"Processing draft for {recipient} ...")
        subject, body_text = generate_email(jd_text, resume_text)

        sig_lines = [x for x in [YOUR_NAME, YOUR_PHONE, YOUR_LINKEDIN] if x]
        if sig_lines:
            body_text += "\n\n" + "\n".join(sig_lines)

        new_message = build_message(recipient, subject, body_text, RESUME_PATH)

        if SEND_MODE == "send":
            sent = service.users().messages().send(userId="me", body=new_message).execute()
            service.users().messages().modify(
                userId="me", id=sent["id"], body={"addLabelIds": [generated_label_id]}
            ).execute()
            status = "SENT"
        else:
            created = service.users().drafts().create(userId="me", body={"message": new_message}).execute()
            service.users().messages().modify(
                userId="me", id=created["message"]["id"], body={"addLabelIds": [generated_label_id]}
            ).execute()
            status = "DRAFT CREATED"

        service.users().messages().modify(
            userId="me", id=message["id"], body={"addLabelIds": [source_label_id]}
        ).execute()

        print(f"  -> {status}: {subject}")
        log_row([draft_id, recipient, status, subject])

        # Optional: sync to NextApply Job Tracker
        if NEXTAPPLY_API_URL and NEXTAPPLY_API_KEY:
            try:
                import urllib.request
                payload = json.dumps({
                    "gmailDraftId": draft_id,
                    "recipientEmail": recipient,
                    "generatedSubject": subject,
                    "generatedBodyPreview": body_text[:300],
                    "status": status,
                    "rawJdText": jd_text[:2000],
                }).encode()
                req = urllib.request.Request(
                    f"{NEXTAPPLY_API_URL.rstrip('/')}/api/jobs/import-from-automator",
                    data=payload,
                    headers={
                        "Content-Type": "application/json",
                        "X-Api-Key": NEXTAPPLY_API_KEY,
                    },
                    method="POST",
                )
                urllib.request.urlopen(req, timeout=5)
                print(f"  -> Logged to NextApply tracker.")
            except Exception as e:
                print(f"  -> NextApply sync failed (non-blocking): {e}")

        processed.add(draft_id)
        save_processed(processed)
        handled += 1

    print(f"\nDone. {handled} draft(s) processed this run. Check your Gmail Drafts folder and {REVIEW_LOG}.")


if __name__ == "__main__":
    main()
