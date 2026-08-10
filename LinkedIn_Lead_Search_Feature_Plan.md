# Feature Plan: "Find Leads on LinkedIn" Action

**What it does:** Clicking a company opens a one-click menu — Technical Recruiter / Hiring Manager / People (Colleague) — that redirects to a pre-built LinkedIn People Search for that exact persona, at that exact company, filtered by your target role and location.

**Where it fits:** Same family as the existing Outreach Pitch Studio — this is the step *before* outreach (find the person) rather than the message itself (what to say once found).

---

## 1. How the Search URL Actually Works

LinkedIn's People Search supports boolean queries (`AND` / `OR` / quoted phrases) inside a single `keywords` parameter — no need for LinkedIn's internal, unstable `geoUrn` location IDs. This keeps the feature dependency-free and won't break if LinkedIn changes internal IDs.

```
https://www.linkedin.com/search/results/people/?keywords=<url-encoded boolean query>
```

**Example query built for "Company XYZ", persona = Technical Recruiter, role = .NET Full Stack, location = Noida:**

```
"Company XYZ" AND ("Technical Recruiter" OR "Talent Acquisition" OR "IT Recruiter") AND (".NET" OR "Full Stack") AND ("Noida" OR "Delhi" OR "Gurugaon")
```

This gets URL-encoded and opened in a new tab. No LinkedIn API, no auth, no scraping — it's just a smart deep link, same category as your existing "Apply Link" badges.

### 1.1 The Three Persona Presets

| Persona | Keyword group added to query |
|---|---|
| **Technical Recruiter** | `"Technical Recruiter" OR "IT Recruiter" OR "Talent Acquisition" OR "Talent Acquisition Specialist"` |
| **Hiring Manager** | `"Hiring Manager" OR "Engineering Manager" OR "Team Lead" OR "Delivery Manager"` |
| **People / Colleague** | No persona filter — instead uses your role keywords directly (`".NET Developer" OR "Full Stack Engineer" OR "Software Engineer"`), since the goal here is finding peers already in the target role who could refer you, not gatekeepers |

### 1.2 Location Handling

Your job records already have a `Location` field (from the existing schema). Logic:
1. If the job's location matches one of your target metros → use it, plus 1–2 commonly-clustered nearby metros for wider net (e.g., Noida → also include Delhi, Gurugaon).
2. If location is blank or "Remote" → fall back to your full target-city list from Settings.

```typescript
const METRO_CLUSTERS: Record<string, string[]> = {
  Noida: ['Noida', 'Delhi', 'Gurugaon'],
  Delhi: ['Delhi', 'Noida', 'Gurugaon'],
  Gurugaon: ['Gurugaon', 'Delhi', 'Noida'],
  Bangalore: ['Bangalore', 'Bengaluru'],
  Hyderabad: ['Hyderabad'],
  Pune: ['Pune'],
};
const DEFAULT_CITIES = ['Noida', 'Delhi', 'Gurugaon', 'Bangalore', 'Hyderabad', 'Pune'];
```

---

## 2. Data Model — What's Configurable vs. Fixed

Everything above (persona keyword groups, role keywords, default city list) should be **editable in Settings**, not hardcoded — your target stack keywords might shift over the 100 days (e.g., adding "Azure" once AZ-204 lands), and you may want to tune recruiter title phrasing based on what's actually landing responses.

### 2.1 Extend the `settings` table (from the earlier backend plan)

```sql
ALTER TABLE settings ADD COLUMN lead_search_config JSONB DEFAULT '{
  "personas": {
    "Technical Recruiter": ["Technical Recruiter", "IT Recruiter", "Talent Acquisition", "Talent Acquisition Specialist"],
    "Hiring Manager": ["Hiring Manager", "Engineering Manager", "Team Lead", "Delivery Manager"],
    "People/Colleague": [".NET Developer", "Full Stack Engineer", "Software Engineer"]
  },
  "roleKeywords": [".NET", "Full Stack", "ASP.NET Core"],
  "defaultCities": ["Noida", "Delhi", "Gurugaon", "Bangalore", "Hyderabad", "Pune"]
}'::jsonb;
```

Stored as one JSONB blob (matches the existing pattern used for `contact_links`) — editable via a form in the Settings modal, no migration needed if you tweak the keyword lists later.

### 2.2 Optional: log search activity (`lead_searches` table)

This isn't required for the feature to work, but it plugs directly into the funnel-analytics goal from your original capsule ("which companies respond most," "where is the funnel leaking"):

```sql
CREATE TABLE lead_searches (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    persona TEXT NOT NULL,
    search_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

Later this lets you answer: *"Did I actually search for a recruiter at every company I applied to, or am I skipping this step under time pressure?"* — a real leak-detection signal.

**Recommendation:** build the feature without this table first (V1), add logging in V2 once the core action works and you've used it for a few days.

---

## 3. Backend — Minimal, Optional

This feature is almost entirely client-side URL construction — no LinkedIn API call, no server round-trip needed to *build* the link. The only backend piece is optional:

```csharp
[HttpPost("{id}/lead-search")]
public async Task<IActionResult> LogLeadSearch(int id, [FromBody] LeadSearchDto dto)
{
    _db.LeadSearches.Add(new LeadSearch {
        JobId = id,
        Persona = dto.Persona,
        SearchUrl = dto.SearchUrl,
        CreatedAt = DateTime.UtcNow
    });
    await _db.SaveChangesAsync();
    return Ok();
}
```

```csharp
[HttpGet("settings/lead-search-config")]
public async Task<IActionResult> GetLeadSearchConfig()
{
    var settings = await _db.Settings.FirstOrDefaultAsync();
    return Ok(settings?.LeadSearchConfig);
}
```

Skip both if you want V1 shipped fastest — just hardcode the defaults in the frontend and add Settings-editability later.

---

## 4. Frontend Implementation

### 4.1 URL builder utility

```typescript
// src/utils/linkedinSearch.ts
interface LeadSearchConfig {
  personas: Record<string, string[]>;
  roleKeywords: string[];
  defaultCities: string[];
}

