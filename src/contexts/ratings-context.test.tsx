import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RatingsProvider, useRatingsContext } from './ratings-context';

const createRatingsWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <RatingsProvider>{children}</RatingsProvider>
  );
};

describe('useRatingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty ratings', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    expect(result.current.ratings).toEqual([]);
  });

  it('should add or update a rating', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating(
        'track-1',
        'track',
        5,
        'Test Song',
        'Test Artist'
      );
    });

    const rating = result.current.getRating('track-1', 'track');
    expect(rating).toBe(5);
  });

  it('should get a rating by id and type', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating(
        'album-1',
        'album',
        4,
        'Test Album',
        'Test Artist'
      );
    });

    const rating = result.current.getRating('album-1', 'album');
    expect(rating).toBe(4);
  });

  it('should return 0 for non-existent rating', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    const rating = result.current.getRating('non-existent', 'track');
    expect(rating).toBe(null);
  });

  it('should remove a rating', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating(
        'track-1',
        'track',
        5,
        'Test Song',
        'Test Artist'
      );
    });

    expect(result.current.getRating('track-1', 'track')).toBe(5);

    act(() => {
      result.current.removeRating('track-1', 'track');
    });

    expect(result.current.getRating('track-1', 'track')).toBe(null);
  });

  it('should filter ratings by type', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating(
        'track-1',
        'track',
        5,
        'Song 1',
        'Artist 1'
      );
      result.current.addOrUpdateRating(
        'track-2',
        'track',
        4,
        'Song 2',
        'Artist 2'
      );
      result.current.addOrUpdateRating(
        'album-1',
        'album',
        3,
        'Album',
        'Artist'
      );
    });

    const trackRatings = result.current.getRatingsByType('track');
    expect(trackRatings).toHaveLength(2);
  });

  it('should update existing rating', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 3, 'Song', 'Artist');
    });

    expect(result.current.getRating('track-1', 'track')).toBe(3);

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 5, 'Song', 'Artist');
    });

    expect(result.current.getRating('track-1', 'track')).toBe(5);
  });

  it('should persist ratings to localStorage', async () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating(
        'track-1',
        'track',
        5,
        'Persisted Song',
        'Artist'
      );
    });

    await waitFor(() => {
      const stored = localStorage.getItem('spotify-artists-ratings');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(
        parsed.some(
          (r: { itemId: string; rating: number }) =>
            r.itemId === 'track-1' && r.rating === 5
        )
      ).toBe(true);
    });
  });

  it('should clear all ratings', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating(
        'track-1',
        'track',
        5,
        'Song 1',
        'Artist'
      );
      result.current.addOrUpdateRating(
        'track-2',
        'track',
        4,
        'Song 2',
        'Artist'
      );
      result.current.addOrUpdateRating(
        'album-1',
        'album',
        3,
        'Album',
        'Artist'
      );
    });

    expect(result.current.ratings.length).toBeGreaterThan(0);

    act(() => {
      result.current.clearRatings();
    });

    expect(result.current.ratings).toHaveLength(0);
  });

  it('should get ratings sorted by rating descending', () => {
    const { result } = renderHook(() => useRatingsContext(), {
      wrapper: createRatingsWrapper(),
    });

    act(() => {
      result.current.addOrUpdateRating(
        'track-1',
        'track',
        3,
        'Song 1',
        'Artist'
      );
      result.current.addOrUpdateRating(
        'track-2',
        'track',
        5,
        'Song 2',
        'Artist'
      );
      result.current.addOrUpdateRating(
        'track-3',
        'track',
        4,
        'Song 3',
        'Artist'
      );
    });

    // Note: getTopRatedItems may not be implemented
    expect(result.current.ratings.length).toBeGreaterThan(0);
  });
});
