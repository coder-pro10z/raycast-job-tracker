# Feature Plan: New Job Entry + Clone Job

**What it solves:** Right now every job is a one-off manual entry. Two real needs:
1. **New Job** — add a company/role that isn't in the 588-row seed at all.
2. **Clone Job** — same company, different role (e.g., KPMG India has both ".NET Full Stack Developer" and "Azure Cloud Engineer" openings) — without retyping company, location, recruiter, or LinkedIn URN from scratch.

Clone is the more valuable of the two day-to-day, since multi-role-per-company is common and re-typing shared fields is exactly the kind of friction the whole tracker exists to remove.

---

## 1. What Carries Over on Clone vs. What Resets

This is the core design decision — get this wrong and Clone either duplicates junk or forces you to re-enter things that shouldn't change.

| Field | On Clone | Why |
|---|---|---|
| Company Name | ✅ Carries over, locked (not editable) | Whole point of clone — same company |
| `linkedin_company_urn` | ✅ Carries over | **This is the biggest win.** You already did the manual lookup once (Section on `currentCompany` from earlier) — cloning means every future role at that company gets precise LinkedIn search for free, forever |
| Location / Work Mode | ✅ Carries over, editable | Usually same, but a company might have the new role at a different city — leave editable, not locked |
| HR/Recruiter Name | ✅ Carries over, editable | Often the same recruiter handles multiple reqs at one company |
| Domain (SDE/Cloud/Dual) | ✅ Carries over, editable | Starting point, may differ per role |
| Career Page Link | ✅ Carries over | Company-level, not role-level |
| **Target Role** | ❌ Cleared, auto-focused | This is *the* field you're here to change — cursor should land here immediately |
| **Application Link** | ❌ Cleared | Role-specific — the old link points at a different job posting |
| **Application Status** | ❌ Reset to `Not Started` | This is a new application, not a continuation |
| **Applied Date** | ❌ Cleared | Same reason |
| **Priority** | ❌ Reset to `Medium` (or prompt) | Don't silently inherit — a High-priority original role doesn't mean the second role is equally High |
| **Next Action** | ❌ Reset to default (`Apply and send outreach...`) | Fresh action, fresh role |
| **Notes** | ❌ Empty | Old notes were about the old role/JD |
| **Outreach templates used** | ❌ Not copied | New role needs its own pitch, not a log of what you sent for the other one |
| **Lead searches log** (if built) | ❌ Not copied | Same reasoning |

**New field needed:** `cloned_from_job_id` (nullable, self-referencing FK) — tracks lineage. Lets you later answer "did applying to multiple roles at the same company improve response rate?" and lets the UI show "2 other roles at this company" as a hint.

---

## 2. Data Model Change

```sql
ALTER TABLE jobs ADD COLUMN cloned_from_job_id INT REFERENCES jobs(id) ON DELETE SET NULL;
CREATE INDEX idx_jobs_cloned_from ON jobs(cloned_from_job_id);
CREATE INDEX idx_jobs_company_name ON jobs(company_name); -- needed for duplicate-check + grouping, Section 4/6
```

`ON DELETE SET NULL` — if you ever delete the original, the clone doesn't get dragged down with it; it just loses its lineage pointer.

---

## 3. Backend

Two endpoints — keep them separate rather than overloading the existing `POST /api/jobs`, since clone has real business logic (which fields reset) that shouldn't live in the frontend.

### 3.1 Clone endpoint — the important one

```csharp
[HttpPost("{id}/clone")]
public async Task<IActionResult> CloneJob(int id)
{
    var source = await _db.Jobs.FindAsync(id);
    if (source is null) return NotFound();

    var clone = new Job
    {
        CompanyName = source.CompanyName,
        Location = source.Location,
        WorkMode = source.WorkMode,
        Domain = source.Domain,
        CareerPageLink = source.CareerPageLink,
        HrRecruiterName = source.HrRecruiterName,
        LinkedinCompanyUrn = source.LinkedinCompanyUrn,   // the big win — reuse the looked-up URN

        // Explicitly reset — not just "left blank by omission"
        TargetRole = "",
        ApplicationLink = null,
        ApplicationStatus = "Not Started",
        AppliedDate = null,
        Priority = "Medium",
        NextAction = "Apply and send outreach",
        ClonedFromJobId = source.Id,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    _db.Jobs.Add(clone);
    await _db.SaveChangesAsync();
    return CreatedAtAction(nameof(GetJob), new { id = clone.Id }, clone);
}
```

Writing every reset field explicitly (not relying on nullable defaults) makes the "what resets" table in Section 1 self-documenting in the code — anyone reading this endpoint later doesn't have to guess.

### 3.2 Duplicate-role check (used by both New and Clone flows)

```csharp
[HttpGet("check-duplicate")]
public async Task<IActionResult> CheckDuplicate(string companyName, string targetRole)
{
    var exists = await _db.Jobs.AnyAsync(j =>
        j.CompanyName == companyName &&
        j.TargetRole == targetRole &&
        j.ApplicationStatus != "Rejected" &&
        j.ApplicationStatus != "Withdrawn");
    return Ok(new { isDuplicate = exists });
}
```

Excludes Rejected/Withdrawn deliberately — reapplying to a role you were rejected from months ago at the same company is a legitimate case, not a mistake worth blocking.

---

## 4. Frontend UX

### 4.1 Two entry points, different weight

