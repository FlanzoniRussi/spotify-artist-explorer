import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { UserFavorite } from '../../types';

interface ArtistsFavoritesChartProps {
  favorites: UserFavorite[];
}

export const ArtistsFavoritesChart: React.FC<ArtistsFavoritesChartProps> = ({ favorites }) => {

  const artistData = useMemo(() => {
    const artistCounts = favorites.reduce((acc, favorite) => {
      const artist = favorite.artist;
      acc[artist] = (acc[artist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(artistCounts)
      .map(([artist, count]) => ({ artist, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [favorites]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { artist: string; count: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-600 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.artist}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} {data.count === 1 ? 'favorito' : 'favoritos'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (artistData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado disponível para visualização</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <BarChart data={artistData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="artist" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
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
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
