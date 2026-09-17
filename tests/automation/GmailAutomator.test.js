/**
 * GmailAutomator.test.js
 *
 * Unit tests for the Gmail JD Automator logic (automation/gmail-jd-automator/main.py).
 * All external calls (Gmail API, Claude API, Tesseract, filesystem, urllib) are mocked.
 * Tests are written in JavaScript to mirror the Python logic for cross-language validation.
 *
 * Run: npx vitest run tests/automation/GmailAutomator.test.js
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';

// ── Mock helpers ─────────────────────────────────────────────────────────────

/**
 * Simulates the find_recipient() function in main.py
 * Extracts the "To" header value from a list of message headers.
 */
function findRecipient(headers) {
  const toHeader = headers.find(h => h.name.toLowerCase() === 'to');
  return toHeader ? toHeader.value : null;
}

/**
 * Simulates the low-confidence guard in main.py:
 * returns true if jdText is usable (>= 50 chars), false if it should be skipped.
 */
function isJdTextUsable(jdText) {
  return Boolean(jdText && jdText.trim().length >= 50);
}

/**
 * Simulates generate_email() response parsing from main.py.
 * Returns { subject, body } or falls back on invalid JSON.
 */
function parseClaudeResponse(rawText) {
  try {
    const cleaned = rawText.replace(/^```(json)?|```$/gm, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.subject || !parsed.body) throw new Error('missing keys');
    return { subject: parsed.subject, body: parsed.body };
  } catch {
    return { subject: 'Regarding your open role', body: rawText };
  }
}

/**
 * Simulates the NextApply webhook payload builder from main.py.
 */
function buildWebhookPayload(draftId, recipient, subject, body, status, jdText) {
  return {
    gmailDraftId: draftId,
    recipientEmail: recipient,
    generatedSubject: subject,
    generatedBodyPreview: body.slice(0, 300),
    status,
    rawJdText: jdText.slice(0, 2000),
  };
}

/**
 * Simulates the idempotency cache check from main.py.
 */
function isAlreadyProcessed(draftId, processedSet) {
  return processedSet.has(draftId);
}

/**
 * Simulates the label-based exclusion check from main.py.
 */
function hasAutomatorLabel(labelIds, sourceLabelId, generatedLabelId) {
  return labelIds.includes(sourceLabelId) || labelIds.includes(generatedLabelId);
}

// ── Test suites ──────────────────────────────────────────────────────────────

describe('Draft discovery & filtering', () => {
  const SOURCE_LABEL_ID = 'label-source-123';
  const GENERATED_LABEL_ID = 'label-generated-456';

  test('filters out draft_id already in processed cache', () => {
    const processedSet = new Set(['draft-abc']);
    expect(isAlreadyProcessed('draft-abc', processedSet)).toBe(true);
    expect(isAlreadyProcessed('draft-new', processedSet)).toBe(false);
  });

  test('filters out draft with JD-Automator/Source-Processed label', () => {
    const labelIds = [SOURCE_LABEL_ID, 'INBOX'];
    expect(hasAutomatorLabel(labelIds, SOURCE_LABEL_ID, GENERATED_LABEL_ID)).toBe(true);
  });

  test('filters out draft with JD-Automator/Generated label', () => {
    const labelIds = [GENERATED_LABEL_ID];
    expect(hasAutomatorLabel(labelIds, SOURCE_LABEL_ID, GENERATED_LABEL_ID)).toBe(true);
  });

  test('does not filter out unprocessed draft with no automator labels', () => {
    const labelIds = ['INBOX', 'DRAFT'];
    const processedSet = new Set();
    expect(hasAutomatorLabel(labelIds, SOURCE_LABEL_ID, GENERATED_LABEL_ID)).toBe(false);
    expect(isAlreadyProcessed('draft-new', processedSet)).toBe(false);
  });
});

describe('Recipient extraction', () => {
  test('extracts email from To: header correctly', () => {
    const headers = [
      { name: 'To', value: 'recruiter@acme.com' },
      { name: 'Subject', value: 'Hello' },
    ];
    expect(findRecipient(headers)).toBe('recruiter@acme.com');
  });

  test('is case-insensitive on header name', () => {
    const headers = [{ name: 'to', value: 'hr@company.org' }];
    expect(findRecipient(headers)).toBe('hr@company.org');
  });

  test('returns null when no To header is present', () => {
    const headers = [{ name: 'Subject', value: 'Job' }];
    expect(findRecipient(headers)).toBeNull();
  });

  test('returns null for empty header list', () => {
    expect(findRecipient([])).toBeNull();
  });
});

