import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-context';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative overflow-hidden rounded-lg
        bg-gray-100 dark:bg-dark-400
        hover:bg-gray-200 dark:hover:bg-dark-300
        border border-gray-200 dark:border-dark-300
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        group
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className='relative w-full h-full flex items-center justify-center'>
        <Sun
          size={iconSizes[size]}
          className={`
            absolute transition-all duration-300 ease-in-out
            ${
              isDark
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100'
            }
            text-primary-500 group-hover:text-primary-600
          `}
        />
        <Moon
          size={iconSizes[size]}
          className={`
            absolute transition-all duration-300 ease-in-out
            ${
              isDark
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0'
            }
            text-gray-300 group-hover:text-gray-200
          `}
        />
      </div>

      {showLabel && <span className='sr-only'>Current theme: {theme}</span>}
    </button>
  );
};

export const ThemeToggleCompact: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-md
        bg-gray-100 dark:bg-dark-400
        hover:bg-gray-200 dark:hover:bg-dark-300
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun size={18} className='text-primary-500' />
      ) : (
        <Moon size={18} className='text-gray-300' />
      )}
    </button>
  );
};
