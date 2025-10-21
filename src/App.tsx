import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './features/theme/theme-context';
import { I18nProvider } from './features/i18n';
import { useTranslation } from './hooks/useTranslation';
import { MainLayout } from './components/layout/main-layout';
import { ArtistListPage } from './pages/artists/artist-list-page';
import { ArtistDetailsPage } from './pages/artists/artist-details-page';

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

const FavoritesPage = () => {
  const { t } = useTranslation();

  return (
    <div className='text-center py-12'>
      <h1 className='text-3xl font-bold mb-4'>{t('navigation.favorites')}</h1>
      <p className='text-gray-600 dark:text-gray-400'>
        {t('empty.noFavorites')}
      </p>
    </div>
  );
};

const RegisterTrackPage = () => {
  const { t } = useTranslation();

  return (
    <div className='text-center py-12'>
      <h1 className='text-3xl font-bold mb-4'>
        {t('forms:trackRegistration.title')}
      </h1>
      <p className='text-gray-600 dark:text-gray-400'>
        {t('forms:trackRegistration.subtitle')}
      </p>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <Router>
                        <MainLayout>
                          <Routes>
                            <Route path='/' element={<ArtistListPage />} />
                            <Route path='/artist/:id' element={<ArtistDetailsPage />} />
                            <Route path='/favorites' element={<FavoritesPage />} />
                            <Route path='/register-track' element={<RegisterTrackPage />} />
                          </Routes>
                        </MainLayout>
          </Router>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
