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

        [HttpGet]
        public async Task<IActionResult> GetNotes(int jobId)
        {
            var notes = await _db.Notes
                .Where(n => n.JobId == jobId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
            return Ok(notes);
        }

        [HttpPost]
        public async Task<IActionResult> AddNote(int jobId, [FromBody] Note note)
        {
            var jobExists = await _db.Jobs.AnyAsync(j => j.Id == jobId);
            if (!jobExists) return NotFound("Job not found");

            note.JobId = jobId;
            note.CreatedAt = DateTime.UtcNow;
            
            _db.Notes.Add(note);
            await _db.SaveChangesAsync();
            
            return Ok(note);
        }
        
        [HttpDelete("{noteId}")]
        public async Task<IActionResult> DeleteNote(int jobId, int noteId)
        {
            var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == noteId && n.JobId == jobId);
            if (note is null) return NotFound();
            
            _db.Notes.Remove(note);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
