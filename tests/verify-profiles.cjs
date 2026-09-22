const BASE = 'http://localhost:5089';

async function main() {
  console.log('--- 1. Fetching Users ---');
  const resUsers = await fetch(`${BASE}/api/auth/users`);
  const users = await resUsers.json();
  console.log('Seeded Users in DB:', users.map(u => ({ id: u.id, email: u.email, name: u.fullName })));

  console.log('\n--- 2. Logging in as Praveen ---');
  const praveenRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '2pkashyap2001@gmail.com', password: 'Password123!' })
  });
  const praveenData = await praveenRes.json();
  console.log('Praveen Login OK:', praveenData.user.fullName, 'ID:', praveenData.user.id);

  console.log('\n--- 3. Logging in as Anam ---');
  const anamRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'anamansari.0406@gmail.com', password: 'Password123!' })
  });
  const anamData = await anamRes.json();
  console.log('Anam Login OK:', anamData.user.fullName, 'ID:', anamData.user.id);

  console.log('\n--- 4. Checking First Job for Praveen & Anam ---');
  const praveenJobsRes = await fetch(`${BASE}/api/jobs`, {
    headers: { 'X-User-Id': 'user_praveen', 'X-Api-Key': 'dev-local-key' }
  });
  const praveenJobs = await praveenJobsRes.json();
  const testJob = praveenJobs[0];
  console.log(`Test Job #${testJob.id} (${testJob.companyName}):`);
  console.log(`Praveen Initial Status: "${testJob.applicationStatus}"`);

  const anamJobRes = await fetch(`${BASE}/api/jobs/${testJob.id}`, {
    headers: { 'X-User-Id': 'user_anam', 'X-Api-Key': 'dev-local-key' }
  });
  const anamJobInitial = await anamJobRes.json();
  console.log(`Anam Initial Status: "${anamJobInitial.applicationStatus}"`);

  console.log(`\n--- 5. Mutating Job #${testJob.id} for Praveen ONLY to "Interviewing" ---`);
  const patchRes = await fetch(`${BASE}/api/jobs/${testJob.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': 'user_praveen',
      'X-Api-Key': 'dev-local-key'
    },
    body: JSON.stringify({ applicationStatus: 'Interviewing' })
  });
  const patchedJob = await patchRes.json();
  console.log(`Praveen Patched Status: "${patchedJob.applicationStatus}"`);

  console.log(`\n--- 6. Verifying Anam's Status remains completely UNTOUCHED ---`);
  const anamJobAfter = await (await fetch(`${BASE}/api/jobs/${testJob.id}`, {
    headers: { 'X-User-Id': 'user_anam', 'X-Api-Key': 'dev-local-key' }
  })).json();
  console.log(`Anam Status: "${anamJobAfter.applicationStatus}"`);

  if (anamJobAfter.applicationStatus !== 'Interviewing') {
    console.log('>>> SUCCESS: Anam application status is ISOLATED from Praveen!');
  } else {
    console.error('>>> FAILURE: Status leaked between users!');
    process.exit(1);
  }

  console.log('\n--- 7. Registering Brand New 3rd User ---');
  const newEmail = `user_${Date.now()}@example.com`;
  const signupRes = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'New Candidate',
      email: newEmail,
      password: 'Password123!',
      targetDomain: 'sde'
    })
  });
  const signupData = await signupRes.json();
  console.log('Created 3rd user:', signupData.user.id, signupData.user.email);

  const newUserJob = await (await fetch(`${BASE}/api/jobs/${testJob.id}`, {
    headers: { 'X-User-Id': signupData.user.id, 'X-Api-Key': 'dev-local-key' }
  })).json();
  console.log(`New User Status for Job #${testJob.id}: "${newUserJob.applicationStatus}"`);

  if (newUserJob.applicationStatus === 'Not Started') {
    console.log('>>> SUCCESS: New user starts with "Not Started" status on catalog job!');
  } else {
    console.error('>>> FAILURE: Expected "Not Started" for new user');
    process.exit(1);
  }

  console.log('\nALL PROFILE & MULTI-USER ISOLATION TESTS PASSED!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