export function buildLinkedInSearchUrl(
  companyName: string,
  persona: keyof LeadSearchConfig['personas'],
  jobLocation: string | null,
  config: LeadSearchConfig
): string {
  const personaTerms = config.personas[persona];
  const cities = getCitiesForLocation(jobLocation, config.defaultCities);

  const parts = [
    `"${companyName}"`,
    `(${personaTerms.map(t => `"${t}"`).join(' OR ')})`,
  ];

  // For recruiter/hiring-manager personas, also require role relevance.
  // For People/Colleague, personaTerms ARE the role keywords already.
  if (persona !== 'People/Colleague') {
    parts.push(`(${config.roleKeywords.map(k => `"${k}"`).join(' OR ')})`);
  }

  parts.push(`(${cities.map(c => `"${c}"`).join(' OR ')})`);

  const query = parts.join(' AND ');
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
}

function getCitiesForLocation(location: string | null, defaultCities: string[]): string[] {
  if (!location) return defaultCities;
  const cluster = METRO_CLUSTERS[location];
  return cluster ?? defaultCities;
}
```

### 4.2 UI component — dropdown action

Fits your existing UI language (glassmorphism status dropdown pattern from the README):

```typescript
// src/components/detail/FindLeadsMenu.tsx
function FindLeadsMenu({ job }: { job: Job }) {
  const { config } = useLeadSearchConfig(); // from Settings, cached
  const [open, setOpen] = useState(false);

  const personas = Object.keys(config.personas);

  return (
    <div className="find-leads-menu">
      <button onClick={() => setOpen(!open)} className="find-leads-trigger">
        🔍 Find Leads
      </button>
      {open && (
        <div className="find-leads-dropdown glass-panel">
          {personas.map(persona => (
            <button
              key={persona}
              onClick={() => {
                const url = buildLinkedInSearchUrl(job.companyName, persona, job.location, config);
                window.open(url, '_blank', 'noopener,noreferrer');
                logLeadSearch(job.id, persona, url); // optional, fire-and-forget
                setOpen(false);
              }}
            >
              {persona}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 4.3 Placement

Two touch points, matching how you already interact with rows:

1. **Row-level quick action** — small icon button in `JobTable.tsx`, next to the existing Apply Link badge. Fast path for the daily speed-apply flow: apply → immediately find the recruiter, no drawer needed.
2. **Job Detail Drawer** — full `FindLeadsMenu` alongside the Outreach Pitch Studio tab, since once you've found the person, the next natural action is drafting the message (which the Pitch Studio already does).

### 4.4 Keyboard shortcut (optional, fits your Raycast-style palette)

Add `L` as a row-focused shortcut → opens the Find Leads dropdown for the currently selected row, consistent with your existing `j`/`k` navigation pattern. Keeps the whole daily workflow keyboard-only: `j`/`k` to move, `Enter` to apply, `L` to find the recruiter, `Esc` to close.

---

## 5. Settings UI Addition

Add a **"Lead Search"** section to the existing Settings modal:

- Editable list per persona (add/remove title variants — e.g., you might add "Recruitment Specialist" or ".NET Recruiter" after seeing what actually works)
- Editable role keywords list
- Editable default city list
- Live preview: type a sample company name, see the generated LinkedIn URL update in real time before saving

This matters because recruiter title phrasing varies by company culture — some use "Talent Acquisition Partner," others "HR Business Partner." Being able to tune this without a code change means you improve it based on real results instead of guessing once and leaving it static.

---

## 6. Testing Checklist

- [ ] Click "Find Leads → Technical Recruiter" on a company with a known location (e.g., Noida) — verify the opened LinkedIn tab's search bar shows the correct boolean query
- [ ] Click "Find Leads → People/Colleague" — verify it returns actual `.NET`/Full Stack engineers at that company, not recruiters
- [ ] Test a job with blank `Location` — verify it falls back to the full default city list, not an empty/broken query
- [ ] Test a company name containing special characters (e.g., "Tech & Co.") — verify URL encoding doesn't break the query
- [ ] Confirm the link opens in a new tab (`noopener,noreferrer`) so your tracker session isn't lost
- [ ] If logging is implemented: confirm `lead_searches` rows are created and don't block/delay the redirect (fire-and-forget, not awaited before `window.open`)

---

## 7. Build Timeline

| Session | Work |
|---|---|
| Evening (45 min) | `buildLinkedInSearchUrl` utility + `METRO_CLUSTERS` map, unit-test the query string output manually against a few real companies |
| Evening (45–60 min) | `FindLeadsMenu` component + row-level icon + drawer placement |
| Evening (30 min) | Wire up default config (hardcoded first — skip Settings/DB for V1) |
| Weekend (30–45 min, optional) | Settings UI for editable persona/role/city lists + backend `lead_search_config` column |
| Weekend (20 min, optional) | `lead_searches` logging table + endpoint, if you want the funnel-analytics data |

**Fastest usable version:** first two sessions only (~90 min total) — hardcoded defaults, no Settings editability, no logging. Ships something you can use in your very next application session. Everything else is a later refinement once you've seen whether the default keyword phrasing actually surfaces the right people.

---

## Next Action

Say the word and I'll write the actual `linkedinSearch.ts` utility and `FindLeadsMenu.tsx` component in full — ready to drop into `frontend/src/utils/` and `frontend/src/components/detail/` respectively.
