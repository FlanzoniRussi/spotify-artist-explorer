import { useState, useEffect, useCallback } from 'react';
import type { UserFavorite } from '../types';
import { generateId } from '../utils/formatters';

const FAVORITES_KEY = 'spotify-artists-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const saveFavorites = useCallback((newFavorites: UserFavorite[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  const addFavorite = useCallback(
    (item: Omit<UserFavorite, 'id' | 'addedAt'>) => {
      const newFavorite: UserFavorite = {
        ...item,
        id: generateId(),
        addedAt: new Date().toISOString(),
      };

      const updatedFavorites = [...favorites, newFavorite];
      saveFavorites(updatedFavorites);
      return newFavorite;
    },
    [favorites, saveFavorites]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      saveFavorites(updatedFavorites);
    },
    [favorites, saveFavorites]
  );

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some(fav => fav.id === id);
    },
    [favorites]
  );

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

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

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
