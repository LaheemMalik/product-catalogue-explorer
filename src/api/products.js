import { apiFetch } from './client';

const BASE_URL = 'https://dummyjson.com';

export function getProducts({ search = '', limit = 20, skip = 0, signal } = {}) {
  const params = new URLSearchParams({ limit, skip });
  const path = search
    ? `/products/search?q=${encodeURIComponent(search)}&${params}`
    : `/products?${params}`;
  return apiFetch(`${BASE_URL}${path}`, { signal });
}