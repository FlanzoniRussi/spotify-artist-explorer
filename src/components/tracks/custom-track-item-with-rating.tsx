import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Music } from 'lucide-react';
import { RatingStars } from '../ui/rating-stars';
import { useRatingsContext } from '../../contexts/ratings-context';
import type { CustomTrack } from '../../types';

interface CustomTrackItemWithRatingProps {
  track: CustomTrack;
  onEdit: (track: CustomTrack) => void;
  onDelete: (trackId: string) => void;
}

export const CustomTrackItemWithRating: React.FC<CustomTrackItemWithRatingProps> = ({
  track,
  onEdit,
  onDelete,
}) => {
  const { getRating, addOrUpdateRating } = useRatingsContext();
  
  const rating = getRating(track.id, 'custom-track');

  const handleRatingChange = (newRating: number) => {
    addOrUpdateRating(
      track.id,
      'custom-track',
      newRating,
      track.name,
      track.artist
    );
  };

  const formatDuration = () => {
    const totalSeconds = track.duration.minutes * 60 + track.duration.seconds;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-dark-500 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-300 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {track.name}
            </h3>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {track.artist}
            {track.album && ` • ${track.album}`}
          </p>

          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
              {track.genre}
            </span>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
              {track.year}
            </span>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
              {formatDuration()}
            </span>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
              track.isReleased
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
            }`}>
              {track.isReleased ? 'Lançada' : 'Não lançada'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Avaliação:</span>
            <RatingStars
              value={rating}
              onChange={handleRatingChange}
              size="sm"
              interactive={true}
            />
            {rating && (
              <span className="text-xs font-semibold text-orange-500">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            onClick={() => onEdit(track)}
            className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Editar música"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(track.id)}
            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Deletar música"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomTrackItemWithRating;
