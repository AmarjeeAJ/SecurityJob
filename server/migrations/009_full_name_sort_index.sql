-- Migration 008 replaced the btree on full_name with a GIN trigram index so
-- that ILIKE '%term%' searches stop sequential-scanning. That fixed searching
-- but regressed sorting: a GIN trigram index cannot serve ORDER BY, so the
-- "Name (A-Z)" option in the records table went back to sorting the whole
-- table in memory (~320ms at 50k rows).
--
-- The two access patterns need two different indexes; keep both.
CREATE INDEX IF NOT EXISTS idx_candidates_full_name_sort ON candidates (full_name);
