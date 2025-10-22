import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './features/theme/theme-context';
import { I18nProvider } from './features/i18n';
import { CustomTracksProvider } from './contexts/custom-tracks-context';
import { ErrorBoundary } from './components/error-boundary';
import { MainLayout } from './components/layout/main-layout';
import { ArtistListPage } from './pages/artists/artist-list-page';
import { ArtistDetailsPage } from './pages/artists/artist-details-page';
import { AlbumDetailsPage } from './pages/albums/album-details-page';
import { FavoritesPage } from './pages/favorites/favorites-page';
import { TrackRegistrationPage } from './pages/tracks/track-registration-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';

/**
 * React Query client configuration
 * Sets up default query options for caching and retry behavior
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * App Component
 *
 * Root component that sets up all providers and routes for the application.
 * Includes error boundaries at strategic points for better error handling.
 *
 * Provider hierarchy:
 * 1. QueryClientProvider - React Query
 * 2. I18nProvider - Internationalization
 * 3. ThemeProvider - Dark/Light mode
 * 4. CustomTracksProvider - Local state for custom tracks
 * 5. Router - React Router for navigation
 * 6. ErrorBoundary - Global error handling
 * 7. MainLayout - Layout wrapper
 * 8. Routes - Route definitions with individual ErrorBoundaries
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <CustomTracksProvider>
            <Router>
              <ErrorBoundary>
                <MainLayout>
                  <Routes>
                    {/* Home / Artist List */}
                    <Route
                      path="/"
                      element={
                        <ErrorBoundary fallback={<div className="p-4">Erro ao carregar artistas</div>}>
                          <ArtistListPage />
                        </ErrorBoundary>
                      }
                    />

                    {/* Artist Details */}
                    <Route
                      path="/artist/:id"
                      element={
                        <ErrorBoundary fallback={<div className="p-4">Erro ao carregar detalhes do artista</div>}>
                          <ArtistDetailsPage />
                        </ErrorBoundary>
                      }
                    />

                    {/* Album Details */}
                    <Route
                      path="/album/:id"
                      element={
                        <ErrorBoundary fallback={<div className="p-4">Erro ao carregar detalhes do álbum</div>}>
                          <AlbumDetailsPage />
                        </ErrorBoundary>
                      }
                    />

                    {/* Favorites */}
                    <Route
                      path="/favorites"
                      element={
                        <ErrorBoundary fallback={<div className="p-4">Erro ao carregar favoritos</div>}>
                          <FavoritesPage />
                        </ErrorBoundary>
                      }
                    />

                    {/* Track Registration */}
                    <Route
                      path="/register-track"
                      element={
                        <ErrorBoundary fallback={<div className="p-4">Erro ao carregar formulário de cadastro</div>}>
                          <TrackRegistrationPage />
                        </ErrorBoundary>
                      }
                    />

                    {/* Dashboard */}
                    <Route
                      path="/dashboard"
                      element={
                        <ErrorBoundary fallback={<div className="p-4">Erro ao carregar dashboard</div>}>
                          <DashboardPage />
                        </ErrorBoundary>
                      }
                    />
                  </Routes>
                </MainLayout>
              </ErrorBoundary>
            </Router>
          </CustomTracksProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
