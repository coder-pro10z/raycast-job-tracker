# Product Backlog & Development Defect Log — NextApply Job Tracker

This document tracks **all errors encountered and resolved during development**, completed feature releases, and upcoming backlog roadmap items for the NextApply Job Tracker platform.

---

## 1. Resolved Development Errors & Fix Log

This section records technical bugs, compilation failures, environment locks, and syntax issues resolved across development sprints.

### 🐛 Error 1: Missing Automator Integration Fields in `JobUpdateDto`
- **Component**: Backend (`backend/NextApply.Api/DTOs/JobUpdateDto.cs`, `JobsController.cs`)
- **Error Code**: `error CS1061: 'JobUpdateDto' does not contain a definition for 'AutomatorStatus' / 'GmailDraftId' / 'OutreachSubject' / 'OutreachBodyPreview'`
- **Root Cause**: When adding Gmail JD Automator integration fields to the database `Job` entity, `JobUpdateDto` was not updated to accept those fields in `PATCH /api/jobs/{id}` requests, causing compilation failure during build.
- **Resolution**:
  - Added nullable properties to `JobUpdateDto.cs`:
    - `public string? GmailDraftId { get; set; }`
    - `public string? AutomatorStatus { get; set; }`
    - `public string? OutreachSubject { get; set; }`
    - `public string? OutreachBodyPreview { get; set; }`
  - Result: `dotnet build` succeeded with 0 errors.

---

### 🐛 Error 2: Windows Executable File Lock During Rebuild (`MSB3027` / `MSB3021`)
- **Component**: Backend Build (`backend/NextApply.Api/bin/Debug/net9.0/NextApply.Api.exe`)
- **Error Code**: `error MSB3027: Could not copy apphost.exe to NextApply.Api.exe. The process cannot access the file because it is being used by another process. The file is locked by: NextApply.Api (PID 22640)`
- **Root Cause**: A previously launched background process of `NextApply.Api` was still actively running on port 5089 and holding a Windows OS file handle lock on the binary while `dotnet build` attempted to overwrite it.
- **Resolution**:
  - Ran `Stop-Process -Name "NextApply.Api" -Force` in PowerShell to terminate the orphaned process holding the file lock.
  - Re-ran `dotnet build` cleanly without file access collisions.

---

### 🐛 Error 3: TypeScript Strict Mode Unused Variable Lints (`TS6133`)
- **Component**: Frontend Build (`frontend/src/components/auth/AuthModal.tsx`, `ProfileMenu.tsx`)
- **Error Code**: `error TS6133: 'User' / 'Briefcase' / 'Globe' / 'Phone' / 'CheckCircle' / 'Sparkles' is declared but its value is never read.`
- **Root Cause**: `tsc -b` runs in strict lint mode under Vite. When scaffolding icon imports from `lucide-react` for the new Auth modal and Profile dropdown, several icons were imported but not utilized in the final JSX tree.
- **Resolution**:
  - Cleaned up import statements in both `AuthModal.tsx` and `ProfileMenu.tsx` to strictly include only rendered icons (`X, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, LogOut, Settings, UserPlus, Check, ChevronDown`).
  - Result: `tsc -b && vite build` built in 8.77s with 0 type errors.

---

### 🐛 Error 4: PowerShell Statement Separator Syntax Error (`&&` vs `;`)
- **Component**: Shell Automation / Developer Tooling
- **Error Code**: `ParserError: The token '&&' is not a valid statement separator in this version.`
- **Root Cause**: In older versions of Windows PowerShell 5.1 (prior to PowerShell 7), Bash-style chained commands (`cmd1 && cmd2`) are not recognized.
- **Resolution**:
  - Replaced `&&` with standard PowerShell statement terminators (`;`) or multi-line command blocks (`cmd1; cmd2`).

---

