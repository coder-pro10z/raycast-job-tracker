# Job Application Module — Product Requirements & Technical Reference

> This document merges the Gmail JD Automator **PRD** (`files/PRD.md`) and **Technical Documentation** (`files/TECHNICAL_DOCUMENTATION.md`) into the NextApply Job Tracker documentation suite, and extends both with the integration layer connecting the automator to the tracker.

---

## 1. Problem Statement

Over 130 job opportunities have been saved as Gmail drafts — a screenshot of the job description pasted into the body, addressed to the recruiter/HR contact who posted the role. Each one requires a human to: read the JD, write a tailored email, attach a resume, and send it. At this volume, manual processing is impractical and opportunities go stale.

Additionally, these ad-hoc outreach attempts are completely invisible to the NextApply Job Tracker — there is no way to see which companies have been contacted, what was sent, or what the follow-up status is.

---

## 2. Goal

1. **Automate outreach email generation** — convert the backlog of JD-screenshot drafts into tailored, resume-attached outreach emails automatically while keeping a human in the loop before anything is sent.
2. **Connect automation output to the tracker** — every auto-processed application becomes a first-class job record in NextApply, visible in the Job Applications panel.

---

## 3. User Stories

| # | Story |
|---|-------|
| 1 | As the user, I want the tool to read the recruiter email and JD out of each existing draft, so I don't have to re-enter anything by hand. |
| 2 | As the user, I want the JD extracted even when it's only visible as a screenshot, so image-based drafts aren't skipped. |
| 3 | As the user, I want a tailored subject + body per JD, grounded only in my real resume content, so outreach looks personalized and honest. |
| 4 | As the user, I want my resume automatically attached, so I don't have to attach it 130 times. |
| 5 | As the user, I want the output saved as a draft first, not sent, so I can catch OCR or AI mistakes before they reach a recruiter. |
| 6 | As the user, I want to run this in small batches and pick up where I left off, so I'm not forced to process all 130 in one sitting. |
| 7 | As the user, I want each processed application to automatically appear in the NextApply tracker, so I have one place to see all my outreach. |
| 8 | As the user, I want drafts the tool can't confidently read flagged rather than silently mishandled, so nothing goes out based on garbage input. |

---

## 4. Non-Goals (v1)

- Not a job search engine — does not find or scrape new job postings.
- Not a resume builder — uses one resume file as-is, unmodified.
- Does not attempt to find or verify a named recruiter contact.
- Not a hosted service — runs locally as a Python sidecar script.

---

## 5. Functional Requirements

1. **Draft discovery** — list all Gmail drafts on the authenticated account.
2. **Recipient extraction** — read the "To" header of each draft.
3. **JD extraction** — extract plain text body content and OCR any embedded image(s).
4. **Content generation** — given JD text + resume text, produce a subject line and 120–180 word email body via Claude, constrained to only reference actual resume content.
5. **Resume attachment** — attach a single configured resume file to every generated email.
6. **Output mode** — either create a new Gmail draft (default) or send immediately, controlled by one config flag.
7. **Idempotency** — a draft that has already been processed must not be reprocessed on a subsequent run.
8. **Low-confidence handling** — if extracted JD text is too short/garbled, skip and log for manual review.
9. **Run limiting** — support processing a capped number of drafts per invocation.
10. **Audit trail** — write a CSV log of every draft handled: status, recipient, generated subject.
11. **Tracker integration** — after each processed draft, optionally `POST` to the NextApply API to create/log a job record.

---

## 6. End-to-End Flow

