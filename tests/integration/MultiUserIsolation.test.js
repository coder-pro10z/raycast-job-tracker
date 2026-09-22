/**
 * MultiUserIsolation.test.js
 *
 * Verifies that the multi-user profile and authentication system provides:
 * 1. Centralized job catalog sharing across all users.
 * 2. Complete status/application progress isolation between Praveen Kashyap and Anam Ansari.
 * 3. Fresh accounts defaulting all catalog opportunities to "Not Started".
 */

import { describe, test, expect, beforeAll } from 'vitest';

const BASE = process.env.NEXTAPPLY_API_URL || 'http://localhost:5089';

describe('Multi-User Profile & Status Isolation', () => {
  let praveenId = 'user_praveen';
  let anamId = 'user_anam';
  let sampleJobId = null;

  beforeAll(async () => {
    // Verify seeded users exist
    const res = await fetch(`${BASE}/api/auth/users`);
    const users = await res.json();
    expect(users.some(u => u.email === '2pkashyap2001@gmail.com')).toBe(true);
    expect(users.some(u => u.email === 'anamansari.0406@gmail.com')).toBe(true);

    // Pick a test job
    const jobsRes = await fetch(`${BASE}/api/jobs`, {
      headers: { 'X-User-Id': praveenId, 'X-Api-Key': 'dev-local-key' }
    });
    const jobs = await jobsRes.json();
    expect(jobs.length).toBeGreaterThan(0);
    sampleJobId = jobs[0].id;
  });

  test('Praveen Kashyap can log in with initial credentials', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '2pkashyap2001@gmail.com', password: 'Password123!' })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.fullName).toBe('Praveen Kashyap');
  });

  test('Anam Ansari can log in with initial credentials', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anamansari.0406@gmail.com', password: 'Password123!' })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.fullName).toBe('Anam Ansari');
  });

  test('Modifying status for Praveen does not alter Anam status', async () => {
    // 1. Check Anam initial status
    const anamBefore = await (await fetch(`${BASE}/api/jobs/${sampleJobId}`, {
      headers: { 'X-User-Id': anamId, 'X-Api-Key': 'dev-local-key' }
    })).json();

    // 2. Set Praveen status to Applied
    const patchRes = await fetch(`${BASE}/api/jobs/${sampleJobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': praveenId,
        'X-Api-Key': 'dev-local-key'
      },
      body: JSON.stringify({ applicationStatus: 'Applied', priority: 'High' })
    });
    expect(patchRes.status).toBe(200);
    const patchedPraveen = await patchRes.json();
    expect(patchedPraveen.applicationStatus).toBe('Applied');
    expect(patchedPraveen.priority).toBe('High');

    // 3. Verify Anam's status is completely isolated
    const anamAfter = await (await fetch(`${BASE}/api/jobs/${sampleJobId}`, {
      headers: { 'X-User-Id': anamId, 'X-Api-Key': 'dev-local-key' }
    })).json();

    expect(anamAfter.applicationStatus).toBe(anamBefore.applicationStatus);
  });

  test('A newly registered candidate starts with Not Started status on shared jobs', async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const signupRes = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'New Candidate',
        email: uniqueEmail,
        password: 'Password123!',
        targetDomain: 'cloud'
      })
    });
    expect(signupRes.status).toBe(200);
    const signupData = await signupRes.json();
    const newUserId = signupData.user.id;

    const newCandidateJob = await (await fetch(`${BASE}/api/jobs/${sampleJobId}`, {
      headers: { 'X-User-Id': newUserId, 'X-Api-Key': 'dev-local-key' }
    })).json();

    expect(newCandidateJob.applicationStatus).toBe('Not Started');
    expect(newCandidateJob.priority).toBe('Medium');
  });
});