### 🐛 Error 5: Ripgrep / External Grep CLI PATH Absence on Windows
- **Component**: Environment & CLI Research Tools
- **Error Code**: `exec: "grep": executable file not found in %PATH%`
- **Root Cause**: Standard Unix utilities (`grep`) are not available in default Windows command environments unless explicitly bundled in Git Bash or Cygwin.
- **Resolution**:
  - Transitioned searching to built-in AST tools (`find_by_name`, `view_file`) and native PowerShell cmdlets (`Select-String`, `Get-ChildItem`).

---

### 🐛 Error 6: Missing Job Domain Imports in `apiClient.ts`
- **Component**: Frontend Client (`frontend/src/services/apiClient.ts`)
- **Error Code**: `ReferenceError: JobDomain, Priority, WorkMode, ApplicationStatus are not defined`
- **Root Cause**: When adding the new multi-user auth types import (`UserProfileDto`, `PublicUserSummary`, `AuthResponse`), the original import line containing domain types was replaced.
- **Resolution**:
  - Re-added the combined types import in `apiClient.ts`:
    `import type { JobItem, JobDomain, Priority, WorkMode, ApplicationStatus } from '../types/job';`
    `import type { UserProfileDto, PublicUserSummary, AuthResponse } from '../types/auth';`

---

### 🐛 Error 7: Hardcoded Default User Fallback Overrode Unauthenticated Guest Experience
- **Component**: Backend (`JobsController.cs`) & Frontend Store (`useJobStore.tsx`)
- **Error / Issue**: When opening the application for the first time without a logged-in session, the application defaulted to Praveen's profile (`user_praveen`), leaking Praveen's 12 active application statuses and bypassing the user login prompt.
- **Root Cause**: `GetUserId()` in `JobsController.cs` had a fallback `return "user_praveen"`, and `useJobStore.tsx` initialized `activeUserId` to `'user_praveen'`.
- **Resolution**:
  - Updated `GetUserId()`: returns `null` when no `X-User-Id` or `Authorization` header is present.
  - Updated `GetJobs()` and `GetJob()`: when `userId` is empty/null, all jobs project safely in guest mode with `application_status: "Not Started"`, `priority: "Medium"`, and empty notes (0 active statuses).
  - Updated `UpdateJob()`: returns `401 Unauthorized` if a guest tries to mutate application statuses without logging in.
  - Updated frontend `useJobStore.tsx`: `activeUserId` initializes to `''`, `currentUser` to `null`, and `isAuthModalOpen` automatically defaults to `true` for first-time visitors.
  - Updated `ProfileMenu.tsx`: renders a guest button with "Sign In", "0 Tracked", and a quick-login CTA.
  - Result: Verified via `node tests/verify-profiles.cjs` that guest views contain exactly 0 active application statuses across all jobs.

---

### 🐛 Error 8: Mixed Content & Offline API Failure in Production Vercel Deployment
- **Component**: Frontend Authentication & API Client (`frontend/src/services/apiClient.ts`, `AuthModal.tsx`, `App.tsx`)
- **Error / Issue**: When accessing the live production deployment on Vercel (`https://raycast-job-tracker.vercel.app/`), clicking the quick login buttons for Praveen or Anam triggered a red **"Login failed"** error alert, and jobs failed to load.
- **Root Cause**:
  1. In production on HTTPS (`https://raycast-job-tracker.vercel.app/`), `VITE_API_URL` defaulted to `http://localhost:5089` in absence of a live cloud backend URL.
  2. Modern web browsers strictly block insecure HTTP calls (`http://localhost:5089`) from secure HTTPS origins under **Mixed Content Security Restrictions**, throwing `TypeError: Failed to fetch`.
  3. The unhandled network exception caused `apiClient.login()` and `apiClient.getJobs()` to throw, triggering the red "Login failed" error in `AuthModal.tsx` and preventing job hydration.
