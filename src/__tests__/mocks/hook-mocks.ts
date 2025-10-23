import { vi } from 'vitest';
import type { UserFavorite } from '../../types';

/**
 * Create a complete mock for useFavorites hook
 */
export const createUseFavoritesMock = () => ({
  favorites: [] as UserFavorite[],
  isLoading: false,
  addFavorite: vi.fn(
    (item: Omit<UserFavorite, 'id' | 'addedAt'>) =>
      ({
        ...item,
        id: 'test-id',
        addedAt: new Date().toISOString(),
      }) as UserFavorite
  ),
  removeFavorite: vi.fn(),
  toggleFavorite: vi.fn(() => true),
  clearFavorites: vi.fn(),
  getFavoritesByType: vi.fn(() => []),
  isFavorite: vi.fn(() => false),
});

/**
 * Create a complete mock for useSearchHistory hook
 */
export const createUseSearchHistoryMock = () => ({
  history: [],
  addSearch: vi.fn(),
  getTopSearches: vi.fn(() => []),
  clearHistory: vi.fn(),
});

/**
 * Create a complete mock for useSpotify hooks (TanStack Query)
 * For tests: we need a simplified mock that covers the essential properties
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUseSpotifyMock = (): any => ({
  data: undefined,
  isLoading: false,
  error: null,
  isFetching: false,
  isError: false,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isStale: false,
  isPlaceholderData: false,
  status: 'pending',
  fetchStatus: 'idle',
  dataUpdatedAt: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  isSuccess: false,
  errorUpdateCount: 0,
  isFetched: false,
  isFetchedAfterMount: false,
  refetch: vi.fn(),
  remove: vi.fn(),
});

/**
 * Create a complete mock for useCustomTracks hook
 */
export const createUseCustomTracksMock = () => ({
  customTracks: [],
  isLoading: false,
  addCustomTrack: vi.fn(),
  removeCustomTrack: vi.fn(),
  clearCustomTracks: vi.fn(),
  updateCustomTrack: vi.fn(),
  getCustomTracksByGenre: vi.fn(() => []),
  getCustomTracksByYear: vi.fn(() => []),
  getCustomTracksByStatus: vi.fn(() => []),
});
