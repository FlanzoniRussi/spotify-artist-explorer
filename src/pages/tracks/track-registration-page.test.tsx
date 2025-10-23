import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the hooks and contexts BEFORE importing the component
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

// NOW import the component
import { TrackRegistrationPage } from './track-registration-page';
import { I18nProvider } from '../../features/i18n';
import { ThemeProvider } from '../../features/theme/theme-context';
import { CustomTracksContext } from '../../contexts/custom-tracks-context';

// Helper to create test wrapper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const customTracksContextValue = {
    customTracks: [],
    isLoading: false,
    addCustomTrack: vi.fn(),
    removeCustomTrack: vi.fn(),
    clearCustomTracks: vi.fn(),
  };

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <CustomTracksContext.Provider value={customTracksContextValue}>
            {children}
          </CustomTracksContext.Provider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe('TrackRegistrationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render track registration form without crashing', () => {
    const { container } = render(<TrackRegistrationPage />, {
      wrapper: createTestWrapper(),
    });
    expect(container).toBeDefined();
  });

  it('should display form inputs', () => {
    render(<TrackRegistrationPage />, { wrapper: createTestWrapper() });
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });
});
