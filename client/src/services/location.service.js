import axios from 'axios';
import { ALL_INDIAN_STATES, INDIA_STATES_DISTRICTS } from '../utils/india-locations.js';
import { DISTRICT_TEHSILS_DATA, getSmartAreasForDistrict } from '../utils/locations.js';
import { 
  getTehsilsForDistrict as getHierarchyTehsils, 
  getVillagesForTehsil as getHierarchyVillages,
  getSubdivisionsForDistrict,
  getBlocksForSubdivision,
  getPincodeForLocation
} from '../utils/tehsilVillages.js';

const clientCache = new Map();

/**
 * Fetch all Indian States
 */
export async function fetchStates() {
  try {
    const res = await axios.get('/api/public/candidates/locations/states');
    if (res.data?.success && Array.isArray(res.data.states)) {
      return res.data.states;
    }
  } catch {
    // Graceful fallback to bundled dataset
  }
  return ALL_INDIAN_STATES;
}

/**
 * Fetch Districts for a given State
 */
export async function fetchDistricts(state = 'Rajasthan') {
  const cacheKey = `districts:${state}`.toLowerCase();
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  try {
    const res = await axios.get('/api/public/candidates/locations/districts', { params: { state } });
    if (res.data?.success && Array.isArray(res.data.districts)) {
      clientCache.set(cacheKey, res.data.districts);
      return res.data.districts;
    }
  } catch {
    // Graceful fallback to bundled dataset
  }

  const fallback = INDIA_STATES_DISTRICTS[state] || INDIA_STATES_DISTRICTS['Rajasthan'] || [];
  clientCache.set(cacheKey, fallback);
  return fallback;
}

/**
 * Fetch Subdivisions for a District
 */
export async function fetchSubdivisions(state = '', district = '') {
  if (!district) return [];
  const cacheKey = `subdivisions:${state}:${district}`.toLowerCase();
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  const localSubs = getSubdivisionsForDistrict(state, district);

  try {
    const res = await axios.get('/api/public/candidates/locations/subdivisions', {
      params: { state, district },
      timeout: 2500
    });
    if (res.data?.success && Array.isArray(res.data.subdivisions) && res.data.subdivisions.length > 0) {
      const merged = [...new Set([...res.data.subdivisions, ...localSubs])];
      clientCache.set(cacheKey, merged);
      return merged;
    }
  } catch {
    // Graceful fallback
  }

  clientCache.set(cacheKey, localSubs);
  return localSubs;
}

/**
 * Fetch Blocks for a Subdivision / District
 */
export async function fetchBlocks(state = '', district = '', subdivision = '') {
  if (!district) return [];
  const cacheKey = `blocks:${state}:${district}:${subdivision}`.toLowerCase();
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  const localBlocks = getBlocksForSubdivision(state, district, subdivision);

  try {
    const res = await axios.get('/api/public/candidates/locations/blocks', {
      params: { state, district, subdivision },
      timeout: 2500
    });
    if (res.data?.success && Array.isArray(res.data.blocks) && res.data.blocks.length > 0) {
      const merged = [...new Set([...res.data.blocks, ...localBlocks])];
      clientCache.set(cacheKey, merged);
      return merged;
    }
  } catch {
    // Graceful fallback
  }

  clientCache.set(cacheKey, localBlocks);
  return localBlocks;
}

/**
 * Auto-resolve PIN code based on location hierarchy (with server resolver and instant local fallback)
 */
export async function resolvePincode(state = '', district = '', block = '', village = '') {
  // The server resolver checks the real government village->pincode data
  // first (and only then falls back to this same local heuristic map among
  // other sources) — calling it first here, instead of after, is what
  // actually lets that real per-village data reach the form. Checking the
  // local block-level heuristic first meant it returned immediately for
  // almost any village (since the map has some entry for most blocks),
  // silently short-circuiting the authoritative server lookup and making
  // the autofilled pincode read as "based on the tehsil" rather than the
  // specific village.
  try {
    const res = await axios.get('/api/public/candidates/locations/resolve-pincode', {
      params: { state, district, block, village },
      timeout: 3000
    });
    if (res.data?.success && res.data.pincode && /^\d{6}$/.test(res.data.pincode)) {
      return res.data.pincode;
    }
  } catch {
    // Non-blocking — fall through to the local heuristic below.
  }

  const localPin = getPincodeForLocation(district, block, village);
  if (localPin && /^\d{6}$/.test(localPin)) {
    return localPin;
  }

  return '';
}

export function resolvePincodeSync(district = '', block = '', village = '') {
  return getPincodeForLocation(district, block, village);
}


/**
 * Fetch dynamic Tehsils and Villages for a given District & State via API
 */
