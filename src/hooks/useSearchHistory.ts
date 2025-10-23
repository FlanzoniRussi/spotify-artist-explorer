import { useState, useEffect, useCallback } from 'react';

interface SearchRecord {
  query: string;
  timestamp: number;
  type: 'artist' | 'album' | 'all';
}

const SEARCH_HISTORY_KEY = 'spotify-search-history';
const MAX_HISTORY = 50;

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

  const getTopSearches = useCallback((limit: number = 10, type?: 'artist' | 'album' | 'all') => {
    const filtered = type ? history.filter(item => item.type === type) : history;
    return filtered.slice(0, limit);
  }, [history]);

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
