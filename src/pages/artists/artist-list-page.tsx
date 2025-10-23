import React, { useState, useMemo } from 'react';
import { Music, Users, TrendingUp, Disc, Filter } from 'lucide-react';
import { useSpotifyArtists, useSpotifyAlbums } from '../../hooks/useSpotify';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavorites } from '../../hooks/useFavorites';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import type { SpotifyArtist, SpotifyAlbum } from '../../types';
import { ArtistCard } from '../../components/artists/artist-card';
import { AlbumGrid } from '../../components/albums/album-grid';
import { SearchInput } from '../../components/ui/search-input';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import { EmptyState } from '../../components/ui/empty-state';
import { ErrorBoundary } from '../../components/error-boundary';
import { Pagination } from '../../components/ui/pagination';

export const ArtistListPage: React.FC = () => {
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();
  const { addSearch, getTopSearches } = useSearchHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState<'artist' | 'album' | 'all'>(
    'all'
  );

  const debouncedSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (query: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDebouncedQuery(query);
        if (query.trim()) {
          addSearch(query, searchType);
        }
      }, 300);
    };
  }, [addSearch, searchType]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    debouncedSearch(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const {
    data: searchData,
    isLoading: artistsLoading,
    error: artistsError,
    isFetching: artistsFetching,
  } = useSpotifyArtists(debouncedQuery, currentPage - 1, 20);

  const {
    data: albumsData,
    isLoading: albumsLoading,
    error: albumsError,
    isFetching: albumsFetching,
  } = useSpotifyAlbums(debouncedQuery, currentPage - 1, 20);

  const pagination = searchData?.pagination;

  const artists = useMemo(
    () => searchData?.artists || [],
    [searchData?.artists]
  );
  const albums = useMemo(() => albumsData || [], [albumsData]);

  const isLoading = artistsLoading || albumsLoading;
  const isFetching = artistsFetching || albumsFetching;
  const error = artistsError || albumsError;

  const handleToggleFavorite = (artist: SpotifyArtist) => {
    const favoriteData = {
      name: artist.name,
      artist: artist.name,
      album: 'Artist',
      duration: 0,
      type: 'artist' as const,
      imageUrl: artist.images?.[0]?.url,
      genre: artist.genres?.[0],
      popularity: artist.popularity,
      spotifyUrl: artist.external_urls?.spotify,
    };
    toggleFavorite(favoriteData);
  };

  const handleIsFavorite = (artist: SpotifyArtist) => {
    return favorites.some(
      fav => fav.type === 'artist' && fav.name === artist.name
    );
  };

  const handleToggleAlbumFavorite = (album: SpotifyAlbum) => {
    const favoriteData = {
      name: album.name,
      artist: album.artists[0]?.name || 'Unknown',
      album: album.name,
      duration: 0,
      type: 'album' as const,
      imageUrl: album.images?.[0]?.url,
      trackCount: album.total_tracks,
      releaseDate: album.release_date,
      spotifyUrl: album.external_urls?.spotify,
    };
    toggleFavorite(favoriteData);
  };

  const handleIsAlbumFavorite = (album: SpotifyAlbum) => {
    return favorites.some(
      fav =>
        fav.type === 'album' &&
        fav.name === album.name &&
        fav.artist === (album.artists[0]?.name || 'Unknown')
    );
  };

  const filteredResults = useMemo(() => {
    if (searchType === 'artist') return { artists, albums: [] };
    if (searchType === 'album') return { artists: [], albums };
    return { artists, albums };
  }, [artists, albums, searchType]);

  const stats = useMemo(() => {
    if (!artists.length && !albums.length) return null;

    const totalFollowers = artists.reduce(
      (sum, artist) => sum + artist.followers.total,
      0
    );
    const avgPopularity =
      artists.length > 0
        ? artists.reduce((sum, artist) => sum + artist.popularity, 0) /
          artists.length
        : 0;

    return {
      totalArtists: artists.length,
      totalAlbums: albums.length,
      totalFollowers,
      avgPopularity: Math.round(avgPopularity),
    };
  }, [artists, albums]);

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <EmptyState
          icon={
            <Music size={48} className='text-gray-400 dark:text-gray-500' />
          }
          title={t('errors.generic')}
          description={t('common:errors.network')}
          action={
            <button
              onClick={() => window.location.reload()}
              className='btn-primary'
            >
              {t('buttons.retry')}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            {t('artists:listing.title')}
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            {t('artists:listing.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className='mb-8'>
          <div className='mb-4'>
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('search.placeholderCombined')}
              loading={isFetching}
            />
          </div>

          {/* Search Type Filter */}
          <div className='flex gap-2 flex-wrap'>
            <button
              onClick={() => setSearchType('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                searchType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
              <Filter className='w-4 h-4' />
              {t('filters.all')}
            </button>
            <button
              onClick={() => setSearchType('artist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                searchType === 'artist'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
              <Users className='w-4 h-4' />
              {t('filters.artists')}
            </button>
            <button
              onClick={() => setSearchType('album')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                searchType === 'album'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
              <Disc className='w-4 h-4' />
              {t('filters.albums')}
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && debouncedQuery && (
          <div className='mb-4'>
            <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
              {t('artists:listing.apiNote')}
            </p>
          </div>
        )}

        {stats && debouncedQuery && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
            <div className='bg-white dark:bg-dark-500 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center'>
                <div className='p-2 bg-primary-100 dark:bg-primary-900 rounded-lg'>
                  <Users className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    {t('artists:listing.stats.totalArtists')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stats.totalArtists}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-dark-500 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center'>
                <div className='p-2 bg-primary-100 dark:bg-primary-900 rounded-lg'>
                  <Disc className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    {t('stats.albums')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stats.totalAlbums}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-dark-500 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center'>
                <div className='p-2 bg-primary-100 dark:bg-primary-900 rounded-lg'>
                  <Users className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    {t('artists:listing.stats.totalFollowers')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stats.totalFollowers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-dark-500 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-300'>
              <div className='flex items-center'>
                <div className='p-2 bg-primary-100 dark:bg-primary-900 rounded-lg'>
                  <TrendingUp className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    {t('artists:listing.stats.avgPopularity')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stats.avgPopularity}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!debouncedQuery ? (
          <div>
            <div className='text-center py-12 mb-8'>
              <Music className='w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                {t('artists:listing.startSearch')}
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                {t('artists:listing.searchHint')}
              </p>
            </div>

            {/* Most Searched Artists Section */}
            {getTopSearches(6).length > 0 && (
              <div>
                <div className='flex items-center gap-2 mb-6'>
                  <TrendingUp className='w-5 h-5 text-primary-500' />
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {t('sections.mostSearchedArtists')}
                  </h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
                  {getTopSearches(6).map((search, index) => (
                    <button
                      key={`${search.query}-${index}`}
                      onClick={() => {
                        setSearchQuery(search.query);
                        setCurrentPage(1);
                        debouncedSearch(search.query);
                      }}
                      className='p-4 bg-white dark:bg-dark-500 rounded-lg border border-gray-200 dark:border-dark-300 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all duration-200 text-left'
                    >
                      <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>
                        {search.type === 'artist'
                          ? '🎤'
                          : search.type === 'album'
                            ? '💿'
                            : '🎵'}
                      </p>
                      <p className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                        {search.query}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingSkeleton key={index} className='h-64' />
            ))}
          </div>
        ) : filteredResults.artists.length === 0 &&
          filteredResults.albums.length === 0 ? (
          <EmptyState
            icon={
              <Music size={48} className='text-gray-400 dark:text-gray-500' />
            }
            title={t('artists:listing.noResults')}
            description={t('artists:listing.tryDifferent')}
          />
        ) : (
          <>
            {/* Artists Section */}
            {filteredResults.artists.length > 0 && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                  <Users className='w-5 h-5' />
                  {t('sections.artists')} ({filteredResults.artists.length})
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {filteredResults.artists.map((artist, index) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      isFavorite={handleIsFavorite(artist)}
                      onToggleFavorite={() => handleToggleFavorite(artist)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Albums Section */}
            {filteredResults.albums.length > 0 && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                  <Disc className='w-5 h-5' />
                  {t('sections.albums')} ({filteredResults.albums.length})
                </h2>
                <AlbumGrid
                  albums={filteredResults.albums}
                  onToggleFavorite={handleToggleAlbumFavorite}
                  isFavorite={handleIsAlbumFavorite}
                />
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className='mt-8'>
                <Pagination
                  currentPage={pagination.currentPage + 1}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};
