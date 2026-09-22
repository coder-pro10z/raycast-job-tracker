using System;

namespace NextApply.Api.Models
{
    public class UserProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string FullName { get; set; }
        public string TargetDomain { get; set; } = "dual"; // "sde", "cloud", "dual"
        public string? CurrentRole { get; set; }
        public string? Yoe { get; set; }
        public string? KeyStrengths { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? Phone { get; set; }
        public string? ResumeSummary { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
