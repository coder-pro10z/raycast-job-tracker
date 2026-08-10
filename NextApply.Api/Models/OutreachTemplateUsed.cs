using System;

namespace NextApply.Api.Models
{
    public class OutreachTemplateUsed
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public required string TemplateName { get; set; }
        public string? Channel { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public string? RecipientName { get; set; }

        // Navigation property
        public Job? Job { get; set; }
    }
}
