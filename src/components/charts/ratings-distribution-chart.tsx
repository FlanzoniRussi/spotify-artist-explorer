import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';

interface RatingsDistributionChartProps {
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  average: number;
  total: number;
}

export const RatingsDistributionChart: React.FC<RatingsDistributionChartProps> = ({
  distribution,
  average,
  total,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const data = useMemo(() => {
    return [
      { stars: '⭐', count: distribution[1], rating: 1 },
      { stars: '⭐⭐', count: distribution[2], rating: 2 },
      { stars: '⭐⭐⭐', count: distribution[3], rating: 3 },
      { stars: '⭐⭐⭐⭐', count: distribution[4], rating: 4 },
      { stars: '⭐⭐⭐⭐⭐', count: distribution[5], rating: 5 },
    ];
  }, [distribution]);

  const textColor = isDark ? '#ffffff' : '#0f172a';
  const gridColor = isDark ? '#404040' : '#e2e8f0';

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('dashboard:charts.ratingsDistribution')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('dashboard:charts.ratingsLabels.total')}: {total} • {t('dashboard:charts.ratingsLabels.average')}: {average.toFixed(1)} ⭐
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="stars"
            stroke={textColor}
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke={textColor} style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDark ? '#404040' : '#e2e8f0'}`,
              borderRadius: '8px',
              color: textColor,
            }}
            formatter={(value) => `${value} ${t('dashboard:charts.ratingsLabels.rating')}${value !== 1 ? 's' : ''}`}
            labelStyle={{ color: textColor }}
          />
          <Legend
            wrapperStyle={{ color: textColor }}
            iconType="circle"
          />
          <Bar
            dataKey="count"
            fill="#f97316"
            radius={[8, 8, 0, 0]}
            name={t('dashboard:charts.ratingsLabels.quantity')}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingsDistributionChart;
