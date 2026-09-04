import env from './env.js';

const configuredOrigins = (env.clientUrl || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin / non-browser requests (no Origin header).
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');

    // Allow wildcard or explicit match in CLIENT_URL
    if (configuredOrigins.includes('*') || configuredOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Automatically allow localhost and loopback on any port for local dev/testing
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    // Automatically allow production domain variations
    if (/^https?:\/\/(www\.)?securityjob\.in(:\d+)?$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    // Politely reject cross-origin requests without crashing the server with a 500 error
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;

