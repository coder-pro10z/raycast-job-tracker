# Phase 4 — Graphify Re-targeting & Full Test Coverage

**Status:** 🔲 Not Started  
**Prerequisite:** Phase 3 complete (frontend panel live)  
**Goal:** Re-target the Graphify graph to the Job Tracker's own 7-layer architecture. Write the full test suite (automation unit tests, frontend component tests, integration tests).

---

## Objectives

1. Replace MCQ-specific nodes/layers in `graph.html` with Job Tracker architecture nodes across 7 layers
2. Write 18+ unit tests for the Gmail JD Automator logic
3. Write component tests for `JobApplicationPanel` and `AutomatorStatusBadge`
4. Write 3 end-to-end integration tests for the full automator→API→UI flow

---

## Part A — Graphify Re-targeting

### Target Architecture: 7 Layers, ~40 Nodes

```
Layer 1: Entry (Indigo)
  → Browser
  → Raycast Extension (original origin)

Layer 2: Frontend (Cyan)
  → React SPA (Vite 8 + TypeScript 5)
  → TanStack Query v5
  → TanStack Virtual v3
  → Vanilla CSS Design System
  → Lucide React Icons

Layer 3: API Gateway (Violet)
  → .NET 9 Web API (Render)
  → ApiKeyAuthMiddleware
  → CORS Policy (AllowFrontend)

Layer 4: Controllers (Purple)
  → JobsController (/api/jobs)
  → NotesController (/api/jobs/{id}/notes)
  → OutreachController (/api/jobs/{id}/outreach)
  → DashboardController (/api/dashboard/*)
  → SettingsController (/api/settings)
  → JobApplicationImportController (/api/jobs/import-from-automator)

Layer 5: Data (Teal)
  → Entity Framework Core 9
  → ApplicationDbContext
  → Job Model
  → Note Model
  → Outreach Model
  → PostgreSQL 15 (Supabase)
  → EF Core Migrations

Layer 6: Automation (Amber)
  → Gmail JD Automator (Python 3.9+)
  → pytesseract / Tesseract OCR
  → Claude API (claude-sonnet-5)
  → Gmail API (google-api-python-client)
  → Resume Extractor (pdfplumber)

Layer 7: Infra (Slate)
  → Vercel CDN (SPA host)
  → Render Web Service (API host)
  → Supabase (DB host)
```

### Node Inspector Sidebar Specs (Tier 2)

Each node's `title` attribute (shown in the sidebar) must include:
- **Responsibility:** one-line description
- **File:** primary source file path
- **API:** relevant endpoint or interface (if applicable)
- **Docs:** link to relevant `docs/*.md` file

### View Modes

The graph keeps both view modes from the MCQ version:
- **Dark Constellation Mode** (default) — `#0B0F19` bg, colored dots, dashed edges
- **Structured Cards Mode** — light bg, box nodes, curved edges

---

## Part B — Test Suite

### Test Runner: Vitest (matches MCQ project's existing suite format)

```bash
# Run all tests
npm run test

# From Job-Tracker root — install Vitest globally or in devDependencies
npx vitest run tests/
```

---

### `tests/automation/GmailAutomator.test.js`

18+ unit test cases — mock all external calls (Gmail API, Claude API, Tesseract).

**Test groups:**

```javascript
describe('Draft discovery', () => {
  test('filters out already-processed draft IDs from processed_drafts.json cache')
  test('filters out drafts labeled JD-Automator/Source-Processed')
  test('filters out drafts labeled JD-Automator/Generated')
  test('processes unprocessed drafts with valid recipients')
})

describe('Recipient extraction', () => {
  test('extracts email from To: header correctly')
  test('returns null when no To header is present')
  test('skips draft when recipient is null')
})

describe('JD text extraction', () => {
  test('extracts plain text from MIME body correctly')
  test('OCRs image attachment and appends to JD text')
  test('combines plain text and OCR text')
})

describe('Low-confidence guard', () => {
  test('skips draft when total JD text < 50 chars')
  test('logs SKIPPED row to review_log.csv for short JD text')
  test('does NOT call Claude when JD text is too short')
})

describe('Email generation', () => {
  test('calls Claude with truncated JD text and resume text')
  test('parses valid JSON response into subject + body correctly')
  test('falls back to raw text + generic subject on invalid JSON response')
  test('appends signature block when YOUR_NAME is set')
})

describe('Idempotency', () => {
  test('does not reprocess a draft_id already in processed_drafts.json')
  test('saves processed draft_id to processed_drafts.json after success')
})

describe('NextApply webhook', () => {
  test('POSTs to NEXTAPPLY_API_URL when env var is set')
  test('continues without error when NEXTAPPLY_API_URL is not set')
  test('continues without error when webhook POST fails (non-blocking)')
})
```

---

### `tests/frontend/JobApplicationPanel.test.tsx`

```typescript
describe('JobApplicationPanel', () => {
  test('renders loading skeleton while query is in flight')
  test('renders empty state when no automator jobs exist')
  test('renders correct number of rows for returned jobs')
  test('shows AutomatorStatusBadge with correct variant per status')
  test('"Open Draft" button href is correct Gmail deep-link URL')
  test('"Mark Applied" button calls useUpdateJob mutation')
  test('clicking a row opens JobDetailDrawer')
})

describe('AutomatorStatusBadge', () => {
  test('renders blue badge for "Draft Created"')
  test('renders green badge for "Sent"')
  test('renders amber badge for "Skipped"')
  test('renders fallback for unknown status value')
})
```

---

### `tests/integration/JobApplicationFlow.test.js`

```javascript
describe('Full Job Application Flow', () => {
  test('Automator webhook → API creates Job record', async () => {
    // POST to /api/jobs/import-from-automator with mock payload
    // Assert 201 + job has gmailDraftId, automatorStatus set
  })

  test('Imported job appears in GET /api/jobs response', async () => {
    // After import, GET /api/jobs
    // Assert job with matching gmailDraftId is in list
  })

  test('Marking job as Applied via PATCH updates applicationStatus', async () => {
    // PATCH /api/jobs/{id} with applicationStatus: "Applied"
    // Assert response has applicationStatus = "Applied" and appliedDate set
  })
})
```

---

### `tests/README.md` — Test suite documentation

Covers:
- How to install and run (Vitest)
- Test file map and what each covers
- Mocking strategy for external APIs
- Coverage targets

---

## Completion Criteria

- [ ] `graph.html` has 7 color-coded layers with ~40 Job Tracker nodes (no MCQ nodes remaining)
- [ ] Node inspector shows file paths and API contracts for all Controller and Data layer nodes
- [ ] Both Dark Constellation Mode and Structured Cards Mode toggle correctly
- [ ] `npx vitest run tests/automation/GmailAutomator.test.js` — 18+ tests pass
- [ ] `npx vitest run tests/frontend/JobApplicationPanel.test.tsx` — 11+ tests pass
- [ ] `npx vitest run tests/integration/JobApplicationFlow.test.js` — 3 tests pass
- [ ] Overall test pass rate: 100% (no skipped tests)
