import { Router } from 'express';
import { pageConfig } from './candidates.controller.js';

const router = Router();

router.get('/:jobSlug', pageConfig);

export default router;
