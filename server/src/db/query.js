import pool from './pool.js';
import logger from '../config/logger.js';

export async function query(text, params = []) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const durationMs = Date.now() - start;
  if (durationMs > 200) {
    logger.warn('Slow query', { text, durationMs });
  }
  return result;
}

export default query;
