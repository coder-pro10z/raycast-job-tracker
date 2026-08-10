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
            // Simple check: looking for the 'X-Api-Key' header
            if (!context.Request.Headers.TryGetValue("X-Api-Key", out var key) || key != _validKey)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Unauthorized: Invalid API Key");
                return;
            }
            await _next(context);
        }
    }
}
