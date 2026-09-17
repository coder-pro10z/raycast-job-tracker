# Prompt Library — NextApply Job Tracker

A collection of structured system prompts for product specification, UI/UX design, modular software development lifecycle (SDLC) phases, code maintenance, documentation management, and architecture visualization.

> These prompts were originally developed in the MCQ Quiz Platform project and have been migrated here as shared organizational infrastructure for the NextApply Job Tracker and Job Application module work.

## Included Prompts

### Product & Design
1. **[WRITE A FULL PRD](./write-full-prd.md)**
   - *Tagline:* Stop starting with "build me an app."
   - *Focus:* Senior Product Manager persona, clarification questions, structured PRD formulation.

2. **[FULL UI & UX DESIGN BRIEF](./design-brief.md)**
   - *Tagline:* Design before you code. Always.
   - *Focus:* Product Designer persona, user flows, layout, design tokens, states, accessibility.

### Granular SDLC Phase Prompts
3. **[PHASE 1: REQUIREMENTS & SPECIFICATION](./phase-1-requirements.md)**
   - *Tagline:* Never code on assumptions. Lock down requirements first.
   - *Focus:* Business Analyst & Architect persona, functional/non-functional requirements, edge case risk matrix.

4. **[PHASE 2: UI/UX & TECHNICAL DESIGN](./phase-2-design.md)**
   - *Tagline:* Blueprint before building. Design UI/UX and system architecture side-by-side.
   - *Focus:* Product Designer & Architect persona, PRD input integration, UI/UX docs (flows, layouts, tokens, states, a11y) & Technical docs (topology, data schemas, API contracts, state mgmt).

5. **[PHASE 3: CLEAN CODE IMPLEMENTATION](./phase-3-code.md)**
   - *Tagline:* Write production-grade code. No hacks, no shortcuts.
   - *Focus:* Senior Software Engineer persona, SOLID principles, strict typing, modular production code.

6. **[PHASE 4: TEST SUITE & QA VERIFICATION](./phase-4-test.md)**
   - *Tagline:* Untested code is broken code. Prove it works.
   - *Focus:* Staff QA Automation Engineer persona, unit, integration, boundary, and coverage testing.

### Combined SDLC Pipeline & Code Refactoring
7. **[REQUIREMENTS - DESIGN - CODE - TEST (Combined Pipeline)](./requirements-design-code-test.md)**
   - *Tagline:* Don't jump straight to code. Build end-to-end with rigor.
   - *Focus:* Principal Tech Lead persona, sequential 4-phase SDLC workflow with explicit approval gates.

8. **[CLEAN UP & REFACTOR DEAD CODE](./clean-up-dead-code.md)**
   - *Tagline:* Vibe coding leaves a mess. Clean it.
   - *Focus:* Repo scanning, dead code removal with proof, logic refactoring to shared utils.

### Documentation Maintenance
9. **[RESTRUCTURE & CONSOLIDATE DOCS](./restructure-docs.md)**
   - *Tagline:* Good docs don't repeat themselves. Yours do.
   - *Focus:* Technical Documentation Architect persona, full audit, canonical hierarchy design, cross-referencing, global index generation, and consistency enforcement.

10. **[RESTRUCTURE PROJECT REPO](./restructure-repo.md)**
    - *Tagline:* Your folder structure is your architecture. Make it say the right thing.
    - *Focus:* Principal Software Architect persona, layer-based restructure (public, src/core, src/data, src/store, src/ui), import path fixes, barrel exports, root README, .gitignore.

11. **[GRAPHIFY CODEBASE & KNOWLEDGE TAXONOMY](./graphify.md)**
    - *Tagline:* Don't just read code. Graph it.
    - *Focus:* Knowledge Graph Architect persona, dependency graph extraction, 3-tier domain taxonomy mapping, Mermaid architecture generation, interactive visual graph viewer creation. See live output at [`/graph`](../frontend/public/graph.html).
