import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-600'>
          <div className='max-w-md w-full mx-4'>
            <div className='bg-white dark:bg-dark-500 rounded-xl shadow-lg p-8 text-center'>
              <div className='flex justify-center mb-4'>
                <AlertTriangle
                  size={48}
                  className='text-red-500 dark:text-red-400'
                />
              </div>

              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Oops! Algo deu errado
              </h2>

              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                Ocorreu um erro inesperado. Tente recarregar a página ou volte
                mais tarde.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className='mb-6 text-left'>
                  <summary className='cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2'>
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className='text-xs bg-gray-100 dark:bg-dark-400 p-3 rounded overflow-auto'>
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className='flex gap-3 justify-center'>
                <button
                  onClick={this.handleRetry}
                  className='btn-primary flex items-center gap-2'
                >
                  <RefreshCw size={16} />
                  Tentar novamente
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className='btn-secondary'
                >
                  Recarregar página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
