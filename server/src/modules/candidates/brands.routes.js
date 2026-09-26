import { Router } from 'express';
import { requireOwnerAuth } from '../../middleware/auth.middleware.js';
import { listBrands } from './candidates.owner.controller.js';

const router = Router();

router.use(requireOwnerAuth);

router.get('/', listBrands);

export default router;
