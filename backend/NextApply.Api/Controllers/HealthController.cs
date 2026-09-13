using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextApply.Api.Data;

namespace NextApply.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public HealthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealth()
        {
            try
            {
                // Simple fast query to check connectivity (avoids deep EF materialization)
                var canConnect = await _db.Database.CanConnectAsync();

                if (canConnect)
                {
                    return Ok(new
                    {
                        status = "online",
                        database = "connected",
                        timestamp = DateTime.UtcNow
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = "degraded",
                        database = "disconnected",
                        message = "Could not connect to the database.",
                        timestamp = DateTime.UtcNow
                    });
                }
            }
            catch (Exception ex)
            {
                // Returning 200 OK avoids 500 error stripping CORS headers on the frontend
                return Ok(new
                {
                    status = "degraded",
                    database = "disconnected",
                    message = "Database connection failed. It may be paused due to inactivity.",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
}
