import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CustomTrack } from '../../types';

interface GenreDistributionChartProps {
  tracks: CustomTrack[];
}

export const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({ tracks }) => {

  const genreData = useMemo(() => {
    const genreCounts = tracks.reduce((acc, track) => {
      const genre = track.genre;
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }, [tracks]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { genre: string; count: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-600 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.genre}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} {data.count === 1 ? 'música' : 'músicas'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (genreData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum gênero cadastrado</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <BarChart data={genreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="genre" 
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
