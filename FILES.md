# FILES.md — NextApply Job Tracker Codebase Map

This file provides a structured directory map for AI agents, LLMs, and developer onboarding. Agents MUST consult this file before crawling the filesystem to avoid wasting context tokens on `node_modules/`, `bin/`, `obj/`, or build artifacts.

---

## Root Structure

```
Job-Tracker/
├── AGENTS.md                  # Universal agent instructions (this repo)
├── CLAUDE.md                  # Claude-specific behavior config
├── GEMINI.md                  # Gemini-specific behavior config
├── FILES.md                   # THIS FILE — codebase directory map
├── SKILL.md                   # Modular agent skills entry point
├── DESIGN.md                  # Visual design system reference
├── RULES.md                   # Mandatory architecture & design rules
├── BACKLOG.md                 # Product backlog, errors, milestones
├── README.md                  # Project overview
├── Job-Tracker.sln            # .NET solution file
├── Jobs-sheet.xlsx            # Master job tracker spreadsheet (588 jobs)
├── render.yaml                # Render.com deployment config
├── vitest.config.js           # Vitest test runner config
├── run.bat / stop.bat         # Windows 1-click dev server scripts
├── run-automator.bat           # Windows automator launcher
├── setup-automator.bat         # Windows automator setup (Python venv)
├── push_to_github.bat          # Git push helper script
│
├── frontend/                  # React 19 + Vite 8 + TypeScript 6 SPA
├── backend/                   # ASP.NET Core 9 Web API
├── automation/                # Python Gmail JD Automator sidecar
├── docs/                      # Architecture guides & JD samples
├── tests/                     # Frontend, integration, automation tests
├── scripts/                   # Utility scripts
├── sheets/                    # Excel data sheets
├── archive/                   # Archived files
├── prompt-lib/                # Prompt templates for AI workflows
└── scratch/                   # Temporary scratch files
```

---

## Frontend (`frontend/`)

**Stack**: React 19.2 · TypeScript 6.0 · Vite 8.2 · TanStack React Query 5 · Lucide React Icons · xlsx.js

```
frontend/
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx                       # ReactDOM entry point
    ├── App.tsx                        # Root app component, routing, auth gating
    ├── index.css                      # Design tokens, dark/light palette, global styles
    ├── styles.css                     # LinkedIn brand tokens supplement
    │
    ├── types/
    │   ├── job.ts                     # JobItem, UserProfile, FilterState, DomainMetrics
    │   └── auth.ts                    # AuthResponse, UserProfileDto, PublicUserSummary
    │
    ├── state/
    │   └── useJobStore.tsx            # Zustand-style global store (auth, filters, UI state)
    │
    ├── hooks/
    │   ├── useJobs.ts                 # TanStack Query mutations (useUpdateJob, useCreateJob, useAddNote)
    │   └── useJobApplicationImport.ts # Live import hook for automator results
    │
    ├── services/
    │   ├── apiClient.ts               # Dual-mode API client (live API + localStorage fallback)
    │   ├── excelAdapter.ts            # Master_Job_Tracker.xlsx parser & domain classifier
    │   ├── emailAssembler.ts          # Publication-ready outreach email synthesizer
    │   ├── composableOutreachEngine.ts # Multi-dimensional matrix outreach slot-filler
    │   └── dataProvider.ts            # Data provider abstraction
    │
    ├── data/
    │   ├── foundationalDrafts.ts      # 24 curated outreach blueprints with {placeholders}
    │   └── outreachTemplates.ts       # Extended outreach template library
    │
    ├── components/
    │   ├── auth/                      # AuthModal.tsx, ProfileMenu.tsx
    │   ├── common/                    # StatusBadgeDropdown, DomainBadgeDropdown, shared UI
    │   ├── dashboard/                 # DashboardView, StageCards, pipeline metrics
    │   ├── detail/                    # JobDetailDrawer, OutreachStudio, FindLeadsMenu
    │   ├── jobapp/                    # JobApplicationPanel, GmailDraftEditorModal, WebAutomatorModal, AutomatorStatusBadge
    │   ├── layout/                    # Sidebar, Header, ToastContainer
    │   ├── outreach/                  # Outreach template views
    │   ├── search/                    # CommandPalette (Cmd+K)
    │   ├── settings/                  # SettingsModal (profile, signature preview)
    │   ├── table/                     # JobTable, VirtualizedJobTable
    │   ├── ui/                        # Shared low-level UI primitives
    │   ├── upload/                    # Excel upload components
    │   └── NewJobModal.tsx            # Manual job creation modal
    │
    └── utils/                         # Shared utility functions
```

