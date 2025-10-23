import { logger } from './logger';

/**
 * Error context for reporting.
 */
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Error reporter for structured error tracking and reporting.
 *
 * Centralizes error handling, logging, and reporting throughout the application.
 * Helps with debugging and monitoring error patterns.
 *
 * Features:
 * - Captures error context (component, action, user info)
 * - Sends errors to error tracking service (if configured)
 * - Logs errors with full context
 * - Formats error messages for display
 *
 * @example
 * ```typescript
 * // Report an API error
 * reportError(error, {
 *   component: 'ArtistSearch',
 *   action: 'fetch-artists',
 *   query: 'The Beatles'
 * });
 *
 * // Report a validation error
 * reportError(new Error('Invalid track duration'), {
 *   component: 'TrackForm',
 *   action: 'validate-submission'
 * });
 * ```
 */
class ErrorReporter {
  /**
   * Report an error with context.
   *
   * @param error - The error object
   * @param context - Additional context about where the error occurred
   */
  reportError(error: Error | unknown, context?: ErrorContext): void {
    const errorObj = this.normalizeError(error);

    // Log with full context
    logger.error(`Error: ${errorObj.message}`, {
      name: errorObj.name,
      stack: errorObj.stack,
      message: errorObj.message,
      ...context,
    });

    // Send to error tracking service (if configured)
    this.sendToTracking(errorObj, context);

    // Store error for debugging
    this.storeError(errorObj, context);
  }

  /**
   * Report an API error with response details.
   *
   * @param error - The error object
   * @param endpoint - The API endpoint that failed
   * @param status - HTTP status code
   * @param context - Additional context
   */
  reportApiError(
    error: Error | unknown,
    endpoint: string,
    status: number,
    context?: ErrorContext
  ): void {
    this.reportError(error, {
      ...context,
      type: 'api-error',
      endpoint,
      status,
    });
  }

  /**
   * Report a validation error.
   *
   * @param message - Validation error message
   * @param context - Additional context
   */
  reportValidationError(message: string, context?: ErrorContext): void {
    const error = new Error(message);
    this.reportError(error, {
      ...context,
      type: 'validation-error',
    });
  }

  /**
   * Normalize error object to ensure consistent error handling.
   *
   * @private
   */
  private normalizeError(error: Error | unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    if (error && typeof error === 'object') {
      return new Error(JSON.stringify(error));
    }

    return new Error('Unknown error');
  }

  /**
   * Send error to tracking service (for future integration).
   *
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private sendToTracking(_error: Error, _context?: ErrorContext): void {
    // This is where you would send to Sentry, Rollbar, etc.
    // For now, we just log it. Easy to extend later.

    if (import.meta.env.DEV) {
      return;
    }

    // In production, you could send to:
    // - Sentry: Sentry.captureException(error, { contexts: { context } })
    // - Rollbar: rollbar.error(error, context)
    // - Custom API: fetch('/api/errors', { ... })
    // 
    // Example implementation:
    // if (error && context) {
    //   sendToService(error, context);
    // }
  }

  /**
   * Store error locally for debugging.
   *
   * @private
   */
  private storeError(error: Error, _context?: ErrorContext): void {
    // Store in sessionStorage for debugging purposes
    try {
      const key = 'app_errors_debug';
      const stored = sessionStorage.getItem(key);
      const errors = stored ? JSON.parse(stored) : [];

      errors.push({
        timestamp: new Date().toISOString(),
        name: error.name,
        message: error.message,
        context: _context,
      });

      // Keep only last 10 errors
      const recent = errors.slice(-10);
      sessionStorage.setItem(key, JSON.stringify(recent));
    } catch {
      // Silently fail if sessionStorage is not available
    }
  }

  /**
   * Get stored errors from debug session.
   *
   * @returns Array of recently stored errors
   */
  getStoredErrors(): Array<{
    timestamp: string;
    name: string;
    message: string;
    context?: ErrorContext;
  }> {
    try {
      const key = 'app_errors_debug';
      const stored = sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear stored errors.
   */
  clearStoredErrors(): void {
    try {
      sessionStorage.removeItem('app_errors_debug');
    } catch {
      // Silently fail
    }
  }
}

/**
 * Singleton error reporter instance.
 */
export const errorReporter = new ErrorReporter();

export default errorReporter;
