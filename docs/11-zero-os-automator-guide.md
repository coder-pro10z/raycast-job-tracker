# NextApply Automator — Multi-Platform, Zero-OS & 1-Click Setup Guide

> **NextApply Automator** enables job seekers to convert raw Job Description (JD) screenshots and recruiter leads into tailored, personalized cold outreach emails with attached resumes, and logs every application into the NextApply Tracker.

---

## 1. Overview & Setup Options Comparison

You no longer need to manually install and configure complex OS dependencies (Python, Tesseract.exe, or Google Cloud OAuth) on your local computer. Choose the execution mode that best fits your workflow:

| Feature / Execution Mode | Mode A: Web & Mobile Studio (In-App) | Mode B: Cloud Runner (GitHub Actions) | Mode C: Local 1-Click Script (`.bat`) | Mode D: Manual CLI (`main.py`) |
|---|---|---|---|---|
| **Supported Devices** | Any Device (iPhone, Android, Mac, iPad, Windows) | Any Device via GitHub Mobile App / Web | Windows 10/11 | Windows, macOS, Linux |
| **Local OS Software Required** | **None (Zero OS / Zero Install)** | **None (Runs in GitHub Cloud)** | Automated via `winget` | Python 3.9+, Git |
| **Tesseract.exe Required?** | **No** (Claude AI Vision) | **No** (Installed in cloud container) | **Optional** (Claude Vision Fallback) | **Optional** (Claude Vision Fallback) |
| **Gmail OAuth Setup?** | **No** (Direct 1-tap Gmail Web/App Deep Link) | Yes (Saved once in GitHub Secrets) | Yes (`credentials.json`) | Yes (`credentials.json`) |
| **Best For** | On-the-go outreach from smartphone or browser | Headless 24/7 batch processing | Power users on local Windows workstation | Local developer customization |

---

## 2. Mode A: Online Web & Mobile Studio (Zero-OS & Zero-Install)

The **fastest and most flexible** way to process JDs and generate personalized outreach from any smartphone, tablet, or laptop.

### Step-by-Step Flow:
1. Open NextApply at **[https://raycast-job-tracker.vercel.app/](https://raycast-job-tracker.vercel.app/)**.
2. Select **🤖 Gmail JD Automator** from the sidebar.
3. Tap the blue **`📱 Run Online Automator`** button in the top header.
4. Enter the **Company Name**, **Target Role**, and optional **Recruiter Email**.
5. Paste the **Job Description text** (or notes copied from a screenshot or LinkedIn post).
6. Select your target domain (`SDE Track`, `Cloud Track`, or `Dual Track`).
7. Tap **"Generate Tailored Outreach"**:
   - Claude synthesizes a personalized email body grounded in your active candidate profile (Praveen Kashyap / Anam Ansari).
8. **1-Tap Gmail Dispatch**:
   - Tap **"Open Pre-filled in Gmail"**:
     - **On iPhone / Android**: Automatically opens your native Gmail app with recipient, subject, and body pre-filled. Attach your resume and hit Send!
     - **On Desktop**: Launches a pre-filled Gmail compose tab in your browser.
9. **Instant Tracking**:
   - Tap **"Save & Track in NextApply"** to log the opportunity directly into your tracker with status `Applied`.

---

## 3. Mode B: 24/7 Cloud Runner (GitHub Actions)

Run the Python automator sidecar in the cloud on GitHub's free infrastructure without needing your personal computer turned on.

### Setup Instructions (One-time):

1. In your GitHub repository, navigate to **Settings → Secrets and variables → Actions → New repository secret**.
2. Add the following secrets:

| Secret Name | Description | Example / Source |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | `sk-ant-...` from console.anthropic.com |
| `GMAIL_CREDENTIALS_JSON` | Content of your Google OAuth client JSON | Copy entire JSON text from `credentials.json` |
| `GMAIL_TOKEN_JSON` | Content of your authorized `token.json` | Generated after your first authorized run |
| `RESUME_BASE64` | Base64-encoded PDF resume | `[Convert]::ToBase64String([IO.File]::ReadAllBytes('resume.pdf'))` |
| `NEXTAPPLY_API_URL` | Your live NextApply URL | `https://raycast-job-tracker.vercel.app` |
| `NEXTAPPLY_API_KEY` | API Key for webhook authorization | `dev-local-key` |

3. The workflow is stored at `automation/gmail-jd-automator/workflow/gmail-jd-automator.yml`. Copy it to `.github/workflows/gmail-jd-automator.yml` in your personal repo.

### How to Trigger from Mobile Phone:
1. Open the **GitHub Mobile app** on your iOS or Android device.
2. Select your repository → Tap **Actions**.
3. Tap **Gmail JD Automator - Cloud Runner**.
4. Tap **Run workflow** → Select `draft` or `send` mode → Tap **Run**!
5. The cloud container boots, installs OCR, processes your Gmail drafts, and logs records back into NextApply in ~60 seconds.

---

## 4. Mode C: 1-Click Machine Setup for Windows

If you prefer to run the Python sidecar locally on your Windows PC, we provide automated batch scripts that eliminate manual downloading:

### 1. Automated Installation (`setup-automator.bat`)
Double-click `setup-automator.bat` in the project root. It automatically:
- Checks for Python 3.9+ (installs Python 3.12 via `winget` if missing).
- Installs Tesseract OCR via `winget` (`UB-Mannheim.TesseractOCR`).
- Creates a Python virtual environment (`venv`) and installs `requirements.txt`.
- Copies `.env.example` to `.env`.

### 2. Execution (`run-automator.bat`)
Double-click `run-automator.bat` anytime to launch the automator. It executes `python main.py` in the isolated virtual environment with real-time console logs.

---

## 5. Technical Architecture: Claude Native Vision Fallback

Historically, image-based automators strictly required the operating-system binary `tesseract.exe` to perform Optical Character Recognition.

In NextApply, we re-architected `automation/gmail-jd-automator/main.py`:

```
Incoming Gmail Draft with Screenshot
                │
         Tesseract Available?
         ├── YES ──► OCR extract text ──► Claude Text Synthesis ──► Draft Created
         └── NO  ──► Claude Vision API ─► Claude Multi-Modal   ──► Draft Created
                     (Base64 Image)       Vision Synthesis
```

- When `tesseract.exe` is absent or encounters an error, `main.py` converts the screenshot image to a Base64-encoded payload (`image/png`).
- The image is passed directly into Claude's multi-modal message content block.
- Claude natively reads and understands the requirements, qualifications, and role title with zero external OCR dependencies.

---

## 6. Security & Privacy

1. **OAuth Scopes**: Gmail API access is restricted to `gmail.modify` and `gmail.compose`. The automator cannot read external inbox emails or delete messages outside its labeled scope.
2. **Idempotency Safeguard**: Every processed draft is stamped with label `JD-Automator/Source-Processed` and recorded in `processed_drafts.json` so no draft is ever duplicated or re-sent.
3. **Safe by Default (`SEND_MODE=draft`)**: The automator saves generated outreach as a **new Gmail draft** so you retain 100% human-in-the-loop review before sending.
