import { Router } from 'express';
import { validateBody } from '../../middleware/validation.middleware.js';
import { registrationRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { uploadCandidateDocuments, handleUploadErrors } from '../../middleware/upload.middleware.js';
import { registerCandidateSchema } from './candidates.schema.js';
import { register } from './candidates.controller.js';
import { RAJASTHAN_LOCATIONS_DATA, RAJASTHAN_DISTRICTS, getSmartAreasForDistrict } from '../../utils/rajasthan-locations.js';
import { INDIA_STATES_DISTRICTS, ALL_INDIAN_STATES } from '../../utils/india-locations.js';
import { 
  getTehsilsForDistrict as getHierarchyTehsils, 
  getVillagesForTehsil as getHierarchyVillages,
  getSubdivisionsForDistrict,
  getBlocksForSubdivision,
  getPincodeForLocation
} from '../../utils/tehsilVillages.js';

const router = Router();

// In-memory cache for external API lookups (24 hours TTL)
const cache = new Map();
function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.time > 24 * 60 * 60 * 1000) {
    cache.delete(key);
    return null;
  }
  return item.data;
}
function setCache(key, data) {
  if (cache.size > 2000) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, { data, time: Date.now() });
}

// 1. All Indian States API
router.get('/locations/states', (req, res) => {
  res.json({
    success: true,
    states: ALL_INDIAN_STATES,
    total: ALL_INDIAN_STATES.length,
  });
});

// 2. State-specific Districts API
router.get('/locations/districts', (req, res) => {
  const state = req.query.state || 'Rajasthan';
  const districts = INDIA_STATES_DISTRICTS[state] || INDIA_STATES_DISTRICTS['Rajasthan'] || RAJASTHAN_DISTRICTS;

  res.json({
    success: true,
    state,
    districts,
    total: districts.length,
  });
});

const STATE_SLUG_MAP = {
  'uttar pradesh': 'uttar-pradesh',
  'madhya pradesh': 'madhya-pradesh',
  'himachal pradesh': 'himachal-pradesh',
  'andhra pradesh': 'andhra-pradesh',
  'arunachal pradesh': 'arunachal-pradesh',
  'west bengal': 'west-bengal',
  'tamil nadu': 'tamil-nadu',
  'jammu and kashmir': 'jammu-and-kashmir',
  'andaman and nicobar islands': 'andaman-and-nicobar-islands',
  'dadra and nagar haveli and daman and diu': 'dadra-and-nagar-haveli-and-daman-and-diu'
};

async function fetchDistrictPostalOffices(state = '', district = '') {
  if (!district) return [];
  const cacheKey = `dist_offices:${state}:${district}`.toLowerCase();
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const rawState = (state || 'Rajasthan').toLowerCase().trim();
    const stateSlug = STATE_SLUG_MAP[rawState] || rawState.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let districtSlug = district.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (districtSlug === 'gurgaon') districtSlug = 'gurugram';

    const url = `https://aniket-thapa.github.io/india-pincode-api/districts/${stateSlug}/${districtSlug}.json`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data?.offices)) {
        setCache(cacheKey, data.offices);
        return data.offices;
      }
    }
  } catch {
    // Non-blocking
  }

  return [];
}

// 3. District-specific Tehsils & Villages API
router.get('/locations/tehsils', async (req, res) => {
  const district = (req.query.district || 'Jaipur').trim();
  const state = (req.query.state || 'Rajasthan').trim();
  const tehsil = (req.query.tehsil || '').trim();

  const cacheKey = `tehsils:${state}:${district}:${tehsil}`.toLowerCase();
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  let tehsils = getHierarchyTehsils(state, district);
  let villages = getHierarchyVillages(state, district, tehsil);

  const localAreas = getSmartAreasForDistrict(district);
  if (state.toLowerCase() === 'rajasthan' && localAreas && localAreas.length > 0) {
    const rjTehsils = localAreas.map((a) => a.split(' ')[0].replace(/[,()&]/g, '')).filter(Boolean);
    tehsils = [...new Set([...tehsils, ...rjTehsils])];
    if (!tehsil && villages.length < 15) {
      villages = [...new Set([...villages, ...localAreas])];
    }
  }

  if (tehsils.length === 0) {
    tehsils = [`${district} सदर (Sadar)`, `${district} ग्रामीण (Rural)`, `${district} मुख्य ब्लॉक`];
  }

  const result = {
    success: true,
    state,
    district,
    tehsil,
    tehsils,
    villages: villages.slice(0, 80),
  };

  setCache(cacheKey, result);
  res.json(result);
});

