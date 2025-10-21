import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useFavorites } from '../../hooks/useFavorites';

const createWrapper = () => {
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

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    expect(result.current.favorites).toEqual([]);
  });

  it('should add favorite track', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

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

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toMatchObject({
      name: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 180000,
      type: 'track',
    });
    expect(result.current.isFavorite(result.current.favorites[0].id)).toBe(true);
  });

  it('should remove favorite track', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

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

    expect(result.current.favorites).toHaveLength(1);
    const favoriteId = result.current.favorites[0].id;

    act(() => {
      result.current.removeFavorite(favoriteId);
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(favoriteId)).toBe(false);
  });

  it('should get favorites by type', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

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
    expect(trackFavorites).toHaveLength(1);
    expect(trackFavorites[0]).toMatchObject({
      name: 'Test Track',
      artist: 'Test Artist',
      type: 'track',
      duration: 180000,
    });
  });
});
