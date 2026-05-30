import { describe, it, expect } from 'vitest';
import { sanitizeSearch, clampLimit, clampSkip } from '../src/utils/validate';

describe('sanitizeSearch', () => {
  it('trims whitespace', () => {
    expect(sanitizeSearch('  phone  ')).toBe('phone');
  });

  it('returns empty string for non-strings', () => {
    expect(sanitizeSearch(null)).toBe('');
    expect(sanitizeSearch(undefined)).toBe('');
    expect(sanitizeSearch(123)).toBe('');
  });

  it('strips control characters', () => {
    expect(sanitizeSearch('phone\x00\x07test')).toBe('phonetest');
  });

  it('caps length at 100 characters', () => {
    expect(sanitizeSearch('a'.repeat(200))).toHaveLength(100);
  });
});

describe('clampLimit', () => {
  it('clamps within range', () => {
    expect(clampLimit(50)).toBe(30);
    expect(clampLimit(-5)).toBe(1);
    expect(clampLimit(15)).toBe(15);
  });

  it('defaults to min for invalid input', () => {
    expect(clampLimit('foo')).toBe(1);
  });
});

describe('clampSkip', () => {
  it('returns 0 for negative or invalid input', () => {
    expect(clampSkip(-1)).toBe(0);
    expect(clampSkip('bad')).toBe(0);
  });

  it('floors valid numbers', () => {
    expect(clampSkip(15.7)).toBe(15);
  });
});