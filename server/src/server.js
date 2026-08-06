import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import pool from './db/pool.js';

const server = app.listen(env.port, () => {
  logger.info(`SecurityJob API listening on port ${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
