# Gmail JD Automator — Multi-Platform Setup & Usage Guide

Reads Gmail drafts containing job-description screenshots + recruiter addresses, extracts the JD using Tesseract OCR or **Claude Native Vision**, composes a tailored outreach email grounded in your resume, attaches your resume PDF, and saves the result as a **new Gmail draft** (or sends it directly if `SEND_MODE=send` in `.env`).

Processed drafts are automatically pushed to the NextApply Job Tracker via webhook.

---

## 🚀 Quick Start (Choose Your Preferred Method)

### Method 1: Zero-Install Online Studio (Mobile & Web) [Fastest]
Open **[https://raycast-job-tracker.vercel.app/](https://raycast-job-tracker.vercel.app/)** on your phone, tablet, or PC → tap **`📱 Run Online Automator`** → paste the JD and tap **Open Pre-filled in Gmail**.
> **No Python, no Tesseract, no terminal needed.**

### Method 2: 1-Click Windows Setup (`setup-automator.bat`)
In the repository root, double-click **`setup-automator.bat`**.
> Uses `winget` to automatically install Python 3.12 and Tesseract OCR, build `venv`, and install dependencies.
> Double-click **`run-automator.bat`** to run anytime.

### Method 3: 24/7 Cloud Runner (GitHub Actions)
Run headless in the cloud without needing your personal computer on. See [`docs/11-zero-os-automator-guide.md`](../../docs/11-zero-os-automator-guide.md) for GitHub Secrets configuration and 1-tap mobile trigger instructions.

---

## Prerequisites (For Local Python Runner Only)

- Python 3.9+
- Anthropic API Key (`ANTHROPIC_API_KEY`)
- Google Cloud OAuth Desktop Credentials (`credentials/credentials.json`)
- Tesseract OCR (*Optional* — the script includes automatic Claude Multi-Modal Vision fallback if Tesseract is not installed!)

---

## Manual Step-by-Step Setup

### Step 1 — Google Cloud OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create or select a project → Enable the **Gmail API**.
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
4. Choose **Desktop app**, download the JSON, and save it as:
   ```
   automation/gmail-jd-automator/credentials/credentials.json
   ```
5. Go to **OAuth consent screen → Test users** and add your Gmail address.

### Step 2 — Environment & Dependencies

```bash
cd automation/gmail-jd-automator

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3 — Configure .env

```bash
cp .env.example .env
```

Edit `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-...
RESUME_PATH=C:/path/to/your/resume.pdf
SEND_MODE=draft          # draft (safe) | send (live)
MAX_DRAFTS=5             # 0 = no limit; start small!
YOUR_NAME=Praveen Kashyap
YOUR_PHONE=+91 98765 43210
YOUR_LINKEDIN=https://linkedin.com/in/praveen-kashyap

# NextApply Integration
NEXTAPPLY_API_URL=https://raycast-job-tracker.vercel.app
NEXTAPPLY_API_KEY=dev-local-key
```

### Step 4 — Run

```bash
python main.py
```

On first run, a browser window opens for Google OAuth authorization. After granting access, `credentials/token.json` is generated for headless execution on subsequent runs.

---

## End-to-End Pipeline

```
Gmail Drafts (with JD screenshot)
    │
    ▼
[1] List all unprocessed drafts
    │
    ▼
[2] Extract recipient ("To:" header) + JD text
    ├── If Tesseract available → OCR screenshot
    └── If Tesseract missing   → Claude Multi-Modal Vision fallback
    │
    ▼
[3] Call Claude 3.5 Sonnet → { "subject": "...", "body": "..." }
    │
    ▼
[4] Build MIME message with attached resume PDF
    │
    ▼
[5] SEND_MODE=draft → drafts.create (safe review)
    SEND_MODE=send  → messages.send (live send)
    │
    ▼
[6] Apply label "JD-Automator/Source-Processed"
    Append row to review_log.csv
    Save ID to processed_drafts.json (Idempotency)
    │
    ▼
[7] POST to NEXTAPPLY_API_URL/api/jobs/import-from-automator
    → Automatically tracks application in NextApply UI
```

---

## Detailed Documentation

For full multi-platform architecture and mobile instructions, see:
- [NextApply Zero-OS Automator Guide](../../docs/11-zero-os-automator-guide.md)
- [NextApply Architecture Overview](../../docs/01-architecture-overview.md)
