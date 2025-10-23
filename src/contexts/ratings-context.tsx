import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserRating } from '../types';
import { generateId } from '../utils/formatters';

const RATINGS_KEY = 'spotify-artists-ratings';

/**
 * Action types for ratings reducer.
 */
type RatingsAction =
  | { type: 'LOAD_RATINGS'; payload: UserRating[] }
  | { type: 'ADD_OR_UPDATE_RATING'; payload: UserRating }
  | { type: 'REMOVE_RATING'; payload: { itemId: string; itemType: UserRating['itemType'] } }
  | { type: 'CLEAR_RATINGS' }
  | { type: 'SET_LOADING'; payload: boolean };

/**
 * Initial state for ratings reducer.
 */
interface RatingsState {
  ratings: UserRating[];
  isLoading: boolean;
}

const initialState: RatingsState = {
  ratings: [],
  isLoading: true,
};

/**
 * Reducer function for managing ratings state with Redux-like actions.
 *
 * @param {RatingsState} state - Current state
 * @param {RatingsAction} action - Action to dispatch
 * @returns {RatingsState} Updated state
 */
const ratingsReducer = (
  state: RatingsState,
  action: RatingsAction
): RatingsState => {
  switch (action.type) {
    case 'LOAD_RATINGS':
      return { ...state, ratings: action.payload, isLoading: false };
    case 'ADD_OR_UPDATE_RATING': {
      const existingIndex = state.ratings.findIndex(
        r => r.itemId === action.payload.itemId && r.itemType === action.payload.itemType
      );
      if (existingIndex >= 0) {
        const updatedRatings = [...state.ratings];
        updatedRatings[existingIndex] = action.payload;
        return { ...state, ratings: updatedRatings };
      }
      return { ...state, ratings: [...state.ratings, action.payload] };
    }
    case 'REMOVE_RATING':
      return {
        ...state,
        ratings: state.ratings.filter(
          r => !(r.itemId === action.payload.itemId && r.itemType === action.payload.itemType)
        ),
      };
    case 'CLEAR_RATINGS':
      return { ...state, ratings: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

/**
 * Context type definition for ratings management.
 *
 * Provides all operations and state required to manage user ratings
 * across the application.
 *
 * @typedef {Object} RatingsContextType
 * @property {UserRating[]} ratings - Array of all user ratings
 * @property {boolean} isLoading - Loading state for initial data fetch from localStorage
 * @property {Function} addOrUpdateRating - Add or update a rating (1-5 stars)
 * @property {Function} removeRating - Remove a rating by item ID and type
 * @property {Function} getRating - Get rating value for a specific item
 * @property {Function} getRatingById - Get full rating object by rating ID
 * @property {Function} getRatingsByType - Get all ratings of a specific type
 * @property {Function} getRatingStats - Calculate statistics for ratings
 * @property {Function} clearRatings - Clear all ratings
 */
interface RatingsContextType {
  ratings: UserRating[];
  isLoading: boolean;
  addOrUpdateRating: (
    itemId: string,
    itemType: UserRating['itemType'],
    rating: number,
    itemName: string,
    itemArtist?: string
  ) => void;
  removeRating: (itemId: string, itemType: UserRating['itemType']) => void;
  getRating: (itemId: string, itemType: UserRating['itemType']) => number | null;
  getRatingById: (id: string) => UserRating | null;
  getRatingsByType: (itemType: UserRating['itemType']) => UserRating[];
  getRatingStats: (itemType?: UserRating['itemType']) => {
    total: number;
    average: number;
    distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  };
  clearRatings: () => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

/**
 * Provider component for ratings context.
 *
 * Wraps child components and provides access to rating management functions
 * through the useRatingsContext hook. Should wrap the components that need
 * to manage or display user ratings.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to provide context to
 * @returns {JSX.Element} Context provider wrapper
 */
export const RatingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ratingsReducer, initialState);

  useEffect(() => {
    const loadRatings = () => {
      try {
        const stored = localStorage.getItem(RATINGS_KEY);
        if (stored) {
          const parsedRatings = JSON.parse(stored);
          dispatch({ type: 'LOAD_RATINGS', payload: parsedRatings });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        // Silent fail
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadRatings();
  }, []);

  /**
   * Internal helper to persist ratings to localStorage.
   *
   * @param {UserRating[]} newRatings - Array of ratings to persist
   * @private
   */
  const saveRatings = useCallback((newRatings: UserRating[]) => {
    try {
      localStorage.setItem(RATINGS_KEY, JSON.stringify(newRatings));
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveRatings(state.ratings);
    }
  }, [state.ratings, state.isLoading, saveRatings]);

  const addOrUpdateRating = useCallback(
    (
      itemId: string,
      itemType: UserRating['itemType'],
      rating: number,
      itemName: string,
      itemArtist?: string
    ) => {
      const ratingData: UserRating = {
        id: generateId(),
        itemId,
        itemType,
        rating,
        itemName,
        itemArtist,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_OR_UPDATE_RATING', payload: ratingData });
    },
    []
  );

  const removeRating = useCallback((itemId: string, itemType: UserRating['itemType']) => {
    dispatch({ type: 'REMOVE_RATING', payload: { itemId, itemType } });
  }, []);

  const getRating = useCallback(
    (itemId: string, itemType: UserRating['itemType']) => {
      const rating = state.ratings.find(r => r.itemId === itemId && r.itemType === itemType);
      return rating?.rating ?? null;
    },
    [state.ratings]
  );

  const getRatingById = useCallback(
    (id: string) => {
      return state.ratings.find(r => r.id === id) ?? null;
    },
    [state.ratings]
  );

  const getRatingsByType = useCallback(
    (itemType: UserRating['itemType']) => {
      return state.ratings.filter(r => r.itemType === itemType);
    },
    [state.ratings]
  );

  const getRatingStats = useCallback(
    (itemType?: UserRating['itemType']) => {
      const filteredRatings = itemType
        ? state.ratings.filter(r => r.itemType === itemType)
        : state.ratings;

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let total = 0;

      filteredRatings.forEach(rating => {
        distribution[rating.rating as 1 | 2 | 3 | 4 | 5]++;
        total += rating.rating;
      });

      const average = filteredRatings.length > 0 ? total / filteredRatings.length : 0;

      return {
        total: filteredRatings.length,
        average: Math.round(average * 10) / 10,
        distribution,
      };
    },
    [state.ratings]
  );

  const clearRatings = useCallback(() => {
    dispatch({ type: 'CLEAR_RATINGS' });
  }, []);

  const value: RatingsContextType = {
    ratings: state.ratings,
    isLoading: state.isLoading,
    addOrUpdateRating,
    removeRating,
    getRating,
    getRatingById,
    getRatingsByType,
    getRatingStats,
    clearRatings,
  };

  return (
    <RatingsContext.Provider value={value}>
      {children}
    </RatingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRatingsContext = (): RatingsContextType => {
  const context = useContext(RatingsContext);
  if (context === undefined) {
    throw new Error('useRatingsContext must be used within a RatingsProvider');
  }
  return context;
};
