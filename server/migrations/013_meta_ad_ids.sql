-- Additive only: 3 nullable columns on candidate_submissions for Meta's
-- structured ad-hierarchy IDs (campaign_id/adset_id/ad_id), captured only
-- when the advertiser adds these as URL parameters on their Meta ad
-- destination URL (e.g. &campaign_id={{campaign.id}}). Existing rows are
-- untouched and stay NULL -- no backfill, since there is no way to know
-- these values for historical submissions.

ALTER TABLE candidate_submissions
  ADD COLUMN IF NOT EXISTS campaign_id VARCHAR(100),
  ADD COLUMN IF NOT EXISTS adset_id VARCHAR(100),
  ADD COLUMN IF NOT EXISTS ad_id VARCHAR(100);
