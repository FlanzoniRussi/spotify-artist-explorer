import React from 'react';
import { Header } from './header';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-dark-600 transition-colors duration-300'>
      <Header />

      <main
        className={`
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8
        ${className}
      `}
      >
        {children}
      </main>

      <footer className='mt-auto bg-white dark:bg-dark-600 border-t border-gray-200 dark:border-dark-300'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='flex items-center space-x-2 text-gray-500 dark:text-gray-400'>
              <span>© 2025 Spotify Artists App</span>
              <span>•</span>
              <span>Built with React + TypeScript</span>
            </div>

            <div className='mt-4 md:mt-0 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400'>
              <span>Staff Engineer Challenge</span>
              <span>•</span>
              <span>Kanastra</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
