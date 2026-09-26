import { test, describe, beforeEach, afterEach, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import request from 'supertest';
import app from '../src/app.js';
import env from '../src/config/env.js';
import pool from '../src/db/pool.js';
import {
  sendCompleteRegistrationEvent,
  hashedPhone,
  isPrivateOrLoopbackIp,
} from '../src/services/metaConversions.service.js';
import { randomMobile, deleteCandidateByMobile, baseRegistrationFields } from './helpers.js';

describe('Meta Conversions API (CAPI) Unit & Integration Tests', () => {
  const createdMobiles = [];
  let originalEnv;
  let originalFetch;

  beforeEach(() => {
    // Snapshot original env settings
    originalEnv = {
      metaAccessToken: env.metaAccessToken,
      metaApiVersion: env.metaApiVersion,
      metaPixelId: env.metaPixelId,
      metaTestEventCode: env.metaTestEventCode,
    };
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    // Restore env & fetch
    env.metaAccessToken = originalEnv.metaAccessToken;
    env.metaApiVersion = originalEnv.metaApiVersion;
    env.metaPixelId = originalEnv.metaPixelId;
    env.metaTestEventCode = originalEnv.metaTestEventCode;
    globalThis.fetch = originalFetch;
  });

  after(async () => {
    for (const mobile of createdMobiles) {
      await deleteCandidateByMobile(mobile);
    }
    await pool.end();
  });

  // -------------------------------------------------------------
  // 1. Phone hashing & normalization
  // -------------------------------------------------------------
  describe('Phone Hashing (hashedPhone)', () => {
    test('normalizes 10-digit Indian numbers and prefixes 91 before SHA-256 hashing', () => {
      const mobile = '9876543210';
      const expectedHash = crypto.createHash('sha256').update('919876543210').digest('hex');

      const hash = hashedPhone(mobile);
      assert.equal(hash, expectedHash);
      assert.match(hash, /^[0-9a-f]{64}$/);
    });

    test('strips +91, 91, spaces, and leading 0 correctly', () => {
      const expectedHash = crypto.createHash('sha256').update('919876543210').digest('hex');

      assert.equal(hashedPhone('+91 98765-43210'), expectedHash);
      assert.equal(hashedPhone('919876543210'), expectedHash);
      assert.equal(hashedPhone('09876543210'), expectedHash);
    });

    test('returns null for invalid or missing numbers', () => {
      assert.equal(hashedPhone(''), null);
      assert.equal(hashedPhone(null), null);
      assert.equal(hashedPhone('12345'), null);
      assert.equal(hashedPhone('abcdefghij'), null);
    });
  });

  // -------------------------------------------------------------
  // 2. Private/Loopback IP Detection
  // -------------------------------------------------------------
  describe('Private / Loopback IP Filter (isPrivateOrLoopbackIp)', () => {
    test('identifies loopback addresses as private', () => {
      assert.equal(isPrivateOrLoopbackIp('127.0.0.1'), true);
      assert.equal(isPrivateOrLoopbackIp('::1'), true);
      assert.equal(isPrivateOrLoopbackIp('localhost'), true);
      assert.equal(isPrivateOrLoopbackIp('::ffff:127.0.0.1'), true);
    });

    test('identifies RFC 1918 private IPv4 ranges as private', () => {
      // 10.0.0.0/8
      assert.equal(isPrivateOrLoopbackIp('10.0.0.1'), true);
      assert.equal(isPrivateOrLoopbackIp('10.255.255.254'), true);
      assert.equal(isPrivateOrLoopbackIp('::ffff:10.1.2.3'), true);

      // 172.16.0.0/12
      assert.equal(isPrivateOrLoopbackIp('172.16.0.1'), true);
      assert.equal(isPrivateOrLoopbackIp('172.24.10.5'), true);
      assert.equal(isPrivateOrLoopbackIp('172.31.255.255'), true);

      // 192.168.0.0/16
      assert.equal(isPrivateOrLoopbackIp('192.168.1.1'), true);
      assert.equal(isPrivateOrLoopbackIp('192.168.254.254'), true);
      assert.equal(isPrivateOrLoopbackIp('::ffff:192.168.0.10'), true);
    });

    test('identifies link-local and IPv6 ULA as private', () => {
      assert.equal(isPrivateOrLoopbackIp('169.254.1.1'), true);
      assert.equal(isPrivateOrLoopbackIp('fe80::1'), true);
      assert.equal(isPrivateOrLoopbackIp('fc00::1'), true);
      assert.equal(isPrivateOrLoopbackIp('fd12:3456:789a::1'), true);
    });

    test('allows genuine public IP addresses', () => {
      assert.equal(isPrivateOrLoopbackIp('49.36.12.89'), false);
      assert.equal(isPrivateOrLoopbackIp('8.8.8.8'), false);
      assert.equal(isPrivateOrLoopbackIp('1.1.1.1'), false);
      assert.equal(isPrivateOrLoopbackIp('172.32.0.1'), false); // Outside 172.16-31
      assert.equal(isPrivateOrLoopbackIp('2405:201:6800:1234::1'), false);
    });

    test('safely handles empty, null, or invalid IP inputs', () => {
      assert.equal(isPrivateOrLoopbackIp(''), true);
      assert.equal(isPrivateOrLoopbackIp(null), true);
      assert.equal(isPrivateOrLoopbackIp(undefined), true);
    });
  });

  // -------------------------------------------------------------
  // 3. Safe Skip When Credentials Missing
  // -------------------------------------------------------------
  describe('Safe Skip Behavior', () => {
    test('skips dispatch when META_ACCESS_TOKEN is missing', async () => {
      env.metaAccessToken = '';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '123456789';

      let fetchCalled = false;
      globalThis.fetch = async () => {
        fetchCalled = true;
        return new Response('{}', { status: 200 });
      };

      await sendCompleteRegistrationEvent({
        eventId: 'test-event-1',
        candidateCode: 'SJ-CAN-2026-TEST01',
        mobileNumber: '9876543210',
      });

      assert.equal(fetchCalled, false, 'fetch should not be called when META_ACCESS_TOKEN is missing');
    });

    test('skips dispatch when META_API_VERSION is missing', async () => {
      env.metaAccessToken = 'token_abc';
      env.metaApiVersion = '';
      env.metaPixelId = '123456789';

      let fetchCalled = false;
      globalThis.fetch = async () => {
        fetchCalled = true;
        return new Response('{}', { status: 200 });
      };

      await sendCompleteRegistrationEvent({
        eventId: 'test-event-2',
        candidateCode: 'SJ-CAN-2026-TEST02',
        mobileNumber: '9876543210',
      });

      assert.equal(fetchCalled, false, 'fetch should not be called when META_API_VERSION is missing');
    });

    test('skips dispatch when META_PIXEL_ID is missing', async () => {
      env.metaAccessToken = 'token_abc';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '';

      let fetchCalled = false;
      globalThis.fetch = async () => {
        fetchCalled = true;
        return new Response('{}', { status: 200 });
      };

      await sendCompleteRegistrationEvent({
        eventId: 'test-event-3',
        candidateCode: 'SJ-CAN-2026-TEST03',
        mobileNumber: '9876543210',
      });

      assert.equal(fetchCalled, false, 'fetch should not be called when META_PIXEL_ID is missing');
    });
  });

  // -------------------------------------------------------------
  // 4. Payload, Headers, and Authentication
  // -------------------------------------------------------------
  describe('CAPI Payload & Request Construction', () => {
    test('sends correctly structured payload with Authorization Bearer header', async () => {
      env.metaAccessToken = 'EAAB_test_access_token_123';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '1640692937620631';
      env.metaTestEventCode = 'TEST99887';

      let capturedUrl = '';
      let capturedOptions = null;

      globalThis.fetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return new Response(JSON.stringify({ events_received: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      const eventId = crypto.randomUUID();
      const testMobile = '9876543210';
      const expectedPhoneHash = crypto.createHash('sha256').update('919876543210').digest('hex');

      await sendCompleteRegistrationEvent({
        eventId,
        candidateCode: 'SJ-CAN-2026-TEST99',
        mobileNumber: testMobile,
        ip: '49.36.12.89', // Public IP
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        fbp: 'fb.1.1680000000.1234567890',
        fbc: 'fb.1.1680000000.IwAR123456789',
        eventSourceUrl: 'http://localhost:5180/apply/security-guard',
      });

      // Endpoint & Auth Headers
      assert.equal(capturedUrl, 'https://graph.facebook.com/v19.0/1640692937620631/events');
      assert.equal(capturedOptions.method, 'POST');
      assert.equal(capturedOptions.headers['Content-Type'], 'application/json');
      assert.equal(capturedOptions.headers['Authorization'], 'Bearer EAAB_test_access_token_123');

      // Parsed body validation
      const body = JSON.parse(capturedOptions.body);

      // Access token must NOT be in the body
      assert.equal(body.access_token, undefined, 'access_token should not be in the JSON payload body');

      // Test event code included when configured
      assert.equal(body.test_event_code, 'TEST99887');

      // Events data array
      assert.ok(Array.isArray(body.data));
      assert.equal(body.data.length, 1);

      const event = body.data[0];
      assert.equal(event.event_name, 'CompleteRegistration');
      assert.equal(event.event_id, eventId);
      assert.equal(event.action_source, 'website');
      assert.equal(event.event_source_url, 'http://localhost:5180/apply/security-guard');
      assert.ok(typeof event.event_time === 'number');

      // User data
      assert.deepEqual(event.user_data.ph, [expectedPhoneHash]);
      assert.equal(event.user_data.client_ip_address, '49.36.12.89');
      assert.equal(event.user_data.client_user_agent, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      assert.equal(event.user_data.fbp, 'fb.1.1680000000.1234567890');
      assert.equal(event.user_data.fbc, 'fb.1.1680000000.IwAR123456789');
    });

    test('omits test_event_code when META_TEST_EVENT_CODE is not configured', async () => {
      env.metaAccessToken = 'token_abc';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '123456789';
      env.metaTestEventCode = '';

      let capturedOptions = null;
      globalThis.fetch = async (url, options) => {
        capturedOptions = options;
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      };

      await sendCompleteRegistrationEvent({
        eventId: crypto.randomUUID(),
        candidateCode: 'SJ-CAN-2026-TEST04',
        mobileNumber: '9876543210',
      });

      const body = JSON.parse(capturedOptions.body);
      assert.equal(body.test_event_code, undefined);
    });

    test('omits client_ip_address when IP is local loopback or private', async () => {
      env.metaAccessToken = 'token_abc';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '123456789';

      let capturedOptions = null;
      globalThis.fetch = async (url, options) => {
        capturedOptions = options;
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      };

      // Test with 127.0.0.1
      await sendCompleteRegistrationEvent({
        eventId: crypto.randomUUID(),
        candidateCode: 'SJ-CAN-2026-TEST05',
        mobileNumber: '9876543210',
        ip: '127.0.0.1',
      });

      let body = JSON.parse(capturedOptions.body);
      assert.equal(body.data[0].user_data.client_ip_address, undefined);

      // Test with 192.168.1.100
      await sendCompleteRegistrationEvent({
        eventId: crypto.randomUUID(),
        candidateCode: 'SJ-CAN-2026-TEST06',
        mobileNumber: '9876543210',
        ip: '192.168.1.100',
      });

      body = JSON.parse(capturedOptions.body);
      assert.equal(body.data[0].user_data.client_ip_address, undefined);

      // Test with ::1
      await sendCompleteRegistrationEvent({
        eventId: crypto.randomUUID(),
        candidateCode: 'SJ-CAN-2026-TEST07',
        mobileNumber: '9876543210',
        ip: '::1',
      });

      body = JSON.parse(capturedOptions.body);
      assert.equal(body.data[0].user_data.client_ip_address, undefined);
    });

    test('omits fbp and fbc when they are null or undefined', async () => {
      env.metaAccessToken = 'token_abc';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '123456789';

      let capturedOptions = null;
      globalThis.fetch = async (url, options) => {
        capturedOptions = options;
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      };

      await sendCompleteRegistrationEvent({
        eventId: crypto.randomUUID(),
        candidateCode: 'SJ-CAN-2026-TEST08',
        mobileNumber: '9876543210',
        fbp: null,
        fbc: null,
      });

      const body = JSON.parse(capturedOptions.body);
      assert.equal(body.data[0].user_data.fbp, undefined);
      assert.equal(body.data[0].user_data.fbc, undefined);
    });
  });

  // -------------------------------------------------------------
  // 5. Resilience: Error handling & non-blocking
  // -------------------------------------------------------------
  describe('Resilience and Non-blocking Execution', () => {
    test('safely catches Meta 4xx/5xx responses without throwing', async () => {
      env.metaAccessToken = 'invalid_token';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '123456789';

      globalThis.fetch = async () => {
        return new Response(JSON.stringify({ error: { message: 'Invalid OAuth access token' } }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      await assert.doesNotReject(async () => {
        await sendCompleteRegistrationEvent({
          eventId: crypto.randomUUID(),
          candidateCode: 'SJ-CAN-2026-TEST09',
          mobileNumber: '9876543210',
        });
      });
    });

    test('safely catches network error / timeout abort without throwing', async () => {
      env.metaAccessToken = 'token_abc';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '123456789';

      globalThis.fetch = async () => {
        throw new Error('Connection reset by peer');
      };

      await assert.doesNotReject(async () => {
        await sendCompleteRegistrationEvent({
          eventId: crypto.randomUUID(),
          candidateCode: 'SJ-CAN-2026-TEST10',
          mobileNumber: '9876543210',
        });
      });
    });
  });

  // -------------------------------------------------------------
  // 6. Registration Flow Integration (Candidates Controller)
  // -------------------------------------------------------------
  describe('Registration Controller Integration', () => {
    test('invokes CAPI on NEW candidate registration and succeeds', async () => {
      env.metaAccessToken = 'token_test_123';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '1640692937620631';

      let fetchCallCount = 0;
      let capturedBody = null;

      globalThis.fetch = async (url, options) => {
        fetchCallCount += 1;
        capturedBody = JSON.parse(options.body);
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      };

      const mobile = randomMobile();
      createdMobiles.push(mobile);

      const res = await request(app)
        .post('/api/public/candidates/register')
        .field(baseRegistrationFields(mobile))
        .field('landingPageUrl', 'http://localhost:5180/apply/security-guard')
        .field('fbp', 'fb.1.1700000000.999999');

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.isExistingCandidate, false);

      // Allow microtask / fire-and-forget to execute
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.equal(fetchCallCount, 1, 'CAPI fetch should be invoked for a new candidate');
      assert.equal(capturedBody.data[0].event_name, 'CompleteRegistration');
      assert.equal(capturedBody.data[0].user_data.fbp, 'fb.1.1700000000.999999');
    });

    test('does NOT invoke CAPI when an existing candidate resubmits/updates', async () => {
      env.metaAccessToken = 'token_test_123';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '1640692937620631';

      let fetchCallCount = 0;
      globalThis.fetch = async () => {
        fetchCallCount += 1;
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      };

      const mobile = randomMobile();
      createdMobiles.push(mobile);

      // First submission (new candidate) -> CAPI fires
      const firstRes = await request(app)
        .post('/api/public/candidates/register')
        .field(baseRegistrationFields(mobile));

      assert.equal(firstRes.status, 201);
      assert.equal(firstRes.body.isExistingCandidate, false);

      await new Promise((resolve) => setTimeout(resolve, 50));
      assert.equal(fetchCallCount, 1, 'CAPI should fire once for the initial new candidate');

      // Reset count before second submission
      fetchCallCount = 0;

      // Second submission (same mobile) -> Existing candidate update -> CAPI must NOT fire
      const secondRes = await request(app)
        .post('/api/public/candidates/register')
        .field({ ...baseRegistrationFields(mobile), fullName: 'Updated Candidate Name' });

      assert.equal(secondRes.status, 201);
      assert.equal(secondRes.body.isExistingCandidate, true);

      await new Promise((resolve) => setTimeout(resolve, 50));
      assert.equal(
        fetchCallCount,
        0,
        'CAPI must NOT fire when isExistingCandidate is true (resubmission/update)'
      );
    });

    test('does NOT invoke CAPI when registration validation fails', async () => {
      env.metaAccessToken = 'token_test_123';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '1640692937620631';

      let fetchCallCount = 0;
      globalThis.fetch = async () => {
        fetchCallCount += 1;
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      };

      const res = await request(app)
        .post('/api/public/candidates/register')
        .field({ fullName: 'Incomplete Candidate Without Mobile' });

      assert.equal(res.status, 422);
      assert.equal(res.body.success, false);

      await new Promise((resolve) => setTimeout(resolve, 50));
      assert.equal(fetchCallCount, 0, 'CAPI must NOT fire on validation failure');
    });

    test('candidate registration response remains 201 even if Meta API fails completely', async () => {
      env.metaAccessToken = 'token_test_123';
      env.metaApiVersion = 'v19.0';
      env.metaPixelId = '1640692937620631';

      // Simulate network crash or Meta API 500 error
      globalThis.fetch = async () => {
        throw new Error('Meta API network crash');
      };

      const mobile = randomMobile();
      createdMobiles.push(mobile);

      const res = await request(app)
        .post('/api/public/candidates/register')
        .field(baseRegistrationFields(mobile));

      assert.equal(res.status, 201, 'Registration must still succeed with 201');
      assert.equal(res.body.success, true);
      assert.ok(res.body.candidateCode);
    });
  });
});
