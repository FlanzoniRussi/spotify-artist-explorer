export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  album_type: 'album' | 'single' | 'compilation';
  artists: Pick<SpotifyArtist, 'id' | 'name'>[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  track_number: number;
  disc_number: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  artists: Pick<SpotifyArtist, 'id' | 'name'>[];
  album: Pick<SpotifyAlbum, 'id' | 'name' | 'images'>;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SpotifySearchResult {
  artists: SpotifySearchResponse<SpotifyArtist>;
  albums: SpotifySearchResponse<SpotifyAlbum>;
  tracks: SpotifySearchResponse<SpotifyTrack>;
}

export interface SpotifyArtistTopTracks {
  tracks: SpotifyTrack[];
}

export interface SpotifyArtistAlbums {
  items: SpotifyAlbum[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export interface UserFavorite {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  type: 'track' | 'album' | 'artist';
  addedAt: string;
  imageUrl?: string;
  genre?: string;
  popularity?: number;
  releaseDate?: string;
  trackCount?: number;
  spotifyUrl?: string;
}
