/**
 * Format milliseconds to human-readable duration format (MM:SS).
 *
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration string (e.g., "3:45")
 *
 * @example
 * formatDuration(225000); // Returns "3:45"
 * formatDuration(5000);   // Returns "0:05"
 */
export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format large numbers with abbreviations (K for thousands, M for millions).
 *
 * Useful for displaying follower counts, play counts, etc.
 * Numbers are rounded to one decimal place.
 *
 * @param {number} num - Number to format
 * @returns {string} Formatted number string (e.g., "1.5M", "250K", "500")
 *
 * @example
 * formatNumber(1500000); // Returns "1.5M"
 * formatNumber(250000);  // Returns "250K"
 * formatNumber(500);     // Returns "500"
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format ISO date string to localized date format.
 *
 * Uses Portuguese (Brazil) locale by default.
 * Format: "day de month de year" (e.g., "15 de janeiro de 2024")
 *
 * @param {string} dateString - ISO date string (e.g., "2024-01-15")
 * @returns {string} Formatted date string in pt-BR locale
 *
 * @example
 * formatDate("2024-01-15"); // Returns "15 de janeiro de 2024"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date as relative time in Portuguese.
 *
 * Converts ISO date strings to human-friendly relative dates
 * (e.g., "Hoje", "Ontem", "3 dias atrás", "2 meses atrás")
 *
 * @param {string} dateString - ISO date string
 * @returns {string} Relative date string in Portuguese
 *
 * @example
 * formatRelativeDate("2024-01-15"); // Returns "Hoje", "Ontem", or "X dias atrás"
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Hoje';
  }
  if (diffInDays === 1) {
    return 'Ontem';
  }
  if (diffInDays < 7) {
    return `${diffInDays} dias atrás`;
  }
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} mês${months > 1 ? 'es' : ''} atrás`;
  }
  const years = Math.floor(diffInDays / 365);
  return `${years} ano${years > 1 ? 's' : ''} atrás`;
};

/**
 * Truncate text to maximum length and append ellipsis.
 *
 * If text is shorter than maxLength, returns text unchanged.
 * Otherwise, truncates and adds "..." suffix.
 *
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 *
 * @example
 * truncateText("Hello World", 5); // Returns "Hello..."
 * truncateText("Hi", 5);          // Returns "Hi"
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate a random unique ID string.
 *
 * Produces a 9-character alphanumeric string suitable for use
 * as a local identifier. NOT cryptographically secure.
 *
 * @returns {string} Random 9-character ID
 *
 * @example
 * const id = generateId(); // Returns something like "a1b2c3d4e"
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Create a debounced version of a function.
 *
 * Delays function execution until after `wait` milliseconds have passed
 * without new calls. Useful for search inputs, resizing handlers, etc.
 *
 * @template T - Function type
 * @param {T} func - Function to debounce
 * @param {number} wait - Debounce delay in milliseconds
 * @returns {Function} Debounced function that takes same parameters as original
 *
 * @example
 * ```typescript
 * const handleSearch = debounce((query: string) => {
 *   console.log('Searching:', query);
 * }, 300);
 *
 * // Only logs after 300ms of inactivity
 * handleSearch('a');    // queued
 * handleSearch('ab');   // queued (replaces previous)
 * handleSearch('abc');  // executed after 300ms
 * ```
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