// 3b. Dedicated Village/Area lookup for specific Tehsil or Block
router.get('/locations/villages', async (req, res) => {
  const district = (req.query.district || '').trim();
  const state = (req.query.state || '').trim();
  const block = (req.query.block || req.query.tehsil || '').trim();

  // 1. Curated authentic villages
  const curated = getHierarchyVillages(state, district, block);

  // 2. Official postal directory villages
  const offices = await fetchDistrictPostalOffices(state, district);
  let postalVillages = [];
  if (offices && offices.length > 0) {
    const cleanBlock = block.toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetPin = getPincodeForLocation(district, block, '');

    const matching = offices.filter((o) => {
      if (!cleanBlock) return true;
      if (targetPin && o.pincode === targetPin) return true;
      const oName = (o.officeName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return oName.includes(cleanBlock) || cleanBlock.includes(oName);
    });

    const pool = matching.length > 0 ? matching : offices;
    postalVillages = pool.map((o) => {
      return (o.officeName || '')
        .replace(/\s+(BO|SO|HO|B\.O|S\.O|H\.O)\b/gi, '')
        .trim();
    }).filter(Boolean);
  }

  const merged = [...new Set([...curated, ...postalVillages])];
  res.json({
    success: true,
    state,
    district,
    block,
    villages: merged.slice(0, 500)
  });
});

// 3c. Subdivisions for District
router.get('/locations/subdivisions', async (req, res) => {
  const district = (req.query.district || '').trim();
  const state = (req.query.state || '').trim();
  const subdivisions = getSubdivisionsForDistrict(state, district);
  res.json({
    success: true,
    state,
    district,
    subdivisions
  });
});

// 3d. Blocks for Subdivision / District
router.get('/locations/blocks', async (req, res) => {
  const district = (req.query.district || '').trim();
  const state = (req.query.state || '').trim();
  const subdivision = (req.query.subdivision || '').trim();
  const blocks = getBlocksForSubdivision(state, district, subdivision);
  res.json({
    success: true,
    state,
    district,
    subdivision,
    blocks
  });
});

// 3e. Dedicated PIN Code Resolver API
router.get('/locations/resolve-pincode', async (req, res) => {
  const state = (req.query.state || '').trim();
  const district = (req.query.district || '').trim();
  const block = (req.query.block || req.query.tehsil || '').trim();
  const village = (req.query.village || '').trim();

  // If neither block nor village is provided, do NOT resolve random PIN
  if (!district || (!block && !village)) {
    return res.json({ success: false, pincode: '' });
  }

  // 1. Try local exact map (0ms)
  const localPin = getPincodeForLocation(district, block, village);

  // 2. If village is specified, check dynamic postal offices
  const offices = await fetchDistrictPostalOffices(state, district);
  if (village && offices.length > 0) {
    const cleanV = village.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = offices.find((o) => {
      const oName = (o.officeName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return oName === cleanV || oName.startsWith(cleanV) || cleanV.startsWith(oName);
    });
    if (match && match.pincode) {
      return res.json({ success: true, pincode: match.pincode, source: 'village' });
    }
  }

  // 3. Return localPin if found
  if (localPin) {
    return res.json({ success: true, pincode: localPin, source: 'block_exact' });
  }

  // 4. Try matching block in dynamic postal offices
  if (block && offices.length > 0) {
    const cleanB = block.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = offices.find((o) => {
      const oName = (o.officeName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return oName.includes(cleanB) || cleanB.includes(oName);
    });
    if (match && match.pincode) {
      return res.json({ success: true, pincode: match.pincode, source: 'block_api' });
    }
  }

  // 5. Fall back to the district's most common pincode. Many districts (seen
  // with Champhai, Mizoram, among others) have no office explicitly typed
  // "HO" in this dataset at all — only Branch Offices — so requiring an HO
  // match left the field blank even though 40+ real, pincode-bearing offices
  // were right there. The most frequent pincode across the district's
  // offices is a reasonable district-level default; it's real postal data,
  // not a guess.
  if (offices.length > 0) {
    const counts = new Map();
    for (const office of offices) {
      if (!office.pincode) continue;
      counts.set(office.pincode, (counts.get(office.pincode) || 0) + 1);
    }
    if (counts.size > 0) {
      const [commonPincode] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      return res.json({ success: true, pincode: commonPincode, source: 'district_common' });
    }
  }

  res.json({ success: false, pincode: '' });
});

// 4. Postal Pincode Lookup API
router.get('/locations/pincode/:pincode', async (req, res) => {
  const pincode = req.params.pincode?.trim();
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit PIN code' });
  }

  const cacheKey = `pincode:${pincode}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const resp = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (resp.ok) {
      const data = await resp.json();
      const first = data?.[0];
      if (first?.Status === 'Success' && first.PostOffice?.length > 0) {
        const po = first.PostOffice[0];
        const villages = first.PostOffice.map((p) => p.Name).filter(Boolean);
        const result = {
          success: true,
          pincode,
          state: po.State,
          district: po.District,
          block: po.Block !== 'NA' ? po.Block : po.Division,
          division: po.Division,
          villages: [...new Set(villages)],
        };
        setCache(cacheKey, result);
        return res.json(result);
      }
    }
  } catch {
    // Fall through
  }

  res.json({ success: false, message: 'Could not find details for this PIN code' });
});

// 5. GPS Reverse Geocoding API
router.get('/locations/reverse-geo', async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'lat and lng query parameters required' });
  }

  const cacheKey = `geo:${Number(lat).toFixed(4)}:${Number(lng).toFixed(4)}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'SecurityJob-Portal/1.0', 'Accept-Language': 'en,hi' },
    });
    clearTimeout(timer);

    if (resp.ok) {
      const data = await resp.json();
      const addr = data?.address || {};
      const result = {
        success: true,
        displayName: data?.display_name || '',
        state: addr.state || '',
        district: addr.state_district || addr.county || addr.city || '',
        tehsil: addr.suburb || addr.neighbourhood || addr.county || '',
        village: addr.village || addr.town || addr.road || '',
        pincode: addr.postcode || '',
        road: addr.road || '',
      };
      setCache(cacheKey, result);
      return res.json(result);
    }
  } catch {
    // Fall through
  }

  res.json({ success: false, message: 'Unable to reverse geocode coordinates' });
});

// Public smart locations API for Rajasthan (backwards compatibility)
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
