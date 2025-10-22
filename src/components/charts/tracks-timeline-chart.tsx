import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CustomTrack } from '../../types';

interface TracksTimelineChartProps {
  tracks: CustomTrack[];
}

export const TracksTimelineChart: React.FC<TracksTimelineChartProps> = ({ tracks }) => {

  const timelineData = useMemo(() => {
    if (tracks.length === 0) return [];

    const monthlyData = tracks.reduce((acc, track) => {
      const date = new Date(track.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthName, count: 0 };
      }
      acc[monthKey].count++;
      return acc;
    }, {} as Record<string, { month: string; count: number }>);

    return Object.values(monthlyData).sort((a, b) => {
      const aDate = new Date(a.month.split(' ')[1] + '-01');
      const bDate = new Date(b.month.split(' ')[1] + '-01');
      return aDate.getTime() - bDate.getTime();
    });
  }, [tracks]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { month: string; count: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-600 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.month}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} {data.count === 1 ? 'música cadastrada' : 'músicas cadastradas'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (timelineData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado de timeline disponível</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
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
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
