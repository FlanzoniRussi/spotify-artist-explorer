import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyTrack,
  SpotifySearchResult,
  SpotifyArtistTopTracks,
  SpotifyArtistAlbums,
  SpotifyNewReleases,
  SpotifyError,
  SearchFilters,
} from '../types';
import { logger } from '../lib/logger';
import { errorReporter } from '../lib/error-reporter';
import { requestLogger } from '../lib/request-logger';
import { spotifyAuth } from './spotifyAuth';

class SpotifyService {
  private api: AxiosInstance;
  private readonly baseURL = 'https://api.spotify.com/v1';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    // Add authorization token to all requests
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await spotifyAuth.getToken();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          errorReporter.reportError(error, {
            component: 'SpotifyService',
            action: 'token-injection-failed',
          });
        }
        logger.debug(`Spotify API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        errorReporter.reportError(error, {
          component: 'SpotifyService',
          action: 'request-interceptor',
        });
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        const duration = 0; // Approximate, would need timing middleware for accuracy
        requestLogger.logRequest(
          response.config.method?.toUpperCase() || 'GET',
          response.config.url || '',
          duration,
          response.status
        );
        return response;
      },
      (error) => {
        if (error.response) {
          requestLogger.logRequest(
            error.config?.method?.toUpperCase() || 'GET',
            error.config?.url || '',
            0,
            error.response.status,
            error
          );
          errorReporter.reportApiError(error, error.config?.url || '', error.response.status, {
            component: 'SpotifyService',
            action: 'api-response-error',
          });
        } else {
          errorReporter.reportError(error, {
            component: 'SpotifyService',
            action: 'api-request-failed',
          });
        }
        return Promise.reject(error);
      }
    );
  }

  async searchArtists(
    query: string,
    limit = 20,
    offset = 0
  ): Promise<{ artists: SpotifyArtist[]; total: number; hasNext: boolean; hasPrevious: boolean }> {
    try {
      const response: AxiosResponse<{ 
        artists: { 
          items: SpotifyArtist[];
          total: number;
          limit: number;
          offset: number;
          next: string | null;
          previous: string | null;
        } 
      }> = await this.api.get('/search', {
        params: {
          q: query,
          type: 'artist',
          limit,
          offset,
        },
      });
      const artists = response.data.artists.items;

      logger.info('Artist search completed', {
        query,
        found: artists.length,
        apiTotal: response.data.artists.total,
        offset,
        limit,
      });

      return {
        artists: artists,
        total: response.data.artists.total,
        hasNext: !!response.data.artists.next,
        hasPrevious: !!response.data.artists.previous,
      };
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'searchArtists',
        query,
      });
      throw this.handleError(error);
    }
  }

  async searchAlbums(
    query: string,
    limit = 20,
    offset = 0
  ): Promise<{ albums: SpotifyAlbum[]; total: number; hasNext: boolean; hasPrevious: boolean }> {
    try {
      const response: AxiosResponse<{ albums: { items: SpotifyAlbum[]; total: number; limit: number; offset: number; next: string | null; previous: string | null } }> =
        await this.api.get('/search', {
          params: {
            q: query,
            type: 'album',
            limit,
            offset,
          },
        });

      logger.info('Album search completed', {
        query,
        found: response.data.albums.items.length,
        total: response.data.albums.total,
        offset,
        limit,
      });

      return {
        albums: response.data.albums.items,
        total: response.data.albums.total,
        hasNext: !!response.data.albums.next,
        hasPrevious: !!response.data.albums.previous,
      };
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'searchAlbums',
        query,
      });
      throw this.handleError(error);
    }
  }

  async searchTracks(
    query: string,
    limit = 20,
    offset = 0
  ): Promise<SpotifyTrack[]> {
    try {
      const response: AxiosResponse<{ tracks: { items: SpotifyTrack[] } }> =
        await this.api.get('/search', {
          params: {
            q: query,
            type: 'track',
            limit,
            offset,
          },
        });

      logger.info('Track search completed', {
        query,
        found: response.data.tracks.items.length,
      });

      return response.data.tracks.items;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'searchTracks',
        query,
      });
      throw this.handleError(error);
    }
  }

  async searchAll(filters: SearchFilters): Promise<SpotifySearchResult> {
    try {
      const [artistsResponse, albumsResponse, tracksResponse] =
        await Promise.all([
          this.api.get('/search', {
            params: {
              q: filters.query,
              type: 'artist',
              limit: filters.limit,
              offset: filters.offset,
            },
          }),
          this.api.get('/search', {
            params: {
              q: filters.query,
              type: 'album',
              limit: filters.limit,
              offset: filters.offset,
            },
          }),
          this.api.get('/search', {
            params: {
              q: filters.query,
              type: 'track',
              limit: filters.limit,
              offset: filters.offset,
            },
          }),
        ]);

      logger.info('All search completed', {
        query: filters.query,
        found: {
          artists: artistsResponse.data.artists.total,
          albums: albumsResponse.data.albums.total,
          tracks: tracksResponse.data.tracks.total,
        },
      });

      return {
        artists: artistsResponse.data.artists,
        albums: albumsResponse.data.albums,
        tracks: tracksResponse.data.tracks,
      };
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'searchAll',
        query: filters.query,
      });
      throw this.handleError(error);
    }
  }

  async getArtist(id: string): Promise<SpotifyArtist> {
    try {
      const response: AxiosResponse<SpotifyArtist> = await this.api.get(
        `/artists/${id}`
      );
      logger.info('Artist retrieved', { id });
      return response.data;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getArtist',
        id,
      });
      throw this.handleError(error);
    }
  }

  async getArtistTopTracks(id: string, market = 'BR'): Promise<SpotifyTrack[]> {
    try {
      const response: AxiosResponse<SpotifyArtistTopTracks> =
        await this.api.get(`/artists/${id}/top-tracks`, {
          params: { market },
        });
      logger.info('Artist top tracks retrieved', { id, market });
      return response.data.tracks;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getArtistTopTracks',
        id,
        market,
      });
      throw this.handleError(error);
    }
  }

  async getArtistAlbums(
    id: string,
    limit = 20,
    offset = 0
  ): Promise<SpotifyArtistAlbums> {
    try {
      const response: AxiosResponse<SpotifyArtistAlbums> = await this.api.get(
        `/artists/${id}/albums`,
        {
          params: {
            limit,
            offset,
            include_groups: 'album,single',
          },
        }
      );
      logger.info('Artist albums retrieved', { id, limit, offset });
      return response.data;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getArtistAlbums',
        id,
        limit,
        offset,
      });
      throw this.handleError(error);
    }
  }

  async getAlbum(id: string): Promise<SpotifyAlbum> {
    try {
      const response: AxiosResponse<SpotifyAlbum> = await this.api.get(
        `/albums/${id}`
      );
      logger.info('Album retrieved', { id });
      return response.data;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getAlbum',
        id,
      });
      throw this.handleError(error);
    }
  }

  async getAlbumTracks(id: string, albumName?: string): Promise<{ items: SpotifyTrack[] }> {
    try {
      const response: AxiosResponse<{ items: SpotifyTrack[] }> = await this.api.get(
        `/albums/${id}/tracks`
      );
      
      // Album tracks endpoint doesn't include popularity, so we need to fetch it separately
      const trackIds = response.data.items.map(track => track.id);
      if (trackIds.length > 0) {
        const tracksWithPopularity = await this.getTracks(trackIds);
        
        // Create a map of track IDs to full track data
        const tracksMap = new Map(tracksWithPopularity.map(t => [t.id, t]));
        
        // Merge popularity and album data into original tracks while preserving all original data
        response.data.items = response.data.items.map(track => {
          const enrichedTrack = tracksMap.get(track.id);
          return {
            ...track,
            popularity: enrichedTrack?.popularity ?? 0,
            // Ensure album information is complete
            album: enrichedTrack?.album || track.album || (albumName ? { name: albumName, images: [], id: id } : track.album),
          };
        });
      }
      
      logger.info('Album tracks retrieved with popularity', { id });
      return response.data;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getAlbumTracks',
        id,
      });
      throw this.handleError(error);
    }
  }

  async getTrack(id: string): Promise<SpotifyTrack> {
    try {
      const response: AxiosResponse<SpotifyTrack> = await this.api.get(
        `/tracks/${id}`
      );
      logger.info('Track retrieved', { id });
      return response.data;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getTrack',
        id,
      });
      throw this.handleError(error);
    }
  }

  /**
   * Fetch multiple tracks with their popularity data.
   * Spotify's album tracks endpoint doesn't include popularity,
   * so we need to fetch them separately using this endpoint.
   * 
   * @param {string[]} ids - Array of track IDs (max 50 per request)
   * @returns {Promise<SpotifyTrack[]>} Array of tracks with full metadata including popularity
   */
  async getTracks(ids: string[]): Promise<SpotifyTrack[]> {
    if (ids.length === 0) return [];
    
    try {
      // Spotify allows max 50 IDs per request
      const chunks = [];
      for (let i = 0; i < ids.length; i += 50) {
        chunks.push(ids.slice(i, i + 50));
      }

      const allTracks: SpotifyTrack[] = [];
      
      for (const chunk of chunks) {
        const response: AxiosResponse<{ tracks: SpotifyTrack[] }> = await this.api.get(
          '/tracks',
          {
            params: {
              ids: chunk.join(','),
            },
          }
        );
        allTracks.push(...response.data.tracks.filter(track => track !== null));
      }

      logger.info('Multiple tracks retrieved with popularity', { count: allTracks.length });
      return allTracks;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getTracks',
        count: ids.length,
      });
      throw this.handleError(error);
    }
  }

  async getNewReleases(limit = 20, offset = 0): Promise<SpotifyNewReleases> {
    try {
      const response: AxiosResponse<{ albums: SpotifyNewReleases }> = await this.api.get(
        '/browse/new-releases',
        {
          params: {
            limit,
            offset,
          },
        }
      );
      logger.info('New releases retrieved', { limit, offset });
      return response.data.albums;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyService',
        action: 'getNewReleases',
        limit,
        offset,
      });
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { 
        response?: { 
          data?: SpotifyError;
          status?: number;
          config?: { url?: string };
        };
      };
      if (axiosError.response?.data) {
        const spotifyError: SpotifyError = axiosError.response.data;
        const status = axiosError.response.status ?? 500;
        const url = axiosError.response.config?.url ?? '';
        errorReporter.reportApiError(new Error(spotifyError.error.message), url, status, {
          component: 'SpotifyService',
          action: 'spotify-api-error',
        });
        return new Error(`Spotify API Error: ${spotifyError.error.message}`);
      }
    }
    errorReporter.reportError(error, {
      component: 'SpotifyService',
      action: 'unexpected-error',
    });
    return new Error('An unexpected error occurred');
  }
}

export const spotifyService = new SpotifyService();