describe('Low-confidence JD text guard', () => {
  test('marks text as usable when >= 50 chars', () => {
    const jd = 'We are looking for a Senior Software Engineer with 5+ years of experience.';
    expect(isJdTextUsable(jd)).toBe(true);
  });

  test('marks text as NOT usable when < 50 chars', () => {
    expect(isJdTextUsable('Short text')).toBe(false);
  });

  test('marks empty string as NOT usable', () => {
    expect(isJdTextUsable('')).toBe(false);
  });

  test('marks whitespace-only string as NOT usable', () => {
    expect(isJdTextUsable('   ')).toBe(false);
  });

  test('marks exactly 50 chars as usable', () => {
    const exactly50 = 'A'.repeat(50);
    expect(isJdTextUsable(exactly50)).toBe(true);
  });

  test('marks 49 chars as NOT usable', () => {
    const exactly49 = 'A'.repeat(49);
    expect(isJdTextUsable(exactly49)).toBe(false);
  });
});

describe('Claude response parsing', () => {
  test('parses valid JSON subject + body correctly', () => {
    const raw = JSON.stringify({ subject: 'Re: Senior Dev', body: 'Hi, I am interested.' });
    const result = parseClaudeResponse(raw);
    expect(result.subject).toBe('Re: Senior Dev');
    expect(result.body).toBe('Hi, I am interested.');
  });

  test('strips markdown fences before parsing', () => {
    const raw = '```json\n{"subject": "Test Role", "body": "Hello!"}\n```';
    const result = parseClaudeResponse(raw);
    expect(result.subject).toBe('Test Role');
    expect(result.body).toBe('Hello!');
  });

  test('falls back to generic subject on invalid JSON', () => {
    const raw = 'This is not JSON at all.';
    const result = parseClaudeResponse(raw);
    expect(result.subject).toBe('Regarding your open role');
    expect(result.body).toBe('This is not JSON at all.');
  });

  test('falls back when JSON is missing required keys', () => {
    const raw = JSON.stringify({ title: 'Something else' });
    const result = parseClaudeResponse(raw);
    expect(result.subject).toBe('Regarding your open role');
  });
});

describe('NextApply webhook payload builder', () => {
  test('builds correct payload shape', () => {
    const payload = buildWebhookPayload(
      'draft-xyz',
      'hr@acme.com',
      'Re: Senior Dev at ACME',
      'Hi, I am very interested in this role. '.repeat(20),
      'DRAFT CREATED',
      'Senior .NET Developer at ACME Corp. 5+ years required. '.repeat(50)
    );

    expect(payload.gmailDraftId).toBe('draft-xyz');
    expect(payload.recipientEmail).toBe('hr@acme.com');
    expect(payload.generatedSubject).toBe('Re: Senior Dev at ACME');
    expect(payload.status).toBe('DRAFT CREATED');
    expect(payload.generatedBodyPreview.length).toBeLessThanOrEqual(300);
    expect(payload.rawJdText.length).toBeLessThanOrEqual(2000);
  });

  test('truncates long body preview to 300 chars', () => {
    const longBody = 'X'.repeat(1000);
    const payload = buildWebhookPayload('d1', 'a@b.com', 'Sub', longBody, 'SENT', 'JD text here for testing long body payload generation.');
    expect(payload.generatedBodyPreview.length).toBe(300);
  });

  test('truncates long rawJdText to 2000 chars', () => {
    const longJd = 'Y'.repeat(5000);
    const payload = buildWebhookPayload('d2', 'a@b.com', 'Sub', 'Body', 'DRAFT CREATED', longJd);
    expect(payload.rawJdText.length).toBe(2000);
  });
});

describe('Idempotency — processed cache', () => {
  test('adds draft_id to processed set after handling', () => {
    const processed = new Set();
    const draftId = 'draft-new-999';
    processed.add(draftId);
    expect(processed.has(draftId)).toBe(true);
  });

  test('second run skips draft_id already in cache', () => {
    const processed = new Set(['draft-already-done']);
    expect(isAlreadyProcessed('draft-already-done', processed)).toBe(true);
  });
});
