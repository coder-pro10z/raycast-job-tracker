# AGENTS.md — NextApply Job Tracker

Universal instructions for AI coding agents (Claude, Gemini, Codex, Copilot, Cursor, Windsurf). Read this file FIRST before making any changes.

---

## Project Identity

**NextApply** is an autonomous job application tracking and outreach platform.

| Layer | Stack | Entry Point |
|---|---|---|
| Frontend | React 19.2 · TypeScript 6.0 · Vite 8.2 · TanStack Query 5 · Lucide React | `frontend/src/App.tsx` |
| Backend | ASP.NET Core 9.0 · EF Core 9 · PostgreSQL (Npgsql) · Swagger | `backend/NextApply.Api/Program.cs` |
| Automation | Python 3.9+ · Google Gmail API · Anthropic Claude · Tesseract OCR | `automation/gmail-jd-automator/main.py` |
| Docs | 17 markdown guides + 10 JD samples | `docs/` |

---

## Build Commands

### Frontend (MUST pass after every change)
```bash
cd frontend && npm run build
# Runs: tsc -b && vite build
# Expected: 0 errors
```

### Backend
```bash
cd backend/NextApply.Api && dotnet build
# Expected: Build succeeded, 0 errors (warnings acceptable)
```

### Tests
```bash
# Root-level Vitest
npm test
# or scoped:
npm run test:frontend
npm run test:automation
```

### Dev Servers
```bash
# Frontend dev (port 5173)
cd frontend && npm run dev

# Backend API (port 5089)
cd backend/NextApply.Api && dotnet run
```

---

## Always Do

1. **Read `FILES.md`** before exploring the filesystem. It maps every directory and warns which paths to skip.
2. **Read `RULES.md`** before writing any UI code. It is the binding design system contract.
3. **Read `DESIGN.md`** for CSS custom property tokens, typography scales, and component patterns.
4. **Use `lucide-react` icons** for ALL interactive controls. Import only what you render (`noUnusedLocals` is enforced).
5. **Use CSS custom properties** (`var(--bg-secondary)`, `var(--text-primary)`) — never hardcode hex values unless it's a brand accent.
6. **Wrap mutation payloads** in `{ id: string; patch: Partial<JobItem> }` when calling `useUpdateJob().mutateAsync()`.
7. **Use `ReturnType<typeof setTimeout>`** for timer refs — never `NodeJS.Timeout` (browser target, no Node ambient types).
8. **Run `npm run build`** in `frontend/` after every TypeScript/React change. Zero errors required.
9. **Use conventional commits**: `feat(scope):`, `fix(scope):`, `docs(scope):`.
10. **Update `BACKLOG.md`** when fixing bugs (Section 1) or shipping features (Section 2).
11. **Ground Praveen's profile** in all outreach: `3+ years` experience, email `2pkashyap2001@gmail.com`, phone `+91 7394990738`, LinkedIn `coder-pro10z`, GitHub `coder-pro10z`.

---

## Never Do

1. **Never use raw Unicode emojis** (📱⚡🧭✉️) in buttons, tabs, badges, or interactive controls.
2. **Never import unused symbols** — `tsc` strict mode (`noUnusedLocals: true`) will fail the build.
3. **Never hardcode `NodeJS.Timeout`** — this is a browser SPA, use `ReturnType<typeof setTimeout>`.
4. **Never pass mutation fields flat** to `useUpdateJob()`. Always wrap inside `patch: { ... }`.
5. **Never crawl** `node_modules/`, `dist/`, `bin/`, `obj/`, `__pycache__/`, or `.git/`.
6. **Never commit** `credentials.json`, `token.json`, `.env`, or `appsettings.Development.json`.
7. **Never modify** `.github/workflows/` — store CI templates in `automation/gmail-jd-automator/workflow/` instead.
8. **Never reference `5+ years`** in Praveen's profile — the correct value is `3+ years`.
9. **Never add external WYSIWYG editors** (TipTap, Quill) — the project uses zero-dependency plain text formatting.

---

## Project Structure (Quick Reference)

```
Job-Tracker/
├── frontend/src/
│   ├── components/         # React components by domain (auth, dashboard, detail, jobapp, layout, search, settings, table)
│   ├── services/           # API client, email assembler, composable outreach engine, Excel adapter
│   ├── hooks/              # TanStack Query hooks (useJobs, useJobApplicationImport)
│   ├── state/              # useJobStore.tsx (global state, auth, filters)
│   ├── data/               # foundationalDrafts.ts, outreachTemplates.ts
│   ├── types/              # job.ts (JobItem, UserProfile), auth.ts
│   └── index.css           # ALL design tokens (dark/light palette, spacing, radius, shadows)
│
├── backend/NextApply.Api/
│   ├── Controllers/        # REST API endpoints (Jobs, Auth, Dashboard, Notes, Settings, Health)
│   ├── Models/             # EF Core entities (Job, UserProfile, UserJobState, Note, Settings)
│   ├── DTOs/               # Request/response contracts (JobUpdateDto, AuthDtos)
│   ├── Data/               # AppDbContext, seeding
│   └── Services/           # Business logic (PasswordHasher)
│
├── automation/gmail-jd-automator/   # Python Gmail JD scan → OCR → Claude → compose pipeline
├── docs/                            # 17 architecture guides, JD samples, outreach handbooks
├── tests/                           # Frontend, integration, automation test suites
└── RULES.md / DESIGN.md / FILES.md / SKILL.md / BACKLOG.md
```

---

## Key Domain Types

```typescript
// frontend/src/types/job.ts
interface JobItem {
  id: string;
  companyName: string;
  targetRole: string;
  location: string;
  workMode: 'Hybrid' | 'Remote' | 'Onsite' | 'Unknown';
  techStack: string[];
  applicationStatus: 'Not Started' | 'Applied' | 'Under Review' | 'Interviewing' | 'Offered' | 'Rejected' | 'Archived';
  priority: 'High' | 'Medium' | 'Low' | 'Normal' | 'Unknown';
  domain: 'sde' | 'cloud' | 'dual' | 'general';
  gmailDraftId?: string;
  automatorStatus?: 'Draft Created' | 'Sent' | 'Skipped';
  outreachSubject?: string;
  outreachBodyPreview?: string;
  hrRecruiterName: string;
  // ... see types/job.ts for full interface
}

interface UserProfile {
  fullName: string;
  currentRole: string;
  yoe: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  // ... see types/job.ts for full interface
}
```

---

## Companion Files

| File | Purpose |
|---|---|
| `FILES.md` | Complete codebase directory map — read to avoid wasting context tokens |
| `DESIGN.md` | Visual design system tokens, palette, typography, component patterns |
| `RULES.md` | Mandatory architecture & UI/UX rules (emoji ban, typography, fallback) |
| `SKILL.md` | Modular agent skill workflows (component creation, API endpoints, outreach, git) |
| `CLAUDE.md` | Claude-specific behavioral overrides |
| `GEMINI.md` | Gemini-specific behavioral overrides |
| `BACKLOG.md` | Bug log, milestones, and roadmap backlog |