```
Gmail Drafts (JD screenshot + recruiter address)
    │
    ▼ drafts.list
[1] List all drafts → filter out already-processed (local cache + Gmail labels)
    │
    ▼ drafts.get (format=full)
[2] For each unprocessed draft:
    ├── Read "To" header               → recipient email
    ├── Walk MIME parts recursively    → plain text + embedded image bytes
    └── OCR each embedded image (Tesseract/pytesseract) → JD text
    │
    ▼
[3] If JD text < 50 chars → log as SKIPPED, move on
    │
    ▼ Anthropic API
[4] Call Claude (claude-sonnet-5)
    Input:  JD text + full resume text
    Output: {"subject": "...", "body": "..."}  (JSON)
    │
    ▼
[5] Build MIME email:
    To: <recipient>
    Subject: <generated>
    Body: <generated> + optional signature
    Attachment: <resume file>
    │
    ▼
[6] SEND_MODE = "draft"              SEND_MODE = "send"
    → drafts.create                  → messages.send
    → label "Generated"              → label "Generated"
    │
    ▼
[7] Label original draft "Source-Processed"
    Record draft_id → processed_drafts.json
    Append row → review_log.csv
    │
    ▼ (optional — if NEXTAPPLY_API_URL set)
[8] POST /api/jobs/import-from-automator
    → NextApply creates job record in PostgreSQL
    → Visible in Job Applications panel in React UI
```

---

## 7. Configuration Reference

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `ANTHROPIC_API_KEY` | Yes | — | Auth for email generation via Claude |
| `CLAUDE_MODEL` | No | `claude-sonnet-5` | Model used for generation |
| `RESUME_PATH` | Yes | — | File attached to every email; also the grounding source for the prompt |
| `SEND_MODE` | No | `draft` | `draft` = safe, review-first. `send` = sends immediately |
| `MAX_DRAFTS` | No | `0` (no limit) | Caps how many drafts one run processes |
| `YOUR_NAME` / `YOUR_PHONE` / `YOUR_LINKEDIN` | No | empty | Appended as a signature block if set |
| `NEXTAPPLY_API_URL` | No | — | If set, enables tracker integration via webhook |
| `NEXTAPPLY_API_KEY` | No | — | X-Api-Key for the NextApply API |

---

## 8. Idempotency / Anti-Duplication Design

Two independent guards prevent reprocessing:
1. **Local cache** (`processed_drafts.json`) — checked first, avoids redundant API calls.
2. **Gmail labels** — `JD-Automator/Source-Processed` on handled originals and `JD-Automator/Generated` on tool-created output. Even if the local cache is deleted, a generated draft is still recognized by its label and excluded.

---

## 9. Error Handling

| Case | Behavior |
|------|---------|
| Draft has no "To" address | Skipped, printed to console, not logged |
| Image present but OCR extracts <50 chars | Skipped, logged as `SKIPPED - low OCR text` |
| Claude response isn't valid JSON | Falls back to raw text as body + generic subject |
| Script interrupted mid-run | Safe to rerun — already-labeled/cached drafts are skipped |
| OAuth token expired | Auto-refreshed silently using stored refresh token |
| NextApply API unavailable | Automator logs a warning and continues — tracker sync is best-effort |

---

## 10. NextApply API Integration

### Endpoint
```
POST /api/jobs/import-from-automator
X-Api-Key: <key>
Content-Type: application/json
```

### Request Body
```json
{
  "gmailDraftId": "r8276351782",
  "recipientEmail": "recruiter@acme.com",
  "generatedSubject": "Re: Senior .NET Developer – ACME Corp",
  "generatedBodyPreview": "Hi, I came across the Senior .NET Developer role at ACME Corp...",
  "status": "DRAFT CREATED",
  "rawJdText": "Senior .NET Developer... 5+ years experience..."
}
```

### Response
```json
{
  "id": 42,
  "companyName": "ACME Corp",
  "gmailDraftId": "r8276351782",
  "automatorStatus": "Draft Created",
  "applicationStatus": "Not Started"
}
```

### Company Name Extraction
The backend uses a simple regex against `rawJdText` and `generatedSubject` to infer `CompanyName`. If extraction fails, it defaults to `"Unknown (from automator)"`.

---

## 11. Security & Privacy

