import { useState, useEffect, useCallback } from 'react';
import type { UserFavorite } from '../types';
import { generateId } from '../utils/formatters';

const FAVORITES_KEY = 'spotify-artists-favorites';

/**
 * Custom hook for managing user favorites with localStorage persistence.
 *
 * Provides a complete favorites management system with support for
 * different item types (tracks, albums, artists). Automatically syncs
 * with localStorage and provides utility functions for favorites operations.
 *
 * @returns {Object} Favorites management interface
 * @returns {UserFavorite[]} favorites - Array of all favorited items
 * @returns {boolean} isLoading - Loading state for initial data fetch
 * @returns {Function} addFavorite - Add a new favorite item
 * @returns {Function} removeFavorite - Remove a favorite by ID
 * @returns {Function} isFavorite - Check if an item is favorited
 * @returns {Function} toggleFavorite - Toggle favorite status for an item
 * @returns {Function} clearFavorites - Clear all favorites
 * @returns {Function} getFavoritesByType - Get favorites filtered by type
 *
 * @example
 * ```typescript
 * const { toggleFavorite, isFavorite, favorites } = useFavorites();
 *
 * // Toggle favorite
 * toggleFavorite({ name: 'Song', artist: 'Artist', type: 'track', ... });
 *
 * // Check if favorited
 * const favorited = isFavorite(itemId);
 * ```
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Migrate old favorites without popularity
          const migrated = parsed.map((fav: UserFavorite) => {
            if ((fav.type === 'track' || fav.type === 'artist') && fav.popularity === undefined) {
              return { ...fav, popularity: 0 };
            }
            return fav;
          });
          setFavorites(migrated);
          // Save migrated data back to localStorage
          if (migrated.some((fav: UserFavorite) => fav.popularity === 0 && (fav.type === 'track' || fav.type === 'artist'))) {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(migrated));
          }
        }
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  /**
   * Internal helper to persist favorites to localStorage.
   *
   * @param {UserFavorite[]} newFavorites - Array of favorites to persist
   * @private
   */
  const saveFavorites = useCallback((newFavorites: UserFavorite[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch {
      // Silent fail
    }
  }, []);

  /**
   * Add a new item to favorites.
   *
   * @param {Omit<UserFavorite, 'id' | 'addedAt'>} item - Item data to favorite
   * @returns {UserFavorite} The newly created favorite object
   */
  const addFavorite = useCallback(
    (item: Omit<UserFavorite, 'id' | 'addedAt'>) => {
      if ((item.type === 'track' || item.type === 'artist') && item.popularity === undefined) {
        // Set default popularity if missing
      }

      const newFavorite: UserFavorite = {
        ...item,
        id: generateId(),
        addedAt: new Date().toISOString(),
        // Ensure popularity is at least 0 for tracks and artists
        popularity: (item.type === 'track' || item.type === 'artist') 
          ? (item.popularity ?? 0)
          : item.popularity,
      };

      const updatedFavorites = [...favorites, newFavorite];
      saveFavorites(updatedFavorites);
      return newFavorite;
    },
    [favorites, saveFavorites]
  );

  /**
   * Remove an item from favorites by its ID.
   *
   * @param {string} id - The favorite item ID to remove
   */
  const removeFavorite = useCallback(
    (id: string) => {
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      saveFavorites(updatedFavorites);
    },
    [favorites, saveFavorites]
  );

  /**
   * Check if an item is in favorites.
   *
   * @param {string} id - The favorite item ID to check
   * @returns {boolean} True if item is favorited, false otherwise
   */
  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some(fav => fav.id === id);
    },
    [favorites]
  );

  /**
   * Toggle favorite status for an item.
   *
   * If the item is already favorited, it will be removed.
   * Otherwise, it will be added. Matching is done by name and artist.
   *
   * @param {Omit<UserFavorite, 'id' | 'addedAt'>} item - Item to toggle
   * @returns {boolean} True if item was added, false if removed
   */
  const toggleFavorite = useCallback(
    (item: Omit<UserFavorite, 'id' | 'addedAt'>) => {
      const existingFavorite = favorites.find(
        fav => fav.name === item.name && fav.artist === item.artist
      );

      if (existingFavorite) {
        removeFavorite(existingFavorite.id);
        return false;
      } else {
        addFavorite(item);
        return true;
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  /**
   * Clear all favorites and reset the hook state.
   * This also clears localStorage.
   */
  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  /**
   * Get all favorites of a specific type.
   *
   * @param {UserFavorite['type']} type - Type to filter by (track, album, artist)
   * @returns {UserFavorite[]} Array of favorites matching the type
   */
  const getFavoritesByType = useCallback(
    (type: UserFavorite['type']) => {
      return favorites.filter(fav => fav.type === type);
    },
    [favorites]
  );

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesByType,
  };
};
