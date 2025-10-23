export * from './spotify';

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

export interface UserRating {
  id: string;
  itemId: string;
  itemType: 'track' | 'artist' | 'album' | 'custom-track';
  itemName: string;
  itemArtist?: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query: string;
  type: 'artist' | 'album' | 'track';
  limit: number;
  offset: number;
}
