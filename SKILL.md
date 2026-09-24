---
name: nextapply-job-tracker
description: Modular agent skills for the NextApply Job Tracker — an autonomous job application platform with React 19, .NET Core 9, Python Gmail Automator, and multi-dimensional outreach engine.
---

# SKILL.md — NextApply Agent Skills Reference

This file defines modular, reusable skill workflows that AI agents can load on-demand when performing specific tasks in the NextApply Job Tracker project.

---

## Skill 1: Frontend Component Creation

**When**: Agent is asked to create a new React component.

### Steps
1. Place the file under `frontend/src/components/<domain>/ComponentName.tsx`.
2. Use `React.FC<Props>` with an explicit props interface.
3. Import icons ONLY from `lucide-react`. Never use raw Unicode emojis.
4. Reference design tokens from `index.css` via `var(--token-name)` in inline styles.
5. For mutations, use `useUpdateJob()` from `hooks/useJobs.ts` with `{ id, patch: Partial<JobItem> }` signature.
6. For global state, use `useJobStore()` from `state/useJobStore.tsx`.
7. For toast notifications, call `showToast('message')` from the job store.
8. Run `cd frontend && npm run build` to verify 0 TypeScript errors.

### Anti-Patterns
- Do NOT use `NodeJS.Timeout`. Use `ReturnType<typeof setTimeout>` instead.
- Do NOT pass mutation fields flat. Always wrap in `{ id, patch: { ...fields } }`.
- Do NOT import unused symbols — `tsc` enforces `noUnusedLocals`.

---

## Skill 2: Backend API Endpoint

**When**: Agent is asked to add a new API endpoint.

### Steps
1. Add/modify controller in `backend/NextApply.Api/Controllers/`.
2. If new entity fields are needed, update `Models/*.cs` AND `DTOs/JobUpdateDto.cs`.
3. Run EF Core migration if schema changes: `dotnet ef migrations add <Name>`.
4. Verify with `cd backend/NextApply.Api && dotnet build` (0 errors).
5. Test with the `.http` file or Swagger UI at `http://localhost:5089/swagger`.

### API Conventions
- All job queries are user-scoped via `X-User-Id` header or auth token.
- Guest users (no auth) receive catalog-only data with `applicationStatus: 'Not Started'`.
- PATCH `/api/jobs/{id}` accepts `JobUpdateDto` with nullable fields.

---

## Skill 3: Outreach Email Synthesis

**When**: Agent is asked to generate or modify outreach email drafts.

### Steps
1. Check `foundationalDrafts.ts` for existing blueprints matching the company/domain.
2. Use `composeOutreachEmail()` from `composableOutreachEngine.ts` for matrix-based synthesis.
3. Use `assembleFullOutreachEmail(job, userProfile)` from `emailAssembler.ts` for full multi-paragraph drafts.
4. All drafts MUST include the candidate's complete signature block (name, role, phone, email, LinkedIn, GitHub).
5. Drafts for Praveen Kashyap must use: `3+ years` experience (not `5+ years`), email `2pkashyap2001@gmail.com`, phone `+91 7394990738`.

### Matrix Dimensions
- **Work Mode**: Remote / Hybrid / Onsite
- **Company Scale**: Startup / Mid-Size / MNC / Service / High-Comp
- **Outreach Angle**: Recruiter Direct / Hiring Manager / Peer Referral

---

## Skill 4: Gmail Automator Pipeline

**When**: Agent is asked to modify the Python Gmail JD automator.

### Steps
1. All automator code lives in `automation/gmail-jd-automator/`.
2. Entry point: `main.py`.
3. Dependencies: `requirements.txt` (google-auth, anthropic, pytesseract, Pillow).
4. Environment: Requires `credentials.json` (Google Cloud OAuth), `ANTHROPIC_API_KEY`, and Tesseract OCR.
5. Pipeline: Scan Gmail Drafts → OCR images → Claude AI tailoring → Compose email → POST to backend.
6. Never commit `credentials/`, `token.json`, or `.env` files.

---

## Skill 5: Build Verification

**When**: After ANY code change, always run verification.

### Frontend
```bash
cd frontend && npm run build
```
Expects: `tsc -b && vite build` → 0 errors.

### Backend
```bash
cd backend/NextApply.Api && dotnet build
```
Expects: `Build succeeded` → 0 errors (warnings acceptable).

### Full Stack
```bash
cd frontend && npm run build; cd ../backend/NextApply.Api && dotnet build
```

---

## Skill 6: Documentation Updates

**When**: Agent completes a feature or milestone.

### Steps
1. Add error entries to `BACKLOG.md` Section 1 if bugs were encountered.
2. Add milestone entries to `BACKLOG.md` Section 2 if features were shipped.
3. Update `docs/07-feature-reference.md` with new feature items.
4. Update `docs/01-architecture-overview.md` if architecture changed.
5. Update `docs/08-job-application-module.md` if outreach/automator logic changed.
6. Commit with conventional commit messages: `feat(scope): description`, `fix(scope): description`, `docs(scope): description`.

---

## Skill 7: Git Workflow

**When**: Agent needs to commit and push changes.

### Steps
1. Stage: `git add .`
2. Commit with conventional format: `git commit -m "feat(outreach): implement native draft editor popup"`
3. Push: `git push origin main`
4. NEVER modify `.github/workflows/` — store CI templates in `automation/gmail-jd-automator/workflow/` instead.
