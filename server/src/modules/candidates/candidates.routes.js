import { Router } from 'express';
import query from '../../db/query.js';
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

// Standard Levenshtein edit distance, used to match curated place names
// against the official LGD spelling when they're close but not an exact
// or substring match (e.g. "Isuapur" vs "Ishupur").
function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
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

// Matches a list of hand-typed/curated place names against real DB rows
// (blocks or urban local bodies — both are {code, name} shaped once mapped
// via getName) using exact/substring matching first, then Levenshtein
// edit-distance as a fallback for near-spellings (e.g. curated "Isuapur" vs
// the real LGD "Ishupur"). Returns the matched rows' codes.
function matchNamesAgainstRows(names, rows, getName) {
  const matched = new Set();
  for (const name of names) {
    const cleanName = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanName) continue;

    let foundDirectMatch = false;
    for (const row of rows) {
      const cleanDb = (getName(row) || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanDb === cleanName || cleanDb.includes(cleanName) || cleanName.includes(cleanDb)) {
        matched.add(row);
        foundDirectMatch = true;
      }
    }

    if (!foundDirectMatch) {
      let bestRow = null;
      let bestDistance = Infinity;
      for (const row of rows) {
        const cleanDb = (getName(row) || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const distance = levenshteinDistance(cleanName, cleanDb);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestRow = row;
        }
      }
      if (bestRow) {
        const cleanDb = (getName(bestRow) || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const threshold = Math.max(2, Math.floor(Math.max(cleanName.length, cleanDb.length) * 0.3));
        if (bestDistance <= threshold) {
          matched.add(bestRow);
        }
      }
    }
  }
  return [...matched];
}