---

## Backend (`backend/NextApply.Api/`)

**Stack**: ASP.NET Core 9.0 · Entity Framework Core 9 · PostgreSQL (Npgsql) · Swagger

```
backend/NextApply.Api/
├── Program.cs                         # Startup, DI, middleware, CORS
├── NextApply.Api.csproj               # .NET 9 SDK project, NuGet packages
├── Dockerfile                         # Container build for Render/Docker
├── appsettings.json                   # DB connection strings, config
│
├── Controllers/
│   ├── JobsController.cs              # CRUD + PATCH /api/jobs, user-scoped queries
│   ├── AuthController.cs              # Login, register, profile update, user seeds
│   ├── DashboardController.cs         # Aggregated pipeline metrics
│   ├── JobApplicationImportController.cs # Automator result ingestion
│   ├── NotesController.cs             # Job notes CRUD
│   ├── OutreachController.cs          # Outreach template API
│   ├── SettingsController.cs          # User settings persistence
│   └── HealthController.cs            # Health check endpoint
│
├── Models/
│   ├── Job.cs                         # Job entity (company, role, status, outreach fields)
│   ├── UserProfile.cs                 # User profile entity
│   ├── UserJobState.cs                # Per-user job application state (composite key)
│   ├── Note.cs                        # Job notes entity
│   ├── Settings.cs                    # User settings entity
│   └── OutreachTemplateUsed.cs        # Outreach template tracking
│
├── DTOs/                              # Data transfer objects for API contracts
├── Data/                              # EF Core DbContext, seeding
├── Services/                          # Business logic services (PasswordHasher, etc.)
├── Middleware/                        # Custom middleware
└── Migrations/                        # EF Core database migrations
```

---

## Automation (`automation/gmail-jd-automator/`)

**Stack**: Python 3.9+ · Google Gmail API · Anthropic Claude API · Tesseract OCR

```
automation/gmail-jd-automator/
├── main.py                            # Core automator: scan drafts → OCR → Claude → compose
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment variable template
├── README.md                          # Automator setup & usage guide
└── workflow/                          # GitHub Actions workflow templates
```

---

## Documentation (`docs/`)

```
docs/
├── 01-architecture-overview.md        # System architecture, tech stack, data flow diagram
├── 02-frontend.md                     # Frontend architecture deep-dive
├── 03-backend.md                      # Backend API reference
├── 04-database.md                     # Database schema & ERD
├── 05-data-flow.md                    # Request lifecycle & state management
├── 06-design-system.md                # Design tokens & component patterns
├── 07-feature-reference.md            # Complete feature inventory (20+ features)
├── 08-job-application-module.md       # Gmail Automator & outreach module guide
├── 09-prompt-library.md               # AI prompt engineering reference
├── 10-graphify-guide.md               # Job pipeline visualization guide
├── 11-zero-os-automator-guide.md      # Zero-OS mobile/web automator guide
├── COMPOSABLE_DRAFTS_MATRIX_GUIDE.md  # Multi-dimensional outreach matrix handbook
├── TOP_PAYING_COMPANIES_OUTREACH_GUIDE.md # Top 25 company compensation & recruiter tips
├── DRAFT_PREVIEW_EDITOR_PLAN.md       # Native Dark Gmail Editor specification
├── developer_starter_kit.md           # New developer onboarding guide
├── ui_ux_reference_guide.md           # UI/UX design reference
├── jd-samples/                        # 10 realistic tier-1 company JD archives
├── phases/                            # Development phase planning docs
├── plans/                             # Feature implementation plans
└── prompts/                           # AI prompt templates
```

---

## Tests (`tests/`)

```
tests/
├── README.md                          # Test strategy & runner docs
├── verify-profiles.cjs                # Profile verification script
├── frontend/                          # React component tests (Vitest + Testing Library)
├── integration/                       # API integration tests
└── automation/                        # Python automator tests
```

---

## Directories to NEVER Crawl

> [!CAUTION]
> Agents must NEVER read, index, or traverse these directories:

- `node_modules/` (any level)
- `frontend/dist/` and `dist/`
- `backend/NextApply.Api/bin/` and `backend/NextApply.Api/obj/`
- `automation/**/__pycache__/`
- `automation/**/credentials/`
- `.git/`
