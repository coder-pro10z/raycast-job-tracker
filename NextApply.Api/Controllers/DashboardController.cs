using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextApply.Api.Data;

namespace NextApply.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DashboardController(AppDbContext db)
        {
            _db = db;
        }

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
    }
}
