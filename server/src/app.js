import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import path from 'node:path';

import env from './config/env.js';
import logger from './config/logger.js';
import corsOptions from './config/cors.js';
import pool from './db/pool.js';
import { uploadRoot } from './middleware/upload.middleware.js';
import { apiRateLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

import candidatesRoutes from './modules/candidates/candidates.routes.js';
import pageConfigRoutes from './modules/candidates/page-config.routes.js';
import ownerCandidatesRoutes from './modules/candidates/owner-candidates.routes.js';
import ownerAuthRoutes from './modules/owner-auth/owner-auth.routes.js';

const app = express();
const PgSession = connectPgSimple(session);

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.cookieSecret));
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.use(
  session({
    store: new PgSession({ pool, tableName: 'session', createTableIfMissing: false }),
    name: 'securityjob.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
  })
);

app.use('/uploads', express.static(path.resolve(uploadRoot)));

app.use('/api', apiRateLimiter);
app.use('/api/public/candidates', candidatesRoutes);
app.use('/api/public/page-config', pageConfigRoutes);
app.use('/api/owner/auth', ownerAuthRoutes);
app.use('/api/owner/candidates', ownerCandidatesRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use(notFoundHandler);
app.use(errorHandler);

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: String(reason) });
});

export default app;
