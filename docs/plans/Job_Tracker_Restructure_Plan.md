# Job-Tracker: Professional Monorepo Restructure Plan

**Goal:** Turn the current flat, mixed-concern folder into a clean `frontend / backend / docs / sheets` monorepo — the layout a hiring manager or another engineer would expect to see.

---

## 0. Current State (what your screenshots show)

Frontend source (`src`, `public`, `package.json`, `tsconfig*`), backend source (`NextApply.Api/`), four separate Excel files, two "prompt" markdowns, a `Plan.md`, a stray `index` Chrome HTML file, and build artifacts (`dist`, `node_modules`, `bin`, `obj`) are all sitting in one flat root. This is normal mid-build — it just needs a pass before it looks intentional.

---

## 1. Target Structure

```
job-tracker/                          # repo root
├── README.md                         # NEW — monorepo overview, links to both apps
├── .gitignore                        # updated — see Section 4
├── .gitattributes
├── Job-Tracker.sln                   # stays at root, path updated to backend/
│
├── docs/
│   ├── architecture.md               # already exists — keep
│   ├── api-reference.md              # NEW — from your ASP.NET Core plan, Section 2.3
│   ├── database-schema.md            # NEW — from Section 1 of the backend plan
│   ├── deployment.md                 # NEW — from Section 5 of the backend plan
│   ├── plan.md                       # was root Plan.md
│   └── prompts/
│       ├── job-sheet-prompt.md       # was Job-sheet-prompt.md
│       └── job-tracker-prompt.md     # was Job-Tracker-prompt.md
│
├── sheets/
│   ├── Master_Job_Tracker_Verified.xlsx   # canonical — see Section 3 note
│   ├── Master_Job_Tracker.xlsx            # superseded — see Section 3 note
│   ├── Jobs-sheet.xlsx                    # superseded — see Section 3 note
│   └── Cloud_DevOps_Jobs_Tracker.xlsx
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── .oxlintrc
│   └── README.md                     # was root README.md (NextApply-specific)
│
├── backend/
│   └── NextApply.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Middleware/
│       ├── Migrations/
│       ├── Models/
│       ├── Properties/
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Dockerfile
│       ├── NextApply.Api.csproj
│       ├── NextApply.Api.http
│       └── README.md                 # NEW — backend-specific quick start
│
├── scripts/
│   └── import_excel_to_postgres.py   # the migration script from the backend plan
│
└── archive/                          # deprecated files, kept not deleted
```

