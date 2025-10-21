import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Play, Users, TrendingUp, Calendar } from 'lucide-react';
import { useSpotifyArtist, useSpotifyArtistTopTracks, useSpotifyArtistAlbums } from '../../hooks/useSpotify';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavorites } from '../../hooks/useFavorites';
import type { SpotifyTrack } from '../../types';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import { EmptyState } from '../../components/ui/empty-state';
import { ErrorBoundary } from '../../components/error-boundary';
import { TrackList } from '../../components/tracks/track-list';
import { AlbumGrid } from '../../components/albums/album-grid';
import { PopularityChart } from '../../components/charts/popularity-chart';

export const ArtistDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();

  const {
    data: artist,
    isLoading: artistLoading,
    error: artistError,
  } = useSpotifyArtist(id || '');

  const {
    data: topTracks = [],
    isLoading: tracksLoading,
  } = useSpotifyArtistTopTracks(id || '');

  const {
    data: albumsData,
    isLoading: albumsLoading,
  } = useSpotifyArtistAlbums(id || '', 0, 20);

  const handleToggleTrackFavorite = (track: SpotifyTrack) => {
    const favoriteData = {
      name: track.name,
      artist: track.artists[0]?.name || artist?.name || 'Unknown',
      album: track.album?.name || 'Unknown',
      duration: track.duration_ms,
      type: 'track' as const,
    };
    toggleFavorite(favoriteData);
  };

  const handleToggleAlbumFavorite = (album: any) => {
    const favoriteData = {
      name: album.name,
      artist: artist?.name || 'Unknown',
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
      fav.artist === (track.artists[0]?.name || artist?.name || 'Unknown')
    );
  };

  const isAlbumFavorite = (album: any) => {
    return favorites.some(fav => 
      fav.type === 'album' && 
      fav.name === album.name && 
      fav.artist === (artist?.name || 'Unknown')
    );
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (artistError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<Users size={48} className='text-gray-400 dark:text-gray-500' />}
          title={t('artists:details.notFound')}
          description={t('artists:details.notFoundDescription')}
          action={
            <button 
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              {t('common.back')}
            </button>
          }
        />
      </div>
    );
  }

  if (artistLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <LoadingSkeleton className="h-8 w-32 mb-4" />
          <LoadingSkeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LoadingSkeleton className="aspect-square rounded-xl mb-6" />
            <LoadingSkeleton className="h-6 w-3/4 mb-2" />
            <LoadingSkeleton className="h-4 w-1/2 mb-4" />
            <LoadingSkeleton className="h-4 w-full mb-2" />
            <LoadingSkeleton className="h-4 w-2/3" />
          </div>
          <div className="lg:col-span-2">
            <LoadingSkeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<Users size={48} className='text-gray-400 dark:text-gray-500' />}
          title={t('artists:details.notFound')}
          description={t('artists:details.notFoundDescription')}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </Link>

        {/* Artist Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Artist Image & Basic Info */}
          <div className="lg:col-span-1">
            <div className="aspect-square rounded-xl overflow-hidden mb-6 shadow-lg">
              {artist.images?.[0]?.url ? (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {artist.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {artist.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {artist.genres?.join(', ') || t('artists:details.variousGenres')}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{formatFollowers(artist.followers.total)} {t('artists:details.followers')}</span>
                  </div>
                  <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                    <TrendingUp className="w-5 h-5 mr-1" />
                    <span>{artist.popularity}% {t('artists:details.popularity')}</span>
                  </div>
                </div>

                {artist.external_urls?.spotify && (
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('artists:details.openInSpotify')}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Popularity Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('artists:details.popularityTrend')}
              </h2>
              <PopularityChart popularity={artist.popularity} />
            </div>
          </div>
        </div>

        {/* Top Tracks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('artists:details.topTracks')}
          </h2>
          {tracksLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : topTracks.length > 0 ? (
            <TrackList
              tracks={topTracks}
              onToggleFavorite={handleToggleTrackFavorite}
              isFavorite={isTrackFavorite}
            />
          ) : (
            <EmptyState
              icon={<Play size={48} className='text-gray-400 dark:text-gray-500' />}
              title={t('artists:details.noTracks')}
              description={t('artists:details.noTracksDescription')}
            />
          )}
        </div>

        {/* Albums */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('artists:details.albums')}
          </h2>
          {albumsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-64" />
              ))}
            </div>
          ) : albumsData?.items && albumsData.items.length > 0 ? (
            <AlbumGrid
              albums={albumsData.items}
              onToggleFavorite={handleToggleAlbumFavorite}
              isFavorite={isAlbumFavorite}
            />
          ) : (
            <EmptyState
              icon={<Calendar size={48} className='text-gray-400 dark:text-gray-500' />}
              title={t('artists:details.noAlbums')}
              description={t('artists:details.noAlbumsDescription')}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
