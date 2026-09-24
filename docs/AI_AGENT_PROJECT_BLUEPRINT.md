# Master Blueprint: AI-Agent & LLM-Driven Software Project Architecture

> **A Complete Guide, File Directory, and Template System to Scaffold, Build, and Maintain Software Projects using AI Coding Agents (Claude Code, Gemini CLI / Antigravity, OpenAI Codex, GitHub Copilot, Cursor, Windsurf).**

---

## Executive Summary: The Agent-First Repository Model

Modern AI coding agents function best when a repository is designed with **structured agent context boundaries**. Without these files, LLMs:
1. Burn thousands of context tokens crawling massive directories (`node_modules/`, `bin/`, `dist/`).
2. Hallucinate architectural conventions, CSS design tokens, and library versions.
3. Violate coding standards (e.g. inserting raw Unicode emojis, leaving unused imports, introducing runtime errors).
4. Lose track of completed milestones, known environment bugs, and long-term project roadmaps.

By establishing a standardized documentation and configuration stack, any project can be developed autonomously, reliably, and with zero architectural regression across AI models.

---

## 🗺️ Master Taxonomy: The 4 Core Layers

```
================================================================================
LAYER 1: AGENT GOVERNANCE & CONTEXT DISCOVERY (Root Level)
--------------------------------------------------------------------------------
├── AGENTS.md                  Universal agent instructions (Open Standard)
├── CLAUDE.md                  Anthropic Claude-specific configuration & overrides
├── GEMINI.md                  Google Gemini / Antigravity-specific configuration
├── FILES.md                   Codebase directory map & context boundary guard
├── DESIGN.md                  Visual design system, CSS tokens & UI patterns
├── SKILL.md                   Modular procedural skill workflows (Frontmatter specs)
├── RULES.md                   Mandatory architectural contracts, lints & anti-patterns
└── BACKLOG.md                 Defect log, milestone tracker & feature roadmap

================================================================================
LAYER 2: SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATIONS (docs/ Level)
--------------------------------------------------------------------------------
├── docs/01-architecture-overview.md   High-level system topology & stack definitions
├── docs/02-frontend.md                Client-side framework, state, routing, components
├── docs/03-backend.md                 API contracts, controllers, services, middleware
├── docs/04-database.md                ERD, schemas, migrations, relational models
├── docs/05-data-flow.md               End-to-end request lifecycle & async pipelines
├── docs/06-design-system.md           Extended UX guidelines, responsive & a11y rules
├── docs/07-feature-reference.md       Comprehensive inventory of all system features
├── docs/08-[core-module].md           Domain-specific deep-dive guides
└── docs/developer_starter_kit.md      Zero-to-one local onboarding & dev setup

================================================================================
LAYER 3: EXECUTION SCRIPTS & LOCAL TOOLING (Root / scripts/)
--------------------------------------------------------------------------------
├── run.bat / run.sh           One-click launch script for all development services
├── stop.bat / stop.sh         One-click shutdown & port cleanup script
├── setup.bat / setup.sh       Automated virtualenv, npm install, DB migration runner
└── push_to_github.bat         Git verification, staging, and deployment pipeline

================================================================================
LAYER 4: AI PROMPT ARCHIVE & PLANNING (prompt-lib/ & docs/plans/)
--------------------------------------------------------------------------------
├── prompt-lib/*.md            Reusable system prompts, domain seeds, test scenarios
└── docs/plans/*.md            Step-by-step RFCs and implementation plans before code
================================================================================
```

---

## 📂 Layer 1: Agent Governance Files (Root Directory)

These files sit at the root of your git repository. They are the **very first files** read by AI assistants.

| File Name | Primary Consumers | Purpose & Operational Impact |
|---|---|---|
| **`AGENTS.md`** | **Universal** (Cursor, Copilot, Windsurf, Codex, Claude, Gemini) | The "README for AI Agents". Specifies exact build commands, test runners, dev server ports, core domain types, and strict "Always Do / Never Do" constraints. |
| **`CLAUDE.md`** | **Claude Code**, Anthropic Desktop & Web | Vendor-specific behavior file. Defines Claude's priority reading order, code style preferences, context efficiency rules, and commit message formats. |
| **`GEMINI.md`** | **Gemini CLI**, Google Antigravity | Vendor-specific behavior file. Details Gemini's tool usage, strict TypeScript compiler flags (`noUnusedLocals`), and ambient type constraints. |
| **`FILES.md`** | **All AI Agents** | The architectural directory map. Details all active domains and lists **"Never Crawl"** directories (`node_modules/`, `dist/`, `bin/`, `obj/`, `.git/`), saving 10,000+ context tokens per session. |
| **`DESIGN.md`** | **All AI Agents** | The visual single-source-of-truth. Catalogs every CSS custom property (`--bg-primary`, `--primary-500`, `--radius-sm`), typography scale, semantic status colors, and component patterns (buttons, badges, cards). |
| **`SKILL.md`** | **All AI Agents** (Antigravity Skills, Cursor Tools) | Modular, reusable task execution playbooks with YAML frontmatter. Guides agents through multi-step procedures (e.g., Adding a Component, Scaffolding an API, Running Verification). |
| **`RULES.md`** | **All AI Agents & Human Reviewers** | The binding code contract. Enforces non-negotiable rules such as banning raw Unicode emojis in buttons, typing browser timers safely, and preventing database bloat. |
| **`BACKLOG.md`** | **All AI Agents & Tech Leads** | The memory of the project. Contains **Section 1: Resolved Defect & Bug Log** (root cause analysis of every build error), **Section 2: Completed Milestones**, and **Section 3: Roadmap Backlog**. |

