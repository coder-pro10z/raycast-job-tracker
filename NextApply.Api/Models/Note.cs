using System;

namespace NextApply.Api.Models
{
    public class Note
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public required string Content { get; set; }
        public string? NoteType { get; set; } = "General";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Job? Job { get; set; }
    }
}
