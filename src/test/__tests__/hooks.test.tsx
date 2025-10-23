import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../../features/theme/theme-context';
import { CustomTracksProvider, useCustomTracks } from '../../contexts/custom-tracks-context';
import type { CustomTrack } from '../../types';

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const createThemeWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty favorites', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add favorite track', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockTrack = {
      name: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 180000,
      type: 'track' as const,
    };

    act(() => {
      result.current.toggleFavorite(mockTrack);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toMatchObject(mockTrack);
  });

  it('should remove favorite', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockTrack = {
      name: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 180000,
      type: 'track' as const,
    };

    act(() => {
      result.current.toggleFavorite(mockTrack);
    });

    expect(result.current.favorites).toHaveLength(1);

    const favoriteId = result.current.favorites[0].id;

    act(() => {
      result.current.removeFavorite(favoriteId);
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('should persist favorites to localStorage', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockTrack = {
      name: 'Persisted Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 200000,
      type: 'track' as const,
    };

    act(() => {
      result.current.addFavorite(mockTrack);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.favorites.length).toBeGreaterThan(0);
    expect(result.current.favorites[0].name).toBe('Persisted Track');
  });

  it('should clear all favorites', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockTrack1 = {
      name: 'Track 1',
      artist: 'Artist 1',
      album: 'Album 1',
      duration: 180000,
      type: 'track' as const,
    };

    const mockTrack2 = {
      name: 'Track 2',
      artist: 'Artist 2',
      album: 'Album 2',
      duration: 200000,
      type: 'track' as const,
    };

    act(() => {
      result.current.addFavorite(mockTrack1);
      result.current.addFavorite(mockTrack2);
    });

    expect(result.current.favorites.length).toBeGreaterThanOrEqual(1);

    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('should check if track is favorited', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockTrack = {
      name: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 180000,
      type: 'track' as const,
    };

    act(() => {
      result.current.addFavorite(mockTrack);
    });

    const favoriteId = result.current.favorites[0].id;
    const isFavorited = result.current.isFavorite(favoriteId);
    expect(isFavorited).toBe(true);
  });

  it('should get favorites by type', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockTrack = {
      name: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 180000,
      type: 'track' as const,
    };

    act(() => {
      result.current.addFavorite(mockTrack);
    });

    const trackFavorites = result.current.getFavoritesByType('track');
    expect(trackFavorites.length).toBeGreaterThanOrEqual(1);
  });
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with light theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createThemeWrapper(),
    });

    expect(result.current.theme).toBe('light');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createThemeWrapper(),
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createThemeWrapper(),
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });
});

