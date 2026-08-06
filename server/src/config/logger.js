import env from './env.js';

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info: (message, meta) => {
    console.log(`[${timestamp()}] INFO  ${message}`, meta ?? '');
  },
  warn: (message, meta) => {
    console.warn(`[${timestamp()}] WARN  ${message}`, meta ?? '');
  },
  error: (message, meta) => {
    console.error(`[${timestamp()}] ERROR ${message}`, meta ?? '');
  },
  debug: (message, meta) => {
    if (!env.isProduction) {
      console.debug(`[${timestamp()}] DEBUG ${message}`, meta ?? '');
    }
  },
};

export default logger;
