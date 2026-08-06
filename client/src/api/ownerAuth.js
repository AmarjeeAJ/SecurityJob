import apiClient from './client.js';

export async function loginOwner(email, password) {
  const { data } = await apiClient.post('/owner/auth/login', { email, password });
  return data;
}

export async function logoutOwner() {
  const { data } = await apiClient.post('/owner/auth/logout');
  return data;
}

export async function fetchOwnerSession() {
  const { data } = await apiClient.get('/owner/auth/session');
  return data;
}
