using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace NextApply.Api.Middleware
{
    public class ApiKeyAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _validKey;

        public ApiKeyAuthMiddleware(RequestDelegate next, IConfiguration config)
        {
            _next = next;
            // Provide a fallback for local dev if not configured
            _validKey = config["ApiKey"] ?? "dev-local-key";
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value ?? string.Empty;

            // Allow public auth endpoints, swagger documentation, and CORS preflight options
            if (context.Request.Method == "OPTIONS" || 
                path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) || 
                path.StartsWith("/api/auth", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            // Allow if valid X-Api-Key is passed
            if (context.Request.Headers.TryGetValue("X-Api-Key", out var key) && key == _validKey)
            {
                await _next(context);
                return;
            }

            // Allow if X-User-Id or Authorization header is provided
            if (context.Request.Headers.ContainsKey("X-User-Id") || context.Request.Headers.ContainsKey("Authorization"))
            {
                await _next(context);
                return;
            }

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Unauthorized: Invalid API Key or User Context");
        }
    }
}
