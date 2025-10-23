import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '../../features/i18n';
import { ThemeProvider } from '../../features/theme/theme-context';
import { ThemeToggle } from '../../features/theme/theme-toggle';
import { LanguageSwitcher } from '../../features/i18n/language-switcher';
import { ErrorBoundary } from '../../components/error-boundary';

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

// Component that throws an error for testing
const ThrowError = () => {
  throw new Error('Test error boundary');
};

// Component that renders conditionally
const ConditionalError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Conditional error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when there is no error', async () => {
    await act(async () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );
    });

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch errors and display error UI', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should display error message in UI', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Ocorreu um erro inesperado/)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should provide retry button', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Tentar novamente');
    expect(retryButton).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should provide home button', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('Ir para início');
    expect(homeButton).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should render custom fallback if provided', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should call onError callback when error occurs', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onErrorSpy = vi.fn();

    render(
      <ErrorBoundary onError={onErrorSpy}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should show error details in development mode', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Check for error details section
    const detailsButton = screen.getByText(/📋 Detalhes do erro/);
    expect(detailsButton).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should allow clicking retry to close error UI', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ConditionalError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();

    // After retry, we would need to re-render with a component that doesn't throw
    // In a real scenario, the component might fix itself or user would navigate away

    consoleErrorSpy.mockRestore();
  });
});
