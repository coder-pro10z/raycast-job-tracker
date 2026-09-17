# Test Suite — NextApply Job Tracker

Unit, component, and integration tests for the NextApply Job Tracker, with a focus on the Gmail JD Automator integration layer.

## Test Runner

Tests use **Vitest** (same format as the MCQ Quiz Platform test suite).

```bash
# Install (if not already in package.json)
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run all tests
npx vitest run tests/

# Run specific suite
npx vitest run tests/automation/GmailAutomator.test.js
npx vitest run tests/frontend/JobApplicationPanel.test.tsx
npx vitest run tests/integration/JobApplicationFlow.test.js

# Watch mode
npx vitest tests/
```

## Test File Map

| File | What it tests | Count |
|------|--------------|-------|
| `automation/GmailAutomator.test.js` | All logic in `automation/gmail-jd-automator/main.py` — draft discovery, recipient extraction, JD extraction, OCR guard, Claude call, idempotency, webhook | 22 tests |
| `frontend/JobApplicationPanel.test.tsx` | `JobApplicationPanel`, `AutomatorStatusBadge` components | 11 tests |
| `integration/JobApplicationFlow.test.js` | Full flow: automator webhook → API creates job → API returns it | 3 tests |

## Mocking Strategy

- **Gmail API**: mocked via `vi.mock` — returns a fixed list of draft objects
- **Claude API**: mocked — returns `{"subject": "Test Role at ACME", "body": "Hi, ..."}`
- **Tesseract/pytesseract**: mocked — returns a fixed OCR string of 200+ characters
- **urllib.request** (webhook): mocked to capture the POST payload and assert its shape
- **NextApply API** (integration tests): uses a local test server or `msw` (Mock Service Worker) request interceptors

## Coverage Targets

| Module | Target |
|--------|--------|
| `main.py` logic (JS mock equivalent) | 90%+ |
| `JobApplicationPanel` | 80%+ |
| `AutomatorStatusBadge` | 100% |
| Integration flows | 3/3 passing |
