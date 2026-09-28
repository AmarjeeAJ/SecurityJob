import { Router } from 'express';
import { requireOwnerAuth } from '../../middleware/auth.middleware.js';
import { validateQuery, validateBody } from '../../middleware/validation.middleware.js';
import { marketingFiltersQuerySchema, metaSyncBodySchema } from './marketing.schema.js';
import {
  getSummary,
  getTrends,
  getComparison,
  getCampaigns,
  getAdsets,
  getAds,
  getSources,
  getLocations,
  getRoles,
  runMetaSync,
  debugMetaToken,
} from './marketing.controller.js';

const router = Router();

router.use(requireOwnerAuth);

router.get('/summary', validateQuery(marketingFiltersQuerySchema), getSummary);
router.get('/trends', validateQuery(marketingFiltersQuerySchema), getTrends);
router.get('/comparison', validateQuery(marketingFiltersQuerySchema), getComparison);
router.get('/campaigns', validateQuery(marketingFiltersQuerySchema), getCampaigns);
router.get('/adsets', validateQuery(marketingFiltersQuerySchema), getAdsets);
router.get('/ads', validateQuery(marketingFiltersQuerySchema), getAds);
router.get('/sources', validateQuery(marketingFiltersQuerySchema), getSources);
router.get('/locations', validateQuery(marketingFiltersQuerySchema), getLocations);
router.get('/roles', validateQuery(marketingFiltersQuerySchema), getRoles);
router.post('/meta-sync', validateBody(metaSyncBodySchema), runMetaSync);
router.get('/debug-token', debugMetaToken); // TEMPORARY -- remove after diagnosis

export default router;
