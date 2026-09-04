import pg from 'pg';
import env from '../config/env.js';
import logger from '../config/logger.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl,
  // Tunable per deployment: every PM2/cluster instance opens its own pool, so
  // (instances x DB_POOL_MAX) must stay comfortably under Postgres
  // max_connections (default 100) or new connections start getting refused.
  max: env.dbPoolMax,
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

// Pre-warm a connection so the first API request doesn't suffer connection handshake delay
pool.query('SELECT 1').catch((err) => {
  logger.warn('Failed to pre-warm PostgreSQL pool connection', { error: err.message });
});

export default pool;

