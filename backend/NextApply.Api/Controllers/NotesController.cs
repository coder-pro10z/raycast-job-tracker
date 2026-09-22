using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextApply.Api.Data;
using NextApply.Api.Models;

namespace NextApply.Api.Controllers
{
    [ApiController]
    [Route("api/jobs/{jobId}/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NotesController(AppDbContext db)
        {
            _db = db;
        }

        private string GetUserId()
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

            return "user_praveen";
        }

        [HttpGet]
        public async Task<IActionResult> GetNotes(int jobId)
        {
            var userId = GetUserId();
            var notes = await _db.Notes
                .Where(n => n.JobId == jobId && (n.UserId == userId || n.UserId == null))
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
            return Ok(notes);
        }

        [HttpPost]
        public async Task<IActionResult> AddNote(int jobId, [FromBody] Note note)
        {
            var userId = GetUserId();
            var jobExists = await _db.Jobs.AnyAsync(j => j.Id == jobId);
            if (!jobExists) return NotFound("Job not found");

            note.JobId = jobId;
            note.UserId = userId;
            note.CreatedAt = DateTime.UtcNow;
            
            _db.Notes.Add(note);
            await _db.SaveChangesAsync();
            
            return Ok(note);
        }
        
        [HttpDelete("{noteId}")]
        public async Task<IActionResult> DeleteNote(int jobId, int noteId)
        {
            var userId = GetUserId();
            var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == noteId && n.JobId == jobId && (n.UserId == userId || n.UserId == null));
            if (note is null) return NotFound();
            
            _db.Notes.Remove(note);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