- **Resolution**:
  - Implemented **Dual-Mode Resilient Client Architecture** in `frontend/src/services/apiClient.ts`:
    - Added proactive mixed content detection (`isMixedContentBlocked()`) to identify HTTPS environments attempting HTTP localhost calls.
    - Added built-in seeded credentials and profile payloads for **Praveen Kashyap** (`2pkashyap2001@gmail.com`) and **Anam Ansari** (`anamansari.0406@gmail.com`), allowing instant 0ms authentication in client mode.
    - Added dynamic user registration and session persistence in `localStorage` (`job_tracker_registered_users`).
    - Added graceful Excel fallback via `excelAdapter.loadJobs()` to parse `/Master_Job_Tracker.xlsx` (588 central jobs) when the backend is unreachable.
    - Preserved zero-state guest experience where unauthenticated visitors see central listings with 0 active statuses.
    - Seeded Praveen with 12 active applications (SDE/FullStack) and Anam with 8 active applications (Cloud/DevOps) for authentic demonstration.
    - Enabled per-user state isolation in `localStorage` (`job_tracker_jobs_${userId}`) so status updates, notes, and job creations persist across page reloads.
    - Seamlessly prioritizes live PostgreSQL API calls whenever a reachable backend (`localhost` in local dev or `VITE_API_URL` HTTPS endpoint) is detected.
  - Verified production build via `npm run build` with 0 TypeScript/lint errors.

---

### 🐛 Error 9: Redundant Emoji Decoration in UI Action Controls
- **Component**: Frontend UI Design System (`JobApplicationPanel.tsx`, `WebAutomatorModal.tsx`, `Sidebar.tsx`, `CommandPalette.tsx`)
- **Error / Issue**: Buttons and tab navigation controls paired Lucide SVG icons with redundant raw Unicode emojis (e.g. `<Smartphone size={15} /> <span>📱 Run Online Automator</span>`), resulting in double icons, jarring platform emoji style mismatches (Windows Segoe vs macOS Apple Color Emoji), and screen-reader accessibility issues.
- **Root Cause**: Ad-hoc emoji usage in JSX labels without a strict design system rule prohibiting raw Unicode emojis alongside vector icons.
- **Resolution**:
  - Removed all raw Unicode emojis from button labels, tab titles, and headers in `JobApplicationPanel.tsx` (`<span>📱 Run Online Automator</span>` -> `<span>Run Online Automator</span>`), `WebAutomatorModal.tsx` (`⚡`, `☁️`, `💻`, `📱`, `✉️`, `⚙️`, `▶️`), `Sidebar.tsx` (`🧭` -> `<Briefcase />`), and `CommandPalette.tsx` (`⚡` -> `<Zap />`).
  - Created permanent architectural standard **`RULES.md`** enforcing Lucide React SVG icons exclusively, typography inheritance (`font-family: inherit`), and tabular number formatting.
  - Added verification scanner script to confirm 0 raw emojis remain in interactive UI elements.
  - Verified clean TypeScript build via `npm run build` with 0 errors.

---

### 🐛 Error 10: Multi-Account Gmail Session Routing & Candidate-Domain Incongruence in Automator
- **Component**: Frontend Automator Panel & Client (`JobApplicationPanel.tsx`, `WebAutomatorModal.tsx`, `apiClient.ts`)
- **Error / Issue**:
  1. Clicking **"Open Draft"** opened a different/default Google Account (account 0) rather than the active user's email session (`2pkashyap2001@gmail.com`).
  2. For Praveen's SDE / Full Stack profile, the automator table rendered irrelevant Cloud/DevOps entries (e.g. HashiCorp with generic title `DevOps & Platform Systems Engineer – Candidate Introduction`) instead of relevant SDE and FSD applications.
- **Root Cause**:
  1. Draft links used naked `https://mail.google.com/mail/#drafts/...` URLs without the Google `authuser` query parameter, causing multi-account browsers to default to account index 0.
  2. Sample applications and cache had hardcoded generic DevOps roles rather than dynamically synthesizing roles tailored to the active user's domain and experience.
