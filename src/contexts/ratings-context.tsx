import React, { createContext, useContext } from 'react';
import { useRatings } from '../hooks/useRatings';
import type { UserRating } from '../types';

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
 * access to ratings functionality.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to provide ratings context to
 * @returns {JSX.Element} Context provider wrapper
 *
 * @example
 * ```typescript
 * <RatingsProvider>
 *   <YourApp />
 * </RatingsProvider>
 * ```
 */
export const RatingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ratings = useRatings();

  return (
    <RatingsContext.Provider value={ratings}>
      {children}
    </RatingsContext.Provider>
  );
};

/**
 * Hook to access the ratings context.
 *
 * Must be used within a component tree wrapped by RatingsProvider.
 * Provides access to all rating management functions and state.
 *
 * @returns {RatingsContextType} The ratings context object
 * @throws {Error} If used outside of RatingsProvider
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { addOrUpdateRating, getRating } = useRatingsContext();
 *   // Use ratings functionality
 * }
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useRatingsContext = () => {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error('useRatingsContext must be used within RatingsProvider');
  }
  return context;
};

export default RatingsContext;
