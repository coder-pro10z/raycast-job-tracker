<div align="center"> 
  <h1>NextApply</h1>
  <p>A high-performance job tracking platform built with React, TypeScript, .NET Core, and PostgreSQL. Optimistic UI updates. Virtualized data tables. Hundreds of leads, zero lag.</p>

  <img src="https://raycast-job-tracker.vercel.app/og-image.png" alt="NextApply Screenshot" width="800" style="border-radius: 12px; margin: 20px 0;"/>

  <p>
    <a href="https://raycast-job-tracker.vercel.app/"><b>Live Demo →</b></a> · 
    <a href="./docs/01-architecture-overview.md"><b>Documentation →</b></a> · 
    <a href="./BACKLOG.md"><b>Product Backlog & Defect Log →</b></a>
  </p>
</div> 

## The problem
Job searching generates a mess of spreadsheets, browser tabs, and half-remembered follow-ups. NextApply started as a Raycast extension for quickly logging applications without leaving the keyboard, and grew into a full tracking platform once that workflow needed a real backend, database, and UI to match.

## What makes this more than a CRUD app
- **Optimistic UI with TanStack Query** — application status changes, notes, and tags update instantly in the UI while the mutation resolves in the background, with automatic rollback on failure. No spinners, no waiting on the network.
- **Row virtualization at scale** — built with TanStack Virtual to render large lead/application lists without DOM lag. Verified against 500+ records with no scroll jank.
- **Hand-built design system** — no component library (no MUI, no Bootstrap). Token-based design system in vanilla CSS: consistent spacing, color, and typography primitives applied across every screen.
- **LinkedIn Lead Search** — surface and track outreach leads directly alongside applications for a seamless networking workflow.
- **Gmail JD Automator sidecar** — Python-powered batch processor that scans Gmail drafts with JD screenshots, OCRs with Tesseract, and writes tailored emails with Claude API, pushing jobs straight to the tracker via webhook.
- **Interactive Graphify architecture visualizer** — full 7-layer interactive architecture visualizer built into the SPA (`/graph`) and standalone (`public/graph.html`).
- **Prompt Library** — 11 production-grade SDLC system prompts for PRD writing, architecture design, refactoring, and test generation.
- **Monorepo architecture** — frontend, backend, automation sidecar, prompt library, and test suites organized cleanly in a single repository.

## Tech stack
| Layer | Technology |
| --- | --- |
| **Frontend** | React, TypeScript, TanStack Query v5, TanStack Virtual v3, vanilla CSS design system |
| **Backend** | C# / ASP.NET Core (.NET 9 REST API) |
| **Database** | PostgreSQL 15 via Supabase + EF Core 9 |
| **Automation** | Python 3.9+, Claude API (Anthropic), Tesseract OCR, Gmail API |
| **Testing** | Vitest (automation logic, component, and integration suites) |
| **Visualizer** | Graphify (Vis.js interactive 7-layer constellation & cards viewer) |
| **Origin** | Raycast extension (keyboard-first application logging) |

## Architecture
```
📦 nextapply 
 ┣ 📂 automation    # Python Gmail JD Automator sidecar (OCR + Claude)
 ┣ 📂 backend       # C# / .NET 9 REST API 
 ┣ 📂 docs          # Complete documentation (10 docs + phases/)
 ┣ 📂 frontend      # React 18 + TypeScript SPA (Vite)
 ┣ 📂 prompt-lib    # 11 SDLC system prompts
 ┗ 📂 tests         # Vitest test suite (automation, frontend, integration)
```

Full architecture, data flow, and database schema docs live in [`/docs`](./docs/01-architecture-overview.md) — including a dedicated [design system doc](./docs/06-design-system.md), [feature reference](./docs/07-feature-reference.md), [Job Application Module guide](./docs/08-job-application-module.md), and [Graphify guide](./docs/10-graphify-guide.md).

## Getting started

```bash
# Clone the repository
git clone https://github.com/coder-pro10z/job-application.git
cd job-application/frontend

# Install dependencies
npm install 

# Set up environment variables
cp .env.example .env 
# Add your backend API URL to the .env file

# Run the frontend dev server
npm run dev
```

*For backend setup, navigate to the `backend/NextApply.Api` folder and run `dotnet run` after configuring your Supabase connection strings in `appsettings.json`.*

*For the automation sidecar, navigate to `automation/gmail-jd-automator`, create a `.env` from `.env.example`, and run `python main.py`.*

## Roadmap
- [x] Integrate Gmail JD Automator sidecar (OCR + Claude outreach)
- [x] Interactive Graphify 7-layer architecture visualizer
- [x] Comprehensive Vitest test suite (automation & frontend)
- [ ] Add advanced filtering by Custom Tags
- [ ] Direct LinkedIn profile scraper webhook

## About
Built by [@coder-pro10z](https://github.com/coder-pro10z). Originally a Raycast extension for fast, keyboard-first job tracking, now a full-stack platform.

- **GitHub:** [github.com/coder-pro10z](https://github.com/coder-pro10z)
