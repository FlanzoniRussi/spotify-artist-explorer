import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartFallbackProps {
  message: string;
  icon?: React.ReactNode;
}

export const ChartFallback: React.FC<ChartFallbackProps> = ({ 
  message, 
  icon = <BarChart3 className="w-8 h-8 text-gray-400" />
}) => {
  return (
    <div className="h-64 w-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      {icon}
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
};
