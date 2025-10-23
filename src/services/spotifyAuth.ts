import axios from 'axios';
import { logger } from '../lib/logger';
import { errorReporter } from '../lib/error-reporter';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AuthError extends Error {
  translationKey?: string;
}

class SpotifyAuth {
  private token: string | null = null;
  private tokenExpireTime: number | null = null;
  private readonly clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  private readonly clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  private readonly tokenEndpoint = 'https://accounts.spotify.com/api/token';

  async getToken(): Promise<string> {
    // If token exists and hasn't expired, return it
    if (this.token && this.tokenExpireTime && Date.now() < this.tokenExpireTime) {
      return this.token;
    }

    // Refresh token
    return this.refreshToken();
  }

  private async refreshToken(): Promise<string> {
    try {
      if (!this.clientId || !this.clientSecret) {
        const error: AuthError = new Error('Spotify credentials not configured. Please set VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET in .env');
        error.translationKey = 'common:errors.api.credentialsNotConfigured';
        errorReporter.reportError(error, {
          component: 'SpotifyAuth',
          action: 'missing-credentials',
        });
        throw error;
      }

      const response = await axios.post<TokenResponse>(
        this.tokenEndpoint,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
          },
        }
      );

      this.token = response.data.access_token;
      // Set expiration time with a 60 second buffer
      this.tokenExpireTime = Date.now() + (response.data.expires_in - 60) * 1000;

      logger.info('Spotify token refreshed successfully');
      return this.token;
    } catch (error) {
      errorReporter.reportError(error, {
        component: 'SpotifyAuth',
        action: 'token-refresh-failed',
      });
      const authError: AuthError = new Error('Failed to obtain Spotify access token. Check your credentials.');
      authError.translationKey = 'common:errors.api.tokenFailed';
      throw authError;
    }
  }
}

export const spotifyAuth = new SpotifyAuth();
