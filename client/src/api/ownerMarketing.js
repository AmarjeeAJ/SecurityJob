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

export async function runMetaSync(body) {
  const { data } = await apiClient.post('/owner/marketing/meta-sync', body || {});
  return data;
}
