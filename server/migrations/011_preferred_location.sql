-- The candidate form's "Preferred Job Location" section collects a full
-- state -> district -> subdivision -> pincode -> landmark hierarchy (mirroring
-- Permanent Address), and registerCandidateSchema validates all of it — but no
-- preferred_* columns ever existed on `candidates`, so every one of those
-- fields was silently discarded after validation. Only the coarse city name
-- survived, via the separate candidate_preferred_locations table, which is
-- why the owner dashboard only ever showed a bare city like "Patna" instead
-- of the full duty-location detail the candidate actually provided.

ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS preferred_state VARCHAR(100),
  ADD COLUMN IF NOT EXISTS preferred_district VARCHAR(100),
  ADD COLUMN IF NOT EXISTS preferred_subdivision VARCHAR(100),
  ADD COLUMN IF NOT EXISTS preferred_block VARCHAR(100),
  ADD COLUMN IF NOT EXISTS preferred_tehsil VARCHAR(100),
  ADD COLUMN IF NOT EXISTS preferred_pincode VARCHAR(10),
  ADD COLUMN IF NOT EXISTS preferred_address_line VARCHAR(250);
