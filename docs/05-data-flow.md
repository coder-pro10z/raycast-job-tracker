# Data Flow Documentation

## Excel Import Flow

The Excel import relies heavily on client-side parsing before interacting with the application state and backend.

```mermaid
sequenceDiagram
    participant User
    participant UploadModal
    participant useJobStore
    participant excelAdapter
    
    User->>UploadModal: Selects .xlsx file
    UploadModal->>useJobStore: uploadExcelFile(file)
    useJobStore->>excelAdapter: parseFile(file)
    excelAdapter-->>useJobStore: Returns parsed JobItems
    
    Note over useJobStore: Performs deduplication against local state
    
    useJobStore-->>UploadModal: Success
    
    Note over UploadModal: Data must be POSTed to API separately for persistence
```
*Note: While `uploadExcelFile` performs deduplication in memory, for DB persistence, the parsed jobs are sent to the backend via POST requests.*

## Standard CRUD Flow

```mermaid
sequenceDiagram
    participant User
    participant ReactComponent
    participant TanStackQuery
    participant apiClient
    participant Backend (EF Core)
    participant Database (Supabase)
    
    User->>ReactComponent: Triggers Action (e.g. Save)
    ReactComponent->>TanStackQuery: mutate()
    TanStackQuery->>apiClient: PATCH /api/jobs/{id}
    apiClient->>Backend (EF Core): HTTP Request
    Backend (EF Core)->>Database (Supabase): SQL Update
    Database (Supabase)-->>Backend (EF Core): Success
    Backend (EF Core)-->>apiClient: 200 OK + Updated Data
    apiClient-->>TanStackQuery: Resolves
    TanStackQuery->>ReactComponent: Updates cache, triggers re-render
```

## Optimistic Update Flow

When updating a job, the UI reflects the change immediately before the server confirms it.

```mermaid
sequenceDiagram
    participant Component
    participant QueryCache
    participant Server
    
    Component->>QueryCache: Mutate (Optimistic)
    Note over QueryCache: 1. Cancel active fetches
    Note over QueryCache: 2. Snapshot current state
    Note over QueryCache: 3. Apply changes locally
    QueryCache->>Server: Send Request
    
    alt Success
        Server-->>QueryCache: 200 OK
        QueryCache->>QueryCache: Invalidate/Refetch on settle
    else Error
        Server-->>QueryCache: 500 Error
        QueryCache->>QueryCache: Rollback to Snapshot
        QueryCache->>QueryCache: Invalidate/Refetch on settle
    end
```

## JD / Notes Save Flow

1. User types in the `JobDetailDrawer` textarea.
2. The UI fires a `useAddNote` mutation (with type=JD) alongside a `useUpdateJob` mutation.
3. The server stores the note in the `Notes` table linked to the job.
4. On data refetch, `mapJobToFrontend` in the client extracts the JD content from the returned notes array.

## Status Change Flow

1. User clicks the `StatusBadgeDropdown` and selects a new status (e.g., 'Applied').
2. `useUpdateJob` triggers a PATCH request with `{ ApplicationStatus: 'Applied' }`.
3. If the backend detects the transition to 'Applied' and `AppliedDate` is null, it auto-sets `AppliedDate` to UTC now.

## LinkedIn People Search Flow

1. User clicks in `FindLeadsMenu`.
2. Triggers `buildLinkedInSearchUrl()` locally with parameters (company, persona, etc.).
3. Executes `window.open(url, '_blank')`.
4. *No server call is made.*

## LinkedIn Job Search Flow

1. User interacts with `FindLeadsMenu` or Header button.
2. Triggers `buildLinkedInJobSearchUrl()` with keywords and recency.
3. Executes `window.open(url, '_blank')`.
4. *No server call is made.*

## Duplicate Check Flow

1. User types in the target role input in the drawer/modal.
2. Changes are debounced by 400ms.
3. `useCheckDuplicateJob` is enabled if both company and role are present.
4. GET `/api/jobs/check-duplicate?companyName=X&targetRole=Y&excludeJobId=Z`.
5. Returns `{ isDuplicate: true/false }` which shows/hides an inline warning in the UI.

## Clone Job Flow

1. User clicks the Clone button on a job.
2. `useCloneJob` mutation triggers POST `/api/jobs/{id}/clone`.
3. Backend duplicates the job (resetting specific fields, inheriting others) and returns the new job.
4. TanStack Query invalidates `['jobs']`.
5. The new job appears in the table.
6. The UI automatically opens the `JobDetailDrawer` for the newly cloned job.

## Theme Toggle Flow

1. User clicks the theme toggle in the Header.
2. `toggleTheme()` in `useJobStore` updates state.
3. A `useEffect` hook reacts: adds/removes `dark`/`light` classes on the HTML `document.documentElement`.
4. The preference is written to `localStorage.setItem('jobtracker_theme', theme)`.

## Search / Filter Pipeline Diagram

```mermaid
flowchart TD
    A[Raw Jobs] --> B{Active Domain?}
    B -->|Filter| C[Domain Filtered Jobs]
    C --> D{View Mode?}
    D -->|Filter| E[View Filtered Jobs]
    E --> F{Priority Chips?}
    F -->|Filter| G[Priority Filtered Jobs]
    G --> H{Work Mode Chips?}
    H -->|Filter| I[Work Mode Filtered Jobs]
    I --> J{Status Chips?}
    J -->|Filter| K[Status Filtered Jobs]
    K --> L{Tech Stack Chips?}
    L -->|Filter| M[Tech Filtered Jobs]
    M --> N{Search Query?}
    N -->|Fuzzy Match| O[Search Filtered Jobs]
    O --> P{Sort Config?}
    P -->|Sort Field/Dir| Q[Final Displayed Jobs]
```
