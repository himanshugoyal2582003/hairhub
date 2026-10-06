'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  large?: boolean;
}

export default function SearchBar({ initialQuery = '', className, large = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ search: query });
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={cn('relative', className)}>
      <div className={cn(
        'flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/40 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all',
        large ? 'p-2' : 'p-1.5'
      )}>
        <Search className={cn('text-slate-400 shrink-0 ml-2', large ? 'w-5 h-5' : 'w-4 h-4')} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city, state, hair type..."
          className={cn(
            'flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none',
            large ? 'text-base py-2 pr-2' : 'text-sm py-1 pr-1'
          )}
        />
        <button
          type="submit"
          className={cn(
            'shrink-0 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm',
            large ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
}

interface FilterBarProps {
  filters: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
      {showMore && (
        <div className="flex flex-wrap gap-2 w-full mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <select
            value={filters.hairType}
            onChange={(e) => onChange('hairType', e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All Hair Types</option>
            {['Straight', 'Wavy', 'Curly', 'Coily'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={filters.virginHair}
            onChange={(e) => onChange('virginHair', e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">Virgin or Not</option>
            <option value="yes">Virgin Hair Only</option>
            <option value="no">Non-Virgin Only</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange('sortBy', e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="newest">Newest First</option>
            <option value="views">Most Viewed</option>
            <option value="length-asc">Length: Short to Long</option>
            <option value="length-desc">Length: Long to Short</option>
          </select>
        </div>
      )}
    </div>
  );
}
