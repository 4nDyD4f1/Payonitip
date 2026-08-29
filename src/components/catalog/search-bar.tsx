'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [value, setValue] = useState('');

  // Simple debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [value, onSearch]);

  return (
    <div className={`relative ${className || ''}`}>
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Cari pempek, kerupuk, atau request jastip..."
          className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-12 text-sm outline-none transition-all focus:border-[#ef85f8] focus:ring-1 focus:ring-[#ef85f8] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-[#f5b0fb] dark:focus:ring-[#f5b0fb]"
        />
        {value && (
          <button
            onClick={() => setValue('')}
            className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
