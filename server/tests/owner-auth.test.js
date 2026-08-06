import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';
import env from '../src/config/env.js';

test('rejects login with an incorrect password', async () => {
  const res = await request(app)
    .post('/api/owner/auth/login')
    .send({ email: env.ownerDefaultEmail, password: 'definitely-wrong-password' });

  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('rejects login with a malformed email', async () => {
  const res = await request(app)
    .post('/api/owner/auth/login')
    .send({ email: 'not-an-email', password: 'whatever' });

  assert.equal(res.status, 422);
});

test('logs in with valid credentials and can access protected candidate list; unauthorized requests are rejected', async () => {
  const agent = request.agent(app);

  const unauthorized = await agent.get('/api/owner/candidates');
  assert.equal(unauthorized.status, 401);

  const login = await agent
    .post('/api/owner/auth/login')
    .send({ email: env.ownerDefaultEmail, password: env.ownerDefaultPassword });

  assert.equal(login.status, 200);
  assert.equal(login.body.success, true);
  assert.equal(login.body.owner.email, env.ownerDefaultEmail);

  const sessionCheck = await agent.get('/api/owner/auth/session');
  assert.equal(sessionCheck.body.authenticated, true);

  const authorized = await agent.get('/api/owner/candidates');
  assert.equal(authorized.status, 200);
  assert.equal(authorized.body.success, true);
  assert.ok(Array.isArray(authorized.body.data));

  const logout = await agent.post('/api/owner/auth/logout');
  assert.equal(logout.status, 200);

  const afterLogout = await agent.get('/api/owner/candidates');
  assert.equal(afterLogout.status, 401);
});

after(async () => {
  await pool.end();
});
