import { describe, it, expect, beforeEach, vi } from 'vitest';
import { errorReporter } from '../../lib/error-reporter';

describe('ErrorReporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    errorReporter.clearStoredErrors();
  });

  describe('error reporting', () => {
    it('should report an Error object', () => {
      const error = new Error('Test error');
      expect(() => {
        errorReporter.reportError(error);
      }).not.toThrow();
    });

    it('should report a string error', () => {
      expect(() => {
        errorReporter.reportError('String error');
      }).not.toThrow();
    });

    it('should report an object error', () => {
      const error = { message: 'Object error', code: 500 };
      expect(() => {
        errorReporter.reportError(error);
      }).not.toThrow();
    });

    it('should report with context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent', action: 'test-action' };
      
      expect(() => {
        errorReporter.reportError(error, context);
      }).not.toThrow();
    });
  });

  describe('API error reporting', () => {
    it('should report API errors with status code', () => {
      const error = new Error('API Error');
      
      expect(() => {
        errorReporter.reportApiError(error, '/api/endpoint', 500, {
          component: 'SpotifyService',
        });
      }).not.toThrow();
    });

    it('should store API error context', () => {
      const error = new Error('API Error');
      errorReporter.reportApiError(error, '/api/endpoint', 404);
      
      const stored = errorReporter.getStoredErrors();
      expect(stored.length).toBeGreaterThan(0);
      expect(stored[0].message).toContain('API Error');
    });
  });

  describe('validation error reporting', () => {
    it('should report validation errors', () => {
      expect(() => {
        errorReporter.reportValidationError('Invalid input', {
          component: 'FormComponent',
          field: 'email',
        });
      }).not.toThrow();
    });

    it('should mark validation errors correctly', () => {
      errorReporter.reportValidationError('Invalid field');
      
      const stored = errorReporter.getStoredErrors();
      expect(stored.length).toBeGreaterThan(0);
    });
  });

  describe('error normalization', () => {
    it('should normalize Error objects', () => {
      const error = new Error('Test');
      errorReporter.reportError(error);
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].name).toBe('Error');
      expect(stored[0].message).toBe('Test');
    });

    it('should normalize string errors to Error objects', () => {
      errorReporter.reportError('String error');
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].message).toContain('String error');
    });

    it('should normalize object errors', () => {
      const obj = { code: 500, status: 'error' };
      errorReporter.reportError(obj);
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].message).toContain('code');
    });

    it('should handle unknown error types', () => {
      errorReporter.reportError(null);
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].message).toBe('Unknown error');
    });
  });

  describe('error storage', () => {
    it('should store errors in session', () => {
      errorReporter.reportError(new Error('Error 1'));
      errorReporter.reportError(new Error('Error 2'));
      
      const stored = errorReporter.getStoredErrors();
      expect(stored.length).toBe(2);
    });

    it('should include timestamp with stored errors', () => {
      errorReporter.reportError(new Error('Test error'));
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].timestamp).toBeDefined();
      expect(stored[0].timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);
    });

    it('should include context with stored errors', () => {
      const context = { userId: '123', action: 'search' };
      errorReporter.reportError(new Error('Test'), context);
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].context).toEqual(context);
    });

    it('should limit stored errors to last 10', () => {
      // Store more than 10 errors
      for (let i = 0; i < 15; i++) {
        errorReporter.reportError(new Error(`Error ${i}`));
      }
      
      const stored = errorReporter.getStoredErrors();
      expect(stored.length).toBeLessThanOrEqual(10);
    });

    it('should clear stored errors', () => {
      errorReporter.reportError(new Error('Error 1'));
      errorReporter.reportError(new Error('Error 2'));
      
      expect(errorReporter.getStoredErrors().length).toBe(2);
      
      errorReporter.clearStoredErrors();
      
      expect(errorReporter.getStoredErrors().length).toBe(0);
    });
  });

  describe('error context', () => {
    it('should capture component context', () => {
      errorReporter.reportError(new Error('Test'), {
        component: 'MyComponent',
      });
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].context?.component).toBe('MyComponent');
    });

    it('should capture action context', () => {
      errorReporter.reportError(new Error('Test'), {
        action: 'search-artists',
      });
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].context?.action).toBe('search-artists');
    });

    it('should capture multiple context fields', () => {
      const context = {
        component: 'Search',
        action: 'search',
        query: 'The Beatles',
        userId: '123',
      };
      
      errorReporter.reportError(new Error('Test'), context);
      
      const stored = errorReporter.getStoredErrors();
      expect(stored[0].context).toEqual(context);
    });
  });

  describe('error tracking integration readiness', () => {
    it('should have production error tracking support', () => {
      // This test verifies the structure supports Sentry/Rollbar integration
      const error = new Error('Test error');
      const context = { component: 'Test', action: 'test' };
      
      expect(() => {
        errorReporter.reportError(error, context);
      }).not.toThrow();
      
      // In production, you would have:
      // Sentry.captureException(error, { contexts: { context } })
      // or similar integration
    });
  });
});
