import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatDate,
  generateId,
  formatRelativeDate,
  truncateText,
  formatNumber,
} from '../../utils/formatters';
import { trackSchema } from '../../lib/validations/track-schema';

/**
 * Tests for formatters utility functions
 */
describe('Formatters', () => {
  /**
   * Test: formatDuration function (milliseconds to M:SS)
   */
  describe('formatDuration', () => {
    /**
     * Test: Format 3 minutes and 5 seconds
     */
    it('should format duration in M:SS format', () => {
      const result = formatDuration(185000); // 3:05
      expect(result).toBe('3:05');
    });

    /**
     * Test: Format short duration
     */
    it('should format short duration', () => {
      const result = formatDuration(125000); // 2:05
      expect(result).toBe('2:05');
    });

    /**
     * Test: Format zero duration
     */
    it('should format zero duration', () => {
      const result = formatDuration(0);
      expect(result).toBe('0:00');
    });

    /**
     * Test: Format duration with padding
     */
    it('should pad seconds with leading zero', () => {
      const result = formatDuration(65000); // 1:05
      expect(result).toContain(':05');
    });
  });

  /**
   * Test: formatDate function
   */
  describe('formatDate', () => {
    /**
     * Test: Format date in Portuguese locale
     */
    it('should format date in Portuguese locale', () => {
      const date = '2024-01-15T10:30:00Z';
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    /**
     * Test: Format current date
     */
    it('should format current date', () => {
      const result = formatDate(new Date().toISOString());
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    /**
     * Test: Format date with specific pattern
     */
    it('should format date with specific pattern', () => {
      const date = '2023-12-25T00:00:00Z';
      const result = formatDate(date);
      expect(result).toContain('2023');
    });
  });

  /**
   * Test: formatRelativeDate function
   */
  describe('formatRelativeDate', () => {
    /**
     * Test: Format today's date
     */
    it('should return "Hoje" for today', () => {
      const result = formatRelativeDate(new Date().toISOString());
      expect(result).toBe('Hoje');
    });

    /**
     * Test: Format yesterday
     */
    it('should return "Ontem" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatRelativeDate(yesterday.toISOString());
      expect(result).toBe('Ontem');
    });

    /**
     * Test: Format week ago
     */
    it('should format days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const result = formatRelativeDate(threeDaysAgo.toISOString());
      expect(result).toContain('dias atrás');
    });
  });

  /**
   * Test: truncateText function
   */
  describe('truncateText', () => {
    /**
     * Test: Truncate long text
     */
    it('should truncate text longer than maxLength', () => {
      const result = truncateText('This is a long text', 10);
      expect(result).toBe('This is a ...');
      expect(result.length).toBeLessThanOrEqual(13);
    });

    /**
     * Test: Don't truncate short text
     */
    it('should not truncate text shorter than maxLength', () => {
      const result = truncateText('Short', 10);
      expect(result).toBe('Short');
    });
  });

  /**
   * Test: formatNumber function
   */
  describe('formatNumber', () => {
    /**
     * Test: Format million
     */
    it('should format numbers in millions', () => {
      const result = formatNumber(1500000);
      expect(result).toContain('M');
    });

    /**
     * Test: Format thousand
     */
    it('should format numbers in thousands', () => {
      const result = formatNumber(1500);
      expect(result).toContain('K');
    });

    /**
     * Test: Format small number
     */
    it('should return number as string for small numbers', () => {
      const result = formatNumber(500);
      expect(result).toBe('500');
    });
  });

  /**
   * Test: generateId function
   */
  describe('generateId', () => {
    /**
     * Test: Generate unique ID
     */
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    /**
     * Test: Generate ID with correct format
     */
    it('should generate ID with correct format', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeLessThanOrEqual(9);
    });

    /**
     * Test: Generate multiple unique IDs
     */
    it('should generate multiple unique IDs', () => {
      const ids = Array.from({ length: 100 }, () => generateId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });
});

/**
 * Tests for Zod validation schemas
 */
describe('Validations - Track Schema', () => {
  /**
   * Valid track data for testing
   */
  const validTrackData = {
    name: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    year: 2024,
    genre: 'Rock',
    duration: { minutes: 3, seconds: 45 },
    isReleased: true,
  };

  /**
   * Test: Valid track data passes validation
   */
  it('should validate correct track data', () => {
    const result = trackSchema.safeParse(validTrackData);
    expect(result.success).toBe(true);
  });

  /**
   * Test: Missing required field - name
   */
  it('should reject missing name', () => {
    const invalidData = { ...validTrackData, name: '' };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Name too short
   */
  it('should reject name shorter than 2 characters', () => {
    const invalidData = { ...validTrackData, name: 'A' };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Name too long
   */
  it('should reject name longer than 100 characters', () => {
    const invalidData = {
      ...validTrackData,
      name: 'A'.repeat(101),
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Invalid year (too old)
   */
  it('should reject year before 1900', () => {
    const invalidData = { ...validTrackData, year: 1899 };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Invalid year (future)
   */
  it('should reject year greater than current year', () => {
    const futureYear = new Date().getFullYear() + 1;
    const invalidData = { ...validTrackData, year: futureYear };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Invalid duration (all zeros)
   */
  it('should reject zero duration', () => {
    const invalidData = {
      ...validTrackData,
      duration: { minutes: 0, seconds: 0 },
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Invalid duration (minutes > 59)
   */
  it('should reject minutes greater than 59', () => {
    const invalidData = {
      ...validTrackData,
      duration: { minutes: 60, seconds: 0 },
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Invalid duration (seconds > 59)
   */
  it('should reject seconds greater than 59', () => {
    const invalidData = {
      ...validTrackData,
      duration: { minutes: 3, seconds: 60 },
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Valid duration at boundary (59:59)
   */
  it('should accept boundary duration 59:59', () => {
    const validData = {
      ...validTrackData,
      duration: { minutes: 59, seconds: 59 },
    };
    const result = trackSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  /**
   * Test: Missing genre
   */
  it('should reject missing genre', () => {
    const invalidData = { ...validTrackData, genre: '' };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  /**
   * Test: Boolean isReleased field
   */
  it('should validate isReleased as boolean', () => {
    const releasedData = { ...validTrackData, isReleased: true };
    const result = trackSchema.safeParse(releasedData);
    expect(result.success).toBe(true);

    const notReleasedData = { ...validTrackData, isReleased: false };
    const result2 = trackSchema.safeParse(notReleasedData);
    expect(result2.success).toBe(true);
  });

  /**
   * Test: Get error details
   */
  it('should provide detailed error information', () => {
    const invalidData = {
      ...validTrackData,
      name: 'A', // Too short
      year: 1800, // Too old
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
