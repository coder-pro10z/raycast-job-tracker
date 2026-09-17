# Frontend Documentation

## Directory Tree

```
frontend/src/
├── App.tsx                   # Root: QueryClientProvider + JobProvider + Router + GraphViewer
├── main.tsx                  # Entry point
├── index.css                 # Global CSS, design tokens
├── components/
│   ├── NewJobModal.tsx        # Modal for creating a new job from scratch
│   ├── auth/                 # Auth gate components (API key entry)
│   ├── common/               # Badge, StatusBadgeDropdown, PriorityBadgeDropdown
│   ├── dashboard/            # DashboardMetrics (metric cards), SupportPage
│   ├── detail/               # JobDetailDrawer, OutreachStudio, FindLeadsMenu
│   ├── jobapp/               # JobApplicationPanel, AutomatorStatusBadge (Gmail Automator sync)
│   ├── layout/               # Header, Sidebar, WorkspaceLoader
│   ├── outreach/             # ColdOutreachWorkspace, template studio
│   ├── search/               # FilterBar, CommandPalette
│   ├── settings/             # SettingsModal
│   ├── table/                # JobTable, EditLinkPopover, cell renderers
│   ├── ui/                   # Generic UI primitives, Toast
│   └── upload/               # UploadModal (Excel import)
├── hooks/
│   ├── useJobs.ts            # TanStack Query hooks (jobs CRUD, notes, clone)
│   └── useJobApplicationImport.ts # Automator jobs query, metrics, mark-as-applied
├── services/
│   ├── apiClient.ts          # Fetch wrapper, field mapping (including automator fields)
│   └── excelAdapter.ts       # Excel parse + export (SheetJS/xlsx)
├── state/
│   └── useJobStore.tsx       # React Context store + JobProvider (view modes, filters)
├── types/
│   └── job.ts                # TypeScript types (JobItem, ViewMode, FilterState)
└── utils/
    └── linkedinSearch.ts     # URL builders for LinkedIn people + job search
```

## Component Hierarchy Diagram

```mermaid
graph TD
    App --> QueryClientProvider
    App --> JobProvider
    JobProvider --> Header
    JobProvider --> Sidebar
    JobProvider --> MainContent[Main Content Area]
    JobProvider --> CommandPalette
    JobProvider --> NewJobModal
    JobProvider --> UploadModal
    JobProvider --> JobDetailDrawer

    Header --> NewJobModal
    Header --> UploadModal

    MainContent --> DashboardMetrics
    MainContent --> FilterBar
    MainContent --> JobTable
    MainContent --> JobApplicationPanel[JobApplicationPanel (from Automator)]
    MainContent --> ColdOutreachWorkspace[ColdOutreachWorkspace]
    MainContent --> GraphViewer[GraphViewer (iframe to /graph.html)]
    MainContent --> SupportPage[SupportPage]

    JobApplicationPanel --> AutomatorStatusBadge
    JobApplicationPanel --> StatusBadgeDropdown

    JobTable --> EditLinkPopover
    JobTable --> FindLeadsMenu
    JobTable --> StatusBadgeDropdown

    JobDetailDrawer --> Tab1[Tab 1: Job & Application Info]
    JobDetailDrawer --> Tab2[Tab 2: OutreachStudio]
```

## State Management

The application state is managed using the **React Context API** through a custom `useJobStore` hook. This replaces external state management libraries like Zustand to reduce bundle size and leverage built-in React features.

The `JobProvider` wraps the application and provides the context. Several state properties are persisted to `localStorage` to maintain user preferences across sessions. The persisted properties include:
- `theme`
- `activeDomain`
- `viewMode`
- `sortBy` / `sortDirection`
- `userProfile`
- `isSidebarCollapsed`

## Filtering Pipeline

The displayed jobs in the table are computed through a series of filters applied sequentially to the raw data. This is typically done via `useMemo` to ensure performance.

**Pipeline Flow:**
`Raw Jobs` → `Domain Filter` → `ViewMode Filter` → `Priority Filter` → `WorkMode Filter` → `Status Filter` → `Tech Filter` → `Search Filter` → `Sort` → `Filtered Jobs`

## Metrics Computation

Metrics are computed based on the currently selected domain (or 'all'). The computations iterate over the job list to provide counts for:
- Total Jobs
- Jobs needing action (Ready to Apply)
- Applied Jobs
- Interviewing Jobs
- Offers
- Rejected
- High Priority Jobs (Top unapplied)

## Data Fetching

Data fetching is handled by TanStack Query (v5).

