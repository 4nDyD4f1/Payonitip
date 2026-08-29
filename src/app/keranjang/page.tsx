'use client';

import { ShoppingCart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/use-cart';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';

export default function KeranjangPage() {
  const { items } = useCartStore();
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-background dark:bg-[#020617] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-[#ef85f8] dark:text-[#f5b0fb]" />
          <h1 className="text-3xl font-bold font-montserrat text-text dark:text-slate-100">Keranjang Belanja</h1>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <ShoppingBag className="w-20 h-20 text-slate-300 dark:text-slate-700 mb-6" />
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Keranjang kamu masih kosong</h2>
            <p className="text-slate-500 dark:text-slate-500 mb-8 text-center max-w-md">
              Yuk, cari pempek kesukaanmu dan tambahkan ke keranjang untuk mulai berbelanja!
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-[#ef85f8] hover:bg-[#004A8C] dark:bg-[#f5b0fb] dark:hover:bg-[#4E93ED] text-white dark:text-slate-900 rounded-xl font-medium transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
