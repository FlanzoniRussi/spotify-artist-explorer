import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CustomTrack } from '../../types';

interface YearDistributionChartProps {
  tracks: CustomTrack[];
}

export const YearDistributionChart: React.FC<YearDistributionChartProps> = ({ tracks }) => {

  const yearData = useMemo(() => {
    const yearCounts = tracks.reduce((acc, track) => {
      const year = track.year;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [tracks]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { year: number; count: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-600 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.year}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} {data.count === 1 ? 'música' : 'músicas'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (yearData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado de ano disponível</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <BarChart data={yearData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="year" 
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
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
