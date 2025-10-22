import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';
import { ChartFallback } from './chart-fallback';
import type { UserFavorite } from '../../types';

interface FavoritesDistributionChartProps {
  favorites: UserFavorite[];
}

export const FavoritesDistributionChart: React.FC<FavoritesDistributionChartProps> = ({ favorites }) => {
  const { t } = useTranslation();

  const data = [
    {
      name: t('sections.artists'),
      value: favorites.filter(fav => fav.type === 'artist').length,
      color: '#3b82f6'
    },
    {
      name: t('sections.albums'),
      value: favorites.filter(fav => fav.type === 'album').length,
      color: '#10b981'
    },
    {
      name: 'Músicas',
      value: favorites.filter(fav => fav.type === 'track').length,
      color: '#8b5cf6'
    }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; color: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-600 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {data.name}: {data.value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return <ChartFallback message="Nenhum dado disponível para visualização" />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
