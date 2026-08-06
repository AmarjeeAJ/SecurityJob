import env from './env.js';

const allowedOrigins = env.clientUrl.split(',').map((origin) => origin.trim());

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin / non-browser requests (no Origin header).
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