---

## 📚 Layer 2: Core Documentation Stack (`docs/`)

Organized numerically (`01-` to `07-`) so agents and developers understand system dependencies in chronological order.

### 1. `docs/01-architecture-overview.md`
- **What it contains**: High-level system architecture, high-level Mermaid topology diagram, complete technology stack table (Frontend, Backend, Database, Cloud), and repository directory breakdown.
- **When agents use it**: During architectural reviews, high-level feature planning, and stack upgrades.

### 2. `docs/02-frontend.md`
- **What it contains**: Client framework details (React/Vue/Svelte version), build bundler (Vite/Next), state management architecture (Zustand/Context/Redux), query caching (TanStack React Query), and routing setup.
- **When agents use it**: When building new UI panels, modifying store slices, or adding client-side API integrations.

### 3. `docs/03-backend.md`
- **What it contains**: Server architecture (.NET/Node/Go/FastAPI), API routing patterns, authentication & middleware pipeline, DTO mappings, and controller endpoint specifications.
- **When agents use it**: When creating or modifying REST/GraphQL endpoints, security filters, or database services.

### 4. `docs/04-database.md`
- **What it contains**: Database engine (PostgreSQL/MySQL/SQLite), Entity Relationship Diagram (ERD), table schemas, composite primary/foreign keys, indexes, and migration procedures.
- **When agents use it**: Before touching models, adding database fields, or crafting relational queries.

### 5. `docs/05-data-flow.md`
- **What it contains**: Sequence diagrams illustrating how data moves from user interaction $\rightarrow$ frontend state $\rightarrow$ HTTP request $\rightarrow$ controller $\rightarrow$ database $\rightarrow$ response $\rightarrow$ UI update.
- **When agents use it**: When debugging state synchronization bugs or integrating async worker pipelines.

### 6. `docs/06-design-system.md`
- **What it contains**: The extended human-readable design manual: theme switching philosophy (Dark vs Light), typography pairings, accessibility contrast guidelines (WCAG AA), and component anatomy.
- **When agents use it**: When designing net-new screens or ensuring responsive behavior across desktop and mobile.

### 7. `docs/07-feature-reference.md`
- **What it contains**: A numbered, exhaustive catalog of every single feature in the platform, including user stories, acceptance criteria, and connected code files.
- **When agents use it**: When verifying that a code change has not broken adjacent functionality or altered expected feature behavior.

### 8. `docs/developer_starter_kit.md`
- **What it contains**: Step-by-step setup instructions for a brand-new machine: required runtimes (Node, .NET, Python), environment variable setup (`.env.example`), seed data commands, and common setup errors.
- **When agents use it**: When guiding human developers through onboarding or diagnosing environment configuration failures.

---

## 🛠️ Layer 3: Developer & Agent Automation Tooling

One-click scripts enable AI agents to execute local commands safely without asking tedious environment questions.

| Script Name | Purpose | Implementation Pattern |
|---|---|---|
| **`run.bat` / `run.sh`** | Launches both frontend and backend concurrently in local development mode. | Checks dependencies, starts API on designated port (e.g. 5089), starts Vite on port 5173, and opens browser. |
| **`stop.bat` / `stop.sh`** | Forcibly kills orphaned processes holding file handles on application binaries. | Uses `taskkill /F /IM NextApply.Api.exe` and `Stop-Process` to resolve Windows OS file lock errors (`MSB3027`). |
| **`setup-automator.bat`** | Configures sidecar runtimes (e.g., Python virtualenvs, OCR binaries, credentials). | Creates `.venv`, runs `pip install -r requirements.txt`, validates environment variables. |
| **`push_to_github.bat`** | Guarded deployment pipeline. | Runs `npm run build` and `dotnet build` first; if 0 errors, runs `git add`, prompts for commit message, and pushes to remote. |

