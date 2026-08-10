# NextApply Backend Migration Plan
### From Zero-Backend xlsx SPA → ASP.NET Core + PostgreSQL (Supabase), Cross-Device Ready

**Owner:** Praveen Kashyap
**Goal:** Turn the existing React/Vite job tracker into a real, cross-device application by adding an ASP.NET Core Web API + PostgreSQL backend — while building a second .NET portfolio project in the process.
**Constraint:** Don't stop applying while this is built. This is evening/weekend work, not a reason to pause Day 2 execution.

---

## 0. Architecture Decision

| Layer | Before | After |
|---|---|---|
| Frontend | React 18 + Vite, reads local `.xlsx` | Same React app, calls REST API instead |
| Data source | `public/Master_Job_Tracker.xlsx` | PostgreSQL (hosted on Supabase, free tier) |
| Backend | None | ASP.NET Core Web API (C#) |
| Auth | None | Single-user passphrase / API key |
| Hosting — frontend | Vercel (unchanged) | Vercel (unchanged) |
| Hosting — backend | N/A | Azure App Service (free/basic tier) |
| Excel role | Source of truth | Import seed + manual backup export only |

**Why Supabase Postgres instead of Azure SQL:** free tier is more generous, zero credit-card friction, and EF Core's Npgsql provider is just as production-real for your resume as SQL Server. If you want the Azure SQL line on your resume specifically, swap the connection string later — the API code barely changes. Either way you're shipping a genuine ASP.NET Core + cloud DB project.

---

## 1. Database Schema

```sql
-- Jobs: mirrors your current 16 xlsx columns, normalized
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    target_role TEXT,
    domain TEXT CHECK (domain IN ('SDE / FullStack', 'Cloud / DevOps', 'Dual Domain')),
    location TEXT,
    work_mode TEXT CHECK (work_mode IN ('Onsite', 'Hybrid', 'Remote')),
    application_link TEXT,
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
    application_status TEXT CHECK (application_status IN
        ('Not Started', 'Applied', 'In Review', 'Interview', 'Offer', 'Rejected', 'Withdrawn'))
        DEFAULT 'Not Started',
    next_action TEXT,
    tech_stack TEXT,
    career_page_link TEXT,
    applied_date DATE,
    referral_needed BOOLEAN DEFAULT FALSE,
    referral_contact_name TEXT,
    hr_recruiter_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notes: free-text notes and JD pastes, one-to-many per job
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    note_type TEXT CHECK (note_type IN ('General', 'JD', 'Link')) DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- OutreachTemplatesUsed: tracks which cold templates you've sent, and to whom
CREATE TABLE outreach_templates_used (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    channel TEXT CHECK (channel IN ('Email', 'LinkedIn')),
    sent_at TIMESTAMPTZ DEFAULT now(),
    recipient_name TEXT
);

-- Settings: your profile config, previously in localStorage only
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    experience_summary TEXT,
    key_strengths TEXT,
    contact_links JSONB,       -- {linkedin, github, portfolio, email}
    theme TEXT DEFAULT 'dark',
    active_track TEXT DEFAULT 'Dual Domain',
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_jobs_status ON jobs(application_status);
CREATE INDEX idx_jobs_priority ON jobs(priority);
CREATE INDEX idx_jobs_domain ON jobs(domain);
```

**Design notes:**
- `applied_date` becomes a real `DATE`, not a manually-typed string — this is what makes the conversion dashboard (Step 10) possible.
- `priority` and `application_status` use SQL `CHECK` constraints — this is where the messy `🔴 High` / `Normal` values get permanently fixed. Bad values become impossible to insert going forward.
- `updated_at` on `jobs` lets you build "what did I touch this week" views later without extra tracking.

---

## 2. ASP.NET Core Web API

### 2.1 Project setup
```bash
dotnet new webapi -n NextApply.Api -controllers
cd NextApply.Api
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### 2.2 Solution structure
```
NextApply.Api/
├── Controllers/
│   ├── JobsController.cs
│   ├── NotesController.cs
│   ├── OutreachController.cs
│   ├── SettingsController.cs
│   └── DashboardController.cs      # for Step 10/11
├── Models/
│   ├── Job.cs
│   ├── Note.cs
│   ├── OutreachTemplateUsed.cs
│   └── Settings.cs
├── Data/
│   └── AppDbContext.cs
├── Middleware/
│   └── ApiKeyAuthMiddleware.cs     # Step 8
├── DTOs/
│   ├── JobDto.cs
│   └── JobUpdateDto.cs
├── Program.cs
└── appsettings.json
```

### 2.3 Core endpoints (CRUD — Step 2)

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/jobs` | List all jobs, with query params: `?status=`, `?priority=`, `?domain=`, `?search=` |
| GET | `/api/jobs/{id}` | Single job detail (for the drawer) |
| PATCH | `/api/jobs/{id}` | Partial update — used by the Apply action, status changes, inline edits |
| POST | `/api/jobs` | Add a new company manually |
| DELETE | `/api/jobs/{id}` | Remove a bad/duplicate entry |
| POST | `/api/jobs/{id}/notes` | Add a note or JD paste |
| GET | `/api/jobs/{id}/notes` | Fetch notes for the drawer |
| POST | `/api/jobs/{id}/outreach` | Log a sent template |
| GET | `/api/settings` | Load profile config |
| PUT | `/api/settings` | Save profile config |
| GET | `/api/dashboard/next-batch?count=8` | Step 10 — today's application queue |
| GET | `/api/dashboard/weekly-summary` | Step 11 — conversion stats |

### 2.4 Example: PATCH endpoint (the one you'll hit most)

```csharp
[HttpPatch("{id}")]
public async Task<IActionResult> UpdateJob(int id, [FromBody] JobUpdateDto dto)
{
    var job = await _db.Jobs.FindAsync(id);
    if (job is null) return NotFound();

    if (dto.ApplicationStatus is not null)
    {
        job.ApplicationStatus = dto.ApplicationStatus;
        if (dto.ApplicationStatus == "Applied" && job.AppliedDate is null)
            job.AppliedDate = DateOnly.FromDateTime(DateTime.UtcNow);
    }
    if (dto.Priority is not null) job.Priority = dto.Priority;
    if (dto.NextAction is not null) job.NextAction = dto.NextAction;

    job.UpdatedAt = DateTime.UtcNow;
    await _db.SaveChangesAsync();
    return Ok(job);
}
```

This single endpoint is what replaces "manually edit the Excel file" — clicking **Apply** in the UI fires this PATCH, sets status + date together, done.

### 2.5 Dashboard aggregation (Step 10/11)

```csharp
[HttpGet("next-batch")]
public async Task<IActionResult> GetNextBatch(int count = 8)
{
    var batch = await _db.Jobs
        .Where(j => j.ApplicationStatus == "Not Started")
        .OrderByDescending(j => j.Priority == "High")
        .ThenBy(j => j.CompanyName)
        .Take(count)
        .ToListAsync();
    return Ok(batch);
}

[HttpGet("weekly-summary")]
public async Task<IActionResult> GetWeeklySummary()
{
    var weekAgo = DateTime.UtcNow.AddDays(-7);
    var applied = await _db.Jobs.CountAsync(j => j.AppliedDate >= DateOnly.FromDateTime(weekAgo));
    var responded = await _db.Jobs.CountAsync(j =>
        j.ApplicationStatus == "In Review" || j.ApplicationStatus == "Interview");
    var interviews = await _db.Jobs.CountAsync(j => j.ApplicationStatus == "Interview");
    var offers = await _db.Jobs.CountAsync(j => j.ApplicationStatus == "Offer");

    return Ok(new {
        appliedThisWeek = applied,
        responseRate = applied > 0 ? (double)responded / applied : 0,
        interviews,
        offers
    });
}
```

This is literally the "which companies respond, what's my conversion rate" system from your original capsule (Section 12) — now it's a real query instead of a spreadsheet you'd have to tally by hand.

---

## 3. Data Migration (Step 3)

One-time script to move your 626 rows from xlsx into Postgres. Python is fastest here (you already have `openpyxl` available), even though the app itself is C#.

```python
import openpyxl
import psycopg2
from datetime import datetime

wb = openpyxl.load_workbook('Master_Job_Tracker.xlsx', data_only=True)
conn = psycopg2.connect("your-supabase-connection-string")
cur = conn.cursor()

PRIORITY_MAP = {
    'High': 'High', '🔴 High': 'High',
    'Medium': 'Medium', 'Normal': 'Medium',
    'Low': 'Low'
}

seen = set()  # dedupe across the 3 sheets (All Opportunities overlaps SDE/Cloud)

for sheet_name in ['All Opportunities']:  # master sheet only — it's the union
    ws = wb[sheet_name]
    rows = list(ws.iter_rows(values_only=True))
    header, data = rows[0], rows[1:]

    for row in data:
        r = dict(zip(header, row))
        key = (r['Company Name'], r['Target Role'])
        if key in seen or not r['Company Name']:
            continue
        seen.add(key)

        cur.execute("""
            INSERT INTO jobs (company_name, target_role, domain, location, work_mode,
                application_link, priority, application_status, next_action, tech_stack,
                career_page_link, applied_date, referral_needed, referral_contact_name,
                hr_recruiter_name)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            r['Company Name'], r['Target Role'], r['Domain'], r['Location'], r['Work Mode'],
            r['Application Link'], PRIORITY_MAP.get(r['Priority'], 'Medium'),
            r['Application Status'] or 'Not Started', r['Next Action'], r['Tech Stack'],
            r['Career Page Link'], r['Applied Date'],
            (r['Referral Needed'] == 'Yes'), r['Referral Contact Name'], r['HR/Recruiter Name']
        ))

        # Notes column becomes a real note row, not a giant text blob
        if r['Notes']:
            cur.execute(
                "INSERT INTO notes (job_id, content, note_type) VALUES (currval('jobs_id_seq'), %s, 'General')",
                (r['Notes'],)
            )

conn.commit()
print(f"Migrated {len(seen)} unique companies")
```

This also solves the **priority normalization (Step 9)** automatically — no separate 10-minute cleanup needed, the map handles it during migration. And it dedupes the overlap between "All Opportunities" and the two track-specific sheets, so you don't end up with 626+431+197 duplicated rows.

---

## 4. Frontend Integration (Steps 4, 6, 7)

### 4.1 Replace the data layer

Delete the read path in `src/services/excelAdapter.ts`; add:

```typescript
// src/services/apiClient.ts
const API_BASE = import.meta.env.VITE_API_URL;

export const apiClient = {
  async getJobs(filters?: JobFilters) {
    const params = new URLSearchParams(filters as any);
    const res = await fetch(`${API_BASE}/api/jobs?${params}`, {
      headers: { 'X-Api-Key': localStorage.getItem('apiKey') ?? '' }
    });
    if (!res.ok) throw new Error('Failed to load jobs');
    return res.json();
  },

  async updateJob(id: number, patch: Partial<Job>) {
    const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': localStorage.getItem('apiKey') ?? ''
      },
      body: JSON.stringify(patch)
    });
    if (!res.ok) throw new Error('Failed to update job');
    return res.json();
  },
  // ...getNextBatch, getWeeklySummary, addNote, etc.
};
```

### 4.2 React Query setup

```typescript
// src/hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

export function useJobs(filters?: JobFilters) {
  return useQuery({ queryKey: ['jobs', filters], queryFn: () => apiClient.getJobs(filters) });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<Job> }) =>
      apiClient.updateJob(id, patch),

    // Step 7 — optimistic update
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['jobs'] });
      const previous = qc.getQueryData(['jobs']);
      qc.setQueryData(['jobs'], (old: Job[]) =>
        old.map(j => (j.id === id ? { ...j, ...patch } : j))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      qc.setQueryData(['jobs'], context?.previous); // rollback on failure
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['jobs'] })
  });
}
```

This is what makes the grid still feel like Linear/Raycast — the row updates instantly in the UI the moment you click, the network call happens in the background, and it silently rolls back only if the request actually fails.

### 4.3 The "Apply" action (Step 6)

```typescript
function ApplyButton({ jobId }: { jobId: number }) {
  const { mutate } = useUpdateJob();
  return (
    <button onClick={() => mutate({
      id: jobId,
      patch: { applicationStatus: 'Applied', appliedDate: new Date().toISOString() }
    })}>
      Mark Applied
    </button>
  );
}
```

One click, status + timestamp both set, synced to Postgres, visible on every device within seconds.

### 4.4 Auth screen (Step 8)

Since you're the only user, skip full auth (JWT/OAuth) — it's overkill. Use a simple gate:

```typescript
// src/components/auth/PassphraseGate.tsx
function PassphraseGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(!!localStorage.getItem('apiKey'));

  if (unlocked) return <>{children}</>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const key = (e.target as any).passphrase.value;
      localStorage.setItem('apiKey', key);
      setUnlocked(true);
    }}>
      <input name="passphrase" type="password" placeholder="Enter access key" />
      <button type="submit">Unlock</button>
    </form>
  );
}
```

Backend middleware checks the same key on every request:

```csharp
public class ApiKeyAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _validKey;

    public ApiKeyAuthMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _validKey = config["ApiKey"]!;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue("X-Api-Key", out var key) || key != _validKey)
        {
            context.Response.StatusCode = 401;
            return;
        }
        await _next(context);
    }
}
```

Store the real key in Azure App Service configuration (environment variable), never in source control.

### 4.5 Export-to-xlsx stays (Step 5)

Keep the existing export feature exactly as-is, just point it at API data instead of in-memory state:

```typescript
async function exportBackup() {
  const jobs = await apiClient.getJobs();
  const ws = XLSX.utils.json_to_sheet(jobs);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'All Opportunities');
  XLSX.writeFile(wb, `Job_Tracker_Backup_${new Date().toISOString().slice(0,10)}.xlsx`);
}
```

Run this weekly (Sunday review block) as an offline backup — cheap insurance, zero dependency on it for day-to-day use.

---

## 5. Deployment

| Component | Where | Notes |
|---|---|---|
| Postgres | Supabase (free tier) | Get connection string from Project Settings → Database |
| API | Azure App Service (F1/B1 tier) | `dotnet publish` → deploy via GitHub Actions or `az webapp up` |
| Frontend | Vercel (already set up) | Add `VITE_API_URL` env var pointing to Azure App Service URL |
| Secrets | Azure App Service → Configuration | `ConnectionStrings:DefaultConnection`, `ApiKey` |

```bash
# Deploy API
cd NextApply.Api
dotnet publish -c Release -o ./publish
az webapp up --name nextapply-api --resource-group nextapply-rg --runtime "DOTNETCORE:8.0"
```

CORS on the API — allow only your Vercel domain:
```csharp
builder.Services.AddCors(options => options.AddPolicy("AllowFrontend", policy =>
    policy.WithOrigins("https://raycast-job-tracker.vercel.app").AllowAnyMethod().AllowAnyHeader()));
```

---

## 6. Build Timeline (fits inside your existing evening/Saturday blocks)

| Session | Work | Fits into |
|---|---|---|
| Sat 1 (90 min) | Supabase project + schema (Section 1) + run migration script | FullStackMastery build slot |
| Weekday evenings x3 (60–75 min each) | Scaffold ASP.NET Core API, implement Jobs CRUD (Section 2.1–2.4) | Existing build session |
| Sat 2 (90 min) | Dashboard endpoints (2.5) + deploy API to Azure (Section 5) | Build slot |
| Weekday evenings x2 | Frontend: apiClient + React Query hooks (4.1–4.2) | Build session |
| Weekday evening x1 | Apply button + optimistic updates (4.3) | Build session |
| Weekday evening x1 | Passphrase auth both sides (4.4) | Build session |
| Sat 3 (60 min) | End-to-end test on phone + laptop, verify sync, export test | Build slot |

**Realistic total: ~2–2.5 weeks** of your existing evening/Saturday time, without touching your morning application block at all.

**Rollout rule:** keep the current xlsx-based version live and usable the entire time you're building this. Don't switch over until the new system has been tested end-to-end with your real data on at least two devices. Zero downtime on your actual job search while you build.

---

## 7. What This Gets You Beyond the Tracker

- A second, resume-ready project: **"NextApply — Job Search Intelligence Platform"** — ASP.NET Core Web API, PostgreSQL, React/TypeScript, deployed on Azure, RESTful design, optimistic UI patterns. This is a legitimate full-stack .NET talking point, distinct from FullStackMastery.
- Real practice with the exact stack in your target job postings, on a problem you actually care about finishing.
- A genuinely cross-device tracker that closes the loop the original capsule flagged as the P0 gap.

---

## Next Action

Say the word and I'll scaffold the actual `NextApply.Api` project files (Program.cs, DbContext, first controller) so you have a running local API within your first build session, rather than just this plan.
