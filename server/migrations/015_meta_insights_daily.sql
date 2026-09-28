-- Additive only. Stores Meta Ads Insights synced from the Marketing API at
-- ad-level daily granularity (campaign/adset info comes along with each ad
-- row from Meta's own response, so Campaign/Ad Set performance tables can
-- be built by GROUP BY on top of this one table without a second sync
-- shape). Nothing here touches the candidates/candidate_submissions
-- tables or the existing Meta CAPI implementation.

CREATE TABLE IF NOT EXISTS meta_insights_daily (
  id BIGSERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES brands (id),
  date DATE NOT NULL,
  platform VARCHAR(30),
  account_id VARCHAR(50),
  campaign_id VARCHAR(100),
  campaign_name VARCHAR(255),
  adset_id VARCHAR(100),
  adset_name VARCHAR(255),
  ad_id VARCHAR(100) NOT NULL,
  ad_name VARCHAR(255),
  spend NUMERIC(12, 2) NOT NULL DEFAULT 0,
  impressions BIGINT NOT NULL DEFAULT 0,
  reach BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  link_clicks BIGINT NOT NULL DEFAULT 0,
  landing_page_views BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One row per brand/day/ad -- re-syncing the same day is an upsert
  -- (ON CONFLICT DO UPDATE), never a duplicate insert.
  UNIQUE (brand_id, date, ad_id)
);

CREATE INDEX IF NOT EXISTS idx_meta_insights_daily_brand_date ON meta_insights_daily (brand_id, date);
CREATE INDEX IF NOT EXISTS idx_meta_insights_daily_campaign_id ON meta_insights_daily (campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_insights_daily_adset_id ON meta_insights_daily (adset_id);
CREATE INDEX IF NOT EXISTS idx_meta_insights_daily_date ON meta_insights_daily (date);
