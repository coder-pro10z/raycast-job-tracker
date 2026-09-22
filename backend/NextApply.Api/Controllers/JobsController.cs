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

        private string? GetUserId()
        {
            if (Request.Headers.TryGetValue("X-User-Id", out var userIdVal) && !string.IsNullOrWhiteSpace(userIdVal))
            {
                var id = userIdVal.ToString().Trim();
                if (!string.Equals(id, "guest", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(id))
                    return id;
            }

            if (Request.Headers.TryGetValue("Authorization", out var authVal) && !string.IsNullOrWhiteSpace(authVal))
            {
                var authStr = authVal.ToString().Trim();
                if (authStr.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    var token = authStr.Substring(7).Trim();
                    if (token.StartsWith("token_")) token = token.Substring(6);
                    if (!string.IsNullOrEmpty(token) && !string.Equals(token, "guest", StringComparison.OrdinalIgnoreCase))
                        return token;
                }
            }

            // For guests / new users without login: return null so all jobs show 0 application statuses
            return null;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs([FromQuery] string? status, [FromQuery] string? priority, [FromQuery] string? domain, [FromQuery] string? search)
        {
            var userId = GetUserId();
            var query = _db.Jobs.AsQueryable();

            if (!string.IsNullOrEmpty(domain))
                query = query.Where(j => j.Domain == domain);

            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(j => j.CompanyName.ToLower().Contains(lowerSearch) || 
                                         (j.TargetRole != null && j.TargetRole.ToLower().Contains(lowerSearch)));
            }

            var jobs = await query
                .Include(j => j.Notes)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            // Fetch user-specific job states for the active user if authenticated
            Dictionary<int, UserJobState> userStates = new();
            if (!string.IsNullOrEmpty(userId))
            {
                userStates = await _db.UserJobStates
                    .Where(s => s.UserId == userId)
                    .ToDictionaryAsync(s => s.JobId);
            }

            var filtered = new List<Job>(jobs.Count);

            foreach (var job in jobs)
            {
                if (userStates.TryGetValue(job.Id, out var state))
                {
                    job.ApplicationStatus = state.ApplicationStatus;
                    job.Priority = state.Priority;
                    job.NextAction = state.NextAction;
                    job.AppliedDate = state.AppliedDate;
                    job.FollowUpDate = state.FollowUpDate;
                    job.ReferralNeeded = state.ReferralNeeded;
                    job.ReferralContactName = state.ReferralContactName;
                    job.ReferralContactRole = state.ReferralContactRole;
                    job.ReferralContactEmail = state.ReferralContactEmail;
                    job.ReferralContactLinkedIn = state.ReferralContactLinkedIn;
                }
                else
                {
                    // If a user hasn't touched this job yet, defaults to fresh untracked state
                    job.ApplicationStatus = "Not Started";
                    job.Priority = "Medium";
                    job.NextAction = null;
                    job.AppliedDate = null;
                    job.FollowUpDate = null;
                    job.ReferralNeeded = false;
                    job.ReferralContactName = null;
                    job.ReferralContactRole = null;
                    job.ReferralContactEmail = null;
                    job.ReferralContactLinkedIn = null;
                }

                // Filter notes to current user or legacy public notes
                job.Notes = job.Notes.Where(n => n.UserId == userId || n.UserId == null).ToList();

                // Apply user-state filters
                if (!string.IsNullOrEmpty(status) && job.ApplicationStatus != status)
                    continue;

                if (!string.IsNullOrEmpty(priority) && job.Priority != priority)
                    continue;

                filtered.Add(job);
            }

            return Ok(filtered);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var userId = GetUserId();
            var job = await _db.Jobs
                .Include(j => j.Notes)
                .Include(j => j.OutreachTemplatesUsed)
                .FirstOrDefaultAsync(j => j.Id == id);
                
            if (job is null) return NotFound();

            UserJobState? state = null;
            if (!string.IsNullOrEmpty(userId))
            {
                state = await _db.UserJobStates.FirstOrDefaultAsync(s => s.UserId == userId && s.JobId == id);
            }
            if (state != null)
            {
                job.ApplicationStatus = state.ApplicationStatus;
                job.Priority = state.Priority;
                job.NextAction = state.NextAction;
                job.AppliedDate = state.AppliedDate;
                job.FollowUpDate = state.FollowUpDate;
                job.ReferralNeeded = state.ReferralNeeded;
                job.ReferralContactName = state.ReferralContactName;
                job.ReferralContactRole = state.ReferralContactRole;
                job.ReferralContactEmail = state.ReferralContactEmail;
                job.ReferralContactLinkedIn = state.ReferralContactLinkedIn;
            }
            else
            {
                job.ApplicationStatus = "Not Started";
                job.Priority = "Medium";
                job.NextAction = null;
                job.AppliedDate = null;
                job.FollowUpDate = null;
                job.ReferralNeeded = false;
                job.ReferralContactName = null;
                job.ReferralContactRole = null;
                job.ReferralContactEmail = null;
                job.ReferralContactLinkedIn = null;
            }

            job.Notes = job.Notes.Where(n => n.UserId == userId || n.UserId == null).ToList();
            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            var userId = GetUserId();
            var initialStatus = job.ApplicationStatus ?? "Not Started";
            var initialPriority = job.Priority ?? "Medium";
            var initialNextAction = job.NextAction;
            var initialAppliedDate = job.AppliedDate;
            var initialFollowUpDate = job.FollowUpDate;
            var initialReferralNeeded = job.ReferralNeeded;
            var initialRefName = job.ReferralContactName;
            var initialRefRole = job.ReferralContactRole;
            var initialRefEmail = job.ReferralContactEmail;
            var initialRefLinkedIn = job.ReferralContactLinkedIn;

            job.CreatedAt = DateTime.UtcNow;
            job.UpdatedAt = DateTime.UtcNow;
            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();

            // Store creator's personal job state
            var state = new UserJobState
            {
                UserId = userId,
                JobId = job.Id,
                ApplicationStatus = initialStatus,
                Priority = initialPriority,
                NextAction = initialNextAction,
                AppliedDate = initialAppliedDate,
                FollowUpDate = initialFollowUpDate,
                ReferralNeeded = initialReferralNeeded,
                ReferralContactName = initialRefName,
                ReferralContactRole = initialRefRole,
                ReferralContactEmail = initialRefEmail,
                ReferralContactLinkedIn = initialRefLinkedIn,
                UpdatedAt = DateTime.UtcNow
            };
            _db.UserJobStates.Add(state);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] JobUpdateDto dto)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Please sign in or create a profile to update application status." });
            }

            var job = await _db.Jobs.Include(j => j.Notes).FirstOrDefaultAsync(j => j.Id == id);
            if (job is null) return NotFound();

            // 1. Central Catalog Updates (Shared across all users)
            if (dto.Domain is not null) job.Domain = dto.Domain;
            if (dto.TargetRole is not null) job.TargetRole = dto.TargetRole;
            if (dto.Location is not null) job.Location = dto.Location;
            if (dto.WorkMode is not null) job.WorkMode = dto.WorkMode;
            if (dto.ApplicationLink is not null) job.ApplicationLink = dto.ApplicationLink;
            if (dto.TechStack is not null) job.TechStack = dto.TechStack;
            if (dto.CareerPageLink is not null) job.CareerPageLink = dto.CareerPageLink;
            if (dto.HrRecruiterName is not null) job.HrRecruiterName = dto.HrRecruiterName;
            if (dto.HrRecruiterEmail is not null) job.HrRecruiterEmail = dto.HrRecruiterEmail;
            if (dto.HrRecruiterLinkedIn is not null) job.HrRecruiterLinkedIn = dto.HrRecruiterLinkedIn;
            if (dto.HrRecruiterPhone is not null) job.HrRecruiterPhone = dto.HrRecruiterPhone;
            if (dto.AutomatorStatus is not null) job.AutomatorStatus = dto.AutomatorStatus;
            if (dto.GmailDraftId is not null) job.GmailDraftId = dto.GmailDraftId;
            if (dto.OutreachSubject is not null) job.OutreachSubject = dto.OutreachSubject;
            if (dto.OutreachBodyPreview is not null) job.OutreachBodyPreview = dto.OutreachBodyPreview;

            job.UpdatedAt = DateTime.UtcNow;

            // 2. Personal Application State Updates (Isolated to active user)
            var state = await _db.UserJobStates.FirstOrDefaultAsync(s => s.UserId == userId && s.JobId == id);
            if (state == null)
            {
                state = new UserJobState
                {
                    UserId = userId,
                    JobId = id,
                    ApplicationStatus = job.ApplicationStatus ?? "Not Started",
                    Priority = job.Priority ?? "Medium",
                    UpdatedAt = DateTime.UtcNow
                };
                _db.UserJobStates.Add(state);
            }

            if (dto.ApplicationStatus is not null)
            {
                state.ApplicationStatus = dto.ApplicationStatus;
                if (dto.ApplicationStatus == "Applied" && state.AppliedDate is null)
                    state.AppliedDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }
            if (dto.Priority is not null) state.Priority = dto.Priority;
            if (dto.NextAction is not null) state.NextAction = dto.NextAction;
            if (dto.ReferralNeeded.HasValue) state.ReferralNeeded = dto.ReferralNeeded.Value;
            if (dto.ReferralContactName is not null) state.ReferralContactName = dto.ReferralContactName;
            if (dto.ReferralContactRole is not null) state.ReferralContactRole = dto.ReferralContactRole;
            if (dto.ReferralContactEmail is not null) state.ReferralContactEmail = dto.ReferralContactEmail;
            if (dto.ReferralContactLinkedIn is not null) state.ReferralContactLinkedIn = dto.ReferralContactLinkedIn;
            if (dto.FollowUpDate.HasValue) state.FollowUpDate = dto.FollowUpDate;
            if (dto.AppliedDate.HasValue) state.AppliedDate = dto.AppliedDate;
            state.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            // Project current user's state onto the returned job
            job.ApplicationStatus = state.ApplicationStatus;
            job.Priority = state.Priority;
            job.NextAction = state.NextAction;
            job.AppliedDate = state.AppliedDate;
            job.FollowUpDate = state.FollowUpDate;
            job.ReferralNeeded = state.ReferralNeeded;
            job.ReferralContactName = state.ReferralContactName;
            job.ReferralContactRole = state.ReferralContactRole;
            job.ReferralContactEmail = state.ReferralContactEmail;
            job.ReferralContactLinkedIn = state.ReferralContactLinkedIn;
            job.Notes = job.Notes.Where(n => n.UserId == userId || n.UserId == null).ToList();

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
            var userId = GetUserId();
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

            var state = new UserJobState
            {
                UserId = userId,
                JobId = clone.Id,
                ApplicationStatus = "Not Started",
                Priority = "Medium",
                NextAction = "Apply and send outreach",
                UpdatedAt = DateTime.UtcNow
            };
            _db.UserJobStates.Add(state);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = clone.Id }, clone);
        }

        [HttpGet("check-duplicate")]
        public async Task<IActionResult> CheckDuplicate([FromQuery] string companyName, [FromQuery] string targetRole, [FromQuery] int? excludeJobId = null)
        {
            var userId = GetUserId();
            var query = _db.Jobs.Where(j =>
                j.CompanyName.ToLower() == companyName.ToLower() &&
                (j.TargetRole != null && j.TargetRole.ToLower() == targetRole.ToLower()) &&
                (!excludeJobId.HasValue || j.Id != excludeJobId.Value));

            var candidateJobIds = await query.Select(j => j.Id).ToListAsync();
            if (candidateJobIds.Count == 0)
            {
                return Ok(new { isDuplicate = false });
            }

            var states = await _db.UserJobStates
                .Where(s => s.UserId == userId && candidateJobIds.Contains(s.JobId))
                .ToListAsync();

            bool isDuplicate = candidateJobIds.Any(jobId =>
            {
                var s = states.FirstOrDefault(st => st.JobId == jobId);
                var st = s?.ApplicationStatus ?? "Not Started";
                return st != "Rejected" && st != "Archived";
            });

            return Ok(new { isDuplicate });
        }
    }
}
