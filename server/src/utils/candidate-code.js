import crypto from 'node:crypto';

// Excludes visually ambiguous characters (0/O, 1/I/L) so codes stay easy to
// read aloud or retype by hand. 32 characters is a power of two, so
// `byte % 32` introduces no modulo bias when sampling from crypto.randomBytes.
const CODE_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;

function randomSuffix() {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let suffix = '';
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    suffix += CODE_CHARSET[bytes[i] % CODE_CHARSET.length];
  }
  return suffix;
}

/**
 * Generates a unique candidate code for the given year, e.g. SJ-CAN-2026-7K3PQ2.
 * Deliberately a random opaque suffix rather than a sequential counter — a
 * predictable running number would let anyone estimate total registration
 * volume just from their own code. Must be called with a client that is
 * inside the same transaction as the candidate insert, since uniqueness is
 * verified with a lookup against the `candidates` table.
 */
export async function generateCandidateCode(client, year = new Date().getFullYear()) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const code = `SJ-CAN-${year}-${randomSuffix()}`;
    const existing = await client.query('SELECT 1 FROM candidates WHERE candidate_code = $1', [code]);
    if (existing.rowCount === 0) return code;
  }
  throw new Error('Failed to generate a unique candidate code after multiple attempts');
}

export default generateCandidateCode;
