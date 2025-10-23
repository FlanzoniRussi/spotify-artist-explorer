import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Play, Users, TrendingUp, Calendar, Heart } from 'lucide-react';
import { useSpotifyArtist, useSpotifyArtistTopTracks, useSpotifyArtistAlbums } from '../../hooks/useSpotify';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavorites } from '../../hooks/useFavorites';
import type { SpotifyTrack, SpotifyAlbum } from '../../types';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import { EmptyState } from '../../components/ui/empty-state';
import { ErrorBoundary } from '../../components/error-boundary';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/table';
import { PopularityChart } from '../../components/charts/popularity-chart';
import { Pagination } from '../../components/ui/pagination';
import { formatDate, formatDuration } from '../../utils/formatters';

export const ArtistDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();
  const [currentTracksPage, setCurrentTracksPage] = React.useState(1);
  const [currentAlbumsPage, setCurrentAlbumsPage] = React.useState(1);
  const ITEMS_PER_PAGE = 20;

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
  } = useSpotifyArtistAlbums(id || '', currentAlbumsPage - 1, ITEMS_PER_PAGE);

  // Paginate top tracks client-side (API returns only top 10)
  const paginatedTopTracks = React.useMemo(() => {
    const startIdx = (currentTracksPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    return topTracks.slice(startIdx, endIdx);
  }, [topTracks, currentTracksPage, ITEMS_PER_PAGE]);

  const totalTracksPages = Math.ceil(topTracks.length / ITEMS_PER_PAGE);
  const totalAlbumsPages = albumsData ? Math.ceil(albumsData.total / ITEMS_PER_PAGE) : 0;

  const handleToggleTrackFavorite = (track: SpotifyTrack) => {
    const favoriteData = {
      name: track.name,
      artist: track.artists[0]?.name || artist?.name || 'Unknown',
      album: track.album?.name || 'Unknown',
      duration: track.duration_ms,
      type: 'track' as const,
      imageUrl: track.album?.images?.[0]?.url,
      genre: artist?.genres?.[0],
      popularity: track.popularity,
      spotifyUrl: track.external_urls?.spotify,
    };
    toggleFavorite(favoriteData);
  };

  const handleToggleAlbumFavorite = (album: SpotifyAlbum) => {
    const favoriteData = {
      name: album.name,
      artist: artist?.name || 'Unknown',
      album: album.name,
      duration: 0,
      type: 'album' as const,
      imageUrl: album.images?.[0]?.url,
      genre: artist?.genres?.[0],
      trackCount: album.total_tracks,
      releaseDate: album.release_date,
      spotifyUrl: album.external_urls?.spotify,
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

  const isAlbumFavorite = (album: { name: string }) => {
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
              {t('buttons.back')}
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
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const backButtonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.1
      }
    },
    hover: {
      x: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <ErrorBoundary>
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Back Button */}
        <motion.div
          variants={backButtonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link
            to="/"
            className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('buttons.back')}
          </Link>
        </motion.div>

        {/* Artist Header */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Artist Image & Basic Info */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div 
              className="aspect-square rounded-xl overflow-hidden mb-6 shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {artist.images?.[0]?.url ? (
                <motion.img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.div 
                  className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span 
                    className="text-white text-6xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {artist.name.charAt(0).toUpperCase()}
                  </motion.span>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {artist.name}
                </motion.h1>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  {artist.genres?.join(', ') || t('artists:details.variousGenres')}
                </motion.p>
              </div>

              {/* Stats */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{formatFollowers(artist.followers.total)} {t('artists:details.followers')}</span>
                  </div>
                  <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                    <TrendingUp className="w-5 h-5 mr-1" />
                    <span>{artist.popularity}% {t('artists:details.popularity')}</span>
                  </div>
                </motion.div>

                {artist.external_urls?.spotify && (
                  <motion.a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('artists:details.openInSpotify')}
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Popularity Chart */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div 
              className="bg-white dark:bg-dark-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-300"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('artists:details.popularityTrend')}
              </h2>
              <PopularityChart popularity={artist.popularity} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Top Tracks */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            {t('artists:details.topTracks')}
          </motion.h2>
          {tracksLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : paginatedTopTracks.length > 0 ? (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">#</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Title</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Album</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Duration</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Popularity</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Favorite</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTopTracks.map((track, index) => (
                    <TableRow key={track.id}>
                      <TableCell className="text-gray-600 dark:text-gray-400">{index + 1}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{track.name}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{track.album?.name}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{formatDuration(track.duration_ms)}</TableCell>
                      <TableCell className="text-primary-600 dark:text-primary-400 font-medium">{track.popularity}%</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleTrackFavorite(track)}
                          className={`p-2 rounded-full transition-colors duration-200 ${isTrackFavorite(track) ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-300'}`}
                          title={isTrackFavorite(track) ? t('buttons.removeFavorite') : t('buttons.addFavorite')}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalTracksPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentTracksPage}
                    totalPages={totalTracksPages}
                    onPageChange={(page) => {
                      setCurrentTracksPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </>
          ) : topTracks.length === 0 ? (
            <EmptyState
              icon={<Play size={48} className='text-gray-400 dark:text-gray-500' />}
              title={t('artists:details.noTracks')}
              description={t('artists:details.noTracksDescription')}
            />
          ) : null}
        </motion.div>

        {/* Albums */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            {t('artists:details.albums')}
          </motion.h2>
          {albumsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-64" />
              ))}
            </div>
          ) : albumsData?.items && albumsData.items.length > 0 ? (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Image</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Title</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Artist</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Date</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Tracks</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">Favorite</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {albumsData.items.map((album) => (
                    <TableRow key={album.id}>
                      <TableCell className="w-20 h-20 rounded-lg overflow-hidden">
                        {album.images?.[0]?.url ? (
                          <img src={album.images[0].url} alt={album.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">No Image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{album.name}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{artist?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{formatDate(album.release_date)}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{album.total_tracks}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleAlbumFavorite(album)}
                          className={`p-2 rounded-full transition-colors duration-200 ${isAlbumFavorite(album) ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-300'}`}
                          title={isAlbumFavorite(album) ? t('buttons.removeFavorite') : t('buttons.addFavorite')}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalAlbumsPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentAlbumsPage}
                    totalPages={totalAlbumsPages}
                    onPageChange={(page) => {
                      setCurrentAlbumsPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </>
          ) : !albumsLoading && !albumsData ? (
            <EmptyState
              icon={<Calendar size={48} className='text-gray-400 dark:text-gray-500' />}
              title={t('artists:details.noAlbums')}
              description={t('artists:details.noAlbumsDescription')}
            />
          ) : null}
        </motion.div>
        </motion.div>
    </ErrorBoundary>
  );
};
