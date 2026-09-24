# CLAUDE.md — Claude-Specific Agent Configuration for NextApply

This file provides Claude-specific behavioral instructions. For universal agent rules, see `AGENTS.md`.

---

## Identity

You are assisting on **NextApply**, an autonomous job application tracking and outreach platform built with React 19, .NET Core 9, and a Python Gmail Automator.

## Priority Reading Order

1. `AGENTS.md` — Universal build commands, always-do / never-do rules
2. `RULES.md` — Mandatory design system contract (emoji ban, typography, fallback architecture)
3. `FILES.md` — Codebase directory map (skip `node_modules/`, `dist/`, `bin/`, `obj/`)
4. `DESIGN.md` — CSS tokens, dark/light palette, component patterns
5. `SKILL.md` — Modular skill workflows for common tasks

## Claude-Specific Rules

### Code Style
- When generating TSX, use **inline styles** referencing CSS custom properties (`var(--bg-secondary)`).
- Import icons ONLY from `lucide-react`. Never suggest emoji-based labels.
- Use `React.FC<Props>` with explicit interfaces for all components.
- When writing mutation calls, ALWAYS use `{ id, patch: { ...fields } }` shape.
- Use `ReturnType<typeof setTimeout>` for timer refs, never `NodeJS.Timeout`.

### Context Efficiency
- Do NOT read `node_modules/`, `dist/`, `backend/**/bin/`, `backend/**/obj/`, or `__pycache__/`.
- Read `FILES.md` first to understand the structure instead of crawling directories.
- The global store is in `frontend/src/state/useJobStore.tsx` — check it before creating new state.
- The API client is in `frontend/src/services/apiClient.ts` — it has dual-mode (live API + localStorage fallback).

### Candidate Profile Grounding
All outreach content for the primary user must use:
- **Name**: Praveen Kashyap
- **Role**: Full Stack Engineer / SDE
- **Experience**: `3+ years` (NEVER `5+ years`)
- **Email**: `2pkashyap2001@gmail.com`
- **Phone**: `+91 7394990738`
- **LinkedIn**: `https://www.linkedin.com/in/coder-pro10z/`
- **GitHub**: `https://github.com/coder-pro10z`

### Build Verification
After ANY code change, run:
```bash
cd frontend && npm run build    # Must: 0 errors
cd backend/NextApply.Api && dotnet build   # Must: 0 errors
```

### Commit Convention
```
feat(scope): description
fix(scope): description
docs(scope): description
```

### Documentation Updates
After shipping features, update:
- `BACKLOG.md` — Add bug entries (Section 1) or milestone entries (Section 2)
- `docs/07-feature-reference.md` — Add new feature items
- `docs/01-architecture-overview.md` — If architecture changed
