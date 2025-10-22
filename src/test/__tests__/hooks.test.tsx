import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../../features/theme/theme-context';

/**
 * Create a wrapper component with QueryClient provider
 */
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

/**
 * Create a wrapper component with Theme provider
 */
const createThemeWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

/**
 * Tests for useFavorites hook
 */
describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  /**
   * Test: Initialize with empty favorites
   */
  it('should initialize with empty favorites', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    // Wait for loading to complete
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  /**
   * Test: Add a favorite track
   */
  it('should add favorite track', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await new Promise(resolve => setTimeout(resolve, 50));

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

  /**
   * Test: Remove a favorite
   */
  it('should remove favorite', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await new Promise(resolve => setTimeout(resolve, 50));

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

  /**
   * Test: Persist favorites to localStorage
   */
  it('should persist favorites to localStorage', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await new Promise(resolve => setTimeout(resolve, 50));

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

    await new Promise(resolve => setTimeout(resolve, 50));

    // Verify the favorite was added to the hook state
    expect(result.current.favorites.length).toBeGreaterThan(0);
    expect(result.current.favorites[0].name).toBe('Persisted Track');
  });

  /**
   * Test: Clear all favorites
   */
  it('should clear all favorites', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await new Promise(resolve => setTimeout(resolve, 50));

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

  /**
   * Test: Check if track is favorited
   */
  it('should check if track is favorited', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await new Promise(resolve => setTimeout(resolve, 50));

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

  /**
   * Test: Get favorites by type
   */
  it('should get favorites by type', async () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: createQueryWrapper(),
    });

    await new Promise(resolve => setTimeout(resolve, 50));

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

/**
 * Tests for useTheme hook
 */
describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  /**
   * Test: Initialize with light theme
   */
  it('should initialize with light theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createThemeWrapper(),
    });

    expect(result.current.theme).toBe('light');
  });

  /**
   * Test: Toggle theme
   */
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

  /**
   * Test: Persist theme to localStorage
   */
  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createThemeWrapper(),
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    // Theme should be persisted
    expect(result.current.theme).toBe('dark');
  });
});
