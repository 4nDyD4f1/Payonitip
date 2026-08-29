'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Product } from './product-card';

const CATEGORIES = ['Semua Kategori', 'Individual', 'Paket', 'Hemat', 'Cemilan'];

interface FilterState {
  categories: string[];
  minPrice: string;
  maxPrice: string;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  bestSellers: Product[];
  categories?: { name: string; slug: string }[];
  className?: string;
  isMobileDrawer?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({ onFilterChange, bestSellers, categories = [], className, isMobileDrawer, onClose }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: ['Semua Kategori'],
    minPrice: '',
    maxPrice: '',
  });

  const categoryOptions = ['Semua Kategori', ...categories.map(c => c.name)];
  // Fallback if no dynamic categories
  const displayCategories = categories.length > 0 ? categoryOptions : CATEGORIES;

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => {
      let newCategories = [...prev.categories];
      if (category === 'Semua Kategori') {
        newCategories = ['Semua Kategori'];
      } else {
        newCategories = newCategories.filter(c => c !== 'Semua Kategori');
        if (checked) {
          newCategories.push(category);
        } else {
          newCategories = newCategories.filter(c => c !== category);
        }
        if (newCategories.length === 0) {
          newCategories = ['Semua Kategori'];
        }
      }
      return { ...prev, categories: newCategories };
    });
  };

  const handleApply = () => {
    onFilterChange(filters);
    if (onClose) onClose();
  };

  return (
    <div className={cn("flex flex-col gap-6 p-4 md:p-0", className)}>
      {isMobileDrawer && (
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="font-montserrat text-lg font-semibold">Filter</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Kategori Filter */}
      <div className="space-y-4">
        <h3 className="font-montserrat font-semibold text-[#1A1C1E] dark:text-[#F1F5F9]">Kategori</h3>
        <div className="space-y-3">
          {displayCategories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${category}`} 
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <label 
                htmlFor={`cat-${category}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Harga Filter */}
      <div className="space-y-4">
        <h3 className="font-montserrat font-semibold text-[#1A1C1E] dark:text-[#F1F5F9]">Harga</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Rp</span>
            <Input 
              type="number" 
              placeholder="Min" 
              className="pl-8"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            />
          </div>
          <span className="text-slate-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Rp</span>
            <Input 
              type="number" 
              placeholder="Max" 
              className="pl-8"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleApply} className="w-full bg-[#ef85f8] hover:bg-[#ef85f8]/90 dark:bg-[#f5b0fb] dark:hover:bg-[#f5b0fb]/90 dark:text-slate-900">
        Terapkan Filter
      </Button>

      {/* Best Sellers */}
      <div className="mt-4 space-y-4">
        <h3 className="font-montserrat font-semibold text-[#1A1C1E] dark:text-[#F1F5F9]">Best Sellers</h3>
        <div className="flex flex-col gap-4">
          {bestSellers.slice(0, 3).map(product => (
            <div key={product.id} className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#e8f1ff] dark:bg-orange-900/40">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-[#f5b0fb] text-[#f5b0fb]" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
