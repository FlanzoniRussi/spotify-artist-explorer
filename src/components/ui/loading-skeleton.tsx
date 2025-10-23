import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
}) => {
  const style: React.CSSProperties = {};

  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height)
    style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <motion.div
      className={`bg-gray-200 dark:bg-dark-400 rounded ${className}`}
      style={style}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export const ArtistCardSkeleton: React.FC = () => (
  <motion.div 
    className='card p-6'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className='flex items-center space-x-4'>
      <Skeleton width={64} height={64} className='rounded-full' />
      <div className='flex-1'>
        <Skeleton height={20} className='mb-2' />
        <Skeleton height={16} width='60%' />
      </div>
    </div>
  </motion.div>
);

export const TrackListSkeleton: React.FC = () => (
  <div className='space-y-3'>
    {Array.from({ length: 5 }).map((_, index) => (
      <motion.div 
        key={index} 
        className='flex items-center space-x-4 p-3'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
      >
        <Skeleton width={40} height={40} className='rounded' />
        <div className='flex-1'>
          <Skeleton height={16} className='mb-1' />
          <Skeleton height={14} width='40%' />
        </div>
        <Skeleton width={60} height={14} />
      </motion.div>
    ))}
  </div>
);

export const AlbumGridSkeleton: React.FC = () => (
  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
    {Array.from({ length: 8 }).map((_, index) => (
      <motion.div 
        key={index} 
        className='space-y-3'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
      >
        <Skeleton width='100%' height={200} className='rounded-lg' />
        <div className='space-y-2'>
          <Skeleton height={16} />
          <Skeleton height={14} width='70%' />
        </div>
      </motion.div>
    ))}
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <motion.div 
    className='card p-6'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Skeleton height={24} width='40%' className='mb-4' />
    <Skeleton height={300} width='100%' className='rounded' />
  </motion.div>
);
export const LoadingSkeleton: React.FC<SkeletonProps> = (props) => <Skeleton {...props} />;
