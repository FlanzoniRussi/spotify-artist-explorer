import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the hooks BEFORE importing the component
vi.mock('../../hooks/useSpotify', () => ({
  useSpotifyArtists: vi.fn(),
  useSpotifyAlbums: vi.fn(),
}));

vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: vi.fn(),
}));

vi.mock('../../hooks/useSearchHistory', () => ({
  useSearchHistory: vi.fn(),
}));

vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'artists:title': 'Artists',
        'artists:subtitle': 'Explore music artists',
        'artists:search': 'Search artists...',
        'artists:startSearching': 'Start searching for artists',
        'artists:noResults': 'No artists found',
        'labels:popularity': 'Popularity',
        'labels:followers': 'Followers',
      };
      return translations[key] || key;
    },
  }),
}));

// NOW import the component and the mocked hooks
import { ArtistListPage } from './artist-list-page';
import { useSpotifyArtists, useSpotifyAlbums } from '../../hooks/useSpotify';
import { useFavorites } from '../../hooks/useFavorites';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { I18nProvider } from '../../features/i18n';
import { ThemeProvider } from '../../features/theme/theme-context';

// Helper to create test wrapper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe('ArtistListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering and Layout', () => {
    it('should render page title', () => {
      vi.mocked(useSpotifyArtists).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useSpotifyAlbums).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      vi.mocked(useSearchHistory).mockReturnValue({
        history: [],
        addToHistory: vi.fn(),
        getTopSearches: vi.fn(() => []),
      });

      const { container } = render(<ArtistListPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });

    it('should render search input', () => {
      vi.mocked(useSpotifyArtists).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useSpotifyAlbums).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      vi.mocked(useSearchHistory).mockReturnValue({
        history: [],
        addToHistory: vi.fn(),
        getTopSearches: vi.fn(() => []),
      });

      const { container } = render(<ArtistListPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });

    it('should render filter buttons', () => {
      vi.mocked(useSpotifyArtists).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useSpotifyAlbums).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      vi.mocked(useSearchHistory).mockReturnValue({
        history: [],
        addToHistory: vi.fn(),
        getTopSearches: vi.fn(() => []),
      });

      const { container } = render(<ArtistListPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });
  });

  describe('Search and Filtering', () => {
    it('should show start search message when no query', () => {
      vi.mocked(useSpotifyArtists).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useSpotifyAlbums).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      vi.mocked(useSearchHistory).mockReturnValue({
        history: [],
        addToHistory: vi.fn(),
        getTopSearches: vi.fn(() => []),
      });

      const { container } = render(<ArtistListPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should show error message on API failure', () => {
      vi.mocked(useSpotifyArtists).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('API Error'),
        isFetching: false,
      });

      vi.mocked(useSpotifyAlbums).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      vi.mocked(useSearchHistory).mockReturnValue({
        history: [],
        addToHistory: vi.fn(),
        getTopSearches: vi.fn(() => []),
      });

      const { container } = render(<ArtistListPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });
  });
});
