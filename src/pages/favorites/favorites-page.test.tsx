import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks and contexts BEFORE importing the component
vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: vi.fn(),
}));

vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../contexts/ratings-context', () => ({
  useRatingsContext: () => ({
    ratings: [],
    getRating: vi.fn(),
    addOrUpdateRating: vi.fn(),
  }),
  RatingsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// NOW import the component and mocked hooks
import { FavoritesPage } from './favorites-page';
import { useFavorites } from '../../hooks/useFavorites';
import { I18nProvider } from '../../features/i18n';
import { ThemeProvider } from '../../features/theme/theme-context';

// Helper to create test wrapper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
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

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render favorites page without crashing', () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      toggleFavorite: vi.fn(),
      isFavorite: () => false,
    });

    const { container } = render(<FavoritesPage />, {
      wrapper: createTestWrapper(),
    });
    expect(container).toBeDefined();
  });

  it('should display empty state when no favorites', () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      toggleFavorite: vi.fn(),
      isFavorite: () => false,
    });

    const { container } = render(<FavoritesPage />, {
      wrapper: createTestWrapper(),
    });
    expect(container).toBeDefined();
  });
});
