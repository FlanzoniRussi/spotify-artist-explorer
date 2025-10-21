import { describe, it, expect } from 'vitest';
import { formatDuration, formatDate, generateId, debounce } from '../../utils/formatters';

describe('formatters', () => {
  describe('formatDuration', () => {
    it('should format duration in milliseconds to mm:ss', () => {
      expect(formatDuration(180000)).toBe('3:00');
      expect(formatDuration(125000)).toBe('2:05');
      expect(formatDuration(60000)).toBe('1:00');
      expect(formatDuration(30000)).toBe('0:30');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0:00');
    });
  });

  describe('formatDate', () => {
    it('should format date string to readable format', () => {
      const date = '2023-01-01';
      const result = formatDate(date);
      expect(result).toMatch(/\d+ de \w+ de \d{4}/);
    });

    it('should handle invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with correct length', () => {
      const id = generateId();
      expect(id).toHaveLength(9);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
    });
  });
});
