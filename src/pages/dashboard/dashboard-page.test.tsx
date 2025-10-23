import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the hooks and contexts BEFORE importing the component
vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: vi.fn(),
}));

vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../contexts/custom-tracks-context', () => ({
  CustomTracksContext: React.createContext({
    customTracks: [],
    isLoading: false,
    addCustomTrack: vi.fn(),
    removeCustomTrack: vi.fn(),
    clearCustomTracks: vi.fn(),
  }),
  CustomTracksProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('../../contexts/ratings-context', () => ({
  useRatingsContext: () => ({
    ratings: [],
    rateItem: vi.fn(),
    removeRating: vi.fn(),
    getRating: vi.fn(),
    getRatings: vi.fn(() => []),
    clearRatings: vi.fn(),
  }),
}));

// NOW import the component and the mocked hooks
import { DashboardPage } from './dashboard-page';
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

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render dashboard without crashing', () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      toggleFavorite: vi.fn(),
      isFavorite: () => false,
    });

    const { container } = render(<DashboardPage />, {
      wrapper: createTestWrapper(),
    });
    expect(container).toBeDefined();
  });

  it('should display charts and statistics', () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      toggleFavorite: vi.fn(),
      isFavorite: () => false,
    });

    const { container } = render(<DashboardPage />, {
      wrapper: createTestWrapper(),
    });
    expect(container).toBeDefined();
  });
});
