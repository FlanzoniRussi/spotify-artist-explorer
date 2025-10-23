import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { vi } from 'vitest';
import { I18nProvider } from '../features/i18n';
import { ThemeProvider } from '../features/theme/theme-context';

/**
 * Creates a test wrapper with all necessary providers for testing components
 * This wrapper includes:
 * - QueryClientProvider (React Query)
 * - I18nProvider (internationalization)
 * - ThemeProvider (theme context)
 *
 * @example
 * const { createTestWrapper } = await import('../../__tests__/helpers');
 * render(<MyComponent />, { wrapper: createTestWrapper() });
 */
export const createTestWrapper = () => {
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

/**
 * Mock translation function for tests
 * @example
 * const mockT = createMockTranslation();
 * mockT('home:title') // returns 'New Releases' or the key itself
 */
export const createMockTranslation = (
  customTranslations: Record<string, string> = {}
) => {
  const defaultTranslations: Record<string, string> = {
    'home:newReleases.title': 'New Releases',
    'home:newReleases.subtitle': 'Discover the latest albums and singles',
    'home:newReleases.empty': 'No releases found',
    'home:newReleases.emptyDescription': 'Try again later',
    'buttons.addFavorite': 'Add to favorites',
    'buttons.removeFavorite': 'Remove from favorites',
    'buttons.retry': 'Retry',
    'fallbacks.unknown': 'Unknown',
    'labels.tracks': 'tracks',
    'labels.track': 'track',
    'labels.followers': 'followers',
    'labels.veryPopular': 'Very Popular',
    'labels.popular': 'Popular',
    'labels.moderate': 'Moderate',
    'labels.emerging': 'Emerging',
    'labels.today': 'Today',
    'labels.yesterday': 'Yesterday',
    'labels.faixa': 'track',
    'labels.faixas': 'tracks',
    'actions.removeFromFavorites': 'Remove from favorites',
    'actions.addToFavorites': 'Add to favorites',
    'actions.viewDetails': 'View Details',
    'actions.openInSpotify': 'Open in Spotify',
    'sections.tracks': 'Tracks',
    'sections.albums': 'Albums',
    'sections.artists': 'Artists',
    'sections.mostSearchedArtists': 'Most Searched Artists',
    'errors.generic': 'Error',
    'common:errors.network': 'Network error',
    'artists:listing.title': 'Artists',
    'artists:listing.subtitle': 'Search for your favorite artists',
    'artists:listing.startSearch': 'Start searching for artists',
    'artists:listing.searchHint': 'Try searching for your favorite artists',
    'artists:listing.noResults': 'No artists found',
    'artists:listing.tryDifferent': 'Try a different search',
    'artists:listing.stats.avgPopularity': 'Average Popularity',
    'artists:loading.artists': 'Loading artists...',
    'artists:loading.albums': 'Loading albums...',
    'search.results.showing': 'Showing artists and albums',
    'search.results.moreResults': 'More results available',
    'search.results.onThisPage': 'on this page',
    'search.placeholderCombined': 'Search artists or albums...',
    'filters.all': 'All',
    'filters.artists': 'Artists',
    'filters.albums': 'Albums',
  };

  return (key: string) =>
    customTranslations[key] || defaultTranslations[key] || key;
};

/**
 * Cleanup function to run after each test
 * Already handled by vitest setup, but useful for reference
 */
export const cleanupTest = () => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks?.();
};
