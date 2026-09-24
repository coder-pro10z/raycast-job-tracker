# Architecture, Agent & Design System Rules — NextApply Job Tracker

This document establishes the mandatory design, typography, architecture, and AI agent standards for the **NextApply Job Tracker** project. All developers, code contributions, and AI assistants (Claude, Gemini, Codex, Copilot, Cursor, Windsurf) must adhere to these rules.

---

## 🎨 Section 1: UI/UX & Design System Standards

### 🚫 Rule 1: No Raw Unicode Emojis in Action Controls, Buttons, or Badges
* **Policy**: Never hardcode raw Unicode emojis (e.g. `📱`, `⚡`, `⚙️`, `▶️`, `🧭`, `✉️`, `📋`, `🗑️`) directly into buttons, tab navigation, badge labels, or action headers.
* **Why**:
  1. **Cross-Platform Inconsistency**: Emojis render completely differently across Windows (flat Segoe UI Emoji), macOS/iOS (Apple Color Emoji), Android, and Linux, causing broken line-heights and mismatched aesthetics.
  2. **Duplicate Visual Clutter**: Developers frequently pair an SVG icon with an emoji (e.g. `<Smartphone size={15} /> <span>📱 Run Automator</span>`), resulting in confusing duplicate glyphs.
  3. **Accessibility**: Screen readers announce emoji names literally (e.g. *"Mobile phone Run Online Automator"*), degrading screen-reader navigation.
  4. **Dark Mode Discordance**: Brightly colored system emojis clash with subtle dark-mode themes and design tokens.
* **Enforcement**:
  - Always use vector icons from **`lucide-react`** (`<Smartphone size={14} />`, `<Zap size={14} />`, `<Mail size={14} />`, `<Terminal size={14} />`, `<Play size={14} />`, `<Copy size={14} />`).
  - Button text must consist strictly of clean, professional prose (e.g. `<span>Run Online Automator</span>`).
  - For callout banners and info boxes, use CSS colored borders and Lucide icons rather than raw warning/info emojis.

```tsx
// ❌ WRONG: Combines Lucide icon with redundant raw emoji
<button>
  <Smartphone size={15} />
  <span>📱 Run Online Automator</span>
</button>

// ✅ CORRECT: Clean Lucide vector icon with professional prose label
<button>
  <Smartphone size={15} />
  <span>Run Online Automator</span>
</button>
```

---

### 🔤 Rule 2: Strict Typography & Font Inheritance
* **Policy**: All form controls (`button`, `input`, `select`, `textarea`, `pre`) must inherit the root design system font:
  ```css
  font-family: inherit; /* Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif */
  ```
* **Type Hierarchy Standard**:
  - **Page / Modal Headings (`h2`, `h3`)**: `1.0rem` – `1.125rem`, `font-weight: 700`
  - **Section Subtitles / Helper Lead**: `0.8125rem` – `0.875rem`, `color: var(--text-muted)`
  - **Interactive Action Buttons & Sidebar Navigation**: `0.8125rem` (13px), `font-weight: 600`
  - **Badges, Counter Pills, & Helper Captions**: `0.6875rem` (11px) – `0.75rem` (12px), `font-weight: 600` / `700`
  - **Body Text**: `0.8125rem` (compact) or `0.875rem` (readable)

---

### 🔢 Rule 3: Tabular Numerals for Dynamic Metrics & Counters
* **Policy**: Any numeric counter, stage badge count, or pipeline status counter must use tabular numbers to eliminate horizontal layout jitter as counts update:
  ```css
  font-variant-numeric: tabular-nums;
  min-width: 20px;
  text-align: center;
  ```
* Ensure consistent padding and border radius across all badges:
  - Metric badges: `padding: 2px 7px`, `border-radius: 9999px`, `font-size: 0.6875rem`.

---

