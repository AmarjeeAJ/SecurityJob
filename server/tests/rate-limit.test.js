import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

// The registration limiter reads its ceiling from env at module-load time, so
// this has to be set before src/app.js is imported. Pinning it here keeps the
// test about the behaviour (the cap is enforced) rather than about whichever
// default the app happens to ship — that default is tuned for carrier-grade
// NAT and would make this test needlessly slow.
const REGISTRATION_LIMIT = 5;
process.env.REGISTRATION_RATE_LIMIT = String(REGISTRATION_LIMIT);

const { default: app } = await import('../src/app.js');
const { default: pool } = await import('../src/db/pool.js');
const { randomMobile, deleteCandidateByMobile, baseRegistrationFields } = await import('./helpers.js');

const createdMobiles = [];

test('public registration endpoint rate-limits repeated submissions from the same client', async () => {
  const agent = request.agent(app);
  let sawRateLimited = false;

  for (let i = 0; i < REGISTRATION_LIMIT + 2; i += 1) {
    const mobile = randomMobile();
    const res = await agent
      .post('/api/public/candidates/register')
      .field(baseRegistrationFields(mobile));

    if (res.status === 429) {
      sawRateLimited = true;
      break;
    }
    createdMobiles.push(mobile);
  }

  assert.equal(
    sawRateLimited,
    true,
    `submissions past the configured limit of ${REGISTRATION_LIMIT} should be rate-limited`
  );
});

test('owner login endpoint rate-limits repeated failed attempts', async () => {
  const agent = request.agent(app);
  let sawRateLimited = false;

  for (let i = 0; i < 12; i += 1) {
    const res = await agent
      .post('/api/owner/auth/login')
      .send({ email: 'owner@securityjob.in', password: 'wrong-password' });

    if (res.status === 429) {
      sawRateLimited = true;
      break;
    }
  }

  assert.equal(sawRateLimited, true, 'repeated failed login attempts should eventually be rate-limited');
});

after(async () => {
  for (const mobile of createdMobiles) {
    await deleteCandidateByMobile(mobile);
  }
  await pool.end();
});
