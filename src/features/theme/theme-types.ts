export type Theme = 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
  systemTheme: Theme;
}

export type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SYSTEM_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' };

export interface ThemeContextType {
  theme: Theme;
  systemTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}
