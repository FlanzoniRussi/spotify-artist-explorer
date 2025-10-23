import { useState, useCallback, useEffect } from 'react';
import type { UserRating } from '../types';

const RATINGS_STORAGE_KEY = 'user-ratings';

/**
 * Custom hook for managing user ratings with localStorage persistence.
 *
 * This hook provides a complete CRUD interface for managing ratings across
 * different item types (tracks, artists, albums, custom-tracks). It handles
 * localStorage synchronization automatically and maintains loading state.
 *
 * @returns {Object} Rating management interface
 * @returns {UserRating[]} ratings - Array of all user ratings
 * @returns {boolean} isLoading - Loading state for initial data fetch
 * @returns {Function} addOrUpdateRating - Add or update a rating (1-5 stars)
 * @returns {Function} removeRating - Remove a rating by item ID and type
 * @returns {Function} getRating - Get rating value for a specific item
 * @returns {Function} getRatingById - Get full rating object by rating ID
 * @returns {Function} getRatingsByType - Get all ratings of a specific type
 * @returns {Function} getRatingStats - Calculate rating statistics
 * @returns {Function} clearRatings - Clear all ratings and localStorage
 *
 * @example
 * ```typescript
 * const { addOrUpdateRating, getRating, getRatingStats } = useRatings();
 *
 * // Add a rating
 * addOrUpdateRating('track-123', 'track', 5, 'Song Name', 'Artist Name');
 *
 * // Get rating for item
 * const rating = getRating('track-123', 'track'); // Returns 5 or null
 *
 * // Get statistics
 * const stats = getRatingStats('track'); // { total: 10, average: 4.2, distribution: {...} }
 * ```
 */
export const useRatings = () => {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
      if (stored) {
        setRatings(JSON.parse(stored));
      }
    } catch (error) {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    }
  }, [ratings, isLoading]);

  /**
   * Add or update a rating for an item.
   *
   * If a rating already exists for the item, it will be updated.
   * Otherwise, a new rating will be created. Validation ensures ratings
   * are between 1 and 5.
   *
   * @param {string} itemId - Unique identifier of the item being rated
   * @param {UserRating['itemType']} itemType - Type of item (track, artist, album, custom-track)
   * @param {number} rating - Rating value (1-5)
   * @param {string} itemName - Display name of the item
   * @param {string} [itemArtist] - Optional artist name for context
   * @throws {Error} If rating is not between 1 and 5
   */
  const addOrUpdateRating = useCallback((
    itemId: string,
    itemType: UserRating['itemType'],
    rating: number,
    itemName: string,
    itemArtist?: string
  ) => {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    setRatings((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.itemId === itemId && r.itemType === itemType
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          rating,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `${itemType}-${itemId}-${Date.now()}`,
          itemId,
          itemType,
          itemName,
          itemArtist,
          rating,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  /**
   * Remove a rating for a specific item.
   *
   * @param {string} itemId - Unique identifier of the item
   * @param {UserRating['itemType']} itemType - Type of item
   */
  const removeRating = useCallback((itemId: string, itemType: UserRating['itemType']) => {
    setRatings((prev) =>
      prev.filter((r) => !(r.itemId === itemId && r.itemType === itemType))
    );
  }, []);

  /**
   * Get the rating value (1-5) for a specific item.
   *
   * @param {string} itemId - Unique identifier of the item
   * @param {UserRating['itemType']} itemType - Type of item
   * @returns {number | null} Rating value or null if not rated
   */
  const getRating = useCallback(
    (itemId: string, itemType: UserRating['itemType']): number | null => {
      const rating = ratings.find(
        (r) => r.itemId === itemId && r.itemType === itemType
      );
      return rating?.rating ?? null;
    },
    [ratings]
  );

  /**
   * Get the full rating object by its ID.
   *
   * @param {string} id - Unique rating identifier
   * @returns {UserRating | null} Full rating object or null if not found
   */
  const getRatingById = useCallback(
    (id: string): UserRating | null => {
      return ratings.find((r) => r.id === id) ?? null;
    },
    [ratings]
  );

  /**
   * Get all ratings of a specific type.
   *
   * @param {UserRating['itemType']} itemType - Type of items to filter by
   * @returns {UserRating[]} Array of ratings matching the type
   */
  const getRatingsByType = useCallback(
    (itemType: UserRating['itemType']): UserRating[] => {
      return ratings.filter((r) => r.itemType === itemType);
    },
    [ratings]
  );

  /**
   * Calculate statistics for ratings.
   *
   * Computes total count, average rating, and distribution across
   * rating values (1-5). Can be filtered by item type.
   *
   * @param {UserRating['itemType']} [itemType] - Optional item type filter
   * @returns {Object} Statistics object
   * @returns {number} total - Total number of ratings
   * @returns {number} average - Average rating value
   * @returns {Object} distribution - Count of ratings for each star (1-5)
   */
  const getRatingStats = useCallback(
    (itemType?: UserRating['itemType']) => {
      const filtered = itemType
        ? ratings.filter((r) => r.itemType === itemType)
        : ratings;

      if (filtered.length === 0) {
        return {
          total: 0,
          average: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;

      filtered.forEach((r) => {
        sum += r.rating;
        distribution[r.rating as keyof typeof distribution]++;
      });

      return {
        total: filtered.length,
        average: sum / filtered.length,
        distribution,
      };
    },
    [ratings]
  );

  /**
   * Clear all ratings and reset the hook state.
   * This also clears localStorage.
   */
  const clearRatings = useCallback(() => {
    setRatings([]);
  }, []);

  return {
    ratings,
    isLoading,
    addOrUpdateRating,
    removeRating,
    getRating,
    getRatingById,
    getRatingsByType,
    getRatingStats,
    clearRatings,
  };
};

export default useRatings;
