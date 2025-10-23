import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CustomTrack } from '../types';
import { generateId } from '../utils/formatters';

const CUSTOM_TRACKS_KEY = 'spotify-artists-custom-tracks';

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

export const CustomTracksProvider: React.FC<CustomTracksProviderProps> = ({ children }) => {
  const [customTracks, setCustomTracks] = useState<CustomTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCustomTracks = () => {
      try {
        const stored = localStorage.getItem(CUSTOM_TRACKS_KEY);
        if (stored) {
          const parsedTracks = JSON.parse(stored);
          setCustomTracks(parsedTracks);
        }
      } catch (error) {
        console.error('Error loading custom tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomTracks();
  }, []);

  const saveCustomTracks = useCallback((newTracks: CustomTrack[]) => {
    try {
      localStorage.setItem(CUSTOM_TRACKS_KEY, JSON.stringify(newTracks));
      setCustomTracks(newTracks);
    } catch (error) {
      console.error('Error saving custom tracks:', error);
    }
  }, []);

  const addCustomTrack = useCallback(
    (trackData: Omit<CustomTrack, 'id' | 'createdAt'>) => {
      const newTrack: CustomTrack = {
        ...trackData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      const updatedTracks = [...customTracks, newTrack];
      saveCustomTracks(updatedTracks);
      return newTrack;
    },
    [customTracks, saveCustomTracks]
  );

  const removeCustomTrack = useCallback(
    (id: string) => {
      const updatedTracks = customTracks.filter(track => track.id !== id);
      saveCustomTracks(updatedTracks);
    },
    [customTracks, saveCustomTracks]
  );

  const updateCustomTrack = useCallback(
    (id: string, updatedData: Partial<CustomTrack>) => {
      const updatedTracks = customTracks.map(track =>
        track.id === id ? { ...track, ...updatedData } : track
      );
      saveCustomTracks(updatedTracks);
    },
    [customTracks, saveCustomTracks]
  );

  const clearCustomTracks = useCallback(() => {
    saveCustomTracks([]);
  }, [saveCustomTracks]);

  const getCustomTracksByGenre = useCallback(
    (genre: string) => {
      return customTracks.filter(track => track.genre === genre);
    },
    [customTracks]
  );

  const getCustomTracksByYear = useCallback(
    (year: number) => {
      return customTracks.filter(track => track.year === year);
    },
    [customTracks]
  );

  const getCustomTracksByStatus = useCallback(
    (isReleased: boolean) => {
      return customTracks.filter(track => track.isReleased === isReleased);
    },
    [customTracks]
  );

  const value: CustomTracksContextType = {
    customTracks,
    isLoading,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomTracks = (): CustomTracksContextType => {
  const context = useContext(CustomTracksContext);
  if (context === undefined) {
    throw new Error('useCustomTracks must be used within a CustomTracksProvider');
  }
  return context;
};
