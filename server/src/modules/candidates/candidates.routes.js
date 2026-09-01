import { Router } from 'express';
import { validateBody } from '../../middleware/validation.middleware.js';
import { registrationRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { uploadCandidateDocuments, handleUploadErrors } from '../../middleware/upload.middleware.js';
import { registerCandidateSchema } from './candidates.schema.js';
import { register } from './candidates.controller.js';
import { RAJASTHAN_LOCATIONS_DATA, RAJASTHAN_DISTRICTS, getSmartAreasForDistrict } from '../../utils/rajasthan-locations.js';

const router = Router();

// Public smart locations API for Rajasthan
router.get('/locations/rajasthan', (req, res) => {
  res.json({
    success: true,
    state: 'Rajasthan',
    districts: RAJASTHAN_DISTRICTS,
    totalDistricts: RAJASTHAN_DISTRICTS.length,
    locationsData: RAJASTHAN_LOCATIONS_DATA,
  });
});

router.get('/locations/areas', (req, res) => {
  const district = req.query.district || 'Jaipur';
  const query = (req.query.query || '').trim().toLowerCase();
  let areas = getSmartAreasForDistrict(district);

  if (query) {
    areas = areas.filter((a) => a.toLowerCase().includes(query));
  }

  res.json({
    success: true,
    district,
    areas,
    count: areas.length,
  });
});

router.post(
  '/register',
  registrationRateLimiter,
  uploadCandidateDocuments,
  handleUploadErrors,
  validateBody(registerCandidateSchema),
  register
);

export default router;
