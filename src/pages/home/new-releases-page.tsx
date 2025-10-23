import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Disc3, Heart } from 'lucide-react';
import { useSpotifyNewReleases } from '../../hooks/useSpotify';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavorites } from '../../hooks/useFavorites';
import type { SpotifyAlbum } from '../../types';
import { LoadingSkeleton } from '../../components/ui/loading-skeleton';
import { EmptyState } from '../../components/ui/empty-state';
import { Pagination } from '../../components/ui/pagination';
import { formatDate } from '../../utils/formatters';

const ITEMS_PER_PAGE = 20;

const heartBeatVariants = {
  unfavorited: {
    scale: 1,
    rotate: 0,
  },
  favorited: {
    scale: [1, 1.3, 1.15, 1.3, 1.1],
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.6 },
  },
};

export const NewReleasesPage: React.FC = () => {
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: releasesData, isLoading } = useSpotifyNewReleases(currentPage - 1, ITEMS_PER_PAGE);

  const totalPages = useMemo(() => {
    return releasesData ? Math.ceil(releasesData.total / ITEMS_PER_PAGE) : 0;
  }, [releasesData]);

  const handleToggleFavorite = (album: SpotifyAlbum) => {
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

  const isFavorite = (album: SpotifyAlbum) => {
    return favorites.some(fav => 
      fav.type === 'album' && 
      fav.name === album.name && 
      fav.artist === (album.artists[0]?.name || 'Unknown')
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Disc3 className="w-8 h-8 text-primary-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('home:newReleases.title') || 'New Releases'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('home:newReleases.subtitle') || 'Discover the latest albums and singles'}
        </p>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-80" />
          ))}
        </div>
      ) : releasesData?.items && releasesData.items.length > 0 ? (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.05 }}
          >
            {releasesData.items.map((album, index) => (
              <motion.div
                key={album.id}
                className="group bg-white dark:bg-dark-500 rounded-xl shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Album Cover */}
                <motion.div
                  className="relative aspect-square overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {album.images?.[0]?.url ? (
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <Disc3 className="w-12 h-12 text-white opacity-50" />
                    </div>
                  )}

                  {/* Favorite Button */}
                  <motion.button
                    onClick={() => handleToggleFavorite(album)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                      isFavorite(album)
                        ? 'bg-red-500 text-white shadow-lg scale-110'
                        : 'bg-white/80 dark:bg-dark-600/80 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
                    }`}
                    aria-label={isFavorite(album) ? t('buttons.removeFavorite') : t('buttons.addFavorite')}
                    initial={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    variants={heartBeatVariants}
                    animate={isFavorite(album) ? 'favorited' : 'unfavorited'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(album) ? 'fill-current' : ''}`} />
                  </motion.button>
                </motion.div>

                {/* Album Info */}
                <motion.div
                  className="p-6 flex flex-col flex-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="mb-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {album.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {album.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>

                  {/* Details */}
                  <motion.div
                    className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <div>
                      <span className="font-medium">{formatDate(album.release_date)}</span>
                    </div>
                    <div>
                      <span>{album.total_tracks} {album.total_tracks !== 1 ? t('labels.tracks') : t('labels.track')}</span>
                    </div>
                    <div className="capitalize">
                      <span>{album.album_type}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Disc3 size={48} className="text-gray-400 dark:text-gray-500" />}
          title={t('home:newReleases.empty') || 'No releases found'}
          description={t('home:newReleases.emptyDescription') || 'Try again later'}
        />
      )}
    </div>
  );
};
