import React from 'react';
import { Music, Search, Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../features/theme/theme-toggle';
import { LanguageSwitcher } from '../../features/i18n/language-switcher';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.header
      className={`
      sticky top-0 z-50
      bg-white/80 dark:bg-dark-600/80
      backdrop-blur-md border-b border-gray-200 dark:border-dark-300
      ${className}
    `}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to='/'
              className='flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors'
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Music size={28} />
              </motion.div>
              <span className='text-xl font-bold text-gradient'>
                {t('app.title')}
              </span>
            </Link>
          </motion.div>
          
          <motion.nav 
            className='hidden md:flex items-center space-x-8'
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to='/'
                className='text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium'
              >
                {t('navigation.artists')}
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to='/favorites'
                className='flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium'
              >
                <Heart size={16} />
                <span>{t('navigation.favorites')}</span>
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to='/register-track'
                className='flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium'
              >
                <Plus size={16} />
                <span>{t('navigation.register')}</span>
              </Link>
            </motion.div>
          </motion.nav>

          <motion.div 
            className='flex items-center space-x-4'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.button 
              className='md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search size={20} />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LanguageSwitcher />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle size='sm' />
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className='md:hidden border-t border-gray-200 dark:border-dark-300'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <motion.div 
            className='flex items-center justify-around py-3'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to='/'
                className='flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors'
              >
                <Music size={20} />
                <span className='text-xs font-medium'>
                  {t('navigation.artists')}
                </span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to='/favorites'
                className='flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors'
              >
                <Heart size={20} />
                <span className='text-xs font-medium'>
                  {t('navigation.favorites')}
                </span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to='/register-track'
                className='flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors'
              >
                <Plus size={20} />
                <span className='text-xs font-medium'>
                  {t('navigation.register')}
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};
