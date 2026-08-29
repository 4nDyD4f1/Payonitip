'use client';

import { Truck, Package } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
}

const SHIPPING_OPTIONS: ShippingMethod[] = [
  {
    id: 'sameday',
    name: 'Sameday Delivery',
    description: 'Tiba hari ini',
    price: 25000,
  },
  {
    id: 'regular',
    name: 'Regular',
    description: '2-3 hari kerja',
    price: 15000,
  }
];

interface ShippingSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export function ShippingSelector({ selected, onChange }: ShippingSelectorProps) {
  return (
    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl font-bold font-montserrat text-text dark:text-slate-100 mb-6">Metode Pengiriman</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SHIPPING_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                isSelected
                  ? 'border-[#ef85f8] bg-blue-50/50 dark:bg-[#ef85f8]/10 dark:border-[#f5b0fb]'
                  : 'border-slate-200 dark:border-slate-700 hover:border-[#ef85f8]/50 dark:hover:border-[#f5b0fb]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#ef85f8]/10 text-[#ef85f8] dark:text-[#f5b0fb]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {option.id === 'sameday' ? <Truck className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${isSelected ? 'text-[#ef85f8] dark:text-[#f5b0fb]' : 'text-slate-700 dark:text-slate-300'}`}>{option.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.description}</p>
                  <p className="font-bold text-sm text-text dark:text-slate-200 mt-2">{formatRupiah(option.price)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