- **"+ New Job"** — header-level button (next to Export/Upload/Settings), opens a full modal with every field blank. Heavier action, used rarely.
- **"Clone"** — per-row icon action, same family as the existing Edit-pencil and Find-Leads-search icons you already have wired up with the portal pattern:

```
[🔗 Apply] [✏️ Edit] [🔍 Find Leads] [⧉ Clone]
```

Clicking Clone should **not** open a big modal — it should feel instant, since most fields are already correct. Use the same lightweight popover pattern already fixed for Edit/Find Leads:

```tsx
function CloneButton({ job }: { job: Job }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // or however row-selection/drawer-open works

  const handleClone = async (e: React.MouseEvent) => {
    e.stopPropagation(); // same lesson from the Edit-popover bug — isolate from row click
    setLoading(true);
    const cloned = await apiClient.cloneJob(job.id);
    setLoading(false);
    openDrawer(cloned.id, { focusField: 'targetRole' }); // land straight in the drawer, cursor on Role
  };

  return (
    <button className="icon-btn" onClick={handleClone} title="Clone for a different role" disabled={loading}>
      <Copy size={12} />
    </button>
  );
}
```

**Why open the drawer, not a modal:** the clone already exists in the database the instant you click — this isn't "fill out a form then submit," it's "here's your new row, go edit the one field that matters." That framing is both faster and matches how the rest of the tracker already treats inline editing (Section on `EditLinkPopover` from earlier).

### 4.2 Duplicate warning (non-blocking)

When the drawer opens post-clone and you start typing a Target Role, debounce-check against `check-duplicate`. If it matches an existing non-rejected entry:

```tsx
{isDuplicate && (
  <div className="duplicate-hint">
    ⚠️ You already have "{targetRole}" at {companyName} (status: {existingStatus}).
    This will still save as a separate entry — dismiss if intentional.
  </div>
)}
```

Warn, don't block — sometimes you genuinely do want two entries for the same role/company (e.g., reapplying after months, or two different postings that happen to share a title).

### 4.3 "New Job" modal (the blank-slate path)

Simple form, same field set as the Job Detail Drawer, all blank, Company Name field triggers the same duplicate check once Target Role is also filled. No clone-specific logic needed here — it's just `POST /api/jobs` with an empty payload.

---

## 5. Table Grouping (now genuinely needed)

Once companies can have 2+ rows, a flat alphabetical list gets confusing — "KPMG India" appearing twice with no visual link between the rows is easy to misread as a data error.

**Minimal fix, not a full rearchitecture:** add a subtle visual cue when consecutive-after-sort rows share a company:

```tsx
function CompanyCell({ job, isSameCompanyAsPrevRow }: { job: Job; isSameCompanyAsPrevRow: boolean }) {
  return (
    <div className="company-cell">
      {isSameCompanyAsPrevRow ? (
        <span className="company-continuation">↳ {job.companyName}</span>
      ) : (
        <span className="company-name">{job.companyName}</span>
      )}
    </div>
  );
}
```

Requires sorting/grouping by Company Name as an available sort option (you likely already have Target Role sort based on the screenshot header arrow — add Company as a second sortable column). Full Kanban-style grouping is a nice-to-have for later; this is the 20-minute version that solves the actual confusion.

---

## 6. Testing Checklist

- [ ] Clone a job — confirm the new row appears with company/location/recruiter/LinkedIn URN pre-filled, and Target Role empty + focused in the drawer
- [ ] Confirm Application Status on the clone is `Not Started`, not inherited from the source
- [ ] Confirm notes and outreach-template logs do **not** carry over to the clone
- [ ] Clone a job, then clone the clone — confirm `cloned_from_job_id` points to the immediate parent, not the original (or decide explicitly if you want it to always point to the root — pick one and document it)
- [ ] Type a Target Role that already exists (non-rejected) at that company — confirm the warning shows but doesn't block saving
- [ ] Type a Target Role that matches a **Rejected** entry at that company — confirm no warning (reapplying is valid)
- [ ] Create a brand-new job via "+ New Job" — confirm it works fully independent of the clone flow
- [ ] Sort by Company — confirm cloned rows visually group via the `↳` continuation indicator
- [ ] Delete a source job that has clones — confirm the clones survive with `cloned_from_job_id` set to `null` (not cascade-deleted)

---

## 7. Build Order

| Step | Work |
|---|---|
| 1 | `cloned_from_job_id` migration + indexes (Section 2) |
| 2 | `POST /api/jobs/{id}/clone` endpoint (Section 3.1) |
| 3 | `CloneButton` in the table row action group, reusing the existing portal/stopPropagation pattern | 
| 4 | Open drawer post-clone with Target Role auto-focused |
| 5 | `check-duplicate` endpoint + debounced frontend warning (Section 3.2, 4.2) |
| 6 | "+ New Job" header button + blank modal (Section 4.3) — lower priority, do last |
| 7 | Company-grouping visual indicator (Section 5) — polish pass once multi-role rows actually exist in your data |

Steps 1–4 alone get you the 80%-value version: one click, new row, cursor on Role, everything else already correct. Ship that first and use it for a few days before deciding whether the duplicate-warning and grouping polish are worth the extra time.

---

## Next Action

Want me to write the full `CloneButton.tsx`, the `clone` endpoint's DTO/controller code, and the migration file — ready to drop in?
