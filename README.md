<div align="center"> 
  <h1>NextApply</h1>
  <p>A high-performance job tracking platform built with React, TypeScript, .NET Core, and PostgreSQL. Optimistic UI updates. Virtualized data tables. Hundreds of leads, zero lag.</p>

  <img src="https://raycast-job-tracker.vercel.app/og-image.png" alt="NextApply Screenshot" width="800" style="border-radius: 12px; margin: 20px 0;"/>

  <p>
    <a href="https://raycast-job-tracker.vercel.app/"><b>Live Demo →</b></a> · 
    <a href="./docs/01-architecture-overview.md"><b>Documentation →</b></a>
  </p>
</div> 

## The problem
Job searching generates a mess of spreadsheets, browser tabs, and half-remembered follow-ups. NextApply started as a Raycast extension for quickly logging applications without leaving the keyboard, and grew into a full tracking platform once that workflow needed a real backend, database, and UI to match.

## What makes this more than a CRUD app
- **Optimistic UI with TanStack Query** — application status changes, notes, and tags update instantly in the UI while the mutation resolves in the background, with automatic rollback on failure. No spinners, no waiting on the network.
- **Row virtualization at scale** — built with TanStack Virtual to render large lead/application lists without DOM lag. Verified against 500+ records with no scroll jank.
- **Hand-built design system** — no component library (no MUI, no Bootstrap). Token-based design system in vanilla CSS: consistent spacing, color, and typography primitives applied across every screen.
- **LinkedIn Lead Search** — surface and track outreach leads directly alongside applications for a seamless networking workflow.
- **Monorepo architecture** — frontend and backend organized cleanly within a single repository. Full breakdown in [`/docs`](./docs/01-architecture-overview.md).

## Tech stack
| Layer | Technology |
| --- | --- |
| **Frontend** | React, TypeScript, TanStack Query, TanStack Virtual, vanilla CSS design system |
| **Backend** | C# / .NET 9 |
| **Database** | PostgreSQL via Supabase |
| **Origin** | Raycast extension (keyboard-first application logging) |

## Architecture
```
📦 nextapply 
 ┣ 📂 backend       # C# / .NET 9 API 
 ┣ 📂 docs          # Architecture, data flow, and design system docs
 ┗ 📂 frontend      # React + TypeScript frontend
```

Full architecture, data flow, and database schema docs live in [`/docs`](./docs/01-architecture-overview.md) — including a dedicated [design system doc](./docs/06-design-system.md) and [feature reference](./docs/07-feature-reference.md).

## Getting started

```bash
# Clone the repository
git clone https://github.com/coder-pro10z/raycast-job-tracker.git 
cd raycast-job-tracker/frontend

# Install dependencies
npm install 

# Set up environment variables
cp .env.example .env 
# Add your backend API URL to the .env file

# Run the frontend dev server
npm run dev
```

*For backend setup, navigate to the `backend` folder and run `dotnet run` after configuring your Supabase connection strings in `appsettings.json`.*

## Roadmap
- [ ] Add advanced filtering by Custom Tags
- [ ] Automate email outreach templates integration
- [ ] Write integration tests for optimistic UI hooks

## About
Built by [@coder-pro10z](https://github.com/coder-pro10z). Originally a Raycast extension for fast, keyboard-first job tracking, now a full-stack platform.

- **GitHub:** [github.com/coder-pro10z](https://github.com/coder-pro10z)
