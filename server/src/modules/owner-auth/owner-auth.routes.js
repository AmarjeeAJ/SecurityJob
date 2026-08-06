import { Router } from 'express';
import { validateBody } from '../../middleware/validation.middleware.js';
import { loginRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { loginSchema } from './owner-auth.schema.js';
import { login, logout, session } from './owner-auth.controller.js';

const router = Router();

router.post('/login', loginRateLimiter, validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/session', session);

export default router;
