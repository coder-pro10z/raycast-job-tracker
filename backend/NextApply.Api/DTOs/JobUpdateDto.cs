using System;

namespace NextApply.Api.DTOs
{
    public class JobUpdateDto
    {
        public string? ApplicationStatus { get; set; }
        public string? Priority { get; set; }
        public string? NextAction { get; set; }
        public string? Domain { get; set; }
        
        // Allowed for updating notes inline, etc.
        public string? TargetRole { get; set; }
        public string? Location { get; set; }
        public string? WorkMode { get; set; }
        public string? ApplicationLink { get; set; }
        public string? TechStack { get; set; }
        public string? CareerPageLink { get; set; }
        public bool? ReferralNeeded { get; set; }
        public string? ReferralContactName { get; set; }
        public string? HrRecruiterName { get; set; }
    }
}
