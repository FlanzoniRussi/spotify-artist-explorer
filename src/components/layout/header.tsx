import React from 'react';
import { Music, Search, Heart, Plus } from 'lucide-react';
import { ThemeToggle } from '../../features/theme/theme-toggle';
import { LanguageSwitcher } from '../../features/i18n/language-switcher';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  return (
    <header
      className={`
      sticky top-0 z-50
      bg-white/80 dark:bg-dark-600/80
      backdrop-blur-md border-b border-gray-200 dark:border-dark-300
      ${className}
    `}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <Link
            to='/'
            className='flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors'
          >
            <Music size={28} />
            <span className='text-xl font-bold text-gradient'>
              {t('app.title')}
            </span>
          </Link>
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              to='/'
              className='text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium'
            >
              {t('navigation.artists')}
            </Link>
            <Link
              to='/favorites'
              className='flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium'
            >
              <Heart size={16} />
              <span>{t('navigation.favorites')}</span>
            </Link>
            <Link
              to='/register-track'
              className='flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium'
            >
              <Plus size={16} />
              <span>{t('navigation.register')}</span>
            </Link>
          </nav>

          <div className='flex items-center space-x-4'>
            <button className='md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'>
              <Search size={20} />
            </button>
            <LanguageSwitcher />
            <ThemeToggle size='sm' />
          </div>
        </div>

        <div className='md:hidden border-t border-gray-200 dark:border-dark-300'>
          <div className='flex items-center justify-around py-3'>
            <Link
              to='/'
              className='flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors'
            >
              <Music size={20} />
              <span className='text-xs font-medium'>
                {t('navigation.artists')}
              </span>
            </Link>
            <Link
              to='/favorites'
              className='flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors'
            >
              <Heart size={20} />
              <span className='text-xs font-medium'>
                {t('navigation.favorites')}
              </span>
            </Link>
            <Link
              to='/register-track'
              className='flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors'
            >
              <Plus size={20} />
              <span className='text-xs font-medium'>
                {t('navigation.register')}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