---

## 🧠 Layer 4: AI Prompt Library & Planning (`prompt-lib/` & `docs/plans/`)

### `prompt-lib/`
- Contains reusable system prompts, candidate personas, OCR vision prompts, and cold outreach templates.
- Allows AI agents to test and evaluate AI features against realistic test scenarios without writing prompts from scratch.

### `docs/plans/` (Spec-Driven Development)
- **Always write a Plan before touching code on complex features.**
- Example: `docs/plans/Draft_Preview_Editor_Popup_Plan.md`.
- Agents draft the architecture, component hierarchy, state flow, and edge cases in a plan markdown document first, allowing the user to review before execution.

---

## 📋 Boilerplate Templates: Copy & Paste for New Projects

Below are standardized boilerplates you can immediately copy into any new project repository:

### 1. `AGENTS.md` Boilerplate
```markdown
# AGENTS.md — [Project Name]

Universal instructions for AI coding agents (Claude, Gemini, Codex, Copilot, Cursor, Windsurf).
Read this file FIRST before making any changes.

---

## Project Identity & Architecture
- **Purpose**: [Brief 1-line description of project]
- **Frontend**: [e.g. React 19 / TypeScript / Vite / Tailwind] -> `frontend/`
- **Backend**: [e.g. ASP.NET Core 9 / FastAPI / Node Express] -> `backend/`
- **Database**: [e.g. PostgreSQL / Supabase / SQLite]
- **Docs Directory**: `docs/`

---

## Build & Test Commands

### Frontend
```bash
cd frontend && npm run build
# Must pass with 0 errors
```

### Backend
```bash
cd backend && dotnet build
# Must pass with 0 errors
```

### Test Suite
```bash
npm test
```

---

## Always Do
1. Read `FILES.md` before exploring directories to save context tokens.
2. Read `RULES.md` for coding contracts and style rules.
3. Read `DESIGN.md` before writing UI code to use official CSS tokens.
4. Run full build verification before finishing any task.
5. Use conventional commit messages: `feat(scope):`, `fix(scope):`, `docs(scope):`.
6. Record resolved bugs in `BACKLOG.md` Section 1.

---

## Never Do
1. Never crawl `node_modules/`, `dist/`, `bin/`, `obj/`, or `.git/`.
2. Never hardcode hex colors when CSS custom property tokens exist.
3. Never use raw Unicode emojis in buttons or interactive action controls.
4. Never leave unused imports or variables (strict linting enabled).
5. Never commit API keys, `.env` files, or production secrets.
```

---

### 2. `FILES.md` Boilerplate
```markdown
# FILES.md — Codebase Map & Boundaries

Consult this map before exploring files to avoid token-heavy directory crawling.

---

## Repository Tree

```
[Project-Name]/
├── AGENTS.md                  # Universal agent instructions
├── CLAUDE.md                  # Claude-specific overrides
├── GEMINI.md                  # Gemini-specific overrides
├── FILES.md                   # THIS FILE — codebase map
├── DESIGN.md                  # Design tokens & UI patterns
├── SKILL.md                   # Procedural agent skills
├── RULES.md                   # Non-negotiable code contracts
├── BACKLOG.md                 # Bugs, milestones & roadmap
├── docs/                      # 01-architecture, 02-frontend, etc.
├── frontend/                  # Client-side application
│   ├── src/
│   │   ├── components/        # UI components by domain
│   │   ├── services/          # API client & business logic
│   │   ├── state/             # Global stores
│   │   ├── types/             # Domain TypeScript interfaces
│   │   └── index.css          # CSS custom property tokens
├── backend/                   # Server-side application
│   ├── Controllers/           # REST endpoints
│   ├── Models/                # Entity definitions
│   └── Services/              # Core business services
└── tests/                     # Unit, integration & e2e tests
```

---

## 🚫 Directories to NEVER Crawl
Agents must NEVER search or traverse:
- `node_modules/`
- `dist/` or `build/`
- `bin/` or `obj/`
- `__pycache__/` or `.venv/`
- `.git/`
```

---

