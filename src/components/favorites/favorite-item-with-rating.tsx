import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Heart, Music, ExternalLink, Flame } from 'lucide-react';
import { RatingStars } from '../ui/rating-stars';
import { useRatingsContext } from '../../contexts/ratings-context';
import { useTranslation } from '../../hooks/useTranslation';
import type { UserFavorite } from '../../types';

interface FavoriteItemWithRatingProps {
  favorite: UserFavorite;
  onRemove: (id: string) => void;
}

export const FavoriteItemWithRating: React.FC<FavoriteItemWithRatingProps> = ({
  favorite,
  onRemove,
}) => {
  const { getRating, addOrUpdateRating } = useRatingsContext();
  const { t } = useTranslation();

  const rating = getRating(favorite.id, favorite.type);

  const handleRatingChange = (newRating: number) => {
    addOrUpdateRating(
      favorite.id,
      favorite.type,
      newRating,
      favorite.name,
      favorite.artist
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('labels.today');
    if (date.toDateString() === yesterday.toDateString())
      return t('labels.yesterday');
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className='bg-white dark:bg-dark-500 rounded-lg shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-md transition-shadow overflow-hidden'
    >
      <div className='flex items-start gap-3 p-3'>
        {/* Image - smaller */}
        <div className='flex-shrink-0'>
          {favorite.imageUrl ? (
            <img
              src={favorite.imageUrl}
              alt={favorite.name}
              className='w-16 h-16 rounded-lg object-cover'
            />
          ) : (
            <div className='w-16 h-16 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 dark:from-dark-400 dark:to-dark-300 flex items-center justify-center'>
              <Music className='w-6 h-6 text-gray-600 dark:text-gray-400' />
            </div>
          )}
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2 mb-1'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-1 mb-1'>
                <Heart className='w-3 h-3 text-red-500 flex-shrink-0' />
                <h3 className='text-xs font-semibold text-gray-900 dark:text-white truncate'>
                  {favorite.name}
                </h3>
              </div>
              <p className='text-xs text-gray-600 dark:text-gray-400 truncate'>
                {favorite.artist}
              </p>
            </div>
            <div className='flex items-center gap-1 flex-shrink-0'>
              {favorite.spotifyUrl && (
                <motion.a
                  href={favorite.spotifyUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-1 text-gray-400 hover:text-green-500 transition-colors'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={t('labels.openInSpotify')}
                >
                  <ExternalLink className='w-3 h-3' />
                </motion.a>
              )}
              <motion.button
                onClick={() => onRemove(favorite.id)}
                className='p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={t('labels.removeFavorite')}
              >
                <Trash2 className='w-3 h-3' />
              </motion.button>
            </div>
          </div>

          <div className='flex items-center justify-between gap-1 mb-2 flex-wrap'>
            <div className='flex items-center gap-1 flex-wrap'>
              <span className='inline-block px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded'>
                {favorite.type === 'track'
                  ? t('sections.tracks')
                  : favorite.type === 'album'
                    ? t('sections.albums')
                    : t('sections.artists')}
              </span>
              {favorite.genre && (
                <span className='inline-block px-1.5 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded'>
                  {favorite.genre}
                </span>
              )}
              {favorite.popularity !== undefined && (
                <span className='inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded'>
                  <Flame className='w-2 h-2' />
                  {favorite.popularity}
                </span>
              )}
              {favorite.trackCount && (
                <span className='inline-block px-1.5 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded'>
                  {favorite.trackCount}{' '}
                  {favorite.trackCount === 1
                    ? t('labels.faixa')
                    : t('labels.faixas')}
                </span>
              )}
            </div>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {formatDate(favorite.addedAt)}
            </span>
          </div>

          {/* Rating Row */}
          <div className='flex items-center gap-2'>
            <RatingStars
              value={rating}
              onChange={handleRatingChange}
              size='sm'
              interactive={true}
            />
            {rating && (
              <span className='text-xs font-semibold text-orange-500'>
                {rating}/5
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteItemWithRating;
