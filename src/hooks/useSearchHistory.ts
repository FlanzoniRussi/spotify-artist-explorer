import { useState, useEffect, useCallback } from 'react';

/**
 * Represents a search query record with timestamp and type information.
 *
 * @typedef {Object} SearchRecord
 * @property {string} query - The search query text
 * @property {number} timestamp - Unix timestamp when the search was performed
 * @property {'artist' | 'album' | 'all'} type - Type of search performed
 */
interface SearchRecord {
  query: string;
  timestamp: number;
  type: 'artist' | 'album' | 'all';
}

const SEARCH_HISTORY_KEY = 'spotify-search-history';
const MAX_HISTORY = 50;

/**
 * Custom hook for managing search history with localStorage persistence.
 *
 * Maintains a history of search queries with timestamps and search types.
 * Automatically persists to localStorage and enforces a maximum history size.
 * Newer searches appear first in the history.
 *
 * @returns {Object} Search history management interface
 * @returns {SearchRecord[]} history - Array of search records (most recent first)
 * @returns {Function} addSearch - Record a new search query
 * @returns {Function} getTopSearches - Get most recent searches with optional filters
 * @returns {Function} clearHistory - Clear all search history
 *
 * @example
 * ```typescript
 * const { addSearch, getTopSearches, history } = useSearchHistory();
 *
 * // Record a search
 * addSearch('The Beatles', 'artist');
 *
 * // Get top 5 artist searches
 * const topArtistSearches = getTopSearches(5, 'artist');
 *
 * // Get all history
 * console.log(history.length); // Current search count
 * ```
 */
export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchRecord[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };

    loadHistory();
  }, []);

  /**
   * Add a search query to the history.
   *
   * Automatically deduplicates identical searches (same query + type).
   * New searches are added to the beginning of the history.
   * History is limited to MAX_HISTORY entries.
   *
   * @param {string} query - The search query text (whitespace is trimmed)
   * @param {'artist' | 'album' | 'all'} [type='all'] - Type of search (default: 'all')
   * @example
   * addSearch('Pink Floyd'); // Defaults to 'all' type
   * addSearch('David Bowie', 'artist'); // Specific type
   */
  const addSearch = useCallback((query: string, type: 'artist' | 'album' | 'all' = 'all') => {
    if (!query.trim()) return;

    setHistory((prevHistory) => {
      const filtered = prevHistory.filter(item => !(item.query === query && item.type === type));
      
      const newRecord: SearchRecord = {
        query,
        timestamp: Date.now(),
        type,
      };

      const updated = [newRecord, ...filtered].slice(0, MAX_HISTORY);
      
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving search history:', error);
      }

      return updated;
    });
  }, []);

  /**
   * Get the most recent search queries.
   *
   * Can be filtered by search type and limited to a specific count.
   * Results are returned in chronological order (most recent first).
   *
   * @param {number} [limit=10] - Maximum number of results to return
   * @param {'artist' | 'album' | 'all'} [type] - Optional filter by search type
   * @returns {SearchRecord[]} Array of search records matching the criteria
   * @example
   * getTopSearches(5); // Get 5 most recent searches
   * getTopSearches(10, 'artist'); // Get 10 most recent artist searches
   */
  const getTopSearches = useCallback((limit: number = 10, type?: 'artist' | 'album' | 'all') => {
    const filtered = type ? history.filter(item => item.type === type) : history;
    return filtered.slice(0, limit);
  }, [history]);

  /**
   * Clear all search history and remove from localStorage.
   */
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  return {
    history,
    addSearch,
    getTopSearches,
    clearHistory,
  };
};
