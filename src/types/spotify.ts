/**
 * Represents an image from Spotify API.
 *
 * Images are typically used for album covers, artist photos, etc.
 * Multiple image sizes may be available.
 *
 * @typedef {Object} SpotifyImage
 * @property {string} url - Direct URL to the image
 * @property {number} height - Image height in pixels
 * @property {number} width - Image width in pixels
 */
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

/**
 * Represents a Spotify artist with complete metadata.
 *
 * Contains essential artist information including name, genres,
 * popularity metrics, and links to Spotify.
 *
 * @typedef {Object} SpotifyArtist
 * @property {string} id - Unique Spotify artist ID
 * @property {string} name - Artist name
 * @property {SpotifyImage[]} images - Artist images/photos
 * @property {string[]} genres - Associated genres
 * @property {number} popularity - Popularity score (0-100)
 * @property {Object} followers - Follower information
 * @property {number} followers.total - Total number of followers
 * @property {Object} external_urls - Links to Spotify
 * @property {string} external_urls.spotify - Spotify profile URL
 */
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

/**
 * Represents a Spotify album with complete metadata.
 *
 * Contains album information including release date, track count,
 * album type, and artist information.
 *
 * @typedef {Object} SpotifyAlbum
 * @property {string} id - Unique Spotify album ID
 * @property {string} name - Album name
 * @property {SpotifyImage[]} images - Album cover images
 * @property {string} release_date - Release date in YYYY-MM-DD format
 * @property {number} total_tracks - Total number of tracks in album
 * @property {'album' | 'single' | 'compilation'} album_type - Type of album
 * @property {Pick<SpotifyArtist, 'id' | 'name'>[]} artists - Album artists
 * @property {Object} external_urls - Links to Spotify
 * @property {string} external_urls.spotify - Spotify album URL
 */
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

/**
 * Represents a Spotify track with complete metadata.
 *
 * Contains track information including duration, explicit flag,
 * popularity, preview URL, and relationships to artists and albums.
 *
 * @typedef {Object} SpotifyTrack
 * @property {string} id - Unique Spotify track ID
 * @property {string} name - Track name/title
 * @property {number} duration_ms - Track duration in milliseconds
 * @property {number} track_number - Position in album
 * @property {number} disc_number - Disc number in album
 * @property {boolean} explicit - Explicit content flag
 * @property {number} popularity - Popularity score (0-100)
 * @property {string | null} preview_url - 30-second preview URL or null
 * @property {Pick<SpotifyArtist, 'id' | 'name'>[]} artists - Track artists
 * @property {Pick<SpotifyAlbum, 'id' | 'name' | 'images'>} album - Album information
 * @property {Object} external_urls - Links to Spotify
 * @property {string} external_urls.spotify - Spotify track URL
 */
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

/**
 * Generic search response wrapper from Spotify API.
 *
 * Used for paginated results from Spotify search operations.
 *
 * @template T - Type of items returned
 * @typedef {Object} SpotifySearchResponse
 * @property {T[]} items - Array of search results
 * @property {number} total - Total number of available results
 * @property {number} limit - Number of results per request
 * @property {number} offset - Current offset in results
 * @property {string | null} next - URL to next page or null
 * @property {string | null} previous - URL to previous page or null
 */
export interface SpotifySearchResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

/**
 * Complete search result from Spotify API.
 *
 * Combines search results for artists, albums, and tracks.
 *
 * @typedef {Object} SpotifySearchResult
 * @property {SpotifySearchResponse<SpotifyArtist>} artists - Artist search results
 * @property {SpotifySearchResponse<SpotifyAlbum>} albums - Album search results
 * @property {SpotifySearchResponse<SpotifyTrack>} tracks - Track search results
 */
export interface SpotifySearchResult {
  artists: SpotifySearchResponse<SpotifyArtist>;
  albums: SpotifySearchResponse<SpotifyAlbum>;
  tracks: SpotifySearchResponse<SpotifyTrack>;
}

/**
 * Top tracks response for an artist.
 *
 * @typedef {Object} SpotifyArtistTopTracks
 * @property {SpotifyTrack[]} tracks - Array of top tracks for the artist
 */
export interface SpotifyArtistTopTracks {
  tracks: SpotifyTrack[];
}

/**
 * Albums response for an artist.
 *
 * Contains paginated albums from an artist.
 *
 * @typedef {Object} SpotifyArtistAlbums
 * @property {SpotifyAlbum[]} items - Array of albums
 * @property {number} total - Total number of albums
 * @property {number} limit - Number of results per request
 * @property {number} offset - Current offset in results
 * @property {string | null} next - URL to next page or null
 * @property {string | null} previous - URL to previous page or null
 */
export interface SpotifyArtistAlbums {
  items: SpotifyAlbum[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

/**
 * Spotify API error response.
 *
 * @typedef {Object} SpotifyError
 * @property {Object} error - Error details
 * @property {number} error.status - HTTP status code
 * @property {string} error.message - Error message description
 */
export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

/**
 * New releases response from Spotify browse API.
 *
 * @typedef {Object} SpotifyNewReleases
 * @property {SpotifyAlbum[]} items - Array of new release albums
 * @property {number} total - Total number of new releases
 * @property {number} limit - Number of results per request
 * @property {number} offset - Current offset in results
 * @property {string | null} next - URL to next page or null
 * @property {string | null} previous - URL to previous page or null
 */
export interface SpotifyNewReleases {
  items: SpotifyAlbum[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

/**
 * User-favorited item from Spotify.
 *
 * Represents a track, album, or artist that a user has marked as favorite.
 * Stores user-specific metadata alongside Spotify data.
 *
 * @typedef {Object} UserFavorite
 * @property {string} id - Unique favorite record ID
 * @property {string} name - Item name (track, album, or artist)
 * @property {string} artist - Primary artist name
 * @property {string} album - Album name
 * @property {number} duration - Duration in milliseconds
 * @property {'track' | 'album' | 'artist'} type - Type of favorite item
 * @property {string} addedAt - ISO timestamp when favorited
 * @property {string} [imageUrl] - Optional image URL
 * @property {string} [genre] - Optional genre classification
 * @property {number} [popularity] - Optional Spotify popularity score
 * @property {string} [releaseDate] - Optional release date
 * @property {number} [trackCount] - Optional track count (for albums)
 * @property {string} [spotifyUrl] - Optional Spotify profile URL
 */
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
