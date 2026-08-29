'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/use-cart';
import { formatRupiah } from '@/lib/utils';
import { Tag } from 'lucide-react';
import { validateVoucher } from '@/lib/supabase/api';

export function CartSummary() {
  const { items, getTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [validating, setValidating] = useState(false);
  
  const subtotal = getTotal();
  const shippingEstimate = items.length > 0 ? 15000 : 0;
  const total = subtotal + shippingEstimate - discount;
  
  const isEmpty = items.length === 0;

  const handleValidateVoucher = async () => {
    if (!promoCode.trim()) {
      setMessage('Masukkan kode voucher');
      setIsValid(false);
      setDiscount(0);
      return;
    }

    setValidating(true);
    setMessage('');
    
    try {
      const result = await validateVoucher(promoCode, subtotal);
      setIsValid(result.valid);
      setMessage(result.message);
      setDiscount(result.discount || 0);
    } catch (error) {
      setIsValid(false);
      setMessage('Terjadi kesalahan saat memvalidasi voucher');
      setDiscount(0);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] sticky top-24">
      <h2 className="text-xl font-bold font-montserrat text-text dark:text-slate-100 mb-6">Ringkasan Belanja</h2>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kode Promo</span>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Masukkan kode"
            disabled={validating}
            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent focus:outline-none focus:border-[#ef85f8] dark:text-slate-200 disabled:opacity-50"
          />
          <button 
            onClick={handleValidateVoucher}
            disabled={validating || isEmpty}
            className="px-4 py-2 bg-[#6dadff] dark:bg-[#a3ccff] hover:bg-[#004A8C] dark:hover:bg-[#4E93ED] text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {validating ? 'Memvalidasi...' : 'Terapkan'}
          </button>
        </div>
        {message && (
          <p className={`text-xs mt-2 ${isValid ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
      
      <div className="space-y-3 text-sm mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimasi Ongkir</span>
          <span>{shippingEstimate > 0 ? formatRupiah(shippingEstimate) : '-'}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Diskon</span>
            <span>-{formatRupiah(discount)}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between font-bold text-lg mb-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-text dark:text-slate-100">
        <span>Total</span>
        <span className="text-[#ef85f8] dark:text-[#f5b0fb]">{formatRupiah(total)}</span>
      </div>
      
      <Link
        href={isEmpty ? '#' : '/checkout'}
        className={`flex w-full items-center justify-center py-3 px-4 rounded-xl font-medium transition-colors ${
          isEmpty 
            ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed' 
            : 'bg-[#ef85f8] hover:bg-[#004A8C] dark:bg-[#f5b0fb] dark:hover:bg-[#4E93ED] text-white dark:text-slate-900'
        }`}
        aria-disabled={isEmpty}
      >
        Lanjut ke Checkout
      </Link>
    </div>
  );
}