- **Resolution**:
  - Implemented explicit account routing via `authuser=${encodeURIComponent(userEmail)}` across `JobApplicationPanel.tsx` and `WebAutomatorModal.tsx`.
  - Added smart action resolver `getGmailAction()` that opens pre-filled compose drafts for pending outreach or sent searches for sent emails in the user's exact Gmail account.
  - Tailored all sample and seeded applications for Praveen to **SDE & Full Stack Developer (FSD)** (HashiCorp $\rightarrow$ `Senior Full Stack Software Engineer (FSD / React / Go)`, Stripe $\rightarrow$ `Senior Full Stack Engineer (.NET / React)`, Snowflake $\rightarrow$ `Senior Backend Developer / SDE`, Datadog $\rightarrow$ `Senior Full Stack & Systems Engineer`).
  - Added live domain workspace filtering in `JobApplicationPanel.tsx` to respect the sidebar's domain selection (`filterState.activeDomain`).
  - Added cache migration in `apiClient.ts` to automatically upgrade legacy cached entries on client load.
  - Verified with `npm run build` (0 errors).

---

## 2. Completed Features & Release Milestones

### 🚀 Milestone 1: Multi-User Profile & Authentication System
- [x] **Catalog & User State Separation**: Centralized master jobs catalog in `jobs`; created `user_job_states` table with composite index `(user_id, job_id)`.
- [x] **Initial User Seeding**: Seeded **Praveen Kashyap** (`2pkashyap2001@gmail.com`) and **Anam Ansari** (`anamansari.0406@gmail.com`), with all ~1,300+ existing applications duplicated for both users.
- [x] **Status & Progress Isolation**: Verified that Praveen changing a status to `Interviewing` leaves Anam's status at `Not Started`.
- [x] **Fresh User Registration**: New user signup collects Full Name, Email, Password, Target Domain, Role, YoE, Key Strengths, LinkedIn, and Phone, with all central jobs defaulting to `"Not Started"`.
- [x] **Secure Password Hashing**: Native PBKDF2 with SHA-256 and salt (`PasswordHasher.cs`).
- [x] **UI Components**:
  - `AuthModal.tsx`: Sign In with 1-click Quick Login chips for Praveen & Anam + comprehensive registration form.
  - `ProfileMenu.tsx`: Header profile widget with initials avatar, active domain badge, account switching dropdown, and logout.
  - `SettingsModal.tsx`: Connected to backend `PUT /api/auth/profile`.
- [x] **Database Migration**: EF Core migration `20260922085253_AddUserAuthAndProfiles` applied to Supabase PostgreSQL.

---

### 🚀 Milestone 2: Guest Mode with Zero Application Statuses & Immediate Login Prompt
- [x] **Zero Application Status Default**: Unauthenticated visitors see central job listings with 0 applied/interviewing statuses (all `"Not Started"`).
- [x] **Immediate Login / Register Popup**: First-time visitors are immediately presented with `AuthModal` to log in or create an account.
- [x] **Unauthorized Mutation Guard**: Read-only browsing is permitted; attempting to edit job statuses as a guest returns `401 Unauthorized`.
- [x] **Database Sanitation**: Cleaned up leftover test candidate accounts in Supabase PostgreSQL, preserving solely Praveen Kashyap and Anam Ansari.

---

### 🚀 Milestone 3: Gmail JD Automator Sidecar & Webhook Pipeline
- [x] **Sidecar Integration**: Migrated Python automator with Claude API, Tesseract OCR, and automated Gmail drafts creation.
- [x] **Webhook Endpoint**: Implemented `POST /api/jobs/import-from-automator` with draft idempotency and company name extraction.
- [x] **Frontend Panel**: Created `JobApplicationPanel.tsx` with filterable automator status badges and "Open Draft in Gmail" deep-links.

---

### 🚀 Milestone 4: System Knowledge Graph (Graphify Mode)
- [x] **Re-targeted Graph**: `frontend/public/graph.html` with 42 nodes and 38 edges across 7 architecture layers (Frontend UI, TanStack Query, Controllers, DTOs, EF Core, Supabase PostgreSQL, Python Automator).
- [x] **Two-Tier System**: Node inspector sidebar with design tokens and code symbol references.

---

### 🚀 Milestone 5: Windows Local Developer Experience
- [x] **1-Click Launchers**: Created `run.bat` (boots both .NET API and Vite frontend concurrently) and `stop.bat` (gracefully stops both processes).

---

