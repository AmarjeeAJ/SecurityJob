import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';
import { randomMobile, deleteCandidateByMobile, baseRegistrationFields } from './helpers.js';

const createdMobiles = [];

test('registers a new candidate successfully and returns a candidate code', async () => {
  const mobile = randomMobile();
  createdMobiles.push(mobile);

  const res = await request(app)
    .post('/api/public/candidates/register')
    .field(baseRegistrationFields(mobile));

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.match(res.body.candidateCode, /^SJ-CAN-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  assert.equal(res.body.isExistingCandidate, false);
});

test('rejects registration when required fields are missing', async () => {
  const res = await request(app)
    .post('/api/public/candidates/register')
    .field({ fullName: 'No Mobile Provided' });

  assert.equal(res.status, 422);
  assert.equal(res.body.success, false);
  assert.ok(res.body.errors);
});

test('rejects an invalid (non 10-digit) mobile number', async () => {
  const res = await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields('12345'), mobileNumber: '12345' });

  assert.equal(res.status, 422);
  assert.match(res.body.errors.mobileNumber, /valid 10-digit/);
});

test('rejects registration when consent is not given', async () => {
  const mobile = randomMobile();
  const res = await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields(mobile), consentGiven: 'false' });

  assert.equal(res.status, 422);
  assert.ok(res.body.errors.consentGiven);
});

test('resubmitting the same mobile number updates the existing candidate instead of duplicating, and records both sources', async () => {
  const mobile = randomMobile();
  createdMobiles.push(mobile);

  const first = await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields(mobile), fullName: 'First Submission' })
    .field('utmSource', 'facebook')
    .field('utmMedium', 'paid_social')
    .field('utmCampaign', 'campaign_a');

  assert.equal(first.status, 201);
  assert.equal(first.body.isExistingCandidate, false);
  const candidateCode = first.body.candidateCode;

  const second = await request(app)
    .post('/api/public/candidates/register')
    .field({ ...baseRegistrationFields(mobile), fullName: 'Second Submission Updated' })
    .field('utmSource', 'whatsapp')
    .field('utmMedium', 'referral')
    .field('utmCampaign', 'campaign_b');

  assert.equal(second.status, 201);
  assert.equal(second.body.isExistingCandidate, true);
  assert.equal(second.body.candidateCode, candidateCode, 'candidate code must be preserved across resubmissions');

  const countResult = await pool.query('SELECT COUNT(*)::int AS count FROM candidates WHERE normalized_mobile_number = $1', [mobile]);
  assert.equal(countResult.rows[0].count, 1, 'only one candidate profile should exist');

  const nameResult = await pool.query('SELECT full_name FROM candidates WHERE normalized_mobile_number = $1', [mobile]);
  assert.equal(nameResult.rows[0].full_name, 'Second Submission Updated', 'latest info must not be silently lost');

  const submissionsResult = await pool.query(
    `SELECT source FROM candidate_submissions cs JOIN candidates c ON c.id = cs.candidate_id WHERE c.normalized_mobile_number = $1 ORDER BY submitted_at`,
    [mobile]
  );
  assert.equal(submissionsResult.rows.length, 2, 'both submission events must be preserved');
  assert.deepEqual(submissionsResult.rows.map((r) => r.source), ['facebook', 'whatsapp']);

  const sourcesResult = await pool.query(
    `SELECT source FROM candidate_sources cs JOIN candidates c ON c.id = cs.candidate_id WHERE c.normalized_mobile_number = $1 ORDER BY source`,
    [mobile]
  );
  assert.equal(sourcesResult.rows.length, 2, 'both distinct campaign sources must be preserved');
});

after(async () => {
  for (const mobile of createdMobiles) {
    await deleteCandidateByMobile(mobile);
  }
  await pool.end();
});
