import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import type { SupportedLanguage } from './i18n-types';

const languages = [
  { code: 'pt' as SupportedLanguage, name: 'Português', flag: '🇧🇷' },
  { code: 'en' as SupportedLanguage, name: 'English', flag: '🇺🇸' },
];

export function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    if (newLanguage !== language) {
      changeLanguage(newLanguage);
    }
  };

  return (
    <div className='relative group'>
      <button
        className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-dark-600/50 dark:hover:bg-dark-500/70 transition-colors duration-200'
        aria-label='Change language'
      >
        <Globe className='w-4 h-4 text-primary-500' />
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          {languages.find(lang => lang.code === language)?.flag}
        </span>
      </button>

      <div className='absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
        <div className='py-2'>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-150 ${
                language === lang.code
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className='text-lg'>{lang.flag}</span>
              <span className='text-sm font-medium'>{lang.name}</span>
              {language === lang.code && (
                <div className='ml-auto w-2 h-2 bg-primary-500 rounded-full' />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
