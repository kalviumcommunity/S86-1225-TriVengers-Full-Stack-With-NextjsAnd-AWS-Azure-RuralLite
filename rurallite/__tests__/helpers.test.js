/**
 * @jest-environment jsdom
 */

import { formatDate, validateEmail, capitalize, truncateString } from '@/lib/utils/helpers';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date in short format (YYYY-MM-DD)', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'short')).toBe('2024-01-15');
    });

    it('should format date in long format with month name', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'long');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should return empty string for null date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('should default to short format', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('2024-01-15');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('admin@rurallite.io')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('z')).toBe('Z');
    });

    it('should return empty string for null/undefined', () => {
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('truncateString', () => {
    it('should truncate string longer than specified length', () => {
      const longString = 'This is a very long string that should be truncated';
      const result = truncateString(longString, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBeLessThanOrEqual(26);
    });

    it('should not truncate string shorter than length', () => {
      expect(truncateString('Short', 50)).toBe('Short');
    });

    it('should use default length of 50', () => {
      const str = 'a'.repeat(100);
      const result = truncateString(str);
      expect(result).toBe('a'.repeat(50) + '...');
    });

    it('should handle null/undefined', () => {
      expect(truncateString(null)).toBe('');
      expect(truncateString(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(truncateString('')).toBe('');
    });
  });
});
