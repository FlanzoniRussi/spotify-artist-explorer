import React from 'react';
import { Music, Heart, Plus, BarChart3, Search, Disc3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../features/theme/theme-toggle';
import { LanguageSwitcher } from '../../features/i18n/language-switcher';
import { useTranslation } from '../../hooks/useTranslation';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const navLinks: NavLink[] = [
    { to: '/', label: t('navigation.home') || 'Lançamentos', icon: <Disc3 size={16} /> },
    { to: '/search-artists', label: t('navigation.artists') || 'Artistas', icon: <Search size={16} /> },
    { to: '/favorites', label: t('navigation.favorites') || 'Favoritos', icon: <Heart size={16} /> },
    { to: '/register-track', label: t('navigation.register') || 'Cadastrar', icon: <Plus size={16} /> },
    { to: '/dashboard', label: t('navigation.dashboard') || 'Dashboard', icon: <BarChart3 size={16} /> },
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
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
        delay: 0.2
      }
    }
  };

  const linkVariants = {
    hover: {
      y: -2,
      transition: {
        duration: 0.2
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
            {navLinks.map((link) => (
              <motion.div 
                key={link.to} 
                variants={linkVariants} 
                whileHover="hover"
              >
                <Link
                  to={link.to}
                  className='flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium relative'
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {isActive(link.to) && (
                    <motion.div
                      className='absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500'
                      layoutId='navUnderline'
                      transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          <motion.div 
            className='flex items-center space-x-4'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
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
            {navLinks.map((link) => (
              <motion.div 
                key={link.to}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.to}
                  className={`flex flex-col items-center space-y-1 transition-colors ${isActive(link.to) ? 'text-primary-500 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:text-primary-500'}`}
                >
                  {link.icon}
                  <span className='text-xs font-medium'>
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};
