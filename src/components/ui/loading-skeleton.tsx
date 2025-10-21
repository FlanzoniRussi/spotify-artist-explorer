import React from 'react';

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
    <div
      className={`animate-pulse bg-gray-200 dark:bg-dark-400 rounded ${className}`}
      style={style}
    />
  );
};

export const ArtistCardSkeleton: React.FC = () => (
  <div className='card p-6'>
    <div className='flex items-center space-x-4'>
      <Skeleton width={64} height={64} className='rounded-full' />
      <div className='flex-1'>
        <Skeleton height={20} className='mb-2' />
        <Skeleton height={16} width='60%' />
      </div>
    </div>
  </div>
);

export const TrackListSkeleton: React.FC = () => (
  <div className='space-y-3'>
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className='flex items-center space-x-4 p-3'>
        <Skeleton width={40} height={40} className='rounded' />
        <div className='flex-1'>
          <Skeleton height={16} className='mb-1' />
          <Skeleton height={14} width='40%' />
        </div>
        <Skeleton width={60} height={14} />
      </div>
    ))}
  </div>
);

export const AlbumGridSkeleton: React.FC = () => (
  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className='space-y-3'>
        <Skeleton width='100%' height={200} className='rounded-lg' />
        <div className='space-y-2'>
          <Skeleton height={16} />
          <Skeleton height={14} width='70%' />
        </div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className='card p-6'>
    <Skeleton height={24} width='40%' className='mb-4' />
    <Skeleton height={300} width='100%' className='rounded' />
  </div>
);
