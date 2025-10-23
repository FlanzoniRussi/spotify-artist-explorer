/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import type {
  I18nState,
  I18nAction,
  I18nContextType,
  SupportedLanguage,
} from './i18n-types';

import ptCommon from '../../locales/pt/common.json';
import ptArtists from '../../locales/pt/artists.json';
import ptForms from '../../locales/pt/forms.json';
import ptDashboard from '../../locales/pt/dashboard.json';
import ptTracks from '../../locales/pt/tracks.json';
import ptFavorites from '../../locales/pt/favorites.json';
import ptHome from '../../locales/pt/home.json';
import enCommon from '../../locales/en/common.json';
import enArtists from '../../locales/en/artists.json';
import enForms from '../../locales/en/forms.json';
import enDashboard from '../../locales/en/dashboard.json';
import enTracks from '../../locales/en/tracks.json';
import enFavorites from '../../locales/en/favorites.json';
import enHome from '../../locales/en/home.json';

const initialState: I18nState = {
  language: (localStorage.getItem('i18nextLng') as SupportedLanguage) || 'pt',
  isLoading: true,
};

function i18nReducer(state: I18nState, action: I18nAction): I18nState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const resources = {
  pt: {
    common: ptCommon,
    artists: ptArtists,
    forms: ptForms,
    dashboard: ptDashboard,
    tracks: ptTracks,
    favorites: ptFavorites,
    home: ptHome,
  },
  en: {
    common: enCommon,
    artists: enArtists,
    forms: enForms,
    dashboard: enDashboard,
    tracks: enTracks,
    favorites: enFavorites,
    home: enHome,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    defaultNS: 'common',
    ns: ['common', 'artists', 'forms', 'dashboard', 'tracks', 'favorites', 'home'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [state, dispatch] = useReducer(i18nReducer, initialState);

  useEffect(() => {
    const initI18n = async () => {
      try {
        if (!localStorage.getItem('i18nextLng')) {
          localStorage.setItem('i18nextLng', 'pt');
        }

        await i18n.init();
        const detectedLanguage = i18n.language as SupportedLanguage;
        dispatch({ type: 'SET_LANGUAGE', payload: detectedLanguage });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initI18n();
  }, []);

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await i18n.changeLanguage(language);
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      localStorage.setItem('i18nextLng', language);
    } catch {
      // Silent fail
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const t = (key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  };

  const value: I18nContextType = {
    language: state.language,
    changeLanguage,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
