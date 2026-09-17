# Phase 1 — Foundation: Asset Migration & Documentation

**Status:** ✅ Complete  
**Goal:** Migrate all assets from the Gmail JD Automator and MCQ Quiz projects into the NextApply Job Tracker repo. Establish the documentation hierarchy and directory structure before any code changes.

---

## Objectives

1. Copy the Gmail JD Automator Python script and all supporting files into `automation/gmail-jd-automator/`
2. Migrate all 11 prompt-lib prompts to `prompt-lib/`
3. Migrate the Graphify Dark Constellation visualizer (`graph.html`) to `frontend/public/`
4. Create the new documentation files (`docs/08`, `09`, `10`) and update the architecture overview
5. Create the `docs/phases/` directory with all 4 phase docs
6. Create the `tests/` directory scaffold (empty files, README)

---

## Deliverables

| Asset | Source | Destination | Status |
|-------|--------|-------------|--------|
| `main.py` | `files/gmail-jd-automator/` | `automation/gmail-jd-automator/` | ✅ |
| `requirements.txt` | `files/gmail-jd-automator/` | `automation/gmail-jd-automator/` | ✅ |
| `.env.example` | `files/gmail-jd-automator/` | `automation/gmail-jd-automator/` | ✅ |
| `.gitignore` | (new) | `automation/gmail-jd-automator/` | ✅ |
| `README.md` | (new) | `automation/gmail-jd-automator/` | ✅ |
| 11 prompt files | `MCQ-Quiz/prompt-lib/` | `prompt-lib/` | ✅ |
| `prompt-lib/README.md` | (updated) | `prompt-lib/README.md` | ✅ |
| `graph.html` | `MCQ-Quiz/public/` | `frontend/public/graph.html` | ✅ (re-targeted in Phase 4) |
| `docs/08-job-application-module.md` | Merged from files/ PRD + Tech Docs | `docs/` | ✅ |
| `docs/09-prompt-library.md` | (new) | `docs/` | ✅ |
| `docs/10-graphify-guide.md` | (new) | `docs/` | ✅ |
| `docs/01-architecture-overview.md` | (modified) | `docs/` | ✅ |
| `docs/phases/` (4 files) | (new) | `docs/phases/` | ✅ |
| `tests/README.md` | (new) | `tests/` | ✅ |
| `tests/` scaffold | (new) | `tests/` | ✅ |

---

## Completion Criteria

- [x] `automation/gmail-jd-automator/main.py` runs standalone: `python main.py` (without `NEXTAPPLY_API_URL` set) without import errors
- [x] All 11 prompt files exist under `prompt-lib/`
- [x] `docs/` contains files 01 through 10
- [x] `docs/phases/` contains all 4 phase docs
- [x] `frontend/public/graph.html` is present and opens in a browser
- [x] `tests/` directory scaffold exists with README

---

## Notes

- The `.env.example` in `automation/` includes the two new optional vars (`NEXTAPPLY_API_URL`, `NEXTAPPLY_API_KEY`) added in Phase 2.
- The `graph.html` copied in this phase still contains MCQ-specific node data; full re-targeting happens in **Phase 4**.
- No database migrations or API changes occur in this phase.
