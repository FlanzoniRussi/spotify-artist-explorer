import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CustomTrack } from '../types';
import { generateId } from '../utils/formatters';

const CUSTOM_TRACKS_KEY = 'spotify-artists-custom-tracks';

/**
 * Action types for custom tracks reducer.
 */
type CustomTracksAction =
  | { type: 'LOAD_TRACKS'; payload: CustomTrack[] }
  | { type: 'ADD_TRACK'; payload: CustomTrack }
  | { type: 'REMOVE_TRACK'; payload: string }
  | { type: 'UPDATE_TRACK'; payload: { id: string; data: Partial<CustomTrack> } }
  | { type: 'CLEAR_TRACKS' }
  | { type: 'SET_LOADING'; payload: boolean };

/**
 * Initial state for custom tracks reducer.
 */
interface CustomTracksState {
  customTracks: CustomTrack[];
  isLoading: boolean;
}

const initialState: CustomTracksState = {
  customTracks: [],
  isLoading: true,
};

/**
 * Reducer function for managing custom tracks state with Redux-like actions.
 *
 * @param {CustomTracksState} state - Current state
 * @param {CustomTracksAction} action - Action to dispatch
 * @returns {CustomTracksState} Updated state
 */
const customTracksReducer = (
  state: CustomTracksState,
  action: CustomTracksAction
): CustomTracksState => {
  switch (action.type) {
    case 'LOAD_TRACKS':
      return { ...state, customTracks: action.payload, isLoading: false };
    case 'ADD_TRACK':
      return { ...state, customTracks: [...state.customTracks, action.payload] };
    case 'REMOVE_TRACK':
      return {
        ...state,
        customTracks: state.customTracks.filter(track => track.id !== action.payload),
      };
    case 'UPDATE_TRACK':
      return {
        ...state,
        customTracks: state.customTracks.map(track =>
          track.id === action.payload.id ? { ...track, ...action.payload.data } : track
        ),
      };
    case 'CLEAR_TRACKS':
      return { ...state, customTracks: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

/**
 * Context type definition for custom tracks management.
 *
 * Provides all operations and state required to manage user-created tracks
 * across the application. Supports filtering by genre, year, and release status.
 *
 * @typedef {Object} CustomTracksContextType
 * @property {CustomTrack[]} customTracks - Array of all custom tracks
 * @property {boolean} isLoading - Loading state for initial data fetch from localStorage
 * @property {Function} addCustomTrack - Add a new custom track
 * @property {Function} removeCustomTrack - Remove a custom track by ID
 * @property {Function} updateCustomTrack - Update a custom track's data
 * @property {Function} clearCustomTracks - Clear all custom tracks
 * @property {Function} getCustomTracksByGenre - Filter tracks by genre
 * @property {Function} getCustomTracksByYear - Filter tracks by release year
 * @property {Function} getCustomTracksByStatus - Filter tracks by release status
 */
interface CustomTracksContextType {
  customTracks: CustomTrack[];
  isLoading: boolean;
  addCustomTrack: (trackData: Omit<CustomTrack, 'id' | 'createdAt'>) => CustomTrack;
  removeCustomTrack: (id: string) => void;
  updateCustomTrack: (id: string, updatedData: Partial<CustomTrack>) => void;
  clearCustomTracks: () => void;
  getCustomTracksByGenre: (genre: string) => CustomTrack[];
  getCustomTracksByYear: (year: number) => CustomTrack[];
  getCustomTracksByStatus: (isReleased: boolean) => CustomTrack[];
}

const CustomTracksContext = createContext<CustomTracksContextType | undefined>(undefined);

export { CustomTracksContext, type CustomTracksContextType };

interface CustomTracksProviderProps {
  children: ReactNode;
}

/**
 * Provider component for custom tracks context.
 *
 * Wraps child components and provides access to custom track management functions
 * through the useCustomTracks hook. Automatically loads custom tracks from
 * localStorage on mount and persists changes automatically.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to provide context to
 * @returns {JSX.Element} Context provider wrapper
 *
 * @example
 * ```typescript
 * <CustomTracksProvider>
 *   <TrackRegistrationPage />
 * </CustomTracksProvider>
 * ```
 */
export const CustomTracksProvider: React.FC<CustomTracksProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(customTracksReducer, initialState);

  useEffect(() => {
    const loadCustomTracks = () => {
      try {
        const stored = localStorage.getItem(CUSTOM_TRACKS_KEY);
        if (stored) {
          const parsedTracks = JSON.parse(stored);
          dispatch({ type: 'LOAD_TRACKS', payload: parsedTracks });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        // Silent fail
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCustomTracks();
  }, []);

  /**
   * Internal helper to persist custom tracks to localStorage.
   *
   * @param {CustomTrack[]} newTracks - Array of tracks to persist
   * @private
   */
  const saveCustomTracks = useCallback((newTracks: CustomTrack[]) => {
    try {
      localStorage.setItem(CUSTOM_TRACKS_KEY, JSON.stringify(newTracks));
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveCustomTracks(state.customTracks);
    }
  }, [state.customTracks, state.isLoading, saveCustomTracks]);

  /**
   * Add a new custom track to the collection.
   *
   * @param {Omit<CustomTrack, 'id' | 'createdAt'>} trackData - Track data to create
   * @returns {CustomTrack} The newly created custom track object
   */
  const addCustomTrack = useCallback(
    (trackData: Omit<CustomTrack, 'id' | 'createdAt'>) => {
      const newTrack: CustomTrack = {
        ...trackData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_TRACK', payload: newTrack });
      return newTrack;
    },
    []
  );

  /**
   * Remove a custom track by its ID.
   *
   * @param {string} id - The custom track ID to remove
   */
  const removeCustomTrack = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TRACK', payload: id });
  }, []);

  /**
   * Update a custom track with partial data.
   *
   * Only provided fields are updated; other properties remain unchanged.
   *
   * @param {string} id - The custom track ID to update
   * @param {Partial<CustomTrack>} updatedData - Partial track data to merge
   */
  const updateCustomTrack = useCallback((id: string, updatedData: Partial<CustomTrack>) => {
    dispatch({ type: 'UPDATE_TRACK', payload: { id, data: updatedData } });
  }, []);

  /**
   * Clear all custom tracks and reset the context state.
   * This also clears localStorage.
   */
  const clearCustomTracks = useCallback(() => {
    dispatch({ type: 'CLEAR_TRACKS' });
  }, []);

  /**
   * Get all custom tracks of a specific genre.
   *
   * @param {string} genre - The genre to filter by
   * @returns {CustomTrack[]} Array of custom tracks matching the genre
   */
  const getCustomTracksByGenre = useCallback(
    (genre: string) => {
      return state.customTracks.filter(track => track.genre === genre);
    },
    [state.customTracks]
  );

  /**
   * Get all custom tracks from a specific year.
   *
   * @param {number} year - The release year to filter by
   * @returns {CustomTrack[]} Array of custom tracks from the year
   */
  const getCustomTracksByYear = useCallback(
    (year: number) => {
      return state.customTracks.filter(track => track.year === year);
    },
    [state.customTracks]
  );

  /**
   * Get custom tracks filtered by release status.
   *
   * @param {boolean} isReleased - Filter by release status (true for released, false for unreleased)
   * @returns {CustomTrack[]} Array of custom tracks matching the status
   */
  const getCustomTracksByStatus = useCallback(
    (isReleased: boolean) => {
      return state.customTracks.filter(track => track.isReleased === isReleased);
    },
    [state.customTracks]
  );

  const value: CustomTracksContextType = {
    customTracks: state.customTracks,
    isLoading: state.isLoading,
    addCustomTrack,
    removeCustomTrack,
    updateCustomTrack,
    clearCustomTracks,
    getCustomTracksByGenre,
    getCustomTracksByYear,
    getCustomTracksByStatus,
  };

  return (
    <CustomTracksContext.Provider value={value}>
      {children}
    </CustomTracksContext.Provider>
  );
};

/**
 * Hook to access the custom tracks context.
 *
 * Must be used within a component tree wrapped by CustomTracksProvider.
 * Provides access to all custom track management functions and state.
 *
 * @returns {CustomTracksContextType} The custom tracks context object
 * @throws {Error} If used outside of CustomTracksProvider
 *
 * @example
 * ```typescript
 * function TrackList() {
 *   const { customTracks, addCustomTrack, removeCustomTrack } = useCustomTracks();
 *   // Use custom tracks functionality
 * }
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useCustomTracks = (): CustomTracksContextType => {
  const context = useContext(CustomTracksContext);
  if (context === undefined) {
    throw new Error('useCustomTracks must be used within a CustomTracksProvider');
  }
  return context;
};
