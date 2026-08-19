using System;
using System.Collections.Generic;

namespace NextApply.Api.Models
{
    public class Job
    {
        public int Id { get; set; }
        public required string CompanyName { get; set; }
        public string? TargetRole { get; set; }
        public string? Domain { get; set; }
        public string? Location { get; set; }
        public string? WorkMode { get; set; }
        public string? ApplicationLink { get; set; }
        public string? Priority { get; set; } = "Medium";
        public string? ApplicationStatus { get; set; } = "Not Started";
        public string? NextAction { get; set; }
        public string? TechStack { get; set; }
        public string? CareerPageLink { get; set; }
        public DateOnly? AppliedDate { get; set; }
        public bool ReferralNeeded { get; set; } = false;
        public string? ReferralContactName { get; set; }
        public string? HrRecruiterName { get; set; }
        public string? HrRecruiterEmail { get; set; }
        public string? HrRecruiterLinkedIn { get; set; }
        public string? HrRecruiterPhone { get; set; }
        
        public string? ReferralContactRole { get; set; }
        public string? ReferralContactEmail { get; set; }
        public string? ReferralContactLinkedIn { get; set; }
        
        public DateOnly? FollowUpDate { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public List<Note> Notes { get; set; } = new();
        public List<OutreachTemplateUsed> OutreachTemplatesUsed { get; set; } = new();

        public int? ClonedFromJobId { get; set; }
        public Job? ClonedFromJob { get; set; }
    }
}
