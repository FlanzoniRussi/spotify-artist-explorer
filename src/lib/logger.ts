/**
 * Log levels supported by the logger.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Context object for structured logging.
 */
interface LogContext {
  [key: string]: unknown;
}

/**
 * Minimalist Logger class for structured logging throughout the application.
 *
 * Features:
 * - Structured logging with context
 * - Log level filtering
 * - Timestamp and source tracking
 * - Environment-aware (verbose in development, silent in production for debug)
 * - No external dependencies
 *
 * @example
 * ```typescript
 * // Basic logging
 * logger.info('User authenticated', { userId: '123' });
 * logger.error('API request failed', { status: 500, error });
 *
 * // Production-ready error tracking
 * try {
 *   await fetchData();
 * } catch (error) {
 *   logger.error('Fetch failed', {
 *     error,
 *     url: endpoint,
 *     context: 'artist-search'
 *   });
 * }
 * ```
 */
class Logger {
  private logLevel: LogLevel = import.meta.env.DEV ? 'debug' : 'info';

  /**
   * Map of log levels to their numeric priority.
   * Higher number = higher priority (shown first)
   */
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  /**
   * ANSI color codes for terminal output (useful in Node/browser console).
   */
  private colors = {
    reset: '\x1b[0m',
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m', // Green
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    context: '\x1b[90m', // Gray
  };

  /**
   * Format timestamp in ISO format.
   *
   * @private
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format log level with color (for console output).
   *
   * @private
   */
  private formatLevel(level: LogLevel): string {
    const color = this.colors[level];
    return `${color}[${level.toUpperCase()}]${this.colors.reset}`;
  }

  /**
   * Format context object as a readable string.
   *
   * @private
   */
  private formatContext(context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) {
      return '';
    }

    try {
      const formatted = JSON.stringify(context, null, 2);
      return `\n${this.colors.context}${formatted}${this.colors.reset}`;
    } catch {
      return `\n${this.colors.context}[Unable to stringify context]${this.colors.reset}`;
    }
  }

  /**
   * Check if a log message should be output based on log level.
   *
   * @private
   */
  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.logLevel];
  }

  /**
   * Log a message at the specified level.
   *
   * @private
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = this.getTimestamp();
    const levelStr = this.formatLevel(level);
    const contextStr = this.formatContext(context);

    const output = `${levelStr} ${timestamp} ${message}${contextStr}`;

    // Send to appropriate console method
    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        console.debug(output);
        break;
      case 'info':
      default:
        console.log(output);
    }
  }

  /**
   * Log a debug message.
   *
   * Used for detailed debugging information (only in development).
   *
   * @param message - Message to log
   * @param context - Optional context object
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  /**
   * Log an informational message.
   *
   * Used for important application events and state changes.
   *
   * @param message - Message to log
   * @param context - Optional context object
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log a warning message.
   *
   * Used for potentially problematic situations that don't prevent operation.
   *
   * @param message - Message to log
   * @param context - Optional context object
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log an error message.
   *
   * Used for error conditions that need immediate attention.
   *
   * @param message - Message to log
   * @param context - Optional context object (include error object here)
   */
  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  /**
   * Set the log level threshold.
   *
   * @param level - New log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

/**
 * Singleton logger instance used throughout the application.
 */
export const logger = new Logger();

export default logger;
