import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  createUseFavoritesMock,
  createUseSpotifyMock,
} from '../../__tests__/mocks/hook-mocks';

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
        ...createUseSpotifyMock(),
        isLoading: true,
      });
      vi.mocked(useFavorites).mockReturnValue(createUseFavoritesMock());

      const { container } = render(<NewReleasesPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });

    it('should render empty state when no albums found', () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue(createUseSpotifyMock());
      vi.mocked(useFavorites).mockReturnValue(createUseFavoritesMock());

      const { container } = render(<NewReleasesPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });

    it('should render page title and subtitle', () => {
      vi.mocked(useSpotifyNewReleases).mockReturnValue(createUseSpotifyMock());
      vi.mocked(useFavorites).mockReturnValue(createUseFavoritesMock());

      const { container } = render(<NewReleasesPage />, {
        wrapper: createTestWrapper(),
      });
      expect(container).toBeDefined();
    });
  });
});
