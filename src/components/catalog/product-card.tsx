'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, Plus } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import { useCartStore } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string;
  image_url?: string;
  rating?: number;
  total_orders?: number;
  weight?: string;
  category?: string;
  categories?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const categoryName = product.categories?.name || product.category || 'Uncategorized';

  return (
    <Link href={`/katalog/${product.slug}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-[1.02]">
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-slate-800"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite ? "fill-[#6dadff] dark:fill-[#a3ccff] text-[#6dadff] dark:text-[#a3ccff]" : "text-slate-500 dark:text-slate-400"
            )}
          />
        </button>

        {/* Image Area */}
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#e8f1ff] to-red-100 dark:from-orange-900/40 dark:to-red-900/40">
          {product.image_url || product.image ? (
            <img src={product.image_url || product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-orange-800/50 dark:text-orange-200/50 font-medium">Image coming soon</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex gap-1">
            <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90 hover:bg-white/90 text-xs shadow-sm">
              {categoryName}
            </Badge>
            <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90 hover:bg-white/90 text-xs shadow-sm">
              {product.weight}
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center gap-1">
            <div className="flex text-[#f5b0fb]">
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
            {product.total_orders && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                • {product.total_orders} terjual
              </span>
            )}
          </div>
          
          <h3 className="mb-1 font-montserrat text-sm font-semibold text-[#1A1C1E] dark:text-[#F1F5F9] line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-auto flex items-end justify-between pt-3">
            <p className="font-semibold text-[#ef85f8] dark:text-[#f5b0fb]">
              {formatRupiah(product.price)}
            </p>
            <button
              onClick={handleAddToCart}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6dadff] dark:bg-[#a3ccff] text-white dark:text-slate-900 transition-transform hover:scale-110 shadow-sm"
              aria-label="Tambah ke keranjang"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
