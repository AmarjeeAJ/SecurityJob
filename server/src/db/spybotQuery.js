import getSpybotPool from './spybotPool.js';
import logger from '../config/logger.js';

// READ-ONLY: a distinct helper from query.js on purpose, so a query against
// Spybot's separate database is never confused with one against this app's
// own database. Returns null when SPYBOT_DATABASE_URL isn't configured,
// rather than throwing -- callers treat that as "Spybot data unavailable".
export async function spybotQuery(text, params = []) {
  const pool = getSpybotPool();
  if (!pool) return null;

  const start = Date.now();
  const result = await pool.query(text, params);
  const durationMs = Date.now() - start;
  if (durationMs > 200) {
    logger.warn('Slow Spybot query', { text, durationMs });
  }
  return result;
}

export default spybotQuery;