export async function fetchTehsilsAndVillages(state = 'Rajasthan', district = 'Jaipur', tehsil = '') {
  if (!district) return { tehsils: [], villages: [] };
  const cacheKey = `tehsils:${state}:${district}:${tehsil}`.toLowerCase();
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  // 1. Instant authentic hierarchy fallback
  const hierarchyTehsils = getHierarchyTehsils(state, district);
  const hierarchyVillages = getHierarchyVillages(state, district, tehsil);

  // 2. Try local server location API
  try {
    const res = await axios.get('/api/public/candidates/locations/tehsils', {
      params: { state, district, tehsil },
      timeout: 3000
    });
    if (res.data?.success && (res.data.tehsils?.length > 0 || res.data.villages?.length > 0)) {
      const mergedTehsils = [...new Set([...(res.data.tehsils || []), ...hierarchyTehsils])];
      const mergedVillages = [...new Set([...(res.data.villages || []), ...hierarchyVillages])];
      const data = {
        tehsils: mergedTehsils,
        villages: mergedVillages
      };
      clientCache.set(cacheKey, data);
      return data;
    }
  } catch {
    // Fallback to direct client hierarchy
  }

  // 3. Fallback: Rajasthan local data if Rajasthan
  let tehsils = hierarchyTehsils;
  let villages = hierarchyVillages;

  if (state.toLowerCase() === 'rajasthan') {
    const rjTehsils = DISTRICT_TEHSILS_DATA[district] || [];
    const rjVillages = getSmartAreasForDistrict(district) || [];
    tehsils = [...new Set([...tehsils, ...rjTehsils])];
    if (!tehsil && villages.length < 10) {
      villages = [...new Set([...villages, ...rjVillages])];
    }
  }

  if (tehsils.length === 0) {
    tehsils = [`${district} सदर (Sadar)`, `${district} ग्रामीण (Rural)`, `${district} मुख्य ब्लॉक`];
  }

  const result = { tehsils, villages };
  clientCache.set(cacheKey, result);
  return result;
}

/**
 * Fetch specific villages / towns / wards for a given Tehsil
 */
export async function fetchVillagesForTehsil(state = '', district = '', tehsil = '') {
  if (!district || !tehsil) return [];
  const cacheKey = `villages:${state}:${district}:${tehsil}`.toLowerCase();
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  // Check hierarchy dataset first for immediate response
  const localVillages = getHierarchyVillages(state, district, tehsil);

  try {
    const res = await axios.get('/api/public/candidates/locations/villages', {
      params: { state, district, tehsil },
      timeout: 2500
    });
    if (res.data?.success && Array.isArray(res.data.villages) && res.data.villages.length > 0) {
      const combined = [...new Set([...res.data.villages, ...localVillages])];
      clientCache.set(cacheKey, combined);
      return combined;
    }
  } catch {
    // Graceful fallback
  }

  clientCache.set(cacheKey, localVillages);
  return localVillages;
}

/**
 * Lookup PIN Code via API to retrieve State, District, Block, and Villages
 */
export async function lookupPincode(pincode) {
  if (!pincode || !/^\d{6}$/.test(pincode)) return null;
  const cacheKey = `pincode:${pincode}`;
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  try {
    const res = await axios.get(`/api/public/candidates/locations/pincode/${pincode}`, { timeout: 5000 });
    if (res.data?.success) {
      clientCache.set(cacheKey, res.data);
      return res.data;
    }
  } catch {
    // Fallback direct call to postal API
    try {
      const direct = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (direct.ok) {
        const json = await direct.json();
        const first = json?.[0];
        if (first?.Status === 'Success' && first.PostOffice?.length > 0) {
          const po = first.PostOffice[0];
          const villages = [...new Set(first.PostOffice.map((p) => p.Name).filter(Boolean))];
          const result = {
            success: true,
            pincode,
            state: po.State,
            district: po.District,
            block: po.Block !== 'NA' ? po.Block : po.Division,
            villages,
          };
          clientCache.set(cacheKey, result);
          return result;
        }
      }
    } catch {
      // Non-blocking
    }
  }

  return null;
}

/**
 * Reverse geocode latitude and longitude to get structured address components
 */
export async function reverseGeocode(lat, lng) {
  if (!lat || !lng) return null;
  const cacheKey = `geo:${Number(lat).toFixed(4)}:${Number(lng).toFixed(4)}`;
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  try {
    const res = await axios.get('/api/public/candidates/locations/reverse-geo', {
      params: { lat, lng },
      timeout: 5000
    });
    if (res.data?.success) {
      clientCache.set(cacheKey, res.data);
      return res.data;
    }
  } catch {
    // Fallback direct call
    try {
      const direct = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`);
      if (direct.ok) {
        const data = await direct.json();
        const addr = data?.address || {};
        const result = {
          success: true,
          displayName: data?.display_name || '',
          state: addr.state || '',
          district: addr.state_district || addr.county || addr.city || '',
          tehsil: addr.suburb || addr.neighbourhood || addr.county || '',
          village: addr.village || addr.town || addr.road || '',
          pincode: addr.postcode || '',
        };
        clientCache.set(cacheKey, result);
        return result;
      }
    } catch {
      // Non-blocking
    }
  }

  return null;
}
