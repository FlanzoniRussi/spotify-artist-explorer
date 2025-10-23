import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { errorReporter } from '../lib/error-reporter';

/**
 * Props for the ErrorBoundary component.
 *
 * @typedef {Object} ErrorBoundaryProps
 * @property {ReactNode} children - Child components to wrap and protect
 * @property {ReactNode} [fallback] - Optional custom error UI to display on error
 * @property {Function} [onError] - Optional callback when an error is caught
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State for the ErrorBoundary component.
 *
 * @typedef {Object} ErrorBoundaryState
 * @property {boolean} hasError - Whether an error has been caught
 * @property {Error} [error] - The caught error object
 * @property {ErrorInfo} [errorInfo] - React error information with component stack
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary component for React error handling.
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 * the entire application. This is a class component required by React
 * for error boundary implementation.
 *
 * **Key Features:**
 * - Catches errors during rendering, in lifecycle methods, and constructors
 * - Displays detailed error information in development mode
 * - Provides retry and home navigation buttons
 * - Supports custom fallback UI
 * - Optional error callback for logging/monitoring
 * - Integrates with structured error reporting
 *
 * **Note:** Does NOT catch errors for:
 * - Event handlers (use try-catch instead)
 * - Asynchronous code (setTimeout, promises)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 *
 * @component
 * @example
 * ```typescript
 * <ErrorBoundary
 *   fallback={<CustomErrorPage />}
 *   onError={(error, errorInfo) => {
 *     console.error('Component error:', error);
 *     trackError(error); // Send to error tracking service
 *   }}
 * >
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * React lifecycle method called when an error is thrown in a child component.
   *
   * Updates state to trigger the fallback UI. Called during render phase.
   *
   * @static
   * @param {Error} error - The error that was thrown
   * @returns {ErrorBoundaryState} New state with hasError flag set to true
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * React lifecycle method called after an error has been thrown.
   *
   * Used for error logging and reporting. Called during commit phase.
   * If running in development, logs the error and component stack to console.
   * Also calls the optional onError callback if provided.
   *
   * Integrates with structured error reporting system.
   *
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Object containing the component stack
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Report error with structured logging
    errorReporter.reportError(error, {
      component: 'ErrorBoundary',
      action: 'caught-component-error',
      componentStack: errorInfo.componentStack,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  /**
   * Retry handler to reset error boundary and attempt to render children again.
   *
   * Called when user clicks "Tentar novamente" button.
   *
   * @private
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  /**
   * Navigate to home page when error occurs.
   *
   * Called when user clicks "Ir para início" button.
   *
   * @private
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 dark:bg-red-950 rounded-full p-4">
                  <AlertTriangle
                    size={48}
                    className="text-red-500 dark:text-red-400"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Algo deu errado
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ocorreu um erro inesperado. Tente recarregar a página ou volte
                para a página inicial.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 hover:text-gray-900 dark:hover:text-gray-200">
                    📋 Detalhes do erro (desenvolvimento)
                  </summary>
                  <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg overflow-auto max-h-48">
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-mono mb-2">
                      <strong>Mensagem:</strong> {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Tentar novamente
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home size={16} />
                  Ir para início
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
