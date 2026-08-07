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

test('CSV export endpoint requires owner authentication', async () => {
  const res = await request(app).get('/api/owner/candidates/export.csv');
  assert.equal(res.status, 401);
});

test('CSV export is UTF-8 with BOM, has readable headers, and is logged', async () => {
  const agent = await loggedInAgent();

  const beforeLogCount = await pool.query('SELECT COUNT(*)::int AS count FROM export_logs');

  const res = await agent.get('/api/owner/candidates/export.csv');

  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/csv/);
  assert.match(res.headers['content-disposition'], /^attachment; filename="securityjob-candidates-\d{4}-\d{2}-\d{2}\.csv"$/);

  assert.equal(res.text.codePointAt(0), 0xfeff, 'response text must start with a UTF-8 BOM so Excel opens it correctly');
  assert.match(res.text, /Candidate ID,Full Name,Mobile Number/);

  const afterLogCount = await pool.query('SELECT COUNT(*)::int AS count FROM export_logs');
  assert.equal(afterLogCount.rows[0].count, beforeLogCount.rows[0].count + 1, 'export must be recorded in export_logs');
});

test('CSV export neutralizes formula-injection prefixes in candidate fields', async () => {
  const mobile = randomMobile();
  createdMobiles.push(mobile);

  // currentArea accepts free text and is included in the CSV export, unlike fullName
  // (whose own validation already rejects a leading "=" as an invalid name).
  await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields(mobile), currentArea: '=SUM(1+1)' });

  const agent = await loggedInAgent();
  const res = await agent.get(`/api/owner/candidates/export.csv?search=${mobile}`);

  assert.equal(res.status, 200);
  assert.doesNotMatch(res.text, /[,\r\n]=SUM/, 'a raw leading "=" must never reach the CSV unescaped');
  assert.match(res.text, /'=SUM\(1\+1\)/, 'dangerous prefix should be neutralized with a leading apostrophe');
});

test('CSV export respects active search filters', async () => {
  const mobile = randomMobile();
  createdMobiles.push(mobile);
  const uniqueName = `FilterTarget${randomNameTag()}`;

  await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields(mobile), fullName: uniqueName });

  const agent = await loggedInAgent();
  const res = await agent.get(`/api/owner/candidates/export.csv?search=${uniqueName}`);

  const dataLines = res.text.trim().split('\r\n').slice(1);
  assert.equal(dataLines.length, 1);
  assert.match(dataLines[0], new RegExp(uniqueName));
});

after(async () => {
  for (const mobile of createdMobiles) {
    await deleteCandidateByMobile(mobile);
  }
  await pool.end();
});
