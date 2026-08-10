using System;
using System.Text.Json;

namespace NextApply.Api.Models
{
    public class Settings
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? ExperienceSummary { get; set; }
        public string? KeyStrengths { get; set; }
        
        // Use JsonElement for JSONB columns mapping in EF Core, or map as a string
        public JsonElement? ContactLinks { get; set; }
        
        public string? Theme { get; set; } = "dark";
        public string? ActiveTrack { get; set; } = "Dual Domain";
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
