using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextApply.Api.Data;
using NextApply.Api.Models;

namespace NextApply.Api.Controllers
{
    [ApiController]
    [Route("api/jobs/{jobId}/[controller]")]
    public class OutreachController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OutreachController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetOutreachLogs(int jobId)
        {
            var logs = await _db.OutreachTemplatesUsed
                .Where(o => o.JobId == jobId)
                .OrderByDescending(o => o.SentAt)
                .ToListAsync();
            return Ok(logs);
        }

        [HttpPost]
        public async Task<IActionResult> LogOutreach(int jobId, [FromBody] OutreachTemplateUsed log)
        {
            var jobExists = await _db.Jobs.AnyAsync(j => j.Id == jobId);
            if (!jobExists) return NotFound("Job not found");

            log.JobId = jobId;
            log.SentAt = DateTime.UtcNow;
            
            _db.OutreachTemplatesUsed.Add(log);
            await _db.SaveChangesAsync();
            
            return Ok(log);
        }
    }
}
