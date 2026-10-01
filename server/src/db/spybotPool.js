import pg from 'pg';
import env from '../config/env.js';
import logger from '../config/logger.js';

const { Pool } = pg;

// READ-ONLY by convention: this pool exists only to report on Spybot
// Security Services' client_leads table from the Marketing & Analysis page.
// Nothing in this codebase should ever INSERT/UPDATE/DELETE through it --
// that database belongs to a separate, already-live application.
let pool = null;

function getSpybotPool() {
  if (!env.spybotDatabaseUrl) return null;
  if (pool) return pool;

  pool = new Pool({
    connectionString: env.spybotDatabaseUrl,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
  });

  pool.on('error', (err) => {
    logger.error('Unexpected Spybot PostgreSQL pool error', { message: err.message });
  });

  return pool;
}

export default getSpybotPool;
