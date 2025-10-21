import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './features/theme/theme-context';
import { I18nProvider } from './features/i18n';
import { CustomTracksProvider } from './contexts/custom-tracks-context';
import { MainLayout } from './components/layout/main-layout';
import { ArtistListPage } from './pages/artists/artist-list-page';
import { ArtistDetailsPage } from './pages/artists/artist-details-page';
import { FavoritesPage } from './pages/favorites/favorites-page';
import { TrackRegistrationPage } from './pages/tracks/track-registration-page';

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
          <CustomTracksProvider>
            <Router>
              <MainLayout>
                <Routes>
                  <Route path='/' element={<ArtistListPage />} />
                  <Route path='/artist/:id' element={<ArtistDetailsPage />} />
                  <Route path='/favorites' element={<FavoritesPage />} />
                  <Route path='/register-track' element={<TrackRegistrationPage />} />
                </Routes>
              </MainLayout>
            </Router>
          </CustomTracksProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
