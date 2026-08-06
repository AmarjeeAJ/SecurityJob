-- One row per raw form submission event (full audit trail of every attempt).
CREATE TABLE IF NOT EXISTS candidate_submissions (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES candidates (id) ON DELETE CASCADE,
  landing_page_slug VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL DEFAULT 'direct',
  medium VARCHAR(100) NOT NULL DEFAULT 'none',
  campaign VARCHAR(150) NOT NULL DEFAULT 'personal_link',
  utm_source VARCHAR(150),
  utm_medium VARCHAR(150),
  utm_campaign VARCHAR(150),
  utm_content VARCHAR(150),
  utm_term VARCHAR(150),
  fbclid VARCHAR(255),
  fbp VARCHAR(255),
  fbc VARCHAR(255),
  referrer_url TEXT,
  landing_page_url TEXT,
  device_type VARCHAR(30),
  browser VARCHAR(100),
  ip_hash VARCHAR(64),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidate_submissions_candidate_id ON candidate_submissions (candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_submissions_submitted_at ON candidate_submissions (submitted_at);

-- Deduplicated summary of every distinct (source, medium, campaign) channel a candidate has come through.
CREATE TABLE IF NOT EXISTS candidate_sources (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES candidates (id) ON DELETE CASCADE,
  source VARCHAR(100) NOT NULL,
  medium VARCHAR(100) NOT NULL,
  campaign VARCHAR(150) NOT NULL,
  landing_page_slug VARCHAR(100) NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_count INTEGER NOT NULL DEFAULT 1,
  UNIQUE (candidate_id, source, medium, campaign)
);

CREATE INDEX IF NOT EXISTS idx_candidate_sources_source ON candidate_sources (source);
CREATE INDEX IF NOT EXISTS idx_candidate_sources_campaign ON candidate_sources (campaign);
CREATE INDEX IF NOT EXISTS idx_candidate_sources_candidate_id ON candidate_sources (candidate_id);
