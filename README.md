# SecurityJob — Candidate Application Platform

A production-ready recruitment landing page for the security industry, built on the
PERN stack (PostgreSQL, Express, React, Node). Candidates land on `/apply/:jobSlug`
from Facebook/Instagram ads, WhatsApp links or QR codes and see the application form
immediately — no intermediate page, no login, no OTP. The owner gets a simple
protected page to search, filter and export the resulting candidate database.

This is a v1 scope on purpose: public form → PostgreSQL → protected records page →
CSV export. No admin panel, employer portal, job workflow, or payments — see
[Current Version Restrictions](#current-version-restrictions).

## 1. Project Overview

- **Public flow:** ad/link → `/apply/:jobSlug` → form visible immediately → submit →
  backend validates → saved to PostgreSQL → success screen with a Candidate ID.
- **Owner flow:** `/owner/login` → `/owner/candidates` (search/filter/paginate) →
  `/owner/candidates/:id` (full record) → CSV export (all or filtered).
- **Duplicate handling:** the mobile number is the identity key. Re-submitting the
  same mobile number updates the existing candidate profile (never creates a second
  profile) and records the new submission as additional campaign-source history.

## 2. Technology Stack

**Frontend:** React 18, Vite, React Router, Axios, React Hook Form, Zod, Tailwind CSS 4.

**Backend:** Node.js, Express, `pg` (parameterized queries, no ORM), Zod validation,
`express-session` + `connect-pg-simple` for owner auth, `multer` for uploads, Helmet,
`express-rate-limit`, `bcryptjs`.

**Database:** PostgreSQL with hand-written SQL migrations (no external migration
framework — see [`server/migrations`](server/migrations)), connection pooling,
transactions for multi-table writes, and indexes on every filtered/sorted column.

## 3. Folder Structure

```
server/
  src/
    config/        env, logger, cors
    db/            pool, query, transaction helpers
    middleware/     auth, error, validation, rate limit, upload
    modules/
      owner-auth/    login / logout / session
      candidates/    public registration + owner list/detail (controller-service-repository)
      exports/       CSV export controller + export_logs repository
    services/       csv-export.service.js (streaming CSV)
    utils/          candidate-code, phone-normalizer, csv-sanitizer, job-roles, ip-hash
  migrations/       001..005 numbered SQL files + migrate.js runner
  seeds/            seed.js (owner account + dev-only test candidate)
  uploads/          photos/ and resumes/ (local disk storage for dev)
  tests/            node:test + supertest integration tests
client/
  src/
    api/            axios client + typed API calls
    components/
      common/        Button, Card, TextInput, SelectInput, Header, Hero, ...
      form/          the 6 form sections, MultiSelectChips, SuccessState, ErrorBanner
      owner/         OwnerHeader, CandidateTable, CandidateFiltersBar, ProtectedRoute
    features/
      candidate-registration/  CandidateApplicationForm.jsx (the orchestrator)
      owner-auth/               OwnerAuthContext (session state)
    pages/          CandidateApplicationPage, OwnerLoginPage, CandidateRecordsPage, CandidateDetailsPage
    schemas/        Zod schemas mirroring backend validation
    services/       tracking.service.js (Meta Pixel / GA4)
    utils/          tracking.js (UTM/fbclid capture), jobRoles.js, locations.js
```

## 4. Prerequisites

- Node.js 20+ (developed/tested on Node 24)
- PostgreSQL 14+ (developed/tested on PostgreSQL 17)
- npm

## 5. PostgreSQL Setup

Create a database and a role for the app (adjust names/password as needed):

```sql
CREATE DATABASE securityjob_db;
CREATE USER securityjob_user WITH ENCRYPTED PASSWORD 'change_me';
GRANT ALL PRIVILEGES ON DATABASE securityjob_db TO securityjob_user;
```

If PostgreSQL is running on a non-default port on your machine, use that port in
`DATABASE_URL` below (Windows installs sometimes run a secondary instance on 5433 —
check `postgresql.conf` → `port` if `localhost:5432` refuses connections).

## 6. Environment Setup

**Backend** — copy and fill in `server/.env.example` → `server/.env`:

```
cd server
cp .env.example .env
```

Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | `postgres://user:password@host:port/database` |
| `CLIENT_URL` | Frontend origin(s) for CORS, comma-separated for multiple |
| `SESSION_SECRET` / `COOKIE_SECRET` | Long random strings — generate with `openssl rand -hex 32` |
| `OWNER_DEFAULT_EMAIL` / `OWNER_DEFAULT_PASSWORD` | Used only by `npm run seed` to create the first owner account |
| `MAX_FILE_SIZE` | Upload size limit in bytes (default 5 MB) |

**Frontend** — copy and fill in `client/.env.example` → `client/.env`:

```
cd client
cp .env.example .env
```

`VITE_API_BASE_URL` must point at the backend's `/api` root, e.g.
`http://localhost:4000/api`.

## 7. Migration Commands

```
cd server
npm install
npm run migrate
```

`migrate.js` applies every `.sql` file in `server/migrations/` in filename order and
tracks what's been applied in a `schema_migrations` table, so re-running it is safe
(already-applied files are skipped).

## 8. Seed Commands

```
npm run seed
```

Creates the owner account from `OWNER_DEFAULT_EMAIL` / `OWNER_DEFAULT_PASSWORD`. When
`NODE_ENV` is not `production`, it also inserts one clearly-marked test candidate
(mobile `9999900001`) so the owner pages have something to show immediately. In
production mode, no candidate data is seeded — only the owner account.

## 9. Development Commands

Run backend and frontend in separate terminals:

```
# terminal 1
cd server
npm run dev        # http://localhost:4000 (or PORT from .env)

# terminal 2
cd client
npm run dev        # http://localhost:5173 (or the port Vite prints)
```

Open `http://localhost:5173/apply/security-guard` — the form loads directly.

## 10. Production Build Commands

```
cd client
npm run build       # outputs client/dist — serve as static files behind your web server
npm run preview      # local production preview

cd server
NODE_ENV=production npm start
```

Because this is a client-side-routed SPA, your production web server (nginx, a
static host, etc.) must fall back to `client/dist/index.html` for unknown paths so
that a direct browser refresh on `/apply/security-guard` or `/owner/candidates/42`
doesn't 404.

## 11. Owner Login Setup

The owner account is never created through a public form — only via `npm run seed`
(reading `OWNER_DEFAULT_EMAIL` / `OWNER_DEFAULT_PASSWORD` from `server/.env`) or by
inserting directly into `owner_users` with a bcrypt hash. Change the seeded password
after first login in any real deployment (there is currently no self-service
password-change UI — update the `password_hash` column directly with a new bcrypt
hash if needed).

Login at `/owner/login`. Sessions are stored server-side in PostgreSQL (`session`
table via `connect-pg-simple`) behind an HTTP-only, `SameSite=Lax` cookie — 8 hour
expiry, `Secure` flag enabled automatically when `NODE_ENV=production`.

## 12. File Upload Setup

Uploads are stored on local disk under `server/uploads/{photos,resumes}` in
development. Filenames are randomized (`crypto.randomBytes`) before storage, so the
original filename is never used as a path — no path-traversal surface — and the
uploads folder is served read-only at `/uploads/...`. MIME type and file size
(`MAX_FILE_SIZE`) are enforced server-side regardless of what the browser claims.
`file-storage` is isolated behind `middleware/upload.middleware.js` so swapping in S3
or another object store later doesn't touch the registration flow.

## 13. Candidate Form Testing

Manual path:

1. Open `http://localhost:5173/apply/security-guard?utm_source=facebook&utm_medium=paid_social&utm_campaign=test`.
2. Confirm "Security Guard" is pre-selected under Preferred Job Role.
3. Fill required fields, leave a required field blank once to confirm inline errors
   appear below the field and your other entries are preserved.
4. Submit with a valid 10-digit mobile number → success screen shows a
   `SJ-CAN-YYYY-XXXXXX` Candidate ID (a random opaque 6-character suffix, not a
   running number — see [Security Notes](#security-notes)) with a working "Copy" button.
5. Submit the exact same mobile number again with different details → success
   message explicitly says your previous registration was found and updated; the
   owner records page still shows only one row for that candidate, with both
   campaign sources visible on the detail page.

## 14. CSV Export Testing

1. Log in at `/owner/login`.
2. On `/owner/candidates`, click **Download All Records** and **Download Filtered
   Records** (after applying a search/filter) — both should download immediately
   (no page navigation) since the browser sends the session cookie automatically.
3. Open the file in Microsoft Excel: Hindi/Unicode text should render correctly (the
   file is UTF-8 with a BOM), and multi-value fields (roles, locations) are
   pipe-separated (`Security Guard | Security Supervisor`).
4. To confirm CSV-injection sanitization: register a candidate with a field like
   "Previous Company" starting with `=`, `+`, `-` or `@`, then export — the value
   should appear prefixed with a leading apostrophe rather than as a live formula.

## 15. Deployment Instructions

1. Provision PostgreSQL, run `npm run migrate` then `npm run seed` (with real
   `OWNER_DEFAULT_EMAIL`/`OWNER_DEFAULT_PASSWORD`, `NODE_ENV=production`).
2. Deploy `server/` behind a process manager (pm2, systemd, or your platform's
   equivalent) with `NODE_ENV=production` and real secrets — never reuse the
   `.env.example` placeholder values.
3. Run `npm run build` in `client/` and serve `client/dist/` as static files (or from
   a CDN) with SPA fallback to `index.html`.
4. Put the backend behind HTTPS — cookies are marked `Secure` in production and
   won't be sent over plain HTTP.
5. Point `CLIENT_URL` (backend) at the real frontend origin and `VITE_API_BASE_URL`
   (frontend, baked in at build time) at the real API origin.
6. Point your Facebook/Instagram ad destination URLs and QR codes at
   `https://<your-domain>/apply/<job-slug>?utm_source=...` (see below).

## 16. Meta Advertisement URL Examples

```
https://securityjob.in/apply/security-guard
  ?utm_source=facebook
  &utm_medium=paid_social
  &utm_campaign=security_guard_database
  &utm_content=creative_01

https://securityjob.in/apply/security-supervisor
  ?utm_source=instagram
  &utm_medium=paid_social
  &utm_campaign=jaipur_supervisor_recruitment
```

Supported role slugs: `security-guard`, `security-supervisor`, `lady-security-guard`,
`armed-guard`, `gunman`, `field-officer`, `security-inspector`, `security-manager`,
`cctv-operator`, `control-room-operator`, `bouncer`, `event-security-guard`,
`fire-marshal`, `bodyguard`, `dog-handler`, `facility-supervisor`,
`housekeeping-staff`, `cash-van-driver`, `atm-custodian`. Any other slug still opens
the form with no role pre-selected. Pages never expire — every configured slug stays
live until the routing/config is changed in a future release.

## 17. Security Notes

- All public and owner APIs validate input server-side with Zod — frontend
  validation is a UX convenience only, never trusted.
- All SQL is parameterized (`pg`'s `$1, $2, ...` placeholders) — no string-built
  queries anywhere in the codebase.
- Owner sessions: bcrypt-hashed passwords, HTTP-only cookies, server-side session
  store, login rate-limited (`express-rate-limit`, 10 attempts / 15 min).
- Public registration is rate-limited (20 / 15 min per client) to reduce scripted
  spam without blocking genuine field-recruiter bursts.
- CSV export sanitizes any field starting with `=`, `+`, `-`, `@`, tab or CR to
  prevent formula-injection in Excel/Sheets, and is only reachable by an
  authenticated owner session; every export is logged to `export_logs` with the
  owner, filters used, and record count.
- IP addresses are never stored raw — only an HMAC hash (`ip-hash.js`), sufficient
  for abuse investigation without retaining personal data unnecessarily.
- Candidate codes (`SJ-CAN-2026-7K3PQ2`) use a random opaque 6-character suffix,
  not a sequential counter — a running number would let anyone estimate total
  registration volume just from their own code. Uniqueness is verified against
  the `candidates` table at generation time (`utils/candidate-code.js`).
- Uploaded files are re-named with random hex filenames server-side; original
  filenames and internal storage paths are never exposed to clients.
- `helmet()` sets standard security headers; CORS is restricted to `CLIENT_URL`.
- **Known dev-only advisories:** `npm audit` in `client/` currently flags Vite's
  bundled esbuild dev server (moderate, dev-server-only exposure, fixed only in a
  breaking Vite 6→8 jump) and a React Router advisory that applies to RSC/framework
  mode, which this SPA does not use (plain `BrowserRouter`). Neither affects the
  production build. Revisit before a major dependency bump.

## 18. Current Version Restrictions

Deliberately **not** built in this version: full admin dashboard, employer
registration/login/job-posting, candidate accounts/login/portal, interview
scheduling, offer letters, payroll, attendance, billing, recruitment CRM, analytics
dashboards, multiple owner roles, subscriptions, payment gateway, or any job/vacancy
expiration logic. The architecture (modular controller-service-repository backend,
normalized schema, componentized frontend) is intentionally structured so these can
be added later without a rewrite.

## 19. Testing

Automated backend tests (`server/tests/`, run with Node's built-in test runner):

```
cd server
npm test
```

Covers: successful registration + candidate code generation, required-field and
invalid-mobile validation, consent enforcement, duplicate-mobile resubmission
(single profile, multiple preserved submission/source records), owner login
success/failure, unauthorized access to candidate records, session-based
authorization, pagination and search/city filtering, CSV export auth requirement,
UTF-8 BOM + headers, CSV-injection sanitization, filtered export, export logging,
and rate limiting on both the public registration and owner login endpoints.

Tests run against the real `DATABASE_URL` you configure in `server/.env`, using
randomly generated mobile numbers and cleaning up every record they create — point
`DATABASE_URL` at a disposable/dev database rather than a shared production one.

Manual testing: see [Candidate Form Testing](#candidate-form-testing) and
[CSV Export Testing](#csv-export-testing) above for the end-to-end path, and check
both Android Chrome and iPhone Safari on the public form given most traffic arrives
from mobile ad clicks.
