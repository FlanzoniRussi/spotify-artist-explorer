import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  loading = false,
  className = '',
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative group">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none transition-colors duration-200 group-focus-within:text-orange-500 z-10" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-20 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-500"
            aria-label="Search input"
          />
        </div>

        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
          </div>
        )}

        {value && !loading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 active:scale-90"
            aria-label="Clear search"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
