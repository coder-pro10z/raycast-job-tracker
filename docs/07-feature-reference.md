# Feature Reference Guide

## 1. Job Table
- **Purpose**: Main view displaying all job applications.
- **How to Use**: Scroll through the virtualized list. Click on column headers to sort. Click a row to open the detail drawer.
- **Files Involved**: `JobTable.tsx`, cell renderers in `components/table/`
- **API Calls Made**: None directly (data provided by parent).
- **Edge Cases/Notes**: Uses `@tanstack/react-virtual` for performance. Has sticky headers.

## 2. Job Detail Drawer
- **Purpose**: View and edit comprehensive details of a single job.
- **How to Use**: Click any row in the Job Table. Edit fields directly. Switch tabs to access Outreach Studio. Close via Esc or clicking the backdrop.
- **Files Involved**: `JobDetailDrawer.tsx`
- **API Calls Made**: PATCH `/api/jobs/{id}` on field edits, POST `/api/jobs/{id}/notes` for JD edits.
- **Edge Cases/Notes**: Rendered via portal. Auto-saves on blur.

## 3. Status Badge Dropdown
- **Purpose**: Quick inline update of job status.
- **How to Use**: Click on a status badge in the table or drawer, select the new status from the dropdown.
- **Files Involved**: `StatusBadgeDropdown.tsx`
- **API Calls Made**: PATCH `/api/jobs/{id}` (via `useUpdateJob`)
- **Edge Cases/Notes**: Changing to 'Applied' auto-sets the applied date on the backend if not set.

## 4. Outreach Pitch Studio
- **Purpose**: Generate outreach emails to recruiters or hiring managers.
- **How to Use**: Open Job Detail Drawer, navigate to Tab 2.
- **Files Involved**: `OutreachStudio.tsx`
- **API Calls Made**: POST `/api/jobs/{id}/outreach` (to log usage).
- **Edge Cases/Notes**: Leverages stored template structures.

## 5. Find Leads Menu
- **Purpose**: Shortcut to search for relevant people and jobs on LinkedIn.
- **How to Use**: Click the Find Leads button in the table row actions. Select a persona or job recency.
- **Files Involved**: `FindLeadsMenu.tsx`, `linkedinSearch.ts`
- **API Calls Made**: None (client-side URL generation).
- **Edge Cases/Notes**: Opens in a new tab.

## 6. Clone Job
- **Purpose**: Easily apply for a different role at the same company.
- **How to Use**: Click the Clone icon in the table row actions.
- **Files Involved**: `useJobs.ts`, `JobTable.tsx`
- **API Calls Made**: POST `/api/jobs/{id}/clone`
- **Edge Cases/Notes**: Duplicates company info but resets application-specific fields.

## 7. New Job Modal
- **Purpose**: Manually enter a new job prospect.
- **How to Use**: Click "New Job" in the header, fill out the form, submit.
- **Files Involved**: `NewJobModal.tsx`
- **API Calls Made**: POST `/api/jobs`
- **Edge Cases/Notes**: Invalidates query cache to refresh the table.

## 8. Edit Link Popover
- **Purpose**: Quick edit access to URL and JD snippet from the table.
- **How to Use**: Click the pencil icon next to a link in the table.
- **Files Involved**: `EditLinkPopover.tsx`
- **API Calls Made**: PATCH `/api/jobs/{id}`
- **Edge Cases/Notes**: Portal-based to avoid clipping inside the virtualized table.

## 9. Excel Upload
- **Purpose**: Import bulk job data from a spreadsheet.
- **How to Use**: Click Upload icon in header, select `.xlsx` file.
- **Files Involved**: `UploadModal.tsx`, `excelAdapter.ts`, `useJobStore.tsx`
- **API Calls Made**: Multiple POST `/api/jobs` (after local deduplication).
- **Edge Cases/Notes**: Deduplicates locally based on Company Name + Target Role before sending to the DB.

## 10. Excel Export
- **Purpose**: Backup or export current data to a spreadsheet.
- **How to Use**: Click Export icon in header.
- **Files Involved**: `excelAdapter.ts`, `useJobStore.tsx`
- **API Calls Made**: None (generates file locally from state).
- **Edge Cases/Notes**: Uses SheetJS/xlsx.

## 11. Command Palette
- **Purpose**: Global quick fuzzy search.
- **How to Use**: Press `Ctrl+K` or `Cmd+K`. Type query.
- **Files Involved**: `CommandPalette.tsx`
- **API Calls Made**: None (searches local state).
- **Edge Cases/Notes**: Searches across company name, role, tech stack, and notes.

## 12. Dashboard Metrics
- **Purpose**: Provide a high-level overview of application progress.
- **How to Use**: View at the top of the main area. Click a card to filter the table to that specific metric.
- **Files Involved**: `DashboardMetrics.tsx`
- **API Calls Made**: None (computed via `useMemo`).
- **Edge Cases/Notes**: Metrics update instantly on domain or data changes.

## 13. Filter Bar
- **Purpose**: Filter jobs based on specific criteria.
- **How to Use**: Click chips for Priority, Work Mode, Status, or Tech.
- **Files Involved**: `FilterBar.tsx`
- **API Calls Made**: None (filters local state).
- **Edge Cases/Notes**: Multi-select support for most filters.

## 14. Theme Toggle
- **Purpose**: Switch between light and dark modes.
- **How to Use**: Click the moon/sun icon in the header.
- **Files Involved**: Header component, `useJobStore.tsx`
- **API Calls Made**: None.
- **Edge Cases/Notes**: Preference is saved to `localStorage`.

## 15. Duplicate Check
- **Purpose**: Prevent entering the same job twice.
- **How to Use**: Type in the Target Role input in the drawer/modal.
- **Files Involved**: `useJobs.ts`, Detail/Modal components.
- **API Calls Made**: GET `/api/jobs/check-duplicate`
- **Edge Cases/Notes**: Debounced by 400ms to avoid spamming the API.

## 16. Find Postings (Header)
- **Purpose**: Quick global LinkedIn job search.
- **How to Use**: Click the "Find Postings" button in the header.
- **Files Involved**: Header component, `linkedinSearch.ts`
- **API Calls Made**: None.
- **Edge Cases/Notes**: Defaults to jobs posted in the last 30 minutes.
