const MAX_SEARCH_LENGTH = 100;

export function sanitizeSearch(input) {
  if (typeof input !== 'string') return '';
  // Strip control characters that could break the URL or display oddly.
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, MAX_SEARCH_LENGTH);
}

export function clampLimit(n, min = 1, max = 30) {
  const num = Number(n);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, Math.floor(num)));
}

export function clampSkip(n) {
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.floor(num);
}