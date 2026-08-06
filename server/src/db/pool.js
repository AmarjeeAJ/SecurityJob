import pg from 'pg';
import env from '../config/env.js';
import logger from '../config/logger.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  // Serverless Postgres providers (Neon, etc.) auto-suspend after inactivity
  // and can take several seconds to wake on the first connection — 5s wasn't
  // enough headroom and caused sporadic 500s on the first request after idle.
  connectionTimeoutMillis: 15000,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL pool error', { message: err.message });
});

export default pool;
