import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './features/theme/theme-context';
import { I18nProvider } from './features/i18n';
import { useTranslation } from './hooks/useTranslation';
import { MainLayout } from './components/layout/main-layout';

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
const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className='text-center py-12'>
      <h1 className='text-4xl font-bold text-gradient mb-4'>
        {t('app.title')}
      </h1>
      <p className='text-gray-600 dark:text-gray-400 text-lg mb-8'>
        {t('app.subtitle')}
      </p>
      <div className='bg-white dark:bg-dark-500 rounded-xl p-8 shadow-lg max-w-md mx-auto'>
        <h2 className='text-2xl font-semibold mb-4'>Features Coming Soon</h2>
        <ul className='space-y-2 text-left'>
          <li className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
            <span>Artist search and discovery</span>
          </li>
          <li className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
            <span>Top tracks and albums</span>
          </li>
          <li className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
            <span>Interactive charts</span>
          </li>
          <li className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
            <span>Favorites management</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

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
                <Route path='/' element={<HomePage />} />
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
