# Prompt Library Index — NextApply Job Tracker

This document is the canonical index for the [`prompt-lib/`](../prompt-lib/) directory — 11 structured system prompts covering the full SDLC lifecycle for this project.

Use these prompts with any LLM (Claude, Gemini, GPT-4) when working on NextApply features.

---

## When to Use Which Prompt

| Situation | Prompt to Use |
|-----------|--------------|
| Starting a brand-new feature with no spec | [Write a Full PRD](../prompt-lib/write-full-prd.md) |
| Designing UI for a new feature | [Full UI & UX Design Brief](../prompt-lib/design-brief.md) |
| Locking down requirements before coding | [Phase 1: Requirements & Specification](../prompt-lib/phase-1-requirements.md) |
| Designing system architecture + UI together | [Phase 2: UI/UX & Technical Design](../prompt-lib/phase-2-design.md) |
| Writing production code for a spec | [Phase 3: Clean Code Implementation](../prompt-lib/phase-3-code.md) |
| Writing tests for a feature | [Phase 4: Test Suite & QA Verification](../prompt-lib/phase-4-test.md) |
| Running the full 4-phase pipeline in one session | [Requirements → Design → Code → Test](../prompt-lib/requirements-design-code-test.md) |
| Cleaning up dead code / vibe-coded files | [Clean Up & Refactor Dead Code](../prompt-lib/clean-up-dead-code.md) |
| Consolidating messy documentation | [Restructure & Consolidate Docs](../prompt-lib/restructure-docs.md) |
| Reorganizing the project repo structure | [Restructure Project Repo](../prompt-lib/restructure-repo.md) |
| Visualizing the codebase as an interactive graph | [Graphify Codebase & Knowledge Taxonomy](../prompt-lib/graphify.md) |

---

## Prompt Summaries

### 1. Write a Full PRD
- **Tagline:** Stop starting with "build me an app."
- **Persona:** Senior Product Manager
- **Output:** Structured PRD with problem statement, user stories, functional/non-functional requirements, success criteria, and risks.
- **Use for:** Job Application Module v2, any new NextApply feature.

### 2. Full UI & UX Design Brief
- **Tagline:** Design before you code. Always.
- **Persona:** Senior Product Designer
- **Output:** User flows, wireframe descriptions, design tokens, component states, accessibility notes.
- **Use for:** Designing the Job Applications Panel, Graphify route, new modals.

### 3. Phase 1: Requirements & Specification
- **Tagline:** Never code on assumptions. Lock down requirements first.
- **Persona:** Business Analyst & Solutions Architect
- **Output:** Functional & non-functional requirements, edge case risk matrix, data model sketch.

### 4. Phase 2: UI/UX & Technical Design
- **Tagline:** Blueprint before building.
- **Persona:** Product Designer & Architect
- **Output:** UI/UX design docs (flows, layouts, tokens, states, a11y) + Technical docs (topology, data schemas, API contracts, state management).

### 5. Phase 3: Clean Code Implementation
- **Tagline:** Write production-grade code. No hacks, no shortcuts.
- **Persona:** Senior Software Engineer
- **Output:** Modular, typed, SOLID-compliant source code. No TODOs, no placeholders.

### 6. Phase 4: Test Suite & QA Verification
- **Tagline:** Untested code is broken code. Prove it works.
- **Persona:** Staff QA Automation Engineer
- **Output:** Unit tests, integration tests, boundary tests, coverage report.

### 7. Requirements → Design → Code → Test (Combined Pipeline)
- **Tagline:** Don't jump straight to code. Build end-to-end with rigor.
- **Persona:** Principal Tech Lead
- **Output:** Full 4-phase artifact set in one session, with explicit approval gates between phases.
- **Use for:** Building the backend `JobApplicationImportController` end-to-end.

### 8. Clean Up & Refactor Dead Code
- **Tagline:** Vibe coding leaves a mess. Clean it.
- **Persona:** Senior Engineer / Refactor Specialist
- **Output:** Annotated dead-code removal list, refactored shared utils, before/after diff.

### 9. Restructure & Consolidate Docs
- **Tagline:** Good docs don't repeat themselves. Yours do.
- **Persona:** Technical Documentation Architect
- **Output:** Canonical doc hierarchy, cross-references, global index, consistency fixes.
- **Use for:** Cleaning up the `docs/` directory after this integration sprint.

### 10. Restructure Project Repo
- **Tagline:** Your folder structure is your architecture. Make it say the right thing.
- **Persona:** Principal Software Architect
- **Output:** Layer-based folder restructure, import path fixes, barrel exports, root README update.

### 11. Graphify Codebase & Knowledge Taxonomy
- **Tagline:** Don't just read code. Graph it.
- **Persona:** Knowledge Graph Architect & Repository Visualizer
- **Output:** Mermaid architecture diagram, taxonomy graph, interactive Vis.js HTML graph viewer.
- **Live output:** [`frontend/public/graph.html`](../frontend/public/graph.html) — Graphify Dark Constellation Mode.
