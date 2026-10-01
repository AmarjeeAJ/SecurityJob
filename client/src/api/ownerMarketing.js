import apiClient from './client.js';

async function get(path, params) {
  const { data } = await apiClient.get(`/owner/marketing/${path}`, { params });
  return data;
}

export const fetchMarketingSummary = (params) => get('summary', params);
export const fetchMarketingTrends = (params) => get('trends', params);
export const fetchMarketingComparison = (params) => get('comparison', params);
export const fetchMarketingCampaigns = (params) => get('campaigns', params);
export const fetchMarketingAdsets = (params) => get('adsets', params);
export const fetchMarketingAds = (params) => get('ads', params);
export const fetchMarketingSources = (params) => get('sources', params);
export const fetchMarketingLocations = (params) => get('locations', params);
export const fetchMarketingRoles = (params) => get('roles', params);

// Meta sync requests paginate through potentially thousands of records and
// can legitimately take well over the client's default 20s timeout (seen in
// practice: ~40s for a full Instant Form leads sync) -- the sync itself
// still completes successfully server-side even when the browser gives up
// waiting, which looked like a false "failed" to the user. A longer,
// sync-specific timeout keeps the UI's status message honest.
const SYNC_TIMEOUT_MS = 180000;

export async function runMetaSync(body) {
  const { data } = await apiClient.post('/owner/marketing/meta-sync', body || {}, { timeout: SYNC_TIMEOUT_MS });
  return data;
}

export async function runMetaLeadsSync() {
  const { data } = await apiClient.post('/owner/marketing/meta-leads-sync', {}, { timeout: SYNC_TIMEOUT_MS });
  return data;
}

export async function runSpybotMetaSync(body) {
  const { data } = await apiClient.post('/owner/marketing/spybot-meta-sync', body || {}, { timeout: SYNC_TIMEOUT_MS });
  return data;
}

export async function runSpybotMetaLeadsSync() {
  const { data } = await apiClient.post('/owner/marketing/spybot-meta-leads-sync', {}, { timeout: SYNC_TIMEOUT_MS });
  return data;
}
