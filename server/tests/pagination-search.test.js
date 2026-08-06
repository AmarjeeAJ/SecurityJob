import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';
import env from '../src/config/env.js';
import { randomMobile, randomNameTag, deleteCandidateByMobile, baseRegistrationFields } from './helpers.js';

const createdMobiles = [];

async function loggedInAgent() {
  const agent = request.agent(app);
  await agent.post('/api/owner/auth/login').send({ email: env.ownerDefaultEmail, password: env.ownerDefaultPassword });
  return agent;
}

test('owner can paginate, search by name, and filter by city', async () => {
  const mobileA = randomMobile();
  const mobileB = randomMobile();
  createdMobiles.push(mobileA, mobileB);
  const uniqueTag = randomNameTag();

  await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields(mobileA), fullName: `PaginationTest${uniqueTag}`, currentCity: 'Udaipur' });
  await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields(mobileB), fullName: `OtherCandidate${uniqueTag}`, currentCity: 'Jodhpur' });

  const agent = await loggedInAgent();

  const bySearch = await agent.get(`/api/owner/candidates?search=PaginationTest${uniqueTag}`);
  assert.equal(bySearch.status, 200);
  assert.equal(bySearch.body.data.length, 1);
  assert.equal(bySearch.body.data[0].fullName, `PaginationTest${uniqueTag}`);

  const byCity = await agent.get('/api/owner/candidates?city=Udaipur&pageSize=1&page=1');
  assert.equal(byCity.status, 200);
  assert.ok(byCity.body.pagination.pageSize === 1);
  assert.ok(byCity.body.data.every((c) => c.currentCity === 'Udaipur'));

  const byMobile = await agent.get(`/api/owner/candidates?search=${mobileB}`);
  assert.equal(byMobile.body.data.length, 1);
  assert.equal(byMobile.body.data[0].mobileNumber, mobileB);
});

after(async () => {
  for (const mobile of createdMobiles) {
    await deleteCandidateByMobile(mobile);
  }
  await pool.end();
});