### 🐛 Error 11: Incomplete Draft Body & Missing Signature in 'Open Draft' Redirection
- **Component**: Job Application Panel (`JobApplicationPanel.tsx`), Web Automator (`WebAutomatorModal.tsx`), Settings Modal (`SettingsModal.tsx`)
- **Error / Issue**: Clicking 'Open Draft' in the Automator redirected to Gmail compose with only a single-sentence teaser (`job.outreachBodyPreview`) without salutation, proof points, or candidate contact/signature block. Additionally, Settings lacked a separate field for Portfolio URL and live signature preview.
- **Root Cause**: `getGmailAction` passed `encodeURIComponent(job.outreachBodyPreview)` into the Gmail URL without assembling greeting, value pitch, or candidate contact block.
- **Resolution**:
  - Created `frontend/src/services/emailAssembler.ts` providing `assembleFullOutreachEmail(job, userProfile)` and `assembleSignature(userProfile)` to generate publication-ready emails with formal greetings, tailored pitches, proof metrics, CTAs, and complete contact signatures.
  - Added dedicated Portfolio URL, Flagship Achievement, and a live formatted Signature Preview card in `SettingsModal.tsx`.
  - Updated backend models (`UserProfile.cs`), DTOs (`AuthDtos.cs`), API controller (`AuthController.cs`), client types, and store to persist Portfolio URL and Flagship Achievement.
  - Created a 10 Foundational Drafts Library with standardized `{placeholders}` in `frontend/src/data/foundationalDrafts.ts` and integrated blueprint selection into `WebAutomatorModal.tsx`.
  - Archived 10 realistic JDs in `docs/jd-samples/` (HashiCorp, Stripe, Snowflake, Datadog, AWS, OpenAI, GitHub, Airbnb, Uber, Netflix).

---

