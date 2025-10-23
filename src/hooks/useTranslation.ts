import { useI18n } from '../features/i18n/i18n-context';

/**
 * Hook for accessing internationalization (i18n) functionality.
 *
 * Provides translation function and language management capabilities.
 * Must be used within an I18nProvider context.
 *
 * @returns {Object} Translation interface
 * @returns {Function} t - Translation function to get localized strings
 * @returns {string} language - Current active language code (e.g., 'pt', 'en')
 * @returns {Function} changeLanguage - Function to switch to a different language
 *
 * @example
 * ```typescript
 * function App() {
 *   const { t, language, changeLanguage } = useTranslation();
 *
 *   return (
 *     <>
 *       <h1>{t('common.title')}</h1>
 *       <p>Current language: {language}</p>
 *       <button onClick={() => changeLanguage('en')}>
 *         {t('common.languageSwitch')}
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export function useTranslation() {
  const { t, language, changeLanguage } = useI18n();

  return {
    t,
    language,
    changeLanguage,
  };
}
