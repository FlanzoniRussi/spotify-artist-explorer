import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';

interface PopularityChartProps {
  popularity: number;
}

export const PopularityChart: React.FC<PopularityChartProps> = ({ popularity }) => {
  const { t } = useTranslation();
  
  // Create mock data for visualization
  const data = [
    { name: t('artists:details.chart.veryLow'), value: 0, fill: '#ef4444' },
    { name: t('artists:details.chart.low'), value: 0, fill: '#f97316' },
    { name: t('artists:details.chart.moderate'), value: 0, fill: '#eab308' },
    { name: t('artists:details.chart.high'), value: 0, fill: '#22c55e' },
    { name: t('artists:details.chart.veryHigh'), value: 0, fill: '#3b82f6' },
  ];

  // Determine which category the popularity falls into
  let categoryIndex = 0;
  if (popularity >= 80) categoryIndex = 4;
  else if (popularity >= 60) categoryIndex = 3;
  else if (popularity >= 40) categoryIndex = 2;
  else if (popularity >= 20) categoryIndex = 1;

  // Set the value for the current category
  data[categoryIndex].value = popularity;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-600 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('artists:details.chart.popularity')}: {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
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
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
