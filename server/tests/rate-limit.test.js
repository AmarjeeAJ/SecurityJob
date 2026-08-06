import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';
import { randomMobile, deleteCandidateByMobile, baseRegistrationFields } from './helpers.js';

const createdMobiles = [];

test('public registration endpoint rate-limits repeated submissions from the same client', async () => {
  const agent = request.agent(app);
  let sawRateLimited = false;

  for (let i = 0; i < 22; i += 1) {
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

  assert.equal(sawRateLimited, true, 'the 21st+ submission in the window should be rate-limited');
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
