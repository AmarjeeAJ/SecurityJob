-- Owner search/filter uses ILIKE '%term%' (leading wildcard), which a btree
-- index can never serve — every search was falling back to a sequential scan
-- of candidates. Trigram GIN indexes are the correct structure for this.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Misleading name: this was created as a btree, so it never helped the
-- ILIKE search it was named for.
DROP INDEX IF EXISTS idx_candidates_full_name_trgm;

CREATE INDEX IF NOT EXISTS idx_candidates_full_name_trgm
  ON candidates USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_candidates_mobile_trgm
  ON candidates USING gin (mobile_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_candidates_code_trgm
  ON candidates USING gin (candidate_code gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_candidates_current_city_trgm
  ON candidates USING gin (current_city gin_trgm_ops);

-- current_area backs the Area / Locality filter and had no index at all.
CREATE INDEX IF NOT EXISTS idx_candidates_current_area_trgm
  ON candidates USING gin (current_area gin_trgm_ops);

-- Offered as a sort option in the records table but never indexed.
CREATE INDEX IF NOT EXISTS idx_candidates_first_registered_at
  ON candidates (first_registered_at);
