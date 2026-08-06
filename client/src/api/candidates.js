import apiClient from './client.js';

export async function fetchPageConfig(jobSlug) {
  const { data } = await apiClient.get(`/public/page-config/${encodeURIComponent(jobSlug)}`);
  return data;
}

export async function submitCandidateApplication(formData) {
  // Deliberately no explicit Content-Type header: the browser must generate its
  // own multipart boundary for a FormData body. Setting 'multipart/form-data'
  // manually here previously overrode that and sent a boundary-less header,
  // which silently broke file parsing server-side (busboy couldn't delimit
  // parts) while text fields still happened to come through — candidates were
  // saved, but their photo/resume uploads were dropped without any error.
  const { data } = await apiClient.post('/public/candidates/register', formData);
  return data;
}
