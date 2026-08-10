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
