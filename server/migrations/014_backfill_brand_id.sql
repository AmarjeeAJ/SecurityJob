-- brand_id was added to the candidates table back in 012_brands.sql, but
-- was never included in CANDIDATE_COLUMNS (the column list that drives the
-- registration INSERT/UPDATE), so every candidate registered since then
-- silently got brand_id = NULL instead of SecurityJob.in's id -- making
-- them invisible under the "SecurityJob.in" filter (only "All Brands"
-- showed them). That write-path gap is fixed alongside this migration;
-- this just re-runs the same backfill 012 did, to catch everyone who
-- registered in between. Every candidate in this table has only ever come
-- through the SecurityJob.in form, so this is a known fact, not a guess.
-- Idempotent: only touches rows still sitting at NULL.

UPDATE candidates
SET brand_id = (SELECT id FROM brands WHERE slug = 'securityjob-in')
WHERE brand_id IS NULL;
