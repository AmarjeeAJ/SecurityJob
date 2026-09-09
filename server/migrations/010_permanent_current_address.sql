-- Until now, `state` and `current_city` held a candidate's PERMANENT/native
-- address despite their names — there was never a real "current address" data
-- model, just a UI section drawn over the same fields. That ambiguity is what
-- let the GPS "get my current location" button silently overwrite a
-- candidate's native address with wherever their phone said they were
-- standing. This migration gives Permanent Address and Current Address their
-- own, unambiguous columns.
--
-- Renaming (not dropping) `state`/`current_city` preserves every existing
-- candidate's data with zero loss — it was permanent-address data all along,
-- just mislabeled.

ALTER TABLE candidates RENAME COLUMN state TO permanent_state;
ALTER TABLE candidates RENAME COLUMN current_city TO permanent_district;

ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS permanent_subdivision VARCHAR(100),
  ADD COLUMN IF NOT EXISTS permanent_block VARCHAR(100),
  ADD COLUMN IF NOT EXISTS permanent_tehsil VARCHAR(100),
  ADD COLUMN IF NOT EXISTS permanent_village VARCHAR(150),
  ADD COLUMN IF NOT EXISTS permanent_pincode VARCHAR(10),
  ADD COLUMN IF NOT EXISTS permanent_address_line VARCHAR(250);

-- Current Address stays intentionally simple (free-text stay address + GPS),
-- matching the guard-friendly UI — it was never meant to be a full
-- state/district/village hierarchy like Permanent Address.
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS current_stay_address VARCHAR(300),
  ADD COLUMN IF NOT EXISTS geo_lat NUMERIC(9, 6),
  ADD COLUMN IF NOT EXISTS geo_lng NUMERIC(9, 6),
  ADD COLUMN IF NOT EXISTS geo_address VARCHAR(300);

ALTER INDEX IF EXISTS idx_candidates_current_city RENAME TO idx_candidates_permanent_district;
