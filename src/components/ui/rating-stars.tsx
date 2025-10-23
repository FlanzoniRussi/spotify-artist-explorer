import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingStarsProps {
  value: number | null;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  interactive?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  size = 'md',
  readOnly = false,
  interactive = true,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentRating = hoverRating ?? value ?? 0;

  const handleMouseEnter = (rating: number) => {
    if (interactive && !readOnly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const handleClick = (rating: number) => {
    if (interactive && !readOnly) {
      onChange(rating);
    }
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readOnly}
          whileHover={!readOnly ? { scale: 1.2 } : {}}
          whileTap={!readOnly ? { scale: 0.9 } : {}}
          className={`
            transition-colors duration-200
            ${!readOnly && interactive ? 'cursor-pointer' : 'cursor-default'}
            ${readOnly ? 'opacity-70' : 'opacity-100'}
            focus:outline-none focus:ring-2 focus:ring-orange-500 rounded
          `}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`
              ${sizeMap[size]}
              transition-all duration-150
              ${star <= currentRating
                ? 'fill-orange-400 text-orange-400'
                : 'text-gray-300 dark:text-gray-600'
              }
            `}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default RatingStars;