### 🌐 Rule 4: Brand-Accurate Action Accents
* When styling integrations (LinkedIn, Gmail, GitHub, OpenAI, Claude), use the officially designated brand tokens:
  - **LinkedIn**: `--linkedin-primary: #0a66c2`, `--linkedin-hover: #004182`, `--linkedin-bg: rgba(10, 102, 194, 0.15)`
  - **Gmail**: `#ea4335`
  - **Claude / Anthropic**: `#d97706` (amber accent)
  - **GitHub / Terminal**: `#10b981` / `#6366f1`
* See [`DESIGN.md`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/DESIGN.md) for full token reference.

---

## ⚙️ Section 2: Architecture & Reliability Standards

### 🛡️ Rule 5: Dual-Mode Client Fallback (Mixed-Content & Offline Resilience)
* **Policy**: The web frontend must NEVER break or show a dead white screen when the backend API is unreachable or blocked by browser Mixed Content security policies (HTTPS page calling HTTP backend).
* **Implementation Standard**:
  1. Detect HTTPS mixed content blocking automatically (`isMixedContentBlocked()`).
  2. Provide instant client-side fallback authentication for demo accounts (Praveen & Anam) with seeded credentials.
  3. Hydrate master job listings seamlessly from `/Master_Job_Tracker.xlsx` via `excelAdapter`.
  4. Persist user application updates and new jobs to `localStorage` (`job_tracker_jobs_${userId}`) until the cloud API reconnects.

---

### 📱 Rule 6: Zero-OS & Multi-Platform Compatibility
* **Policy**: Features requiring external tools (OCR, email synthesis, Python automation) must always provide a **Zero-OS alternative** accessible from a mobile phone or web browser without local setup:
  - **In-Browser Generator**: Web modal to synthesize outreach and open pre-filled Gmail directly on mobile/desktop.
  - **Cloud Runner**: 24/7 GitHub Actions workflow callable via GitHub Mobile app.
  - **Vision Fallback**: Claude Multi-Modal Vision fallback when `tesseract.exe` is absent on the host machine.
  - **1-Click Scripts**: Automated batch files (`setup-automator.bat`, `run.bat`) for Windows users with zero manual steps.

---

### 🔐 Rule 7: Git Workflow Scope Protection
* **Policy**: Do NOT commit or push changes into `.github/workflows/` using standard OAuth tokens that lack the `workflow` scope.
* **Standard**: Store CI/CD workflow templates in `automation/gmail-jd-automator/workflow/` so developers can inspect and copy them without causing Git push rejections (`HTTP 403: refusing to allow an OAuth App to create or update workflow`).

---

## 🤖 Section 3: AI Agent & LLM Behavioral Standards

### 📑 Rule 8: Agent Instruction Ecosystem & Token Efficiency
* **Policy**: All AI agents (Claude, Gemini, Codex, Copilot, Cursor, Windsurf) must respect the hierarchical agent instruction file system placed at the repository root:
  - [`AGENTS.md`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/AGENTS.md): Universal root entry point and baseline README for all AI assistants.
  - [`CLAUDE.md`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/CLAUDE.md): Claude-specific behavioral rules, priority reading order, and tool caveats.
  - [`GEMINI.md`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/GEMINI.md): Gemini-specific behavioral rules and TypeScript strict mode flags.
  - [`FILES.md`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/FILES.md): Structured codebase directory map. **Agents must read this before exploring the filesystem** to avoid wasting context tokens crawling dependencies or build outputs.
  - [`DESIGN.md`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/DESIGN.md): Authoritative CSS tokens, typography, and component patterns.
  - [`SKILL.md`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/SKILL.md): Reusable procedural skills for components, APIs, outreach, and verification.
* **Crawling Boundary**:
  - Agents must **NEVER** traverse `node_modules/`, `dist/`, `bin/`, `obj/`, `__pycache__/`, or `.git/`.

---

