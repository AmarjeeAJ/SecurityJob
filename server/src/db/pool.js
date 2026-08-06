import pg from 'pg';
import env from '../config/env.js';
import logger from '../config/logger.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL pool error', { message: err.message });
});

export default pool;
