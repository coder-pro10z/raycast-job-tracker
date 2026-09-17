namespace NextApply.Api.DTOs;

/// <summary>
/// Payload sent by the Gmail JD Automator sidecar after processing a Gmail draft.
/// Creates or logs a Job record in NextApply so the outreach is tracked centrally.
/// </summary>
/// <param name="GmailDraftId">The Gmail draft ID of the source draft (used as idempotency key).</param>
/// <param name="RecipientEmail">The email address from the draft's To: header.</param>
/// <param name="GeneratedSubject">The Claude-generated subject line for the outreach email.</param>
/// <param name="GeneratedBodyPreview">First 300 characters of the generated email body.</param>
/// <param name="Status">Automator run status: "DRAFT CREATED" | "SENT" | "SKIPPED".</param>
/// <param name="RawJdText">Raw extracted JD text (plain + OCR), up to 2000 chars, used for company name parsing.</param>
public record JobApplicationImportDto(
    string GmailDraftId,
    string RecipientEmail,
    string GeneratedSubject,
    string GeneratedBodyPreview,
    string Status,
    string RawJdText
);
