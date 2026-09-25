-- Phase B: multi-brand foundation. Purely additive -- no existing table is
-- altered destructively, no existing column is dropped/renamed, and the
-- registration write path is not touched in this phase (new candidates will
-- get brand_id = NULL until a later phase wires brand resolution into
-- candidates.service.js). This migration only lays the schema groundwork.

CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  website_url VARCHAR(255),
  facebook_page_id VARCHAR(100),
  meta_ad_account_id VARCHAR(100),
  meta_pixel_id VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO brands (name, slug, website_url, is_active)
VALUES
  ('SecurityJob.in', 'securityjob-in', 'https://securityjob.in', TRUE),
  ('Spybot Security Services', 'spybot-security-services', NULL, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Nullable, FK to brands, no NOT NULL constraint -- registration keeps
-- working exactly as before even though nothing in the app writes this
-- column yet.
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS brand_id INTEGER REFERENCES brands (id);

CREATE INDEX IF NOT EXISTS idx_candidates_brand_id ON candidates (brand_id);

-- Every candidate record that exists today came through SecurityJob.in --
-- this repo has never served any other brand -- so this backfill is a known
-- fact, not a guess. Anything outside that certainty is left NULL rather
-- than assigned a brand by inference.
UPDATE candidates
SET brand_id = (SELECT id FROM brands WHERE slug = 'securityjob-in')
WHERE brand_id IS NULL;