**Not committed to git** (build artifacts, regenerate on demand):
`node_modules/`, `dist/`, `backend/NextApply.Api/bin/`, `backend/NextApply.Api/obj/`, the stray `index` (Chrome-saved HTML page — this doesn't belong in a repo at all, move to `archive/` or delete).

---

## 2. File-by-File Mapping

| Current location | New location | Why |
|---|---|---|
| `src/`, `public/`, `index.html` | `frontend/src/`, `frontend/public/`, `frontend/index.html` | Isolates frontend concern |
| `package.json`, `package-lock.json` | `frontend/` | npm scope should match the app it builds |
| `tsconfig*.json`, `.oxlintrc` | `frontend/` | Frontend-only tooling config |
| `README.md` (current, NextApply-focused) | `frontend/README.md` | It documents the React app specifically |
| `NextApply.Api/` | `backend/NextApply.Api/` | Isolates backend concern |
| `Master_Job_Tracker.xlsx`, `Master_Job_Tracker_Verified.xlsx`, `Jobs-sheet.xlsx`, `Cloud_DevOps_Jobs_Tracker.xlsx` | `sheets/` | Data files, not source code — shouldn't live at root |
| `Plan.md` | `docs/plan.md` | Reference doc |
| `Job-sheet-prompt.md`, `Job-Tracker-prompt.md` | `docs/prompts/` | These are AI-prompt artifacts, not project docs — grouping them separately keeps `docs/` focused on things a reader actually needs |
| `docs/` (existing architecture content) | `docs/` | Already correct, just gains siblings |
| `scripts/` | `scripts/` | Correct already — this is where the xlsx→Postgres import script from the backend plan belongs |
| `index` (Chrome HTML doc) | delete or `archive/` | Not a project file — looks like an accidental save |
| `.sln` | stays at root | Solution files conventionally sit at repo root even in monorepos; internal project reference path updates to `backend/NextApply.Api/...` |

---

## 3. Decision Needed: Four Excel Files

You have `Master_Job_Tracker.xlsx`, `Master_Job_Tracker_Verified.xlsx`, `Jobs-sheet.xlsx`, and `Cloud_DevOps_Jobs_Tracker.xlsx` all sitting at root. Once the backend migration (from the earlier plan) is live, Postgres becomes the source of truth — these become historical/seed files, not something you edit day-to-day. Before moving them, confirm:

- Is `Master_Job_Tracker_Verified.xlsx` the newest/canonical one, and the plain `Master_Job_Tracker.xlsx` an older draft?
- Is `Jobs-sheet.xlsx` a duplicate of `Master_Job_Tracker.xlsx`, or does it hold different data?
- Is `Cloud_DevOps_Jobs_Tracker.xlsx` already merged into the "All Opportunities" master sheet, or a separate unmerged source?

**Recommended default** (safe, reversible): move all four into `sheets/`, but put the two you suspect are superseded (`Master_Job_Tracker.xlsx`, `Jobs-sheet.xlsx`) into `archive/` instead. Nothing gets deleted, but the active folder only shows the one true source you actually use for migration.

---

## 4. Updated `.gitignore`

```gitignore
# Frontend
frontend/node_modules/
frontend/dist/

# Backend
backend/NextApply.Api/bin/
backend/NextApply.Api/obj/

# Environment secrets
**/appsettings.Development.json
**/.env
**/.env.local

# OS/editor
.DS_Store
Thumbs.db
.vscode/
```

If `appsettings.Development.json` currently holds a real connection string, move that to environment variables or user-secrets now — it should never be committed even in Development form.

---

## 5. PowerShell Migration Script

Run from the repo root (where `.git` lives). This uses `git mv` throughout so file history is preserved — nothing looks "newly added" in git blame.

```powershell
# --- 1. Create new top-level folders ---
New-Item -ItemType Directory -Force -Path frontend, backend, sheets, docs/prompts, archive, scripts | Out-Null

# --- 2. Move frontend files ---
git mv src frontend/src
git mv public frontend/public
git mv index.html frontend/index.html
git mv package.json frontend/package.json
git mv package-lock.json frontend/package-lock.json
git mv tsconfig.json frontend/tsconfig.json
git mv tsconfig.app.json frontend/tsconfig.app.json
git mv tsconfig.node.json frontend/tsconfig.node.json
git mv .oxlintrc frontend/.oxlintrc
git mv README.md frontend/README.md

# --- 3. Move backend files ---
git mv NextApply.Api backend/NextApply.Api

# --- 4. Move data files into sheets/ (adjust based on Section 3 decision) ---
git mv Master_Job_Tracker_Verified.xlsx sheets/Master_Job_Tracker_Verified.xlsx
git mv Cloud_DevOps_Jobs_Tracker.xlsx sheets/Cloud_DevOps_Jobs_Tracker.xlsx
git mv Master_Job_Tracker.xlsx archive/Master_Job_Tracker.xlsx
git mv Jobs-sheet.xlsx archive/Jobs-sheet.xlsx

# --- 5. Move docs ---
git mv Plan.md docs/plan.md
git mv Job-sheet-prompt.md docs/prompts/job-sheet-prompt.md
git mv Job-Tracker-prompt.md docs/prompts/job-tracker-prompt.md

# --- 6. Handle the stray file ---
git mv index archive/index.html

# --- 7. Remove build artifacts from tracking (safe — they regenerate) ---
git rm -r --cached dist 2>$null
git rm -r --cached node_modules 2>$null
git rm -r --cached backend/NextApply.Api/bin 2>$null
git rm -r --cached backend/NextApply.Api/obj 2>$null

Write-Host "Move complete. Now fix the .sln, vite config, and Vercel root dir before committing." -ForegroundColor Yellow
```

---

## 6. Fixes Required After the Move (do these before your next commit)

### 6.1 `Job-Tracker.sln`
Open it in a text editor and update the project path:
```diff
- Project("{...}") = "NextApply.Api", "NextApply.Api\NextApply.Api.csproj", "{...}"
+ Project("{...}") = "NextApply.Api", "backend\NextApply.Api\NextApply.Api.csproj", "{...}"
```
Or regenerate cleanly instead of hand-editing:
```powershell
dotnet sln Job-Tracker.sln remove NextApply.Api/NextApply.Api.csproj
dotnet sln Job-Tracker.sln add backend/NextApply.Api/NextApply.Api.csproj
```

### 6.2 Vercel root directory
Since the frontend no longer lives at repo root, Vercel needs to know where to build from:
**Vercel Dashboard → Project Settings → General → Root Directory → set to `frontend`**
Without this, your next deploy will fail looking for `package.json` at the old root.

### 6.3 `frontend/vite.config.ts`
Check for any hardcoded relative paths (e.g., `publicDir`, alias paths) — these should still resolve correctly since the whole `frontend/` folder moved as a unit, but verify with a local `npm run dev` before pushing.

### 6.4 Backend `.csproj` and `Program.cs`
Same logic — internal references are relative to the project file, so moving the whole folder as a unit keeps them intact. Run `dotnet build` locally from `backend/NextApply.Api/` to confirm.

### 6.5 Any CI/deploy scripts
If you have GitHub Actions or an `az webapp up` script that references old paths (`NextApply.Api/`), update them to `backend/NextApply.Api/`.

---

## 7. New Root `README.md` Outline

Replace the old NextApply-specific README at root with a short monorepo index — the detailed content moves to `frontend/README.md` (already there) and a new `backend/NextApply.Api/README.md`:

```markdown
# Job-Tracker

Full-stack job application tracking & intelligence workspace.

## Structure
- `frontend/` — React 18 + TypeScript + Vite UI ([details](frontend/README.md))
- `backend/NextApply.Api/` — ASP.NET Core Web API + PostgreSQL ([details](backend/NextApply.Api/README.md))
- `docs/` — architecture, API reference, database schema, deployment guide
- `sheets/` — source-of-record Excel exports (backup/seed only, not the live data store)
- `scripts/` — one-off tooling (Excel → Postgres migration)

## Quick Start
See `frontend/README.md` and `backend/NextApply.Api/README.md` for setup instructions for each half.

## Architecture
See [docs/architecture.md](docs/architecture.md) for the full system design.
```

## 8. New `backend/NextApply.Api/README.md` Outline

```markdown
# NextApply.Api

ASP.NET Core Web API backend for the Job-Tracker workspace.

## Stack
ASP.NET Core 8, EF Core (Npgsql), PostgreSQL (Supabase)

## Local Setup
1. `dotnet restore`
2. Set connection string via `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."`
3. `dotnet ef database update`
4. `dotnet run`

## Endpoints
See [../../docs/api-reference.md](../../docs/api-reference.md)
```

---

## 9. Verification Checklist (run through this before pushing)

- [ ] `cd frontend && npm install && npm run dev` — app loads at localhost as before
- [ ] `cd backend/NextApply.Api && dotnet build` — builds clean
- [ ] `dotnet run` from backend folder — API responds on expected port
- [ ] Open `Job-Tracker.sln` in Visual Studio/Rider — project loads without a missing-reference warning
- [ ] `git status` — confirm `node_modules/`, `dist/`, `bin/`, `obj/` are no longer tracked
- [ ] Push to a branch first (not `main`) — deploy preview on Vercel to confirm the root-directory fix worked
- [ ] Once green, merge to `main`

---

## 10. Commit Message

```
refactor: restructure into frontend/backend/docs/sheets monorepo layout

- Move React app into frontend/
- Move ASP.NET Core API into backend/NextApply.Api/
- Move all Excel data files into sheets/ (superseded copies to archive/)
- Move planning/prompt docs into docs/ and docs/prompts/
- Update .sln project reference and .gitignore for new structure
- Remove stray tracked build artifacts (dist, node_modules, bin, obj)
```

This one commit message doubles as a clean changelog entry — useful if this repo is ever shown in an interview.
