export * from './spotify';

/**
 * Represents a user-created custom track.
 *
 * Allows users to manually register and track their own music
 * with full metadata including duration, genre, and release status.
 *
 * @typedef {Object} CustomTrack
 * @property {string} id - Unique identifier for the custom track
 * @property {string} name - Track name/title
 * @property {string} artist - Artist or band name
 * @property {string} [album] - Optional album name
 * @property {number} year - Release year (e.g., 2024)
 * @property {string} genre - Music genre classification
 * @property {Object} duration - Track duration
 * @property {number} duration.minutes - Minutes component of duration
 * @property {number} duration.seconds - Seconds component of duration
 * @property {boolean} isReleased - Whether the track has been released
 * @property {string} createdAt - ISO timestamp when created
 */
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

/**
 * Represents a user's rating for a Spotify or custom track.
 *
 * Stores ratings (1-5 stars) for different types of items
 * (tracks, artists, albums, custom tracks) with audit timestamps.
 *
 * @typedef {Object} UserRating
 * @property {string} id - Unique rating identifier
 * @property {string} itemId - ID of the rated item
 * @property {'track' | 'artist' | 'album' | 'custom-track'} itemType - Type of item being rated
 * @property {string} itemName - Display name of the item
 * @property {string} [itemArtist] - Optional artist name for context
 * @property {number} rating - Rating value from 1 to 5
 * @property {string} createdAt - ISO timestamp when rating was created
 * @property {string} updatedAt - ISO timestamp when rating was last updated
 */
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

/**
 * Search filter parameters for Spotify API queries.
 *
 * Defines the criteria and pagination for searching artists, albums, and tracks.
 *
 * @typedef {Object} SearchFilters
 * @property {string} query - Search query string
 * @property {'artist' | 'album' | 'track'} type - Type of item to search for
 * @property {number} limit - Maximum number of results per request (typically 1-50)
 * @property {number} offset - Pagination offset for results
 */
export interface SearchFilters {
  query: string;
  type: 'artist' | 'album' | 'track';
  limit: number;
  offset: number;
}