// 3b. Dedicated Village/Area lookup for specific Tehsil, Block, or Subdivision
router.get('/locations/villages', async (req, res) => {
  const district = (req.query.district || '').trim();
  const state = (req.query.state || '').trim();
  const block = (req.query.block || req.query.tehsil || '').trim();

  // 1. Real, exhaustive village data — the `villages` table (676k+ real
  // villages, seeded from the official LGD directory via seedLgd.js) is the
  // authoritative source. The UI now selects a Subdivision, not a Block, so
  // `block` here is usually a subdivision name; resolve it to every LGD
  // block that belongs to that subdivision (via the curated
  // SUBDIVISION_BLOCK_MAP) and pull every village under all of them —
  // not just whichever single block happened to fuzzy-match.
  let lgdVillages = [];
  try {
    const dbBlocks = await query(
      `SELECT b.block_code, b.block_name FROM blocks b
       JOIN districts d ON d.district_code = b.district_code
       JOIN states s ON s.state_code = d.state_code
       WHERE lower(s.state_name) = lower($1) AND lower(d.district_name) = lower($2)`,
      [state, district]
    );

    // Try treating `block` as a Subdivision first (the common case now).
    const blockNamesInSubdivision = block ? getBlocksForSubdivision(state, district, block) : [];
    let matchedBlocks = matchNamesAgainstRows(blockNamesInSubdivision, dbBlocks.rows, (r) => r.block_name);

    // Fall back to matching `block` directly against real block names —
    // covers a real Block/Tehsil value, or a subdivision with no curated
    // block list on record.
    if (matchedBlocks.length === 0 && block) {
      matchedBlocks = matchNamesAgainstRows([block], dbBlocks.rows, (r) => r.block_name);
    }

    if (matchedBlocks.length > 0) {
      const villagesResult = await query(
        'SELECT DISTINCT village_name FROM villages WHERE block_code = ANY($1::int[]) ORDER BY village_name',
        [matchedBlocks.map((r) => r.block_code)]
      );
      lgdVillages = villagesResult.rows.map((r) => r.village_name).filter(Boolean);
    }
  } catch (err) {
    // DB unreachable/unseeded — degrade to the curated + postal sources below.
  }

  // 1b. Urban Local Body Wards — the government's actual "village"-equivalent
  // list for cities. Rural blocks are covered by LGD villages above; fully
  // urban areas (New Delhi, Mumbai, "X City" blocks) have no LGD villages —
  // cities use municipal wards, a separate LGD dataset (Urban Local Bodies +
  // Wards) now loaded via seedLgd.js. Try this whenever the rural lookup
  // came up empty, using the same district/block name matched against real
  // Urban Local Body names.
  let wardVillages = [];
  if (lgdVillages.length === 0) {
    try {
      const dbUlbs = await query(
        `SELECT ulb.local_body_code, ulb.local_body_name FROM urban_local_bodies ulb
         JOIN states s ON s.state_code = ulb.state_code
         WHERE lower(s.state_name) = lower($1)`,
        [state]
      );
      const candidateNames = [block, district].filter(Boolean);
      const matchedUlbs = matchNamesAgainstRows(candidateNames, dbUlbs.rows, (r) => r.local_body_name);
      if (matchedUlbs.length > 0) {
        const wardsResult = await query(
          'SELECT DISTINCT ward_name FROM urban_local_body_wards WHERE local_body_code = ANY($1::int[]) ORDER BY ward_name',
          [matchedUlbs.map((r) => r.local_body_code)]
        );
        wardVillages = wardsResult.rows.map((r) => r.ward_name).filter(Boolean);
      }
    } catch (err) {
      // DB unreachable/unseeded — degrade to the postal source below.
    }
  }

  // 2. Official postal directory villages — real supplementary data (named
  // localities that aren't separate LGD village records) when an office
  // name actually matches the block.
  //
  // Fully-urban blocks (New Delhi, Chandigarh, "X City" blocks, etc.) mostly
  // have no LGD villages — cities use municipal wards, now covered above via
  // wardVillages. Name-matching alone badly under-serves the remaining gap
  // cases: a city's post offices are named after their own locality
  // ("Chanakya Puri SO", "Bengali Market SO"), not the district/block name,
  // so matching against "new delhi" caught 1 of New Delhi's 84 real
  // offices. When neither lgdVillages nor wardVillages found anything, use
  // every real office for the district instead of only the name-matched
  // ones — still genuine postal data, just not filtered down to a handful
  // of coincidental name matches.
  const hasRealData = lgdVillages.length > 0 || wardVillages.length > 0;
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

    const officePool = hasRealData ? matching : offices;
    postalVillages = officePool.map((o) => {
      return (o.officeName || '')
        .replace(/\s+(BO|SO|HO|B\.O|S\.O|H\.O)\b/gi, '')
        .trim();
    }).filter(Boolean);
  }

  // 3. Small hand-curated sample. Only used as the absolute last resort —
  // when there's no real LGD village data, no real ward data, AND no real
  // postal data either — since its own last-resort branch fabricates
  // placeholder text like "X मुख्य कस्बा / टाउन" rather than a real place name.
  const curated = (!hasRealData && postalVillages.length === 0)
    ? getHierarchyVillages(state, district, block)
    : [];

  const merged = [...new Set([...lgdVillages, ...wardVillages, ...postalVillages, ...curated])];
  res.json({
    success: true,
    state,
    district,
    block,
    villages: merged.slice(0, 1000)
  });
});

