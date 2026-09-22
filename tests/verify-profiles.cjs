const BASE = 'http://localhost:5089';

async function main() {
  console.log('=== 1. Fetching Seeded Users ===');
  const resUsers = await fetch(`${BASE}/api/auth/users`);
  const users = await resUsers.json();
  console.log('Users in DB:', users.map(u => ({ id: u.id, email: u.email, name: u.fullName })));

  console.log('\n=== 2. Testing Guest / Unauthenticated Mode (No User Logged In) ===');
  const guestJobsRes = await fetch(`${BASE}/api/jobs`, {
    headers: { 'X-Api-Key': 'dev-local-key' } // No X-User-Id
  });
  if (guestJobsRes.status !== 200) {
    throw new Error(`Guest jobs fetch failed with status ${guestJobsRes.status}`);
  }
  const guestJobs = await guestJobsRes.json();
  console.log(`Fetched ${guestJobs.length} jobs as Guest.`);

  const nonStartedGuestJobs = guestJobs.filter(j => j.applicationStatus !== 'Not Started');
  console.log(`Guest non-started jobs count: ${nonStartedGuestJobs.length}`);
  if (nonStartedGuestJobs.length === 0) {
    console.log('>>> SUCCESS: Guest view has 0 active application statuses (all "Not Started")!');
  } else {
    throw new Error(`Guest view leaked ${nonStartedGuestJobs.length} application statuses!`);
  }

  console.log('\n=== 3. Testing Guest Mutation Block (Unauthorized) ===');
  const testJobId = guestJobs[0].id;
  const guestPatchRes = await fetch(`${BASE}/api/jobs/${testJobId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'dev-local-key'
      // No X-User-Id
    },
    body: JSON.stringify({ applicationStatus: 'Applied' })
  });
  console.log(`Guest PATCH response status: ${guestPatchRes.status}`);
  if (guestPatchRes.status === 401) {
    console.log('>>> SUCCESS: Guest mutation is rejected with 401 Unauthorized!');
  } else {
    throw new Error(`Expected 401 Unauthorized for guest mutation, got ${guestPatchRes.status}`);
  }

  console.log('\n=== 4. Testing Authenticated Praveen Session ===');
  const praveenJobsRes = await fetch(`${BASE}/api/jobs`, {
    headers: { 'X-User-Id': 'user_praveen', 'X-Api-Key': 'dev-local-key' }
  });
  const praveenJobs = await praveenJobsRes.json();
  const praveenActive = praveenJobs.filter(j => j.applicationStatus !== 'Not Started');
  console.log(`Praveen has ${praveenActive.length} active applications.`);

  console.log('\n=== 5. Testing Authenticated Anam Session ===');
  const anamJobsRes = await fetch(`${BASE}/api/jobs`, {
    headers: { 'X-User-Id': 'user_anam', 'X-Api-Key': 'dev-local-key' }
  });
  const anamJobs = await anamJobsRes.json();
  const anamActive = anamJobs.filter(j => j.applicationStatus !== 'Not Started');
  console.log(`Anam has ${anamActive.length} active applications.`);

  console.log('\n=== 6. Testing Isolated Mutation Between Users ===');
  // Mutate testJobId for Praveen
  await fetch(`${BASE}/api/jobs/${testJobId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': 'user_praveen',
      'X-Api-Key': 'dev-local-key'
    },
    body: JSON.stringify({ applicationStatus: 'Interviewing' })
  });

  const checkPraveen = await (await fetch(`${BASE}/api/jobs/${testJobId}`, {
    headers: { 'X-User-Id': 'user_praveen', 'X-Api-Key': 'dev-local-key' }
  })).json();

  const checkAnam = await (await fetch(`${BASE}/api/jobs/${testJobId}`, {
    headers: { 'X-User-Id': 'user_anam', 'X-Api-Key': 'dev-local-key' }
  })).json();

  const checkGuest = await (await fetch(`${BASE}/api/jobs/${testJobId}`, {
    headers: { 'X-Api-Key': 'dev-local-key' }
  })).json();

  console.log(`Job #${testJobId} Statuses:`);
  console.log(`- Praveen: "${checkPraveen.applicationStatus}"`);
  console.log(`- Anam: "${checkAnam.applicationStatus}"`);
  console.log(`- Guest: "${checkGuest.applicationStatus}"`);

  if (checkPraveen.applicationStatus === 'Interviewing' &&
      checkAnam.applicationStatus !== 'Interviewing' &&
      checkGuest.applicationStatus === 'Not Started') {
    console.log('>>> SUCCESS: Status mutation is 100% isolated to Praveen, Anam is unaffected, and Guest remains "Not Started"!');
  } else {
    throw new Error('Status isolation failed between Praveen, Anam, and Guest!');
  }

  console.log('\n========================================');
  console.log('ALL TESTS PASSED: GUEST ZERO-STATE & USER ISOLATION VERIFIED!');
  console.log('========================================');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
