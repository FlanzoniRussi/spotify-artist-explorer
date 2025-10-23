import { renderHook, act } from '@testing-library/react';
import { useRatings } from '../../hooks/useRatings';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useRatings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty ratings', () => {
    const { result } = renderHook(() => useRatings());
    expect(result.current.ratings).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add a rating', () => {
    const { result } = renderHook(() => useRatings());

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 5, 'Test Song', 'Test Artist');
    });

    expect(result.current.ratings).toHaveLength(1);
    expect(result.current.ratings[0].rating).toBe(5);
    expect(result.current.ratings[0].itemName).toBe('Test Song');
  });

  it('should update a rating', () => {
    const { result } = renderHook(() => useRatings());

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 5, 'Test Song');
    });

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 3, 'Test Song');
    });

    expect(result.current.ratings).toHaveLength(1);
    expect(result.current.ratings[0].rating).toBe(3);
  });

  it('should get rating for an item', () => {
    const { result } = renderHook(() => useRatings());

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 4, 'Test Song');
    });

    const rating = result.current.getRating('track-1', 'track');
    expect(rating).toBe(4);
  });

  it('should return null for non-existent rating', () => {
    const { result } = renderHook(() => useRatings());

    const rating = result.current.getRating('non-existent', 'track');
    expect(rating).toBeNull();
  });

  it('should remove a rating', () => {
    const { result } = renderHook(() => useRatings());

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 5, 'Test Song');
    });

    expect(result.current.ratings).toHaveLength(1);

    act(() => {
      result.current.removeRating('track-1', 'track');
    });

    expect(result.current.ratings).toHaveLength(0);
  });

  it('should get rating stats', () => {
    const { result } = renderHook(() => useRatings());

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 5, 'Song 1');
      result.current.addOrUpdateRating('track-2', 'track', 4, 'Song 2');
      result.current.addOrUpdateRating('track-3', 'track', 3, 'Song 3');
    });

    const stats = result.current.getRatingStats('track');
    expect(stats.total).toBe(3);
    expect(stats.average).toBe(4);
    expect(stats.distribution[3]).toBe(1);
    expect(stats.distribution[4]).toBe(1);
    expect(stats.distribution[5]).toBe(1);
  });

  it('should persist ratings to localStorage', () => {
    const { result: result1 } = renderHook(() => useRatings());

    act(() => {
      result1.current.addOrUpdateRating('track-1', 'track', 5, 'Test Song');
    });

    const { result: result2 } = renderHook(() => useRatings());

    expect(result2.current.ratings).toHaveLength(1);
    expect(result2.current.ratings[0].rating).toBe(5);
  });

  it('should throw error for invalid rating', () => {
    const { result } = renderHook(() => useRatings());

    expect(() => {
      act(() => {
        result.current.addOrUpdateRating('track-1', 'track', 6, 'Test Song');
      });
    }).toThrow('Rating must be between 1 and 5');

    expect(() => {
      act(() => {
        result.current.addOrUpdateRating('track-1', 'track', 0, 'Test Song');
      });
    }).toThrow('Rating must be between 1 and 5');
  });

  it('should get ratings by type', () => {
    const { result } = renderHook(() => useRatings());

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 5, 'Song 1');
      result.current.addOrUpdateRating('artist-1', 'artist', 4, 'Artist 1');
      result.current.addOrUpdateRating('track-2', 'track', 3, 'Song 2');
    });

    const trackRatings = result.current.getRatingsByType('track');
    expect(trackRatings).toHaveLength(2);

    const artistRatings = result.current.getRatingsByType('artist');
    expect(artistRatings).toHaveLength(1);
  });

  it('should clear all ratings', () => {
    const { result } = renderHook(() => useRatings());

    act(() => {
      result.current.addOrUpdateRating('track-1', 'track', 5, 'Song 1');
      result.current.addOrUpdateRating('track-2', 'track', 4, 'Song 2');
    });

    expect(result.current.ratings).toHaveLength(2);

    act(() => {
      result.current.clearRatings();
    });

    expect(result.current.ratings).toHaveLength(0);
  });
});
