import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  value: number;
  onChange: (year: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  min = 1900,
  max = new Date().getFullYear(),
  placeholder = 'Select year',
  className = '',
  error = false,
}) => {
  const years = Array.from(
    { length: max - min + 1 },
    (_, i) => max - i
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <select
          value={value || ''}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
            error
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-600'
          }`}
        >
          <option value="">{placeholder}</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
