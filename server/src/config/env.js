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
  // All optional -- Meta CAPI is a non-critical dependency. No fallback
  // API version is hardcoded here; metaConversions.service.js skips the
  // send (safely, with a log) rather than guessing a version if this is
  // left blank.
  metaAccessToken: process.env.META_ACCESS_TOKEN || '',
  metaApiVersion: process.env.META_API_VERSION || '',
  metaTestEventCode: process.env.META_TEST_EVENT_CODE || '',
  // Meta Ads Insights sync (Marketing & Analysis page). Reuses
  // metaAccessToken/metaApiVersion above. Optional -- the sync safely
  // no-ops with a clear log if this is blank, same pattern as CAPI.
  metaAdAccountId: process.env.META_AD_ACCOUNT_ID || '',
  // Meta native Instant Form leads sync. Same reuse/optional pattern as
  // metaAdAccountId above.
  metaPageId: process.env.META_PAGE_ID || '',
  // Spybot Security Services is a separate, already-live application with
  // its own Postgres database -- this is a READ-ONLY connection used only
  // to report on its client_leads table in the Marketing & Analysis page,
  // never to write to it. Optional -- the Spybot side of the dashboard
  // safely shows "not configured" if this is blank.
  spybotDatabaseUrl: process.env.SPYBOT_DATABASE_URL || '',
  // Spybot is a separate Meta Business Portfolio with its own ad account
  // and Page, so it needs its own credentials -- none of the META_* vars
  // above apply to it. Reuses the shared META_API_VERSION.
  spybotMetaAccessToken: process.env.SPYBOT_META_ACCESS_TOKEN || '',
  spybotMetaAdAccountId: process.env.SPYBOT_META_AD_ACCOUNT_ID || '',
  spybotMetaPageId: process.env.SPYBOT_META_PAGE_ID || '',
};

export default env;
