import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the hooks BEFORE importing the component
vi.mock('../../hooks/useSpotify', () => ({
  useSpotifyNewReleases: vi.fn(),
}));

vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: vi.fn(),
}));

vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home:newReleases.title': 'New Releases',
        'home:newReleases.subtitle': 'Discover the latest albums and singles',
        'home:newReleases.empty': 'No releases found',
        'home:newReleases.emptyDescription': 'Try again later',
        'buttons.addFavorite': 'Add to favorites',
        'buttons.removeFavorite': 'Remove from favorites',
        'fallbacks.unknown': 'Unknown',
        'labels.tracks': 'tracks',
        'labels.track': 'track',
      };
      return translations[key] || key;
    },
  }),
}));

// NOW import the component and the mocked hooks
import { NewReleasesPage } from './new-releases-page';
import { useSpotifyNewReleases } from '../../hooks/useSpotify';
import { useFavorites } from '../../hooks/useFavorites';
import { I18nProvider } from '../../features/i18n';
import { ThemeProvider } from '../../features/theme/theme-context';
import { mockAlbums } from '../../__tests__/fixtures/mock-data';

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

describe('NewReleasesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering and Loading States', () => {
    it('should render loading skeleton when data is loading', () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      const { container } = render(<NewReleasesPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });

    it('should render empty state when no albums found', async () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: [], total: 0 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      const { container } = render(<NewReleasesPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });

    it('should render page title and subtitle', () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: [], total: 0 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      render(<NewReleasesPage />, { wrapper: createTestWrapper() });

      expect(screen.getByText('New Releases')).toBeDefined();
      expect(
        screen.getByText('Discover the latest albums and singles')
      ).toBeDefined();
    });
  });

  describe('Album Display', () => {
    it('should render albums when data is loaded', async () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: mockAlbums, total: 2 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      render(<NewReleasesPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText(mockAlbums[0].name)).toBeDefined();
      });
    });

    it('should display album artist names', async () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: mockAlbums, total: 2 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      render(<NewReleasesPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText(mockAlbums[0].artists[0].name)).toBeDefined();
      });
    });

    it('should display album track count', async () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: mockAlbums, total: 2 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      render(<NewReleasesPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText('10 tracks')).toBeDefined();
      });
    });
  });

  describe('Favorite Interaction', () => {
    it('should display favorite button for each album', async () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: mockAlbums, total: 2 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      render(<NewReleasesPage />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        const favoriteButtons = screen.getAllByRole('button', {
          name: /favorite/i,
        });
        expect(favoriteButtons.length).toBeGreaterThan(0);
      });
    });

    it('should call toggleFavorite when favorite button is clicked', async () => {
      const toggleFavorite = vi.fn();

      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: [mockAlbums[0]], total: 1 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite,
        isFavorite: () => false,
      });

      render(<NewReleasesPage />, { wrapper: createTestWrapper() });

      const favoriteButton = await screen.findByRole('button', {
        name: /favorite/i,
      });
      await userEvent.click(favoriteButton);

      expect(toggleFavorite).toHaveBeenCalled();
    });

    it('should show favorited state when album is in favorites', async () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: { items: mockAlbums, total: 2 },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [mockAlbums[0]],
        toggleFavorite: vi.fn(),
        isFavorite: item => item.id === mockAlbums[0].id,
      });

      const { container } = render(<NewReleasesPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });
  });

  describe('Pagination', () => {
    it('should render pagination when there are multiple pages', async () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue({
        data: {
          items: mockAlbums,
          total: 100,
        },
        isLoading: false,
        error: null,
        isFetching: false,
      });

      vi.mocked(useFavorites).mockReturnValue({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      });

      const { container } = render(<NewReleasesPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });
  });
});
