import { Router } from 'express';
import { validateBody } from '../../middleware/validation.middleware.js';
import { registrationRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { uploadCandidateDocuments, handleUploadErrors } from '../../middleware/upload.middleware.js';
import { registerCandidateSchema } from './candidates.schema.js';
import { register } from './candidates.controller.js';

const router = Router();

router.post(
  '/register',
  registrationRateLimiter,
  uploadCandidateDocuments,
  handleUploadErrors,
  validateBody(registerCandidateSchema),
  register
);

export default router;
