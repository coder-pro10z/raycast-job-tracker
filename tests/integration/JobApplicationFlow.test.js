/**
 * JobApplicationFlow.test.js
 *
 * End-to-end integration tests for the Gmail JD Automator → NextApply pipeline.
 *
 * Tests the full flow:
 *   1. Automator webhook payload → POST /api/jobs/import-from-automator
 *   2. Imported job appears in GET /api/jobs
 *   3. PATCH /api/jobs/{id} updates applicationStatus to "Applied"
 *
 * Assumes a running local backend at http://localhost:5089 with API key "dev-local-key".
 * To run against a real backend: ensure `dotnet run` is active in backend/.
 *
 * Run: npx vitest run tests/integration/JobApplicationFlow.test.js
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = process.env.NEXTAPPLY_API_URL ?? 'http://localhost:5089';
const API_KEY = process.env.NEXTAPPLY_API_KEY ?? 'dev-local-key';

const headers = {
  'Content-Type': 'application/json',
  'X-Api-Key': API_KEY,
};

// Unique draft ID per test run to avoid cross-run collisions
const TEST_DRAFT_ID = `test-draft-${Date.now()}`;

let importedJobId = null;

// ── Test helpers ──────────────────────────────────────────────────────────────

async function importJob(overrides = {}) {
  const payload = {
    gmailDraftId: TEST_DRAFT_ID,
    recipientEmail: 'recruiter@acme-test.com',
    generatedSubject: 'Re: Senior .NET Developer – ACME Corp (Integration Test)',
    generatedBodyPreview: 'Hi, I came across the role at ACME Corp and I am very interested. My 5 years of .NET experience aligns well.',
    status: 'DRAFT CREATED',
    rawJdText: 'Senior .NET Developer at ACME Corp. We are looking for 5+ years of C# and .NET Core experience. Remote friendly.',
    ...overrides,
  };

  const response = await fetch(`${BASE_URL}/api/jobs/import-from-automator`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  return { response, body: await response.json() };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Full Job Application Integration Flow', () => {
  test('1. Automator webhook → API creates Job record (201)', async () => {
    const { response, body } = await importJob();

    expect(response.status).toBe(201);
    expect(body.gmailDraftId).toBe(TEST_DRAFT_ID);
    expect(body.automatorStatus).toBe('Draft Created');
    expect(body.applicationStatus).toBe('Not Started');
    expect(body.outreachSubject).toContain('Senior .NET Developer');
    expect(body.companyName).toBeTruthy(); // should be non-empty (extracted from JD)
    expect(body.id).toBeDefined();

    // Store for subsequent tests
    importedJobId = body.id;
  });

  test('2. Idempotency — re-importing same draftId returns 200 (no duplicate)', async () => {
    // Second call with same TEST_DRAFT_ID
    const { response, body } = await importJob();

    // Should be 200 (existing) not 201 (created)
    expect(response.status).toBe(200);
    expect(body.id).toBe(importedJobId);
  });

  test('3. Imported job appears in GET /api/jobs response', async () => {
    const response = await fetch(`${BASE_URL}/api/jobs`, { headers });
    expect(response.status).toBe(200);

    const jobs = await response.json();
    const found = jobs.find(j => j.gmailDraftId === TEST_DRAFT_ID);

    expect(found).toBeDefined();
    expect(found.automatorStatus).toBe('Draft Created');
    expect(found.outreachSubject).toContain('Senior .NET Developer');
  });

  test('4. PATCH updates applicationStatus to Applied, auto-sets appliedDate', async () => {
    if (!importedJobId) {
      throw new Error('importedJobId not set — test 1 must pass first');
    }

    const response = await fetch(`${BASE_URL}/api/jobs/${importedJobId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ ApplicationStatus: 'Applied' }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.applicationStatus).toBe('Applied');
    expect(body.appliedDate).toBeTruthy(); // auto-set by backend
  });
});
