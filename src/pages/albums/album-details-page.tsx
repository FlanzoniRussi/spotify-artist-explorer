import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Music, TrendingUp, Heart } from 'lucide-react';
import { useSpotifyAlbum, useSpotifyAlbumTracks } from '../../hooks/useSpotify';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavorites } from '../../hooks/useFavorites';
import type { SpotifyTrack } from '../../types';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import { EmptyState } from '../../components/ui/empty-state';
import { ErrorBoundary } from '../../components/error-boundary';
import { TrackList } from '../../components/tracks/track-list';
import { formatDate } from '../../utils/formatters';

export const AlbumDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();

  const {
    data: album,
    isLoading: albumLoading,
    error: albumError,
  } = useSpotifyAlbum(id || '');

  const {
    data: tracksData,
    isLoading: tracksLoading,
  } = useSpotifyAlbumTracks(id || '');

  const handleToggleTrackFavorite = (track: SpotifyTrack) => {
    const favoriteData = {
      name: track.name,
      artist: track.artists[0]?.name || album?.artists[0]?.name || 'Unknown',
      album: album?.name || 'Unknown',
      duration: track.duration_ms,
      type: 'track' as const,
    };
    toggleFavorite(favoriteData);
  };

  const handleToggleAlbumFavorite = () => {
    if (!album) return;
    
    const favoriteData = {
      name: album.name,
      artist: album.artists[0]?.name || 'Unknown',
      album: album.name,
      duration: 0,
      type: 'album' as const,
    };
    toggleFavorite(favoriteData);
  };

  const isTrackFavorite = (track: SpotifyTrack) => {
    return favorites.some(fav => 
      fav.type === 'track' && 
      fav.name === track.name && 
      fav.artist === (track.artists[0]?.name || album?.artists[0]?.name || 'Unknown')
    );
  };

  const isAlbumFavorite = () => {
    if (!album) return false;
    return favorites.some(fav => 
      fav.type === 'album' && 
      fav.name === album.name && 
      fav.artist === (album.artists[0]?.name || 'Unknown')
    );
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = (): string => {
    if (!tracksData?.items) return '0:00';
    const totalMs = tracksData.items.reduce((sum, track) => sum + track.duration_ms, 0);
    return formatDuration(totalMs);
  };

  if (albumError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<Music size={48} className='text-gray-400 dark:text-gray-500' />}
          title={t('errors.notFound')}
          description="Failed to load album. Please try again."
          action={
            <Link
              to="/"
              className="btn-primary"
            >
              {t('buttons.back')}
            </Link>
          }
        />
      </div>
    );
  }

  if (albumLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-xl mb-6"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<Music size={48} className='text-gray-400 dark:text-gray-500' />}
          title={t('errors.notFound')}
          description="Album not found or has been removed."
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('buttons.back')}
          </Link>
        </div>

        {/* Album Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Album Cover */}
          <div className="lg:col-span-1">
            <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
              {album.images?.[0]?.url ? (
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {album.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Album Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {album.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {album.artists.map(artist => artist.name).join(', ')}
              </p>
              
              {/* Album Actions */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleToggleAlbumFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isAlbumFavorite()
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isAlbumFavorite() ? 'fill-current' : ''}`} />
                  {isAlbumFavorite() ? t('actions.removeFromFavorites') : t('actions.addToFavorites')}
                </button>
                
                {album.external_urls?.spotify && (
                  <a
                    href={album.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-400 rounded-lg transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('actions.openInSpotify')}
                  </a>
                )}
              </div>
            </div>

            {/* Album Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('artists:details.releaseDate')}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(album.release_date)}
                </p>
              </div>

              <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('artists:details.tracks')}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {album.total_tracks}
                </p>
              </div>

              <div className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('artists:details.duration')}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getTotalDuration()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Album Tracks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('artists:details.tracks')} ({tracksData?.items?.length || 0})
          </h2>
          
          {tracksLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-16" />
              ))}
            </div>
          ) : tracksData?.items && tracksData.items.length > 0 ? (
            <TrackList
              tracks={tracksData.items}
              onToggleFavorite={handleToggleTrackFavorite}
              isFavorite={isTrackFavorite}
            />
          ) : (
            <EmptyState
              icon={<Music size={48} className='text-gray-400 dark:text-gray-500' />}
              title={t('artists:details.noTracks')}
              description={t('artists:details.noTracksDescription')}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
