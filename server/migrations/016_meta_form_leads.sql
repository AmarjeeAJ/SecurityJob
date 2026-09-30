-- Meta native Instant Form leads -- people who submitted a lead form directly
-- on Facebook/Instagram without ever visiting the website. Distinct from
-- candidates (website registrations); a lead here may or may not also be a
-- website registration, so this is never merged into the candidates table.

CREATE TABLE IF NOT EXISTS meta_form_leads (
  id BIGSERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES brands (id),
  leadgen_id VARCHAR(50) NOT NULL UNIQUE,
  form_id VARCHAR(50),
  form_name VARCHAR(255),
  campaign_id VARCHAR(100),
  campaign_name VARCHAR(255),
  adset_id VARCHAR(100),
  adset_name VARCHAR(255),
  ad_id VARCHAR(100),
  ad_name VARCHAR(255),
  full_name VARCHAR(255),
  phone_number VARCHAR(30),
  normalized_phone VARCHAR(10),
  email VARCHAR(255),
  field_data JSONB,
  created_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meta_form_leads_brand_created ON meta_form_leads (brand_id, created_time);
CREATE INDEX IF NOT EXISTS idx_meta_form_leads_campaign_id ON meta_form_leads (campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_form_leads_adset_id ON meta_form_leads (adset_id);
CREATE INDEX IF NOT EXISTS idx_meta_form_leads_ad_id ON meta_form_leads (ad_id);
CREATE INDEX IF NOT EXISTS idx_meta_form_leads_normalized_phone ON meta_form_leads (normalized_phone);
