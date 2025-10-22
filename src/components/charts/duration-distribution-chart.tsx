import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { UserFavorite } from '../../types';

interface DurationDistributionChartProps {
  favorites: UserFavorite[];
}

export const DurationDistributionChart: React.FC<DurationDistributionChartProps> = ({ favorites }) => {

  const durationData = useMemo(() => {
    const trackFavorites = favorites.filter(fav => fav.type === 'track' && fav.duration > 0);
    
    if (trackFavorites.length === 0) return [];

    const durationsInMinutes = trackFavorites.map(fav => Math.round(fav.duration / 60000));
    
    const buckets = [
      { range: '0-2 min', min: 0, max: 2, count: 0 },
      { range: '2-4 min', min: 2, max: 4, count: 0 },
      { range: '4-6 min', min: 4, max: 6, count: 0 },
      { range: '6-8 min', min: 6, max: 8, count: 0 },
      { range: '8+ min', min: 8, max: Infinity, count: 0 }
    ];

    durationsInMinutes.forEach(duration => {
      const bucket = buckets.find(b => duration >= b.min && duration < b.max);
      if (bucket) {
        bucket.count++;
      }
    });

    return buckets.filter(bucket => bucket.count > 0);
  }, [favorites]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { range: string; count: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-600 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.range}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} {data.count === 1 ? 'música' : 'músicas'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (durationData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhuma música com duração disponível</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <BarChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="range" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
