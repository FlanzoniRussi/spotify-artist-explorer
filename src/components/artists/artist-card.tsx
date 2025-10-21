import React from 'react';
import { Heart, Users, TrendingUp, ExternalLink, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import type { SpotifyArtist } from '../../types';

interface ArtistCardProps {
  artist: SpotifyArtist;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index?: number;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  isFavorite,
  onToggleFavorite,
  index = 0,
}) => {
  const { t } = useTranslation();
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPopularityColor = (popularity: number): string => {
    if (popularity >= 80) return 'text-green-600 dark:text-green-400';
    if (popularity >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (popularity >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPopularityLabel = (popularity: number): string => {
    if (popularity >= 80) return t('labels.veryPopular');
    if (popularity >= 60) return t('labels.popular');
    if (popularity >= 40) return t('labels.moderate');
    return t('labels.emerging');
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div 
      className="group bg-white dark:bg-dark-500 rounded-xl shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Artist Image */}
      <div className="relative aspect-square overflow-hidden">
        {artist.images?.[0]?.url ? (
          <motion.img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-full h-full object-cover"
            variants={imageVariants}
            whileHover="hover"
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
              {artist.name.charAt(0).toUpperCase()}
            </motion.span>
          </motion.div>
        )}
        
        {/* Favorite Button */}
        <motion.button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/80 dark:bg-dark-600/80 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
          }`}
          aria-label={isFavorite ? t('actions.removeFromFavorites') : t('actions.addToFavorites')}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.div>
        </motion.button>
      </div>

      {/* Artist Info */}
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="mb-4">
          <motion.h3 
            className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {artist.name}
          </motion.h3>
          <motion.p 
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            {artist.genres?.slice(0, 2).join(', ') || t('labels.variousGenres')}
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div 
          className="space-y-3 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <Users className="w-4 h-4 mr-2" />
              <span>{formatFollowers(artist.followers.total)} {t('labels.followers')}</span>
            </motion.div>
            <motion.div 
              className={`flex items-center text-sm font-medium ${getPopularityColor(artist.popularity)}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{artist.popularity}%</span>
            </motion.div>
          </div>
          
          <motion.div 
            className="text-xs text-gray-500 dark:text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.3 }}
          >
            {getPopularityLabel(artist.popularity)}
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Link
              to={`/artist/${artist.id}`}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {t('actions.viewDetails')}
            </Link>
          </motion.div>
          {artist.external_urls?.spotify && (
            <motion.a
              href={artist.external_urls.spotify}
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
  );
};
