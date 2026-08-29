'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart';
import { formatRupiah } from '@/lib/utils';
import Image from 'next/image';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
    image?: string;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-xl bg-surface dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="w-20 h-20 shrink-0 rounded-lg bg-gradient-to-br from-[#ef85f8]/20 to-[#6dadff]/20 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 w-full">
        <h3 className="font-semibold text-text dark:text-slate-100 truncate">{item.name}</h3>
        {item.variant && <p className="text-sm text-slate-500 dark:text-slate-400">{item.variant}</p>}
        <p className="font-bold text-[#ef85f8] dark:text-[#f5b0fb] mt-1">{formatRupiah(item.price)}</p>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-6 text-center font-medium text-sm text-text dark:text-slate-200">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={() => removeItem(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          aria-label="Hapus item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