### 3. `DESIGN.md` Boilerplate
```markdown
# DESIGN.md — Visual Design System Reference

Mandatory design tokens and UI patterns for all frontend generation.

---

## Color Tokens

### Backgrounds
- `--bg-primary`: Main app canvas background
- `--bg-secondary`: Cards, modals, sidebars
- `--bg-tertiary`: Elevated inputs, active rows
- `--bg-hover`: Interactive hover states

### Text
- `--text-primary`: Primary headings and content
- `--text-secondary`: Secondary labels and descriptions
- `--text-muted`: Placeholders and captions

### Accents & Status
- `--primary-500`: Core brand action color
- `--status-success-bg` / `--status-success-text`: Success badges
- `--status-warning-bg` / `--status-warning-text`: In-progress badges
- `--status-danger-bg` / `--status-danger-text`: Error/failed badges

---

## Typography & Spacing
- **Font Stack**: Inherit system sans-serif (`font-family: inherit`)
- **Spacing Grid**: 8-point system (`--space-1: 4px`, `--space-2: 8px`, `--space-4: 16px`, `--space-6: 24px`)
- **Border Radius**: `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-full: 9999px`
- **Tabular Numbers**: Any counter or dynamic metric must use `font-variant-numeric: tabular-nums`.
```

---

### 4. `RULES.md` Boilerplate
```markdown
# RULES.md — Non-Negotiable Architectural Contracts

---

## Section 1: UI & Styling Standards
1. **No Raw Unicode Emojis**: Never use emojis (`⚡`, `📱`, `✉️`) in buttons or badges. Always use vector icons from `lucide-react` (or chosen icon library).
2. **Strict Font Inheritance**: All `button`, `input`, `select`, and `textarea` elements must have `font-family: inherit`.
3. **Tabular Numerals**: Numeric counters must use `font-variant-numeric: tabular-nums` to prevent layout shift.

## Section 2: Code Quality & Runtime Safety
1. **Strict Linting**: Zero unused imports or variables permitted (`noUnusedLocals: true`).
2. **Browser Safety**: Never import Node-specific types (e.g. `NodeJS.Timeout`) in client SPA code.
3. **Resilient Architecture**: Provide graceful offline / mock fallback if the remote backend is unreachable.

## Section 3: AI Agent Governance
1. Consult `FILES.md` before querying files.
2. Run full test & build verification before completing any task.
3. Document all bugs encountered in `BACKLOG.md` Section 1.
```

---

### 5. `SKILL.md` Boilerplate
```markdown
---
name: [project-name]-skills
description: Procedural workflows for AI coding agents working on [Project Name].
---

# SKILL.md — Procedural Agent Workflows

## Skill 1: Creating a New Frontend Component
1. Place in `frontend/src/components/<domain>/<ComponentName>.tsx`.
2. Define explicit TypeScript props interface.
3. Use vector icons from the design system; do NOT use raw emojis.
4. Style using CSS custom properties from `DESIGN.md`.
5. Run `npm run build` in `frontend/` to confirm 0 errors.

## Skill 2: Creating a New API Endpoint
1. Define model in `Models/` and DTO in `DTOs/`.
2. Implement controller endpoint in `Controllers/`.
3. Verify database migrations if entity changed.
4. Run backend build to confirm 0 compilation errors.

## Skill 3: Build Verification & Documentation
1. Run both frontend and backend build commands.
2. If bugs occurred, document in `BACKLOG.md` Section 1.
3. If feature completed, mark checklist in `BACKLOG.md` Section 2.
4. Stage, commit with conventional commit message, and push.
```

---

### 6. `BACKLOG.md` Boilerplate
```markdown
# Product Backlog & Defect Log — [Project Name]

## 1. Resolved Development Errors & Fix Log
Records technical bugs, root causes, and exact resolutions across sprints.

### 🐛 Error 1: [Short Title]
- **Component**: [e.g. Frontend Auth / Backend Controller]
- **Error Code / Message**: `[Exact error string]`
- **Root Cause**: [Why did this error occur?]
- **Resolution**: [Step-by-step fix applied]

---

## 2. Completed Features & Release Milestones
- [x] **Milestone 1**: [Foundation & Project Scaffolding]
- [x] **Milestone 2**: [Core Database & API Implementation]

---

## 3. Product Roadmap Backlog

### Category A: Core Capabilities
- [ ] Feature 1
- [ ] Feature 2

### Category B: Polish & Automation
- [ ] Feature 3
- [ ] Feature 4
```

---

## 🚀 The Day-0 Project Inception Protocol

When starting a brand-new project with an AI agent, follow this exact sequence:

1. **Step 1: Create the 8 Governance Files**:
   Create `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `FILES.md`, `DESIGN.md`, `SKILL.md`, `RULES.md`, and `BACKLOG.md` using the templates above.
2. **Step 2: Seed `docs/01-architecture-overview.md`**:
   Write the high-level vision, expected components, and selected tech stack.
3. **Step 3: Scaffold Repositories**:
   Create `frontend/` and `backend/` skeletons.
4. **Step 4: Create Local Tooling**:
   Add `run.bat` and `stop.bat` for frictionless execution.
5. **Step 5: Hand off to Agents**:
   Your AI coding agents now have 100% architectural context, strict safety rails, and zero ambiguity on how to build your platform.
