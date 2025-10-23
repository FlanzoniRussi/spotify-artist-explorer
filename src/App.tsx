import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './features/theme/theme-context';
import { I18nProvider } from './features/i18n';
import { CustomTracksProvider } from './contexts/custom-tracks-context';
import { RatingsProvider } from './contexts/ratings-context';
import { ErrorBoundary } from './components/error-boundary';
import { MainLayout } from './components/layout/main-layout';
import { NewReleasesPage } from './pages/home/new-releases-page';
import { ArtistListPage } from './pages/artists/artist-list-page';
import { ArtistDetailsPage } from './pages/artists/artist-details-page';
import { AlbumDetailsPage } from './pages/albums/album-details-page';
import { FavoritesPage } from './pages/favorites/favorites-page';
import { TrackRegistrationPage } from './pages/tracks/track-registration-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <RatingsProvider>
            <CustomTracksProvider>
              <Router>
                <ErrorBoundary>
                  <MainLayout>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <ErrorBoundary fallback={<div className="p-4">Erro ao carregar lançamentos</div>}>
                            <NewReleasesPage />
                          </ErrorBoundary>
                        }
                      />

                      <Route
                        path="/search-artists"
                        element={
                          <ErrorBoundary fallback={<div className="p-4">Erro ao carregar artistas</div>}>
                            <ArtistListPage />
                          </ErrorBoundary>
                        }
                      />

                      <Route
                        path="/artist/:id"
                        element={
                          <ErrorBoundary fallback={<div className="p-4">Erro ao carregar detalhes do artista</div>}>
                            <ArtistDetailsPage />
                          </ErrorBoundary>
                        }
                      />

                      <Route
                        path="/album/:id"
                        element={
                          <ErrorBoundary fallback={<div className="p-4">Erro ao carregar detalhes do álbum</div>}>
                            <AlbumDetailsPage />
                          </ErrorBoundary>
                        }
                      />

                      <Route
                        path="/favorites"
                        element={
                          <ErrorBoundary fallback={<div className="p-4">Erro ao carregar favoritos</div>}>
                            <FavoritesPage />
                          </ErrorBoundary>
                        }
                      />

                      <Route
                        path="/register-track"
                        element={
                          <ErrorBoundary fallback={<div className="p-4">Erro ao carregar formulário de cadastro</div>}>
                            <TrackRegistrationPage />
                          </ErrorBoundary>
                        }
                      />

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
          </RatingsProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
