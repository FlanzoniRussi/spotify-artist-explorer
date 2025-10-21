import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

interface CustomTracksProviderProps {
  children: ReactNode;
}

export const CustomTracksProvider: React.FC<CustomTracksProviderProps> = ({ children }) => {
  const [customTracks, setCustomTracks] = useState<CustomTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log('CustomTracksProvider - customTracks:', customTracks.length, customTracks);

  useEffect(() => {
    const loadCustomTracks = () => {
      try {
        const stored = localStorage.getItem(CUSTOM_TRACKS_KEY);
        if (stored) {
          const parsedTracks = JSON.parse(stored);
          console.log('Loading tracks from localStorage:', parsedTracks.length);
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
      console.log('saveCustomTracks called with:', newTracks);
      localStorage.setItem(CUSTOM_TRACKS_KEY, JSON.stringify(newTracks));
      console.log('localStorage updated, setting state...');
      setCustomTracks(newTracks);
      console.log('State updated to:', newTracks);
    } catch (error) {
      console.error('Error saving custom tracks:', error);
    }
  }, []);

  const addCustomTrack = useCallback(
    (trackData: Omit<CustomTrack, 'id' | 'createdAt'>) => {
      console.log('addCustomTrack called with:', trackData);
      console.log('Current customTracks before add:', customTracks);
      
      const newTrack: CustomTrack = {
        ...trackData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      console.log('New track created:', newTrack);

      const updatedTracks = [...customTracks, newTrack];
      console.log('Updated tracks array:', updatedTracks);
      
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

export const useCustomTracks = (): CustomTracksContextType => {
  const context = useContext(CustomTracksContext);
  if (context === undefined) {
    throw new Error('useCustomTracks must be used within a CustomTracksProvider');
  }
  return context;
};