- `credentials.json`, `token.json`, and `.env` are excluded from version control via `.gitignore`.
- Resume content and JD text are sent to the Anthropic API only — no third-party storage.
- The script requests the minimum Gmail scopes needed (`modify` for labeling, `compose` for draft/send).

---

## 12. Known Limitations (v1)

- Single static resume for all applications — no per-role resume selection.
- No recruiter-name personalization ("Hi," is used generically).
- OCR quality depends entirely on the screenshot's resolution/font — no image preprocessing applied.
- Company name extraction from JD text is heuristic — may require manual correction in the tracker UI.
- Gmail's daily send limits apply if `SEND_MODE=send` is used at volume.

---

## 13. Future Enhancements & Upgrades Completed

- [x] Full UI review panel inside NextApply (`JobApplicationPanel.tsx`) with status synchronization.
- [x] Multi-paragraph publication-ready draft synthesis with proof metrics and candidate contact signatures.
- [x] Multi-account Gmail routing with `authuser` URL parameters.
- [x] Zero-OS and mobile automator studio without requiring local Python or Tesseract binaries.
- [x] 10 curated foundational outreach blueprints library with standardized placeholder interpolation.
- [x] Tier-1 realistic job description benchmark archive.

---

## 14. Publication-Ready Outreach Synthesis & Signature Studio (v2)

### The Incomplete Draft Resolution
In early iterations, clicking **Open Draft** only passed a 1-sentence teaser (`job.outreachBodyPreview`) into the Gmail compose window without salutations, proof metrics, or contact information.

To solve this, NextApply introduced **`emailAssembler.ts`** and **`foundationalDrafts.ts`**:

```
Candidate Profile (Settings) + Job Record (Automator)
                  ↓
          EmailAssembler
                  ↓
    [Formal Salutation]
    [Role & Company Hook]
    [Key Technical Strengths & YOE]
    [Flagship Metric / Proof Point]
    [Call to Action (15-min call)]
    [Complete Formal Signature Block]
                  ↓
       Gmail Compose Deep-link
  (?authuser=...&view=cm&fs=1&to=...&su=...&body=...)
```

### Complete Signature Block Anatomy
Configured in `SettingsModal.tsx` and persisted to `UserProfile`:
```text
--
Best regards,
[Full Name]
[Current / Target Role]
Phone: [Phone Number] | Email: [Email Address]
LinkedIn: [LinkedIn Profile URL]
GitHub: [GitHub Profile URL]
Portfolio: [Portfolio / Live Projects Website URL]
```

### 10 Foundational Drafts Library (`foundationalDrafts.ts`)
Standardized blueprints covering major candidate domains with `{placeholder}` interpolation:
1. **SDE / Distributed Backend & Microservices** (`sde-distributed-backend`)
2. **Full Stack & Product Engineer** (`sde-fullstack-product`)
3. **Cloud Platform, DevOps & SRE** (`cloud-platform-devops`)
4. **Cloud Solutions Architect & Systems Strategy** (`cloud-solutions-architect`)
5. **High-Velocity Startup Generalist** (`high-growth-startup`)
6. **Enterprise & FinTech High-Reliability Systems** (`enterprise-fintech`)
7. **AI Systems & LLM Application Engineer** (`ai-infra-llm-app`)
8. **Direct Recruiter InMail / Short Cold Pitch** (`recruiter-direct-inmail`)
9. **Peer / Alumni Referral Request** (`alumni-referral-request`)
10. **Post-Interview Thank You & Concrete Value Add** (`post-interview-thankyou`)

### Grounded Tier-1 JD Archive (`docs/jd-samples/`)
Authentic JD samples from HashiCorp, Stripe, Snowflake, Datadog, AWS, OpenAI, GitHub, Airbnb, Uber, and Netflix stored in `docs/jd-samples/` serve as production benchmarks for testing OCR extraction and prompt quality.