// 3c. Subdivisions for District
router.get('/locations/subdivisions', async (req, res) => {
  const district = (req.query.district || '').trim();
  const state = (req.query.state || '').trim();
  let subdivisions = getSubdivisionsForDistrict(state, district);

  // SUBDIVISION_BLOCK_MAP is hand-curated for only 23 districts (Bihar's and
  // Rajasthan's major ones, plus 3 in UP). Every other district — 97% of
  // India — fell back to a generic "District सदर / District ग्रामीण"
  // placeholder that doesn't correspond to any real administrative unit, so
  // picking either one returned the exact same unscoped, district-wide
  // village list (verified: Ludhiana Sadar vs Ludhiana Rural, 382/387
  // identical villages). For those districts, use the real LGD blocks —
  // already loaded for all 784 districts via seedLgd.js — as the
  // selectable list instead, so each option actually scopes the village
  // list to its own real area.
  const isPlaceholder =
    subdivisions.length > 0 &&
    subdivisions.length <= 2 &&
    subdivisions.every((s) => s.includes('सदर') || s.includes('ग्रामीण'));

  if (isPlaceholder) {
    try {
      const realBlocks = await query(
        `SELECT b.block_name FROM blocks b
         JOIN districts d ON d.district_code = b.district_code
         JOIN states s ON s.state_code = d.state_code
         WHERE lower(s.state_name) = lower($1) AND lower(d.district_name) = lower($2)
         ORDER BY b.block_name`,
        [state, district]
      );
      if (realBlocks.rows.length > 0) {
        subdivisions = realBlocks.rows.map((r) => r.block_name).filter(Boolean);
      }
    } catch {
      // DB unavailable — keep the placeholder as a last resort so the
      // dropdown isn't left empty.
    }
  }

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

  // 0. Authoritative government data — direct Village -> Pincode mapping
  // from the LGD `pincode_villages` dataset (seeded onto villages.pincode
  // via seedLgd.js). This is the real per-village record from the source
  // of truth, not a heuristic — it should win over every fallback below.
  // (This is what fixes cases like "Gangoi" resolving to the wrong pincode
  // under the old office-name-matching heuristic: 841411 is the village's
  // actual government-assigned pincode.)
  if (village) {
    try {
      const exact = await query(
        `SELECT v.pincode, b.block_name FROM villages v
         JOIN districts d ON d.district_code = v.district_code
         JOIN states s ON s.state_code = v.state_code
         JOIN blocks b ON b.block_code = v.block_code
         WHERE lower(s.state_name) = lower($1) AND lower(d.district_name) = lower($2)
           AND lower(v.village_name) = lower($3) AND v.pincode IS NOT NULL`,
        [state, district, village]
      );

      let rows = exact.rows;
      if (rows.length === 0) {
        const fuzzy = await query(
          `SELECT v.pincode, b.block_name FROM villages v
           JOIN districts d ON d.district_code = v.district_code
           JOIN states s ON s.state_code = v.state_code
           JOIN blocks b ON b.block_code = v.block_code
           WHERE lower(s.state_name) = lower($1) AND lower(d.district_name) = lower($2)
             AND lower(v.village_name) LIKE '%' || lower($3) || '%' AND v.pincode IS NOT NULL
           LIMIT 20`,
          [state, district, village]
        );
        rows = fuzzy.rows;
      }

      if (rows.length > 0) {
        // Multiple villages can share a name within a district — if the
        // candidate also gave a block/subdivision, prefer the row whose
        // block matches it.
        let chosen = rows[0];
        if (block && rows.length > 1) {
          const cleanBlock = block.toLowerCase().replace(/[^a-z0-9]/g, '');
          const blockMatch = rows.find((r) => {
            const cleanDb = (r.block_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanDb.includes(cleanBlock) || cleanBlock.includes(cleanDb);
          });
          if (blockMatch) chosen = blockMatch;
        }
        return res.json({ success: true, pincode: chosen.pincode, source: 'lgd_village' });
      }
    } catch (err) {
      // DB unreachable/unseeded — degrade to the heuristic sources below.
    }
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

  // 4.5. Authoritative government urban data — Urban Local Body -> Pincode
  // mapping (LGD `pincode_urban` dataset). Cities aren't covered by the
  // villages table at all, so when nothing above resolved anything, try
  // matching the block/district against a real Urban Local Body name and
  // use its real government pincode(s) instead of falling straight to the
  // coarser "district's most common pincode" heuristic below.
  try {
    const dbUlbs = await query(
      `SELECT ulb.local_body_code, ulb.local_body_name FROM urban_local_bodies ulb
       JOIN states s ON s.state_code = ulb.state_code
       WHERE lower(s.state_name) = lower($1)`,
      [state]
    );
    const candidateNames = [block, district].filter(Boolean);
    const matchedUlbs = matchNamesAgainstRows(candidateNames, dbUlbs.rows, (r) => r.local_body_name);
    if (matchedUlbs.length > 0) {
      const ulbPins = await query(
        'SELECT DISTINCT pincode FROM urban_local_body_pincodes WHERE local_body_code = ANY($1::int[]) ORDER BY pincode',
        [matchedUlbs.map((r) => r.local_body_code)]
      );
      if (ulbPins.rows.length > 0) {
        return res.json({ success: true, pincode: ulbPins.rows[0].pincode, source: 'urban_local_body' });
      }
    }
  } catch (err) {
    // DB unreachable/unseeded — degrade to the district-common fallback below.
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
