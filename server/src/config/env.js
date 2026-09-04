import 'dotenv/config';

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 4000),
  databaseUrl: required('DATABASE_URL'),
  databaseSsl: process.env.DATABASE_SSL === 'true',
  dbPoolMax: Number(process.env.DB_POOL_MAX || 20),
  registrationRateLimit: Number(process.env.REGISTRATION_RATE_LIMIT || 60),
  crossSiteCookies: process.env.CROSS_SITE_COOKIES === 'true',
  clientUrl: required('CLIENT_URL', 'http://localhost:5173'),
  sessionSecret: required('SESSION_SECRET'),
  cookieSecret: required('COOKIE_SECRET'),
  passwordHashRounds: Number(process.env.PASSWORD_HASH_ROUNDS || 10),
  uploadDirectory: process.env.UPLOAD_DIRECTORY || 'uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024),
  ownerDefaultEmail: process.env.OWNER_DEFAULT_EMAIL || '',
  ownerDefaultPassword: process.env.OWNER_DEFAULT_PASSWORD || '',
  metaPixelId: process.env.META_PIXEL_ID || '',
  gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
};

export default env;
