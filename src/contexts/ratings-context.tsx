import React, { createContext, useContext } from 'react';
import { useRatings } from '../hooks/useRatings';
import type { UserRating } from '../types';

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

// eslint-disable-next-line react-refresh/only-export-components
export const useRatingsContext = () => {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error('useRatingsContext must be used within RatingsProvider');
  }
  return context;
};

export default RatingsContext;
