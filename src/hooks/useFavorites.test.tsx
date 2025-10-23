import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useFavorites } from './useFavorites';

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
