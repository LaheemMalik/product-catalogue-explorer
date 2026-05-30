import { apiFetch } from './client';

const BASE_URL = 'https://dummyjson.com';

export function getProducts({ limit = 20, skip = 0, signal } = {}) {
  const url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  return apiFetch(url, { signal });
}