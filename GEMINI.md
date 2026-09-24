# GEMINI.md — Gemini-Specific Agent Configuration for NextApply

This file provides Gemini-specific behavioral instructions. For universal agent rules, see `AGENTS.md`.

---

## Identity

You are assisting on **NextApply**, an autonomous job application tracking and outreach platform built with React 19, .NET Core 9, and a Python Gmail Automator.

## Priority Reading Order

1. `AGENTS.md` — Universal build commands, always-do / never-do rules
2. `RULES.md` — Mandatory design system contract (emoji ban, typography, fallback architecture)
3. `FILES.md` — Codebase directory map (skip `node_modules/`, `dist/`, `bin/`, `obj/`)
4. `DESIGN.md` — CSS tokens, dark/light palette, component patterns
5. `SKILL.md` — Modular skill workflows for common tasks

## Gemini-Specific Rules

### Code Generation
- When generating TSX components, use **inline styles** with CSS custom properties (`var(--bg-secondary)`, `var(--text-primary)`).
- Import icons exclusively from `lucide-react`. Raw Unicode emojis are banned in all interactive UI elements.
- Always define explicit TypeScript interfaces for component props.
- For state mutations, use `useUpdateJob()` from `hooks/useJobs.ts` with `{ id: string; patch: Partial<JobItem> }`.
- Timer references must use `ReturnType<typeof setTimeout>`, not `NodeJS.Timeout`.

### Context Management
- **Read `FILES.md` first** — it maps every directory and warns which paths to skip.
- Never traverse: `node_modules/`, `dist/`, `backend/**/bin/`, `backend/**/obj/`, `__pycache__/`, `.git/`.
- The global application store lives at `frontend/src/state/useJobStore.tsx`.
- The API client at `frontend/src/services/apiClient.ts` supports dual-mode operation (live PostgreSQL API + client-side localStorage fallback for offline / mixed-content environments).

### TypeScript Strict Mode
The project enforces these strict compiler options in `tsconfig.app.json`:
- `noUnusedLocals: true` — every import must be used
- `noUnusedParameters: true` — every parameter must be referenced
- `noFallthroughCasesInSwitch: true`
- `target: es2023`, `lib: ["ES2023", "DOM"]`
- `types: ["vite/client"]` — no `@types/node` ambient globals in browser code

### Candidate Profile Grounding
All outreach content for the primary user must use:
- **Name**: Praveen Kashyap
- **Role**: Full Stack Engineer / SDE
- **Experience**: `3+ years` (NEVER use `5+ years`)
- **Email**: `2pkashyap2001@gmail.com`
- **Phone**: `+91 7394990738`
- **LinkedIn**: `https://www.linkedin.com/in/coder-pro10z/`
- **GitHub**: `https://github.com/coder-pro10z`

### Build Verification
After ANY code change, verify:
```bash
cd frontend && npm run build    # tsc -b && vite build → 0 errors
cd backend/NextApply.Api && dotnet build   # Build succeeded → 0 errors
```

### Commit Convention
```
feat(scope): description
fix(scope): description
docs(scope): description
```

### Documentation Protocol
After shipping features, update:
- `BACKLOG.md` — Bug entries (Section 1), milestone entries (Section 2), roadmap checkboxes (Section 3)
- `docs/07-feature-reference.md` — Feature inventory
- `docs/01-architecture-overview.md` — If architecture or tech stack changed
- `docs/08-job-application-module.md` — If outreach, automator, or draft editor logic changed
