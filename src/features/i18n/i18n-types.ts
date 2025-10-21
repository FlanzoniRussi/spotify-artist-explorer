export type SupportedLanguage = 'pt' | 'en';

export interface I18nState {
  language: SupportedLanguage;
  isLoading: boolean;
}

export type I18nAction =
  | { type: 'SET_LANGUAGE'; payload: SupportedLanguage }
  | { type: 'SET_LOADING'; payload: boolean };

export interface I18nContextType {
  language: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}
