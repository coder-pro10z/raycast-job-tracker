# NextApply.Api

ASP.NET Core Web API backend for the Job-Tracker workspace.

## Stack
ASP.NET Core 9.0, EF Core (Npgsql), PostgreSQL (Supabase)

## Local Setup
1. `dotnet restore`
2. Set connection string in `appsettings.json` or via `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."`
3. Set your local API key in `appsettings.json` or via `dotnet user-secrets set "ApiKey" "..."` (Defaults to `dev-local-key`)
4. `dotnet run`

## Endpoints
See [../../docs/NextApply_Backend_Migration_Plan.md](../../docs/NextApply_Backend_Migration_Plan.md) for the detailed API reference.
