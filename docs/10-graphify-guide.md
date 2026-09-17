# Graphify — Architecture Visualizer Guide

> **Tagline:** Don't just read code. Graph it.

The **Graphify Dark Constellation Mode** is an interactive architecture graph viewer built with [Vis.js](https://visjs.org/). It visualizes the NextApply Job Tracker's full system architecture — from the browser through the React frontend, .NET API, PostgreSQL database, and the Gmail JD Automator sidecar.

---

## Accessing the Graph

**Local development:**
```
http://localhost:5173/graph
```
The `/graph` route in the React SPA renders `frontend/public/graph.html`.

**Direct file open:**
```
Job-Tracker/frontend/public/graph.html
```
Open directly in any browser — no server required.

---

## Graph Architecture

The graph is organized into **7 layers**, each rendered as a distinct color cluster:

| Layer | Color | Nodes |
|-------|-------|-------|
| **Entry** | Indigo | Browser, Raycast Extension |
| **Frontend** | Cyan | React SPA, Vite, TanStack Query, TanStack Virtual, Vanilla CSS |
| **API Gateway** | Violet | .NET 9 Web API, ApiKeyAuthMiddleware, CORS Policy |
| **Controllers** | Purple | JobsController, NotesController, OutreachController, DashboardController, JobApplicationImportController |
| **Data** | Teal | EF Core, ApplicationDbContext, PostgreSQL/Supabase, Migrations |
| **Automation** | Amber | Gmail JD Automator (Python), Claude API, Gmail API, Tesseract OCR |
| **Infra** | Slate | Vercel CDN, Render Web Service, Supabase Host |

---

## Features

### Graphify Dark Constellation Mode
- **Dark `#0B0F19` background** with colored constellation-dot nodes
- **Degree-based dynamic node sizing:** `size = 10 + (degree × 2.5)` — more connected nodes appear larger
- **Dashed edges** (`dashes: [4, 4]`) showing dependency direction
- **Hover tooltips** — `label · layer` on hover
- **Node Inspector Sidebar** — click any node to see:
  - Component responsibility
  - File path
  - API contracts / interfaces
  - Related documentation links

### Interactive Controls
- **Layer checkboxes** — toggle entire architecture layers on/off
- **Search bar** — fuzzy search nodes by name
- **Fit View** button — re-center and fit all nodes
- **View Mode toggle** — switch between Dark Constellation Mode and Structured Cards Mode (light background, box nodes, curved edges)

---

## Two-Tier Effectiveness Rule

The graph enforces a **10/10 Two-Tier Rule** to prevent visual clutter:

- **Tier 1 (Visual Canvas):** Nodes represent high-level Module & Component boundaries only (e.g., `JobsController`, `React SPA`, `ApplicationDbContext`). Not individual functions, fields, or CSS classes.
- **Tier 2 (Inspector Sidebar):** Rich details — method signatures, DTO shapes, design tokens, color palette — are shown in the **NODE INFO** sidebar when a node is clicked.

---

## Extending the Graph

To add new nodes (e.g., after adding a new controller or service):

1. Open `frontend/public/graph.html` in a text editor.
2. Locate the `var nodes = new vis.DataSet([...])` section.
3. Add a new node object:
   ```javascript
   {
     id: 'my-new-service',
     label: 'MyNewService',
     group: 'controllers',   // matches one of the 7 layer groups
     title: 'Responsibility: ...\nFile: backend/.../MyNewService.cs',
     value: 3                // relative importance (affects size)
   }
   ```
4. Add edges to/from existing nodes in the `var edges = new vis.DataSet([...])` section:
   ```javascript
   { from: 'jobs-controller', to: 'my-new-service', label: 'calls' }
   ```

---

## Regenerating the Graph

To fully regenerate the graph from scratch using the AI prompt:
1. Open [`prompt-lib/graphify.md`](../prompt-lib/graphify.md)
2. Copy the system prompt
3. Paste into your LLM of choice with this project's codebase as context
4. The LLM will output: Mermaid architecture diagram + `graph.html` with updated nodes

---

## Related Documentation

- [Architecture Overview](./01-architecture-overview.md)
- [Backend API Documentation](./03-backend.md)
- [Job Application Module](./08-job-application-module.md)
- [Graphify Prompt](../prompt-lib/graphify.md)