| Hook | Query Key | Stale Time | Purpose |
| --- | --- | --- | --- |
| `useJobs` | `['jobs']` | 5 mins | Fetches all jobs with Notes included |
| `useJobApplicationImport` | `['jobs']` | 5 mins | Derived hook filtering automator jobs (`gmailDraftId != null`), computes metrics, provides `markAsApplied` |
| `useUpdateJob` | N/A | N/A | Updates a job. Performs optimistic UI update. |
| `useCreateJob` | N/A | N/A | Creates a new job. Invalidates `['jobs']` on success. |
| `useAddNote` | N/A | N/A | Adds a note to a job. Invalidates `['jobs']` on success. |
| `useCloneJob` | N/A | N/A | Clones a job. Invalidates `['jobs']` on success. |
| `useCheckDuplicateJob` | `['check-duplicate', company, role, id]` | 60 secs | Checks for duplicate job entries based on company and role. |

## Job Applications (Automator) Panel

The `JobApplicationPanel` (`components/jobapp/JobApplicationPanel.tsx`) renders all opportunities imported via the Gmail JD Automator sidecar:
- **Badge Indicators:** `AutomatorStatusBadge` displays run results: `Draft Created` (blue), `Sent` (green), and `Skipped` (amber).
- **Direct Gmail Deep Links:** "Open Draft" anchors directly to `https://mail.google.com/mail/#drafts/<gmailDraftId>`.
- **One-Click Application:** "Mark Applied" triggers an optimistic PATCH to transition `applicationStatus` to `Applied`, automatically setting the `appliedDate`.
- **Full Lineage:** Clicking any row opens the full `JobDetailDrawer` for notes and LinkedIn lead discovery.

## System Architecture Graph (Graphify)

Selecting **System Graph** from the sidebar loads `/graph.html` inside `GraphViewer` (`App.tsx`):
- Features both **Dark Constellation Mode** (`#0B0F19`) and **Structured Cards Mode**.
- Interactive Vis.js network with 42 nodes across all 7 layers of NextApply.
- Two-Tier Rule enforcement: clicking any node opens the Node Inspector sidebar with file paths, responsibilities, API endpoints, and links to `/docs`.

## Optimistic Updates

The `useUpdateJob` hook employs optimistic updates to provide a snappy user experience:
1. **Cancel pending queries:** Prevents race conditions.
2. **Snapshot previous cache:** Saves the current state for fallback.
3. **Mutate cache immediately:** Updates the UI before the server responds.
4. **Rollback on error:** Restores the previous cache if the mutation fails.
5. **Invalidate on settle:** Ensures data freshness by refetching on success or failure.

## Portal Pattern

Popovers (like `EditLinkPopover` and `FindLeadsMenu`) use React Portals (`createPortal`). This is essential to prevent them from being clipped by the `JobTable`'s `overflow: hidden` or `overflow: auto` CSS rules. 
The portals are appended to `document.body` and position themselves relative to their trigger elements using refs. They include global click and scroll event listeners to close themselves when the user clicks outside or scrolls the table.

## Row Virtualization

To handle hundreds or thousands of job entries without performance degradation, the `JobTable` uses `@tanstack/react-virtual`. It only renders the rows that are currently visible within the viewport scroll area, reusing DOM nodes as the user scrolls.

**Design Constraint**: The virtual row height is set to `64px` (previously 50px) to ensure proper "breathability" and alignment with the premium design system's spacing grid, preventing the UI from feeling like a dense spreadsheet.

## LinkedIn Search

The `linkedinSearch.ts` utility provides two main functions for constructing LinkedIn search URLs:
- `buildLinkedInSearchUrl()`: Constructs a people search URL. It takes the company name (or URN), desired personas (e.g., recruiter, engineering manager), geographical criteria, and hiring filters.
- `buildLinkedInJobSearchUrl()`: Constructs a jobs search URL based on keywords, recency (e.g., `f_TPR=r86400` for past 24 hours), and an optional company URN.

## Field Mapping

The `apiClient.ts` maps fields between the backend models and the frontend `JobItem` interfaces:
- Backend `applicationLink` maps to Frontend `jobApplicationLink`
- Backend `techStack` (CSV string) maps to Frontend `techStack` (string array)
- Backend `notes` array is split into standard `notes` (General) and `jdContent` (JD type)
- Backend `domain` string is mapped to literal types (`sde`, `cloud`, `dual`, `general`)
- Backend `id` (integer) is mapped to string for frontend keys

## LocalStorage Keys

| Key | Purpose |
| --- | --- |
| `jobtracker_theme` | Stores 'dark' or 'light' preference |
| `jobtracker_domain` | Stores the active domain filter |
| `jobtracker_viewMode` | Stores the active view tab |
| `jobtracker_sort` | Stores `{ sortBy, sortDirection }` |
| `jobtracker_userProfile` | Stores user specific settings |
| `jobtracker_sidebar` | Stores boolean for collapsed state |
