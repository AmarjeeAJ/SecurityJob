import apiClient from './client.js';

export async function fetchCandidates(params) {
  const { data } = await apiClient.get('/owner/candidates', { params });
  return data;
}

export async function fetchCandidateDetails(id) {
  const { data } = await apiClient.get(`/owner/candidates/${id}`);
  return data;
}

export async function deleteCandidate(id) {
  const { data } = await apiClient.delete(`/owner/candidates/${id}`);
  return data;
}

export function buildExportCsvUrl(params) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ''))
  ).toString();
  const base = `${apiClient.defaults.baseURL}/owner/candidates/export.csv`;
  return query ? `${base}?${query}` : base;
}
