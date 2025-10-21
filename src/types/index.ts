export * from './spotify';
import type { UserFavorite } from './spotify';

export interface CustomTrack {
  id: string;
  name: string;
  artist: string;
  album?: string;
  year: number;
  genre: string;
  duration: {
    minutes: number;
    seconds: number;
  };
  isReleased: boolean;
  createdAt: string;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  favorites: UserFavorite[];
  customTracks: CustomTrack[];
}

export interface SearchFilters {
  query: string;
  type: 'artist' | 'album' | 'track';
  limit: number;
  offset: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
