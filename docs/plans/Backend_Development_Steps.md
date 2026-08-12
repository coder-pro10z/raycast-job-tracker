# NextApply Backend Development Steps

This document tracks the exact steps executed to migrate the application from a zero-backend local Excel SPA to a full-stack ASP.NET Core API architecture.

## Phase 1: API Initialization & Scaffolding (Completed)

The foundation of the C# `.NET 9.0` backend has been scaffolded and successfully compiled.

### 1. Project Creation
- Initialized a new ASP.NET Core Web API project: `NextApply.Api`.
- Installed Entity Framework Core packages (Version `9.0.4` to match the local SDK):
  - `Npgsql.EntityFrameworkCore.PostgreSQL`
  - `Microsoft.EntityFrameworkCore.Design`

### 2. Database Models (Entity Framework)
Created C# models mapped explicitly to the planned PostgreSQL Schema:
- **`Job.cs`**: Handles core application logic (status, priority, applied date, etc.)
- **`Note.cs`**: One-to-many relationship tracking manual JD pastes and text notes.
- **`OutreachTemplateUsed.cs`**: One-to-many relationship logging cold outreach activity.
- **`Settings.cs`**: Cloud configuration for user preferences (Theme, active track).

### 3. DbContext Configuration
- Configured `AppDbContext.cs` mapping models to their specific tables (`jobs`, `notes`, `settings`, `outreach_templates_used`).
- Added column mapping and primary/foreign key relationships using FluentAPI.

### 4. REST Controllers
Built the core routing logic for the frontend:
- `JobsController.cs`: CRUD endpoints, `PATCH` for partial updates (marking as 'Applied').
- `NotesController.cs` & `OutreachController.cs`: Sub-entity tracking.
- `DashboardController.cs`: Aggregation endpoints to fetch "next-batch" tasks and weekly conversion metrics.
- `SettingsController.cs`: Fetches and updates global configurations.

### 5. API Security & Setup
- Built a lightweight `ApiKeyAuthMiddleware.cs` for fast local development without complex OAuth overhead.
- Wired up the CORS policy in `Program.cs` to explicitly trust the Vite frontend (`localhost:5173`) and the Vercel production URL.
- Configured the mock PostgreSQL connection string in `appsettings.json`.

---

## Phase 2: Data Migration (Pending)
*This phase will begin once a live PostgreSQL database (e.g., Supabase) is provisioned.*

- Connect the `appsettings.json` to the live database.
- Execute EF Core Migrations to generate the tables.
- Run a Python migration script to safely transfer all data from the unified `Master_Job_Tracker.xlsx` into the PostgreSQL `jobs` table, strictly normalizing the priorities and formatting.
