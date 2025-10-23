import { useState, useCallback, useEffect } from 'react';
import type { UserRating } from '../types';

const RATINGS_STORAGE_KEY = 'user-ratings';

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
      console.error('Error loading ratings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    }
  }, [ratings, isLoading]);

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

  const removeRating = useCallback((itemId: string, itemType: UserRating['itemType']) => {
    setRatings((prev) =>
      prev.filter((r) => !(r.itemId === itemId && r.itemType === itemType))
    );
  }, []);

  const getRating = useCallback(
    (itemId: string, itemType: UserRating['itemType']): number | null => {
      const rating = ratings.find(
        (r) => r.itemId === itemId && r.itemType === itemType
      );
      return rating?.rating ?? null;
    },
    [ratings]
  );

  const getRatingById = useCallback(
    (id: string): UserRating | null => {
      return ratings.find((r) => r.id === id) ?? null;
    },
    [ratings]
  );

  const getRatingsByType = useCallback(
    (itemType: UserRating['itemType']): UserRating[] => {
      return ratings.filter((r) => r.itemType === itemType);
    },
    [ratings]
  );

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
