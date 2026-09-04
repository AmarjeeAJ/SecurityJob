import { Router } from 'express';
import { requireOwnerAuth } from '../../middleware/auth.middleware.js';
import { validateQuery, validateParams } from '../../middleware/validation.middleware.js';
import {
  listCandidatesQuerySchema,
  exportCandidatesQuerySchema,
  candidateIdParamSchema,
  candidateDocParamSchema,
} from './candidates.owner.schema.js';
import {
  listCandidates,
  getCandidateDetails,
  getCandidateDocumentFile,
  deleteCandidate,
} from './candidates.owner.controller.js';
import { exportCandidatesCsv } from '../exports/exports.controller.js';

const router = Router();

router.use(requireOwnerAuth);

// Must be declared before "/:id" so it isn't swallowed by the id param route.
router.get('/export.csv', validateQuery(exportCandidatesQuerySchema), exportCandidatesCsv);
router.get('/', validateQuery(listCandidatesQuerySchema), listCandidates);
router.get('/:id', validateParams(candidateIdParamSchema), getCandidateDetails);
router.delete('/:id', validateParams(candidateIdParamSchema), deleteCandidate);
router.get('/:id/documents/:docId', validateParams(candidateDocParamSchema), getCandidateDocumentFile);

export default router;

