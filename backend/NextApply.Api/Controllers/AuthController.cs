using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextApply.Api.Data;
using NextApply.Api.DTOs;
using NextApply.Api.Models;
using NextApply.Api.Services;

namespace NextApply.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.FullName))
            {
                return BadRequest(new { message = "Email, password, and full name are required." });
            }

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var exists = await _db.UserProfiles.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
            if (exists)
            {
                return Conflict(new { message = "An account with this email address already exists." });
            }

            var user = new UserProfile
            {
                Email = normalizedEmail,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                FullName = dto.FullName.Trim(),
                TargetDomain = string.IsNullOrWhiteSpace(dto.TargetDomain) ? "dual" : dto.TargetDomain.Trim(),
                CurrentRole = dto.CurrentRole?.Trim(),
                Yoe = dto.Yoe?.Trim(),
                KeyStrengths = dto.KeyStrengths?.Trim(),
                LinkedinUrl = dto.LinkedinUrl?.Trim(),
                Phone = dto.Phone?.Trim(),
                ResumeSummary = dto.ResumeSummary?.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.UserProfiles.Add(user);
            await _db.SaveChangesAsync();

            var userDto = MapToDto(user);
            return Ok(new AuthResponseDto
            {
                Token = $"token_{user.Id}",
                User = userDto
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var user = await _db.UserProfiles.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (user == null || !PasswordHasher.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var userDto = MapToDto(user);
            return Ok(new AuthResponseDto
            {
                Token = $"token_{user.Id}",
                User = userDto
            });
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not identified." });
            }

            var user = await _db.UserProfiles.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(MapToDto(user));
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not identified." });
            }

            var user = await _db.UserProfiles.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (dto.FullName != null) user.FullName = dto.FullName.Trim();
            if (dto.TargetDomain != null) user.TargetDomain = dto.TargetDomain.Trim();
            if (dto.CurrentRole != null) user.CurrentRole = dto.CurrentRole.Trim();
            if (dto.Yoe != null) user.Yoe = dto.Yoe.Trim();
            if (dto.KeyStrengths != null) user.KeyStrengths = dto.KeyStrengths.Trim();
            if (dto.LinkedinUrl != null) user.LinkedinUrl = dto.LinkedinUrl.Trim();
            if (dto.Phone != null) user.Phone = dto.Phone.Trim();
            if (dto.ResumeSummary != null) user.ResumeSummary = dto.ResumeSummary.Trim();

            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(MapToDto(user));
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.UserProfiles
                .OrderBy(u => u.FullName)
                .Select(u => new PublicUserSummaryDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    TargetDomain = u.TargetDomain,
                    CurrentRole = u.CurrentRole
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("seed-initial-users")]
        public async Task<IActionResult> SeedInitialUsers()
        {
            var seededCount = await SeedUsersAndStatesAsync(_db);
            return Ok(new { message = $"Seeding complete. Seeded/Updated records: {seededCount}" });
        }

        private string? GetCurrentUserId()
        {
            if (Request.Headers.TryGetValue("X-User-Id", out var userIdVal) && !string.IsNullOrWhiteSpace(userIdVal))
            {
                return userIdVal.ToString().Trim();
            }

            if (Request.Headers.TryGetValue("Authorization", out var authVal) && !string.IsNullOrWhiteSpace(authVal))
            {
                var authStr = authVal.ToString().Trim();
                if (authStr.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    var token = authStr.Substring(7).Trim();
                    if (token.StartsWith("token_")) return token.Substring(6);
                    return token;
                }
            }

            return null;
        }

        private static UserProfileDto MapToDto(UserProfile user)
        {
            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                TargetDomain = user.TargetDomain,
                CurrentRole = user.CurrentRole,
                Yoe = user.Yoe,
                KeyStrengths = user.KeyStrengths,
                LinkedinUrl = user.LinkedinUrl,
                Phone = user.Phone,
                ResumeSummary = user.ResumeSummary,
                CreatedAt = user.CreatedAt
            };
        }

        public static async Task<int> SeedUsersAndStatesAsync(AppDbContext db)
        {
            int changes = 0;

            // 1. Seed Praveen Kashyap
            var praveen = await db.UserProfiles.FirstOrDefaultAsync(u => u.Email.ToLower() == "2pkashyap2001@gmail.com");
            if (praveen == null)
            {
                praveen = new UserProfile
                {
                    Id = "user_praveen",
                    Email = "2pkashyap2001@gmail.com",
                    PasswordHash = PasswordHasher.Hash("Password123!"),
                    FullName = "Praveen Kashyap",
                    TargetDomain = "sde",
                    CurrentRole = "Full Stack Engineer / SDE",
                    Yoe = "5+ years",
                    KeyStrengths = "React, TypeScript, C#, .NET Core, Microservices, Cloud Architecture",
                    LinkedinUrl = "https://www.linkedin.com/in/praveen-kashyap-8b8359190/",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.UserProfiles.Add(praveen);
                changes++;
            }

            // 2. Seed Anam Ansari
            var anam = await db.UserProfiles.FirstOrDefaultAsync(u => u.Email.ToLower() == "anamansari.0406@gmail.com");
            if (anam == null)
            {
                anam = new UserProfile
                {
                    Id = "user_anam",
                    Email = "anamansari.0406@gmail.com",
                    PasswordHash = PasswordHasher.Hash("Password123!"),
                    FullName = "Anam Ansari",
                    TargetDomain = "dual",
                    CurrentRole = "Software Engineer",
                    Yoe = "3+ years",
                    KeyStrengths = "Full Stack Development, React, Python, Cloud Infrastructure, Agile",
                    LinkedinUrl = "https://www.linkedin.com/in/anam-ansari",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.UserProfiles.Add(anam);
                changes++;
            }

            await db.SaveChangesAsync();

            // 3. For all existing jobs, duplicate application state for Praveen and Anam
            var jobs = await db.Jobs.ToListAsync();
            var existingPraveenStates = await db.UserJobStates
                .Where(s => s.UserId == praveen.Id)
                .Select(s => s.JobId)
                .ToHashSetAsync();

            var existingAnamStates = await db.UserJobStates
                .Where(s => s.UserId == anam.Id)
                .Select(s => s.JobId)
                .ToHashSetAsync();

            var statesToAdd = new List<UserJobState>();

            foreach (var job in jobs)
            {
                if (!existingPraveenStates.Contains(job.Id))
                {
                    statesToAdd.Add(new UserJobState
                    {
                        UserId = praveen.Id,
                        JobId = job.Id,
                        ApplicationStatus = job.ApplicationStatus ?? "Not Started",
                        Priority = job.Priority ?? "Medium",
                        NextAction = job.NextAction,
                        AppliedDate = job.AppliedDate,
                        FollowUpDate = job.FollowUpDate,
                        ReferralNeeded = job.ReferralNeeded,
                        ReferralContactName = job.ReferralContactName,
                        ReferralContactRole = job.ReferralContactRole,
                        ReferralContactEmail = job.ReferralContactEmail,
                        ReferralContactLinkedIn = job.ReferralContactLinkedIn,
                        UpdatedAt = DateTime.UtcNow
                    });
                }

                if (!existingAnamStates.Contains(job.Id))
                {
                    statesToAdd.Add(new UserJobState
                    {
                        UserId = anam.Id,
                        JobId = job.Id,
                        ApplicationStatus = job.ApplicationStatus ?? "Not Started",
                        Priority = job.Priority ?? "Medium",
                        NextAction = job.NextAction,
                        AppliedDate = job.AppliedDate,
                        FollowUpDate = job.FollowUpDate,
                        ReferralNeeded = job.ReferralNeeded,
                        ReferralContactName = job.ReferralContactName,
                        ReferralContactRole = job.ReferralContactRole,
                        ReferralContactEmail = job.ReferralContactEmail,
                        ReferralContactLinkedIn = job.ReferralContactLinkedIn,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            if (statesToAdd.Count > 0)
            {
                // Add in batches for performance
                const int batchSize = 500;
                for (int i = 0; i < statesToAdd.Count; i += batchSize)
                {
                    var batch = statesToAdd.Skip(i).Take(batchSize);
                    db.UserJobStates.AddRange(batch);
                    await db.SaveChangesAsync();
                }
                changes += statesToAdd.Count;
            }

            return changes;
        }
    }
}
