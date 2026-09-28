import 'dotenv/config';
const BASE = 'http://localhost:4100/api';

const loginRes = await fetch(`${BASE}/owner/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: process.env.OWNER_DEFAULT_EMAIL, password: process.env.OWNER_DEFAULT_PASSWORD }),
});
const cookie = loginRes.headers.get('set-cookie');
await new Promise((r) => setTimeout(r, 800));

console.log('Running real Meta Insights sync (last 30 days)...\n');

const since = new Date();
since.setDate(since.getDate() - 30);
const fmt = (d) => d.toISOString().slice(0, 10);

const syncRes = await fetch(`${BASE}/owner/marketing/meta-sync`, {
  method: 'POST',
  headers: { Cookie: cookie, 'Content-Type': 'application/json' },
  body: JSON.stringify({ since: fmt(since), until: fmt(new Date()) }),
});
const syncJson = await syncRes.json();
console.log('Sync result:', JSON.stringify(syncJson, null, 2));
