using System;

namespace NextApply.Api.Models
{
    public class UserJobState
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public int JobId { get; set; }
        public string ApplicationStatus { get; set; } = "Not Started";
        public string Priority { get; set; } = "Medium";
        public string? NextAction { get; set; }
        public DateOnly? AppliedDate { get; set; }
        public DateOnly? FollowUpDate { get; set; }
        public bool ReferralNeeded { get; set; } = false;
        public string? ReferralContactName { get; set; }
        public string? ReferralContactRole { get; set; }
        public string? ReferralContactEmail { get; set; }
        public string? ReferralContactLinkedIn { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public UserProfile? User { get; set; }
        public Job? Job { get; set; }
    }
}
