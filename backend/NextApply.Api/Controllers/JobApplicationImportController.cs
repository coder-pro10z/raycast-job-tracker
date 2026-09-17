using Microsoft.AspNetCore.Mvc;
using NextApply.Api.Data;
using NextApply.Api.DTOs;
using NextApply.Api.Models;
using System.Text.RegularExpressions;

namespace NextApply.Api.Controllers;

/// <summary>
/// Receives webhook payloads from the Gmail JD Automator Python sidecar.
/// Each successful payload creates a new Job record in NextApply so outreach
/// is tracked alongside manually-entered applications.
///
/// POST /api/jobs/import-from-automator
/// Header: X-Api-Key (required — same key used by the frontend)
/// </summary>
[ApiController]
[Route("api/jobs")]
public class JobApplicationImportController : ControllerBase
{
    private readonly AppDbContext _db;

    public JobApplicationImportController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Import a single job record from the Gmail JD Automator.
    /// Idempotent: if a Job with the same GmailDraftId already exists, returns 200 (no duplicate created).
    /// </summary>
    [HttpPost("import-from-automator")]
    public async Task<IActionResult> ImportFromAutomator([FromBody] JobApplicationImportDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.GmailDraftId))
            return BadRequest(new { error = "GmailDraftId is required." });

        // Idempotency: do not create a duplicate if this draft was already imported
        var existing = _db.Jobs.FirstOrDefault(j => j.GmailDraftId == dto.GmailDraftId);
        if (existing is not null)
            return Ok(existing);

        // Extract company name heuristically from the JD text and subject line
        var companyName = ExtractCompanyName(dto.RawJdText, dto.GeneratedSubject)
                          ?? "Unknown (from automator)";

        // Normalize automator status to a friendly display value
        var automatorStatus = dto.Status switch
        {
            "DRAFT CREATED" => "Draft Created",
            "SENT"          => "Sent",
            "SKIPPED"       => "Skipped",
            _               => dto.Status
        };

        var job = new Job
        {
            CompanyName          = companyName,
            ApplicationStatus    = "Not Started",
            Priority             = "Medium",
            NextAction           = "Review outreach draft in Gmail",
            GmailDraftId         = dto.GmailDraftId,
            AutomatorStatus      = automatorStatus,
            OutreachSubject      = dto.GeneratedSubject,
            OutreachBodyPreview  = dto.GeneratedBodyPreview,
            HrRecruiterName      = ExtractNameFromEmail(dto.RecipientEmail),
            CreatedAt            = DateTime.UtcNow,
        };

        _db.Jobs.Add(job);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(ImportFromAutomator), new { id = job.Id }, job);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /// <summary>
    /// Tries to extract a company name from the JD text or generated subject.
    /// Looks for common patterns: "at CompanyName", "– CompanyName", "Company: X".
    /// </summary>
    private static string? ExtractCompanyName(string jdText, string subject)
    {
        // Check subject first: "Re: Role Title – CompanyName" or "Role at CompanyName"
        var subjectMatch = Regex.Match(subject,
            @"(?:–\s*|at\s+)([A-Z][A-Za-z0-9\s&.,'-]{2,40}?)(?:\s*$|\s*[,|])",
            RegexOptions.IgnoreCase);
        if (subjectMatch.Success)
            return subjectMatch.Groups[1].Value.Trim();

        // Check JD text: "Company: X" or "at CompanyName" patterns
        var jdMatch = Regex.Match(jdText,
            @"(?:Company[:\s]+|at\s+)([A-Z][A-Za-z0-9\s&.,'-]{2,40}?)(?:\n|\.|\s{2,})",
            RegexOptions.IgnoreCase);
        if (jdMatch.Success)
            return jdMatch.Groups[1].Value.Trim();

        return null;
    }

    /// <summary>
    /// Extracts a readable name from an email address for the HrRecruiterName field.
    /// e.g. "john.doe@acme.com" -> "john.doe" (best-effort; user can edit in UI).
    /// </summary>
    private static string? ExtractNameFromEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return null;
        var local = email.Split('@').First();
        return string.IsNullOrWhiteSpace(local) ? null : local;
    }
}
