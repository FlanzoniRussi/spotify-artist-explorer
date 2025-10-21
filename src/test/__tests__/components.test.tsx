import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '../../features/i18n';
import { ThemeProvider } from '../../features/theme/theme-context';
import { ThemeToggle } from '../../features/theme/theme-toggle';
import { LanguageSwitcher } from '../../features/i18n/language-switcher';

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe('ThemeToggle', () => {
  it('should render theme toggle button', async () => {
    await act(async () => {
      render(<ThemeToggle />, { wrapper: createTestWrapper() });
    });
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should have correct aria label', async () => {
    await act(async () => {
      render(<ThemeToggle />, { wrapper: createTestWrapper() });
    });
    
    const button = screen.getByLabelText('Switch to dark mode');
    expect(button).toBeInTheDocument();
  });
});

describe('LanguageSwitcher', () => {
  it('should render language switcher', async () => {
    await act(async () => {
      render(<LanguageSwitcher />, { wrapper: createTestWrapper() });
    });
    
    const button = screen.getByLabelText('Change language');
    expect(button).toBeInTheDocument();
  });

  it('should have correct aria label', async () => {
    await act(async () => {
      render(<LanguageSwitcher />, { wrapper: createTestWrapper() });
    });
    
    const button = screen.getByLabelText('Change language');
    expect(button).toBeInTheDocument();
  });
});
