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
