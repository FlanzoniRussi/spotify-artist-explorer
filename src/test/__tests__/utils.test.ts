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

describe('Formatters', () => {
  
  describe('formatDuration', () => {
    
    it('should format duration in M:SS format', () => {
      const result = formatDuration(185000); // 3:05
      expect(result).toBe('3:05');
    });

    it('should format short duration', () => {
      const result = formatDuration(125000); // 2:05
      expect(result).toBe('2:05');
    });

    it('should format zero duration', () => {
      const result = formatDuration(0);
      expect(result).toBe('0:00');
    });

    it('should pad seconds with leading zero', () => {
      const result = formatDuration(65000); // 1:05
      expect(result).toContain(':05');
    });
  });

  describe('formatDate', () => {
    
    it('should format date in Portuguese locale', () => {
      const date = '2024-01-15T10:30:00Z';
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    it('should format current date', () => {
      const result = formatDate(new Date().toISOString());
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format date with specific pattern', () => {
      const date = '2023-12-25T00:00:00Z';
      const result = formatDate(date);
      expect(result).toContain('2023');
    });
  });

  describe('formatRelativeDate', () => {
    
    it('should return "Hoje" for today', () => {
      const result = formatRelativeDate(new Date().toISOString());
      expect(result).toBe('Hoje');
    });

    it('should return "Ontem" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatRelativeDate(yesterday.toISOString());
      expect(result).toBe('Ontem');
    });

    it('should format days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const result = formatRelativeDate(threeDaysAgo.toISOString());
      expect(result).toContain('dias atrás');
    });
  });

  describe('truncateText', () => {
    
    it('should truncate text longer than maxLength', () => {
      const result = truncateText('This is a long text', 10);
      expect(result).toBe('This is a ...');
      expect(result.length).toBeLessThanOrEqual(13);
    });

    it('should not truncate text shorter than maxLength', () => {
      const result = truncateText('Short', 10);
      expect(result).toBe('Short');
    });
  });

  describe('formatNumber', () => {
    
    it('should format numbers in millions', () => {
      const result = formatNumber(1500000);
      expect(result).toContain('M');
    });

    it('should format numbers in thousands', () => {
      const result = formatNumber(1500);
      expect(result).toContain('K');
    });

    it('should return number as string for small numbers', () => {
      const result = formatNumber(500);
      expect(result).toBe('500');
    });
  });

  describe('generateId', () => {
    
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate ID with correct format', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeLessThanOrEqual(9);
    });

    it('should generate multiple unique IDs', () => {
      const ids = Array.from({ length: 100 }, () => generateId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });
});

describe('Validations - Track Schema', () => {
  
  const validTrackData = {
    name: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    year: 2024,
    genre: 'Rock',
    duration: { minutes: 3, seconds: 45 },
    isReleased: true,
  };

  it('should validate correct track data', () => {
    const result = trackSchema.safeParse(validTrackData);
    expect(result.success).toBe(true);
  });

  it('should reject missing name', () => {
    const invalidData = { ...validTrackData, name: '' };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject name shorter than 2 characters', () => {
    const invalidData = { ...validTrackData, name: 'A' };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject name longer than 100 characters', () => {
    const invalidData = {
      ...validTrackData,
      name: 'A'.repeat(101),
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject year before 1900', () => {
    const invalidData = { ...validTrackData, year: 1899 };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject year greater than current year', () => {
    const futureYear = new Date().getFullYear() + 1;
    const invalidData = { ...validTrackData, year: futureYear };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject zero duration', () => {
    const invalidData = {
      ...validTrackData,
      duration: { minutes: 0, seconds: 0 },
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject minutes greater than 59', () => {
    const invalidData = {
      ...validTrackData,
      duration: { minutes: 60, seconds: 0 },
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject seconds greater than 59', () => {
    const invalidData = {
      ...validTrackData,
      duration: { minutes: 3, seconds: 60 },
    };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept boundary duration 59:59', () => {
    const validData = {
      ...validTrackData,
      duration: { minutes: 59, seconds: 59 },
    };
    const result = trackSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject missing genre', () => {
    const invalidData = { ...validTrackData, genre: '' };
    const result = trackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should validate isReleased as boolean', () => {
    const releasedData = { ...validTrackData, isReleased: true };
    const result = trackSchema.safeParse(releasedData);
    expect(result.success).toBe(true);

    const notReleasedData = { ...validTrackData, isReleased: false };
    const result2 = trackSchema.safeParse(notReleasedData);
    expect(result2.success).toBe(true);
  });

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