### 🐛 Error 12: Truncated Sliced Body & Outdated Candidate Profile (5+ years vs 3+ years) in Gmail Drafts
- **Component**: Email Assembler (`emailAssembler.ts`), Client Cache (`useJobStore.tsx`, `apiClient.ts`), Seed Data (`AuthController.cs`, `foundationalDrafts.ts`, `JobApplicationPanel.tsx`)
- **Error / Issue**: When opening Gmail drafts, the email body showed truncated sentences ending in `...` (e.g. `With over 5+ years of hands-on software engineering e...`) and contained outdated profile details (`5+ years` instead of candidate's actual `3+ years`, placeholder contact info).
- **Root Cause**:
  1. `WebAutomatorModal.tsx` historically saved truncated teaser strings (`generatedBody.slice(0, 150) + '...'`) into `job.outreachBodyPreview`.
  2. `assembleFullOutreachEmail` previously checked only `preview.length > 180`, mistakenly treating the 183-character truncated teaser as the final full email.
  3. Default profile values in backend seeds and client fallbacks had `5+ years` rather than Praveen's current `3+ years` and exact contact information.
- **Resolution**:
  - Updated `assembleFullOutreachEmail()` in `emailAssembler.ts` with strict anti-truncation validation: any preview ending with `...` or `…`, under 280 characters, lacking double newlines, or containing `5+ years` is flagged as an invalid teaser and automatically regenerated into a full multi-paragraph pitch.
  - Grounded all default values, seeds, and fallbacks in Praveen's exact profile details:
    - **Full Name**: `Praveen Kashyap`
    - **Current / Target Role**: `Full Stack Engineer / SDE`
    - **Years of Experience**: `3+ years`
    - **Target Domain**: `Software Engineering (SDE)`
    - **Key Technical Strengths**: `Angular, React, TypeScript, C#, .NET Core, Microservices, Cloud Architecture`
    - **Email Address**: `2pkashyap2001@gmail.com`
    - **Phone Number**: `+91 7394990738`
    - **LinkedIn Profile**: `https://www.linkedin.com/in/coder-pro10z/`
    - **GitHub / Portfolio**: `https://github.com/coder-pro10z`
  - Added automatic migration in `useJobStore.tsx` to upgrade any existing user profile stored in browser `localStorage`.
  - Updated backend user seed in `AuthController.cs` to update existing user records on startup.
  - Verified frontend build (`tsc -b && vite build`) and backend build (`dotnet build`) both succeeded with 0 errors.

---

### 🚀 Milestone 6: Brand-Accurate LinkedIn Outreach Studio Styling
- [x] **Design Tokens**: Added `--linkedin-primary: #0a66c2`, `--linkedin-hover: #004182`, `--linkedin-bg`, and `--linkedin-border` in `index.css` and `styles.css`.
- [x] **Channel Navigation Pills**: Updated `LinkedIn Note (<300 chars)` and `LinkedIn InMail` buttons in `OutreachStudio.tsx` to use the official LinkedIn primary background.
- [x] **Contextual Action Bar**: Dynamic LinkedIn action button that switches to LinkedIn brand blue and surfaces direct "Open Profile on LinkedIn" links when recruiter contact information is present.

---

### 🚀 Milestone 7: Publication-Ready Email Assembly, Signature Studio & Foundational Drafts Library
- [x] **Full Outreach Assembly**: Implemented `emailAssembler.ts` producing multi-paragraph outreach drafts with greeting, pitch, proof metric, and signature.
- [x] **Candidate Signature Engine**: Supports Full Name, Role, Phone, Email, LinkedIn, GitHub, and Portfolio URLs with real-time preview in Settings.
- [x] **10 Foundational Drafts Library**: Scaffolding in `foundationalDrafts.ts` with `{placeholder}` interpolation across SDE, Cloud, and Networking categories.
- [x] **Realistic JD Archive**: Archived 10 realistic company JDs in `docs/jd-samples/`.

---

### 🚀 Milestone 8: Top 25 Highest-Paying IT Product Companies Outreach Engine (~₹40–95 LPA)
- [x] **High-Comp Blueprint Expansion**: Expanded `foundationalDrafts.ts` to 24 curated blueprints, creating tailored outreach architectures for top global product and Indian tier-1 tech firms:
  - **Uber** (~₹95 LPA): Real-time marketplace dispatch state machines, H3 geospatial indexing, p99 latency SLAs.
  - **Netflix** (~₹90 LPA): Edge streaming throughput, chaos resilience, freedom and responsibility, micro-frontends.
  - **Google** (~₹85 LPA): Large-scale distributed systems, Borg/Kubernetes patterns, algorithmic efficiency.
  - **Meta** (~₹85 LPA): High-velocity product shipping, React / TypeScript / GraphQL web scale, measurable engagement.
  - **Apple** (~₹82 LPA): Systems craft, privacy-first architectures, low-latency API contracts.
  - **Airbnb** (~₹80 LPA): Distributed booking state machines, product design fidelity, service-oriented architecture.
  - **Amazon / AWS** (~₹75 LPA): Customer Obsession, 2-pizza decoupled SOA, operational excellence.
  - **Microsoft** (~₹72 LPA): Enterprise cloud scale, C# / .NET Core / TypeScript excellence, Azure microservices.
  - **NVIDIA** (~₹70 LPA): High-performance computing, GPU data streaming, accelerated platforms.
  - **Stripe** (~₹68 LPA): Idempotent financial APIs, 99.999% availability, zero-loss ledger reliability.
  - **Atlassian** (~₹40–50+ LPA): Enterprise collaboration cloud, developer velocity, multi-tenant microservices.
  - **Razorpay & PhonePe** (~₹45–46 LPA): High-volume UPI transactions, flash sale surge resilience, idempotent webhooks.
  - **Flipkart, Zomato, Swiggy & Meesho** (~₹40–48 LPA): Hyper-local dispatch, Big Billion Days flash-sale spikes, distributed caching (Redis).
  - **Enterprise Multi-Tenant SaaS** (~₹52–65 LPA): Salesforce, Adobe, ServiceNow, PayPal, Oracle, SAP Labs, Cisco, Qualcomm.
- [x] **Company-Aware Auto-Detection**: Integrated auto-detection in `WebAutomatorModal.tsx` and `emailAssembler.ts` that immediately matches company names to company-engineered architectural hooks.
- [x] **Forum & Recruiter Calibrated Framework**: Published comprehensive handbook `docs/TOP_PAYING_COMPANIES_OUTREACH_GUIDE.md` covering recruiter expectations from Blind, LeetCode, and recruiter insights (mobile-scannable under 150 words, concrete metrics, zero spammy attachments, low-friction 15-min CTA).
- [x] **Clean Verification**: Frontend (`tsc -b && vite build`) and backend (`dotnet build`) both verified with 0 errors.

---

### 🚀 Milestone 9: Multi-Dimensional Composable Outreach Matrix Engine (Zero-DB Overhead)
- [x] **Zero-Database Architecture**: Rejected heavy SQL database bloat in favor of a pure TypeScript functional slot-filling engine (`composableOutreachEngine.ts`). Delivers 0ms latency, zero DB migrations, and 100% offline & Vercel serverless compatibility.
- [x] **Multi-Dimensional Matrix Dimensions**:
  - **Work Modes**: `Remote` (async autonomy, PR discipline, distributed timezones) vs `Hybrid` (in-office whiteboard pairing + focused remote shipping) vs `Onsite` (zero-latency face-to-face whiteboarding, pairing, immediate feedback).
  - **Company Archetypes**:
    - `Startup (0-to-1)`: High agency, wear many hats, rapid shipping without tech debt.
    - `Mid-Size (Scale-up)`: Breaking monolithic bottlenecks, scaling microservices, CI/CD automation.
    - `MNC / Big Tech`: p99 tail latency, 99.999% SLAs, architectural RFCs, observable microservices at scale.
    - `Service / IT Solutions`: Client delivery velocity, legacy enterprise modernization (.NET Framework to .NET Core/Cloud), agile sprint discipline.
    - `High-Comp Quant & FinTech`: Zero-loss transactional correctness, sub-millisecond data pipelines, memory/compute efficiency (Citadel, Stripe, OpenAI, Snowflake).
  - **Outreach Angles**: `Direct Recruiter` (<120 words) vs `Hiring Manager (Technical & p99 Architecture)` vs `Peer / Alumni Referral Request`.
- [x] **Interactive Automator UI Controls**: Added responsive chips and selectors in `WebAutomatorModal.tsx` allowing candidates to toggle Work Mode, Company Scale, and Outreach Angle with live dynamic synthesis.
- [x] **Global Integration**: Wired `emailAssembler.ts` to automatically weave the job's `work_mode` and company archetype into all "Open Draft" actions across the platform.
- [x] **Comprehensive Handbook**: Published `docs/COMPOSABLE_DRAFTS_MATRIX_GUIDE.md`.
- [x] **Build Verification**: `npm run build` and `dotnet build` succeeded with 0 errors.

---

### Category A: Authentication & User Management
- [ ] **JWT Token Expiration & Refresh Flow**: Upgrade token string to signed HMAC-SHA256 JWT tokens with 7-day expiration and silent refresh.
- [ ] **Forgot Password & Email Reset**: Send password reset tokens via SendGrid / SMTP.
- [ ] **Avatar Image Upload**: Support user profile avatar picture uploads to Supabase Storage bucket.

### Category B: Multi-User Collaboration & Sharing
- [ ] **Job Recommendation Sharing**: Allow User A to "Recommend / Send Opportunity" to User B with an internal notification.
- [ ] **Shared Recruiter Contacts Directory**: Cross-reference recruiter notes and outreach outcomes across team members.
- [ ] **Activity Feed**: Timeline showing recent applications, interview rounds, and offers across profiles.

### Category C: Automator & Analytics
- [ ] **Automated Background Scheduler**: Windows Task Scheduler / Cron job runner for `automation/gmail-jd-automator/main.py`.
- [ ] **Export Profile Performance PDF**: Export personal application metrics, conversion rates, and weekly progress charts to PDF.
- [ ] **LinkedIn InMail Automation**: Browser extension integration for 1-click lead capture into NextApply.
