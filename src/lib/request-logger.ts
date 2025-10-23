import { logger } from './logger';

/**
 * Request metrics for performance tracking.
 */
interface RequestMetrics {
  method: string;
  url: string;
  startTime: number;
  endTime: number;
  duration: number;
  status?: number;
  error?: Error;
}

/**
 * Request logger for tracking API calls and performance.
 *
 * Logs all HTTP requests made through the Spotify API service,
 * including timing information, response status, and errors.
 *
 * Useful for:
 * - Debugging API interactions
 * - Performance monitoring
 * - Error tracking and analysis
 * - Understanding API usage patterns
 *
 * @example
 * ```typescript
 * // Log a successful API call
 * requestLogger.logRequest('GET', '/v1/artists/123', 234, 200);
 *
 * // Log an API error
 * requestLogger.logRequest('GET', '/v1/artists/123', 1500, 500, error);
 *
 * // Get request statistics
 * const stats = requestLogger.getStatistics();
 * console.log(`Average response time: ${stats.averageResponseTime}ms`);
 * ```
 */
class RequestLogger {
  private requests: RequestMetrics[] = [];
  private maxRequests = 100;

  /**
   * Log an API request with response time and status.
   *
   * @param method - HTTP method (GET, POST, etc)
   * @param url - API endpoint URL
   * @param duration - Response time in milliseconds
   * @param status - HTTP status code
   * @param error - Optional error object if request failed
   */
  logRequest(
    method: string,
    url: string,
    duration: number,
    status: number,
    error?: Error
  ): void {
    const metrics: RequestMetrics = {
      method,
      url,
      startTime: Date.now() - duration,
      endTime: Date.now(),
      duration,
      status,
      error,
    };

    // Add to history
    this.requests.push(metrics);
    if (this.requests.length > this.maxRequests) {
      this.requests.shift();
    }

    // Log appropriately based on status
    if (error || status >= 400) {
      logger.error(`API Request Failed: ${method} ${url}`, {
        status,
        duration: `${duration}ms`,
        error: error?.message,
      });
    } else if (duration > 2000) {
      logger.warn(`API Request Slow: ${method} ${url}`, {
        status,
        duration: `${duration}ms`,
      });
    } else {
      logger.debug(`API Request: ${method} ${url}`, {
        status,
        duration: `${duration}ms`,
      });
    }
  }

  /**
   * Log the start of an API request.
   *
   * Returns a callback function to log the completion.
   *
   * @param method - HTTP method
   * @param url - API endpoint URL
   * @returns Function to call when request completes
   *
   * @example
   * ```typescript
   * const complete = requestLogger.startRequest('GET', '/v1/artists');
   * try {
   *   const response = await fetch(url);
   *   complete(response.status);
   * } catch (error) {
   *   complete(500, error);
   * }
   * ```
   */
  startRequest(method: string, url: string) {
    const startTime = Date.now();

    return (status: number, error?: Error) => {
      const duration = Date.now() - startTime;
      this.logRequest(method, url, duration, status, error);
    };
  }

  /**
   * Get statistics about logged requests.
   *
   * @returns Object with request statistics
   */
  getStatistics() {
    if (this.requests.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        successCount: 0,
        errorCount: 0,
      };
    }

    const durations = this.requests.map((r) => r.duration);
    const successCount = this.requests.filter((r) => (r.status ?? 0) < 400).length;
    const errorCount = this.requests.filter((r) => (r.status ?? 0) >= 400 || r.error).length;

    return {
      totalRequests: this.requests.length,
      averageResponseTime: durations.reduce((a, b) => a + b, 0) / durations.length,
      minResponseTime: Math.min(...durations),
      maxResponseTime: Math.max(...durations),
      successCount,
      errorCount,
    };
  }

  /**
   * Get all logged requests.
   *
   * @returns Array of request metrics
   */
  getRequests(): RequestMetrics[] {
    return [...this.requests];
  }

  /**
   * Clear all logged requests.
   */
  clearRequests(): void {
    this.requests = [];
  }
}

/**
 * Singleton request logger instance.
 */
export const requestLogger = new RequestLogger();

export default requestLogger;