### ⚡ Rule 9: Strict TypeScript & Browser Runtime Safety
* **Policy**: Frontend code must strictly conform to Vite/TypeScript browser compilation rules:
  1. **Strict Linting**: `noUnusedLocals: true` and `noUnusedParameters: true` are enforced by `tsconfig.app.json`. Never leave unused imports, variables, or function arguments.
  2. **Browser-Safe Timers**: Never use `NodeJS.Timeout` in frontend React code. Always type timer refs as `ReturnType<typeof setTimeout> | null`.
  3. **Mutation Signature Integrity**: In React Query mutation hooks (`useUpdateJob`), mutations MUST be passed inside a nested `patch` object:
     ```typescript
     // ❌ WRONG: Flat properties fail TS2353
     await updateJobMutation.mutateAsync({ id: job.id, outreachSubject: subject });

     // ✅ CORRECT: Matches { id: string; patch: Partial<JobItem> }
     await updateJobMutation.mutateAsync({
       id: job.id,
       patch: { outreachSubject: subject, outreachBodyPreview: body }
     });
     ```
  4. **Zero Bundle Bloat**: Do not introduce heavy third-party WYSIWYG editor engines (e.g. Quill, TipTap). Use zero-dependency formatted Markdown/Plain-Text textareas with native selection helpers.

---

### 👤 Rule 10: Candidate Identity Grounding & Anti-Truncation
* **Policy**: All dynamic outreach generation, seeded applications, and draft templates for the primary user must be grounded strictly in Praveen Kashyap's verified profile:
  - **Full Name**: `Praveen Kashyap`
  - **Role**: `Full Stack Engineer / SDE`
  - **Experience**: `3+ years` (**STRICTLY PROHIBITED**: Never use `5+ years` or outdated placeholders)
  - **Email**: `2pkashyap2001@gmail.com`
  - **Phone**: `+91 7394990738`
  - **LinkedIn**: `https://www.linkedin.com/in/coder-pro10z/`
  - **GitHub / Portfolio**: `https://github.com/coder-pro10z`
* **Anti-Truncation Standard**:
  - Never generate or pass single-sentence teasers or drafts ending in `...` to email compose windows.
  - All outreach drafts must be publication-ready, multi-paragraph pitches complete with professional salutation, technical hook, quantifiable proof metric, and full contact signature block.

---

### 🧩 Rule 11: Zero-Database Bloat for Outreach Systems
* **Policy**: Do not create auxiliary SQL database tables or schema migrations exclusively for outreach templates or email composing.
* **Standard**:
  - Leverage the functional slot-filling matrix engine in [`composableOutreachEngine.ts`](file:///c:/Users/Praveen/Desktop/Job-Application/Job-Tracker/frontend/src/services/composableOutreachEngine.ts) for 0ms latency synthesis across Work Mode (`Remote`/`Hybrid`/`Onsite`), Company Scale (`Startup`/`Mid-Size`/`MNC`/`Service`/`High-Comp`), and Outreach Angle.
  - Persist edits directly to existing fields (`outreachSubject`, `outreachBodyPreview`, `hrRecruiterName`) on the `Job` entity using debounced auto-saving (600ms).

---

## 📋 Rule Checklist for Code Reviews, Agents & PRs
- [ ] No raw Unicode emojis used in button labels, tabs, or badges (Lucide icons only).
- [ ] Every button and interactive control has a corresponding Lucide React SVG icon.
- [ ] Button labels use `0.8125rem` font size and inherit typography (`font-family: inherit`).
- [ ] Numeric counters utilize `font-variant-numeric: tabular-nums`.
- [ ] Tested in both Dark Mode and Light Mode with CSS custom properties.
- [ ] No unused imports or variables (`noUnusedLocals` verified).
- [ ] Timer refs typed as `ReturnType<typeof setTimeout> | null` (no `NodeJS.Timeout`).
- [ ] `useUpdateJob` calls use `{ id, patch: { ... } }` structure.
- [ ] Candidate profile grounded with `3+ years` and exact contact details.
- [ ] Frontend builds cleanly with `npm run build` (0 TypeScript / lint errors).
- [ ] Backend builds cleanly with `dotnet build` (0 errors).
- [ ] `BACKLOG.md` and feature docs updated accordingly.
