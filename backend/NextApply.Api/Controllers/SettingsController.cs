using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextApply.Api.Data;
using NextApply.Api.Models;

namespace NextApply.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SettingsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _db.Settings.FirstOrDefaultAsync();
            if (settings is null)
            {
                // Return default settings if none exist
                settings = new Settings { Id = 1 };
                _db.Settings.Add(settings);
                await _db.SaveChangesAsync();
            }
            return Ok(settings);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSettings([FromBody] Settings updatedSettings)
        {
            var settings = await _db.Settings.FirstOrDefaultAsync();
            if (settings is null)
            {
                updatedSettings.UpdatedAt = DateTime.UtcNow;
                _db.Settings.Add(updatedSettings);
                await _db.SaveChangesAsync();
                return Ok(updatedSettings);
            }

            settings.FullName = updatedSettings.FullName;
            settings.ExperienceSummary = updatedSettings.ExperienceSummary;
            settings.KeyStrengths = updatedSettings.KeyStrengths;
            settings.ContactLinks = updatedSettings.ContactLinks;
            settings.Theme = updatedSettings.Theme;
            settings.ActiveTrack = updatedSettings.ActiveTrack;
            settings.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(settings);
        }
    }
}
