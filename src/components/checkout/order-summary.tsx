'use client';

import { formatRupiah } from '@/lib/utils';
import { Lock, Loader2 } from 'lucide-react';

interface OrderSummaryProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onSubmit: () => void;
  loading: boolean;
}

export function OrderSummary({ items, subtotal, shipping, discount, total, onSubmit, loading }: OrderSummaryProps) {
  return (
    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] sticky top-24">
      <h2 className="text-xl font-bold font-montserrat text-text dark:text-slate-100 mb-6">Ringkasan Pesanan</h2>
      
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{item.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.quantity} x {formatRupiah(item.price)}</p>
            </div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{formatRupiah(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-3 text-sm mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Ongkos Kirim</span>
          <span>{shipping > 0 ? formatRupiah(shipping) : '-'}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Diskon</span>
            <span>-{formatRupiah(discount)}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between font-bold text-lg mb-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-text dark:text-slate-100">
        <span>Total Pembayaran</span>
        <span className="text-[#ef85f8] dark:text-[#f5b0fb]">{formatRupiah(total)}</span>
      </div>
      
      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-white bg-[#ef85f8] hover:bg-[#004A8C] dark:bg-[#f5b0fb] dark:hover:bg-[#4E93ED] dark:text-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Buat Pesanan
          </>
        )}
      </button>
      <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-4 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Transaksi aman & terenkripsi
      </p>
    </div>
  );
}
