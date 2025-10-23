import React from 'react';
import { Header } from './header';
import { useTranslation } from '../../hooks/useTranslation';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col min-h-screen bg-gray-50 dark:bg-dark-600 transition-colors duration-300'>
      <Header />

      <main
        className={`
        flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8
        ${className}
      `}
      >
        {children}
      </main>

      <footer className='bg-white dark:bg-dark-600 border-t border-gray-200 dark:border-dark-300 mt-auto'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0'>
            <div className='flex items-center space-x-2 text-xs md:text-sm text-gray-500 dark:text-gray-400'>
              <span>{t('footer.copyright')}</span>
              <span className='hidden md:inline'>•</span>
              <span className='hidden md:inline'>{t('footer.builtWith')}</span>
            </div>

            <div className='flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-500 dark:text-gray-400'>
              <span>{t('footer.challenge')}</span>
              <span className='hidden md:inline'>•</span>
              <span className='hidden md:inline'>{t('footer.company')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
