using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextApply.Api.Data;
using NextApply.Api.DTOs;
using NextApply.Api.Models;

namespace NextApply.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public JobsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs([FromQuery] string? status, [FromQuery] string? priority, [FromQuery] string? domain, [FromQuery] string? search)
        {
            var query = _db.Jobs.AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(j => j.ApplicationStatus == status);

            if (!string.IsNullOrEmpty(priority))
                query = query.Where(j => j.Priority == priority);

            if (!string.IsNullOrEmpty(domain))
                query = query.Where(j => j.Domain == domain);

            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(j => j.CompanyName.ToLower().Contains(lowerSearch) || 
                                         (j.TargetRole != null && j.TargetRole.ToLower().Contains(lowerSearch)));
            }

            var jobs = await query.OrderByDescending(j => j.CreatedAt).ToListAsync();
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _db.Jobs
                .Include(j => j.Notes)
                .Include(j => j.OutreachTemplatesUsed)
                .FirstOrDefaultAsync(j => j.Id == id);
                
            if (job is null) return NotFound();
            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            job.CreatedAt = DateTime.UtcNow;
            job.UpdatedAt = DateTime.UtcNow;
            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

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
            if (dto.TargetRole is not null) job.TargetRole = dto.TargetRole;
            if (dto.Location is not null) job.Location = dto.Location;
            if (dto.WorkMode is not null) job.WorkMode = dto.WorkMode;
            if (dto.ApplicationLink is not null) job.ApplicationLink = dto.ApplicationLink;
            if (dto.TechStack is not null) job.TechStack = dto.TechStack;
            if (dto.CareerPageLink is not null) job.CareerPageLink = dto.CareerPageLink;
            if (dto.ReferralNeeded.HasValue) job.ReferralNeeded = dto.ReferralNeeded.Value;
            if (dto.ReferralContactName is not null) job.ReferralContactName = dto.ReferralContactName;
            if (dto.HrRecruiterName is not null) job.HrRecruiterName = dto.HrRecruiterName;

            job.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(job);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job is null) return NotFound();
            
            _db.Jobs.Remove(job);
            await _db.SaveChangesAsync();
            return NoContent();
        }
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

        [HttpGet("check-duplicate")]
        public async Task<IActionResult> CheckDuplicate([FromQuery] string companyName, [FromQuery] string targetRole)
        {
            var exists = await _db.Jobs.AnyAsync(j =>
                j.CompanyName == companyName &&
                j.TargetRole == targetRole &&
                j.ApplicationStatus != "Rejected" &&
                j.ApplicationStatus != "Archived");
                
            return Ok(new { isDuplicate = exists });
        }
    }
}