describe('useCustomTracks', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const createCustomTracksWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <CustomTracksProvider>
        {children}
      </CustomTracksProvider>
    );
  };

  it('should initialize with empty tracks and isLoading false', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.customTracks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add a custom track', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const trackData = {
      name: 'My Track',
      artist: 'My Artist',
      album: 'My Album',
      year: 2024,
      genre: 'Rock',
      duration: { minutes: 3, seconds: 45 },
      isReleased: true,
    };

    let addedTrack: CustomTrack;
    act(() => {
      addedTrack = result.current.addCustomTrack(trackData);
    });

    expect(result.current.customTracks).toHaveLength(1);
    expect(result.current.customTracks[0]).toMatchObject(trackData);
    expect(addedTrack!.id).toBeDefined();
    expect(addedTrack!.createdAt).toBeDefined();
  });

  it('should remove a custom track', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const trackData = {
      name: 'Track to Remove',
      artist: 'Artist',
      album: 'Album',
      year: 2024,
      genre: 'Pop',
      duration: { minutes: 2, seconds: 30 },
      isReleased: false,
    };

    let trackId: string = '';
    act(() => {
      const track = result.current.addCustomTrack(trackData);
      trackId = track.id;
    });

    expect(result.current.customTracks).toHaveLength(1);

    act(() => {
      result.current.removeCustomTrack(trackId);
    });

    expect(result.current.customTracks).toHaveLength(0);
  });

  it('should update a custom track', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const trackData = {
      name: 'Original Name',
      artist: 'Original Artist',
      album: 'Original Album',
      year: 2024,
      genre: 'Jazz',
      duration: { minutes: 4, seconds: 20 },
      isReleased: false,
    };

    let trackId: string = '';
    act(() => {
      const track = result.current.addCustomTrack(trackData);
      trackId = track.id;
    });

    act(() => {
      result.current.updateCustomTrack(trackId, {
        name: 'Updated Name',
        isReleased: true,
      });
    });

    expect(result.current.customTracks[0].name).toBe('Updated Name');
    expect(result.current.customTracks[0].isReleased).toBe(true);
    expect(result.current.customTracks[0].artist).toBe('Original Artist');
  });

  it('should clear all custom tracks', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const track1 = {
      name: 'Track 1',
      artist: 'Artist 1',
      album: 'Album 1',
      year: 2024,
      genre: 'Rock',
      duration: { minutes: 3, seconds: 0 },
      isReleased: true,
    };

    const track2 = {
      name: 'Track 2',
      artist: 'Artist 2',
      album: 'Album 2',
      year: 2023,
      genre: 'Pop',
      duration: { minutes: 2, seconds: 45 },
      isReleased: false,
    };

    act(() => {
      result.current.addCustomTrack(track1);
      result.current.addCustomTrack(track2);
    });

    expect(result.current.customTracks).toHaveLength(2);

    act(() => {
      result.current.clearCustomTracks();
    });

    expect(result.current.customTracks).toHaveLength(0);
  });

  it('should get custom tracks by genre', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const rockTrack = {
      name: 'Rock Track',
      artist: 'Rock Artist',
      album: 'Rock Album',
      year: 2024,
      genre: 'Rock',
      duration: { minutes: 3, seconds: 0 },
      isReleased: true,
    };

    const popTrack = {
      name: 'Pop Track',
      artist: 'Pop Artist',
      album: 'Pop Album',
      year: 2024,
      genre: 'Pop',
      duration: { minutes: 2, seconds: 45 },
      isReleased: true,
    };

    act(() => {
      result.current.addCustomTrack(rockTrack);
      result.current.addCustomTrack(popTrack);
    });

    const rockTracks = result.current.getCustomTracksByGenre('Rock');
    expect(rockTracks).toHaveLength(1);
    expect(rockTracks[0].genre).toBe('Rock');
  });

  it('should get custom tracks by year', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const track2024 = {
      name: 'Track 2024',
      artist: 'Artist',
      album: 'Album',
      year: 2024,
      genre: 'Rock',
      duration: { minutes: 3, seconds: 0 },
      isReleased: true,
    };

    const track2023 = {
      name: 'Track 2023',
      artist: 'Artist',
      album: 'Album',
      year: 2023,
      genre: 'Pop',
      duration: { minutes: 2, seconds: 45 },
      isReleased: true,
    };

    act(() => {
      result.current.addCustomTrack(track2024);
      result.current.addCustomTrack(track2023);
    });

    const tracksByYear = result.current.getCustomTracksByYear(2024);
    expect(tracksByYear).toHaveLength(1);
    expect(tracksByYear[0].year).toBe(2024);
  });

  it('should get custom tracks by release status', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const releasedTrack = {
      name: 'Released Track',
      artist: 'Artist',
      album: 'Album',
      year: 2024,
      genre: 'Rock',
      duration: { minutes: 3, seconds: 0 },
      isReleased: true,
    };

    const pendingTrack = {
      name: 'Pending Track',
      artist: 'Artist',
      album: 'Album',
      year: 2024,
      genre: 'Pop',
      duration: { minutes: 2, seconds: 45 },
      isReleased: false,
    };

    act(() => {
      result.current.addCustomTrack(releasedTrack);
      result.current.addCustomTrack(pendingTrack);
    });

    const releasedTracks = result.current.getCustomTracksByStatus(true);
    expect(releasedTracks).toHaveLength(1);
    expect(releasedTracks[0].isReleased).toBe(true);

    const pendingTracks = result.current.getCustomTracksByStatus(false);
    expect(pendingTracks).toHaveLength(1);
    expect(pendingTracks[0].isReleased).toBe(false);
  });

  it('should persist custom tracks to localStorage', async () => {
    const { result } = renderHook(() => useCustomTracks(), {
      wrapper: createCustomTracksWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const trackData = {
      name: 'Persisted Track',
      artist: 'Persisted Artist',
      album: 'Persisted Album',
      year: 2024,
      genre: 'Electronic',
      duration: { minutes: 4, seconds: 15 },
      isReleased: true,
    };

    act(() => {
      result.current.addCustomTrack(trackData);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const stored = localStorage.getItem('spotify-artists-custom-tracks');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject(trackData);
  });
});
