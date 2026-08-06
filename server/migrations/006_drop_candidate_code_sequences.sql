-- Candidate codes are now generated as random opaque suffixes (see
-- src/utils/candidate-code.js) rather than a sequential per-year counter, so
-- a visible running number can no longer be used to estimate total
-- registration volume from a single candidate's own code. This table is no
-- longer read or written anywhere.
DROP TABLE IF EXISTS candidate_code_sequences;
