import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyTrack,
  SpotifySearchResult,
  SpotifyArtistTopTracks,
  SpotifyArtistAlbums,
  SpotifyError,
  SearchFilters,
} from '../types';

class SpotifyService {
  private api: AxiosInstance;
  private readonly baseURL = 'https://api.spotify.com/v1';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      config => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          return this.api.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('spotify_access_token');
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Spotify credentials not configured');
      }

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
        }
      );

      const { access_token } = response.data;
      localStorage.setItem('spotify_access_token', access_token);
    } catch (error) {
      console.error('Failed to refresh Spotify token:', error);
      throw error;
    }
  }

  async searchArtists(
    query: string,
    limit = 20,
    offset = 0
  ): Promise<{ artists: SpotifyArtist[]; total: number; hasNext: boolean; hasPrevious: boolean }> {
    try {
      // Query otimizada para busca mais precisa
      const searchQuery = `artist:"${query}"`;
      
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
          q: searchQuery,
          type: 'artist',
          limit,
          offset,
        },
      });

      // Filtrar resultados para garantir precisão
      const artists = response.data.artists.items;
      const queryLower = query.toLowerCase().trim();
      
      // Filtrar apenas artistas que realmente correspondem à busca
      const filteredArtists = artists.filter(artist => {
        const artistName = artist.name.toLowerCase();
        
        // Correspondência exata
        if (artistName === queryLower) return true;
        
        // Correspondência que começa com a query
        if (artistName.startsWith(queryLower)) return true;
        
        // Para queries com múltiplas palavras, verificar se todas estão presentes
        const queryWords = queryLower.split(' ');
        if (queryWords.length > 1) {
          return queryWords.every(word => artistName.includes(word));
        }
        
        // Para queries de uma palavra, ser mais restritivo
        return artistName.includes(queryLower) && queryLower.length >= 3;
      });

      return {
        artists: filteredArtists,
        total: response.data.artists.total,
        hasNext: !!response.data.artists.next,
        hasPrevious: !!response.data.artists.previous,
      };
    } catch (error) {
      console.error('Error searching artists:', error);
      throw this.handleError(error);
    }
  }

  async searchAlbums(
    query: string,
    limit = 20,
    offset = 0
  ): Promise<SpotifyAlbum[]> {
    try {
      const response: AxiosResponse<{ albums: { items: SpotifyAlbum[] } }> =
        await this.api.get('/search', {
          params: {
            q: query,
            type: 'album',
            limit,
            offset,
          },
        });

      return response.data.albums.items;
    } catch (error) {
      console.error('Error searching albums:', error);
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

      return response.data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
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

      return {
        artists: artistsResponse.data.artists,
        albums: albumsResponse.data.albums,
        tracks: tracksResponse.data.tracks,
      };
    } catch (error) {
      console.error('Error searching all:', error);
      throw this.handleError(error);
    }
  }

  async getArtist(id: string): Promise<SpotifyArtist> {
    try {
      const response: AxiosResponse<SpotifyArtist> = await this.api.get(
        `/artists/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting artist:', error);
      throw this.handleError(error);
    }
  }

  async getArtistTopTracks(id: string, market = 'BR'): Promise<SpotifyTrack[]> {
    try {
      const response: AxiosResponse<SpotifyArtistTopTracks> =
        await this.api.get(`/artists/${id}/top-tracks`, {
          params: { market },
        });
      return response.data.tracks;
    } catch (error) {
      console.error('Error getting artist top tracks:', error);
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
      return response.data;
    } catch (error) {
      console.error('Error getting artist albums:', error);
      throw this.handleError(error);
    }
  }

  async getAlbum(id: string): Promise<SpotifyAlbum> {
    try {
      const response: AxiosResponse<SpotifyAlbum> = await this.api.get(
        `/albums/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting album:', error);
      throw this.handleError(error);
    }
  }

  async getAlbumTracks(id: string): Promise<{ items: SpotifyTrack[] }> {
    try {
      const response: AxiosResponse<{ items: SpotifyTrack[] }> = await this.api.get(
        `/albums/${id}/tracks`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting album tracks:', error);
      throw this.handleError(error);
    }
  }

  async getTrack(id: string): Promise<SpotifyTrack> {
    try {
      const response: AxiosResponse<SpotifyTrack> = await this.api.get(
        `/tracks/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting track:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: SpotifyError } };
      if (axiosError.response?.data) {
        const spotifyError: SpotifyError = axiosError.response.data;
        return new Error(`Spotify API Error: ${spotifyError.error.message}`);
      }
    }
    return new Error('An unexpected error occurred');
  }
}

export const spotifyService = new SpotifyService();
