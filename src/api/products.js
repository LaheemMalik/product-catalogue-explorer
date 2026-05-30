import { apiFetch } from './client';

const BASE_URL = 'https://dummyjson.com';

export function getProducts({
  search = '',
  category = '',
  sort = '',
  limit = 20,
  skip = 0,
  signal,
} = {}) {
  const params = new URLSearchParams({ limit, skip });

  if (sort) {
    const [sortBy, order] = sort.split('-');
    params.set('sortBy', sortBy);
    params.set('order', order);
  }

  let path;
  if (search) {
    path = `/products/search?q=${encodeURIComponent(search)}&${params}`;
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}?${params}`;
  } else {
    path = `/products?${params}`;
  }

  return apiFetch(`${BASE_URL}${path}`, { signal });
}

export function getCategoryList({ signal } = {}) {
  return apiFetch(`${BASE_URL}/products/category-list`, { signal });
}