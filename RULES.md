# Architecture & Design System Rules — NextApply Job Tracker

This document establishes the mandatory design, typography, and architecture standards for the **NextApply Job Tracker** project. All developers, code contributions, and AI assistants must adhere to these rules.

---

## 🎨 Section 1: UI/UX & Design System Standards

### 🚫 Rule 1: No Raw Unicode Emojis in Action Controls, Buttons, or Badges
* **Policy**: Never hardcode raw Unicode emojis (e.g. `📱`, `⚡`, `⚙️`, `▶️`, `🧭`, `✉️`) directly into buttons, tab navigation, badge labels, or action headers.
* **Why**:
  1. **Cross-Platform Inconsistency**: Emojis render completely differently across Windows (flat Segoe UI Emoji), macOS/iOS (Apple Color Emoji), Android, and Linux, causing broken line-heights and mismatched aesthetics.
  2. **Duplicate Visual Clutter**: Developers frequently pair an SVG icon with an emoji (e.g. `<Smartphone size={15} /> <span>📱 Run Automator</span>`), resulting in confusing duplicate glyphs.
  3. **Accessibility**: Screen readers announce emoji names literally (e.g. *"Mobile phone Run Online Automator"*), degrading screen-reader navigation.
  4. **Dark Mode Discordance**: Brightly colored system emojis clash with subtle dark-mode themes and design tokens.
* **Enforcement**:
  - Always use vector icons from **`lucide-react`** (`<Smartphone size={14} />`, `<Zap size={14} />`, `<Mail size={14} />`, `<Terminal size={14} />`, `<Play size={14} />`).
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
  - **LinkedIn**: `--linkedin-primary: #0a66c2`, `--linkedin-hover: #004182`
  - **Gmail**: `#ea4335`
  - **Claude / Anthropic**: `#d97706` (amber accent)
  - **GitHub / Terminal**: `#10b981` / `#6366f1`

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

## 📋 Rule Checklist for Code Reviews & PRs
- [ ] No raw Unicode emojis used in button labels, tabs, or badges.
- [ ] Every button and interactive control has a corresponding Lucide React SVG icon.
- [ ] Button labels use `0.8125rem` font size and inherit typography.
- [ ] Numeric counters utilize `font-variant-numeric: tabular-nums`.
- [ ] Tested in both Dark Mode and Light Mode.
- [ ] Frontend builds cleanly with `npm run build` (0 TypeScript / lint errors).
