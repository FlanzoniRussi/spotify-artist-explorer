import { useI18n } from '../features/i18n/i18n-context';

export function useTranslation() {
  const { t, language, changeLanguage } = useI18n();

  return {
    t,
    language,
    changeLanguage,
  };
}
