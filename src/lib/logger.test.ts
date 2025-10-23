import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logger } from './logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logging levels', () => {
    it('should log debug messages', () => {
      const consoleSpy = vi
        .spyOn(console, 'debug')
        .mockImplementation(() => {});
      logger.debug('Debug message', { key: 'value' });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log info messages', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('Info message', { key: 'value' });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log warning messages', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      logger.warn('Warning message', { key: 'value' });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log error messages', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      logger.error('Error message', { key: 'value' });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('context handling', () => {
    it('should include context in log output', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const context = { userId: '123', action: 'search' };
      logger.info('User action', context);

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('User action');
      expect(output).toContain('userId');

      consoleSpy.mockRestore();
    });

    it('should handle logging without context', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('Simple message');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle complex context objects', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const context = {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
        error: new Error('test'),
      };

      logger.info('Complex context', context);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('log level filtering', () => {
    it('should respect log level threshold', () => {
      logger.setLogLevel('debug');
      const consoleSpy = vi
        .spyOn(console, 'debug')
        .mockImplementation(() => {});

      logger.debug('Debug message');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
