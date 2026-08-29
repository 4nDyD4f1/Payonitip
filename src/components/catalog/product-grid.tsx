'use client';

import { ProductCard, Product } from './product-card';
import { Frown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex h-[320px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
            <div className="h-[200px] animate-pulse bg-slate-200 dark:bg-slate-800" />
            <div className="flex flex-1 flex-col p-4 space-y-3">
              <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-auto h-5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Frown className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Produk tidak ditemukan</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
