import React from 'react';
import { Heart, Calendar, ExternalLink, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import type { SpotifyAlbum } from '../../types';
import { formatDate } from '../../utils/formatters';

interface AlbumGridProps {
  albums: SpotifyAlbum[];
  onToggleFavorite: (album: SpotifyAlbum) => void;
  isFavorite: (album: SpotifyAlbum) => boolean;
}

/**
 * Animation for the heart when favorited
 */
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

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  albums,
  onToggleFavorite,
  isFavorite,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          className="group bg-white dark:bg-dark-500 rounded-xl shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          {/* Album Cover */}
          <div className="relative aspect-square overflow-hidden">
            {album.images?.[0]?.url ? (
              <motion.img
                src={album.images[0].url}
                alt={album.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.div
                className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="text-white text-4xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {album.name.charAt(0).toUpperCase()}
                </motion.span>
              </motion.div>
            )}

            {/* Favorite Button */}
            <motion.button
              onClick={() => onToggleFavorite(album)}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isFavorite(album)
                  ? 'bg-red-500 text-white shadow-lg scale-110'
                  : 'bg-white/80 dark:bg-dark-600/80 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
              }`}
              aria-label={isFavorite(album) ? t('actions.removeFromFavorites') : t('actions.addToFavorites')}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isFavorite(album) ? 'favorited' : 'unfavorited'}
                variants={heartBeatVariants}
                key={isFavorite(album) ? 'favorited' : 'unfavorited'}
              >
                <Heart className={`w-5 h-5 ${isFavorite(album) ? 'fill-current' : ''}`} />
              </motion.div>
            </motion.button>
          </div>

          {/* Album Info */}
          <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="mb-4">
              <motion.h3
                className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {album.name}
              </motion.h3>
              <motion.p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {album.artists.map((artist) => artist.name).join(', ')}
              </motion.p>
            </div>

            {/* Album Details */}
            <motion.div
              className="space-y-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(album.release_date)}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {album.total_tracks} {album.total_tracks !== 1 ? t('labels.tracks') : t('labels.track')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {album.album_type}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Link
                  to={`/album/${album.id}`}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {t('actions.viewDetails')}
                </Link>
              </motion.div>

              {album.external_urls?.spotify && (
                <motion.a
                  href={album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-gray-300 dark:border-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-400 rounded-lg transition-colors duration-200"
                  aria-label={t('actions.openInSpotify')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
