# Phase 3 — Frontend: Job Application Panel UI

**Status:** ✅ Complete  
**Goal:** Add a dedicated "Job Applications" panel to the NextApply React frontend where users can see all auto-imported applications, their outreach status, and take action on them.

---

## Objectives

1. ✅ Create `JobApplicationPanel.tsx` — list view of automator-sourced jobs
2. ✅ Create `AutomatorStatusBadge.tsx` — status badge variant for automator statuses
3. ✅ Create `useJobApplicationImport.ts` — TanStack Query hook
4. ✅ Add nav item linking to the new panel in Sidebar
5. ✅ Add `/graph` route & System Graph nav item rendering `graph.html`

---

## Files to Create / Modify

### Frontend — `frontend/src/`

#### [NEW] `components/jobapp/JobApplicationPanel.tsx`

A filterable, sortable table of jobs where `gmailDraftId != null`.

**Columns:**
| Column | Source | Notes |
|--------|--------|-------|
| Company | `companyName` | Parsed by backend from JD text |
| Recipient | `hrRecruiterName` | The `To:` email from the Gmail draft |
| Generated Subject | `outreachSubject` | Truncated to 60 chars |
| Status | `automatorStatus` | `AutomatorStatusBadge` |
| App Status | `applicationStatus` | Existing `StatusBadgeDropdown` |
| Date | `createdAt` | Formatted relative date |
| Actions | — | "Open Draft" (links to Gmail), "Mark Applied" button |

**Behaviors:**
- Clicking a row opens the existing `JobDetailDrawer` (reuse fully)
- "Open Draft" button deep-links to `https://mail.google.com/mail/#drafts/<gmailDraftId>`
- "Mark Applied" calls `PATCH /api/jobs/{id}` with `applicationStatus: "Applied"` via the existing `useUpdateJob` hook

#### [NEW] `components/jobapp/AutomatorStatusBadge.tsx`

Status badge with 3 variants:
```tsx
type AutomatorStatus = 'Draft Created' | 'Sent' | 'Skipped';

// Color mapping:
// "Draft Created" → blue  (var(--color-blue-500))
// "Sent"         → green (var(--color-green-500))
// "Skipped"      → amber (var(--color-amber-500))
```

Follows the same token-based styling as the existing `StatusBadgeDropdown`.

#### [NEW] `hooks/useJobApplicationImport.ts`

```typescript
// useJobApplications() — fetch all jobs with gmailDraftId set
export const useJobApplications = () =>
  useQuery({
    queryKey: ['jobs', 'automator'],
    queryFn: () => api.get('/api/jobs?source=automator'),  // backend filters on GmailDraftId != null
  });
```

#### [MODIFY] `App.tsx`

1. Add route:
```tsx
<Route path="/graph" element={<GraphViewer />} />
```
Where `GraphViewer` is a simple wrapper:
```tsx
const GraphViewer = () => (
  <iframe
    src="/graph.html"
    style={{ width: '100%', height: '100vh', border: 'none' }}
    title="Architecture Graph"
  />
);
```

2. Add "Job Applications" entry to sidebar/nav (wherever the existing nav items live).

#### [MODIFY] `components/layout/` (nav component, whichever file it lives in)

Add nav item:
```tsx
{ label: 'Job Applications', href: '/job-applications', icon: Mail }
```

---

## Design Spec

### JobApplicationPanel layout
```
┌─────────────────────────────────────────────────────┐
│  📨 Job Applications (from Automator)         [132] │
│  Showing auto-processed outreach from Gmail.         │
├──────────┬──────────────┬────────────┬──────────────┤
│ Company  │ Subject      │ Automator  │ App Status   │
│          │              │ Status     │              │
├──────────┼──────────────┼────────────┼──────────────┤
│ ACME Corp│ Re: Senior.. │ 🔵 Draft   │ Not Started  │
│ Beta Inc │ Application..│ 🟢 Sent    │ Applied      │
│ Gamma Co │ —            │ 🟡 Skipped │ —            │
└──────────┴──────────────┴────────────┴──────────────┘
```

### Token usage
- Reuse all existing CSS custom properties from `index.css`
- No new color tokens — use `--color-blue-*`, `--color-green-*`, `--color-amber-*` already defined
- Padding, spacing, font-size: match existing table cells

---

## Completion Criteria

- [ ] `/job-applications` route renders `JobApplicationPanel` with jobs filtered to automator-sourced records
- [ ] `AutomatorStatusBadge` renders correct color for all 3 status values
- [ ] "Open Draft" button deep-links to the correct Gmail draft URL
- [ ] "Mark Applied" updates `applicationStatus` optimistically (reuses existing TanStack Query mutation)
- [ ] `/graph` route renders `graph.html` at full viewport height with no scrollbar or border
- [ ] Nav item for "Job Applications" is visible and active when on that route
- [ ] `JobDetailDrawer` opens correctly when clicking a row in `JobApplicationPanel`
- [ ] No regressions in the existing Job Table or other features
