import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

/**
 * Props for SearchInput component
 */
interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Show loading spinner */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SearchInput Component
 *
 * A reusable search input with clear button and loading state.
 * Uses shadcn/ui Input component for consistency.
 * Features orange border on focus for better visual feedback.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Search artists..."
 *   loading={isLoading}
 * />
 * ```
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  loading = false,
  className = '',
}) => {
  /**
   * Handle clearing the search input
   */
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none transition-colors duration-200 group-focus-within:text-orange-500" />
        <div className="relative">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-20 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-500"
            aria-label="Search input"
          />
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
          </div>
        )}

        {/* Clear Button */}
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
