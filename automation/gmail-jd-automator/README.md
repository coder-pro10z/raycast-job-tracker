# Gmail JD Automator — Setup & Usage Guide

Reads Gmail drafts that contain a job-description screenshot + recruiter address, OCRs the JD, asks Claude to write a tailored outreach email grounded in your actual resume, attaches your resume, and saves the result as a **new Gmail draft** for you to review (or sends it directly if `SEND_MODE=send` in `.env`).

Optionally, if `NEXTAPPLY_API_URL` is set, each processed draft is automatically logged as a new job record in the NextApply Job Tracker.

---

## Prerequisites

- Python 3.9+
- Tesseract OCR installed at OS level
- An Anthropic API key
- A Google Cloud project with the Gmail API enabled

---

## Step 1 — Google Cloud OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a project (or select an existing one).
3. Enable the **Gmail API**.
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
5. Choose **Desktop app**, download the JSON, and save it as:
   ```
   automation/gmail-jd-automator/credentials/credentials.json
   ```
6. Go to **APIs & Services → OAuth consent screen → Test users** and add your Gmail address.

---

## Step 2 — Install Tesseract OCR

| OS | Command |
|----|---------|
| macOS | `brew install tesseract` |
| Ubuntu/Debian | `sudo apt install tesseract-ocr` |
| Windows | Download installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki) |

---

## Step 3 — Python Environment

```bash
cd Job-Tracker/automation/gmail-jd-automator

python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

---

## Step 4 — Configure .env

```bash
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...
RESUME_PATH=C:/path/to/your/resume.pdf
SEND_MODE=draft          # draft (safe) | send (live)
MAX_DRAFTS=5             # 0 = no limit; start small!
YOUR_NAME=Your Name
YOUR_PHONE=+1 555 000 0000
YOUR_LINKEDIN=https://linkedin.com/in/yourprofile

# Optional: NextApply integration
NEXTAPPLY_API_URL=http://localhost:5089
NEXTAPPLY_API_KEY=dev-local-key
```

---

## Step 5 — First Run

```bash
python main.py
```

On first run, a browser window opens for Google OAuth. After authorizing, a `credentials/token.json` is saved and future runs are fully headless.

---

## How It Works

```
Gmail Drafts (with JD screenshot)
    │
    ▼
[1] List all unprocessed drafts
    │
    ▼
[2] Extract recipient (To: header) + JD text (plain text + OCR images)
    │
    ▼
[3] If JD text < 50 chars → log as SKIPPED, continue
    │
    ▼
[4] Call Claude → { "subject": "...", "body": "..." }
    │
    ▼
[5] Build MIME email with resume attachment
    │
    ▼
[6] SEND_MODE=draft → drafts.create
    SEND_MODE=send  → messages.send
    │
    ▼
[7] Label original draft "JD-Automator/Source-Processed"
    Append row to review_log.csv
    Save draft_id to processed_drafts.json
    │
    ▼ (optional)
[8] POST to NEXTAPPLY_API_URL/api/jobs/import-from-automator
    → Creates job record in NextApply tracker
```

---

## Output Files

| File | Purpose |
|------|---------|
| `review_log.csv` | Audit trail — every draft touched, recipient, status, generated subject |
| `processed_drafts.json` | Local cache preventing reprocessing on re-runs |
| `credentials/token.json` | Auto-generated OAuth token (do not commit) |

---

## Idempotency

Two independent guards prevent reprocessing:
1. **Local cache** (`processed_drafts.json`) — checked first.
2. **Gmail labels** — `JD-Automator/Source-Processed` on originals, `JD-Automator/Generated` on output. Even if the cache is deleted, labeled drafts are excluded.

---

## NextApply Integration

When `NEXTAPPLY_API_URL` is set, each successfully processed draft is also sent to:

```
POST /api/jobs/import-from-automator
X-Api-Key: <NEXTAPPLY_API_KEY>

{
  "gmailDraftId": "...",
  "recipientEmail": "recruiter@company.com",
  "generatedSubject": "Re: Senior .NET Developer – CompanyName",
  "generatedBodyPreview": "Hi, I came across the Senior ...",
  "status": "DRAFT CREATED",
  "rawJdText": "..."
}
```

This creates a new job record in NextApply visible in the **Job Applications** panel in the UI.
