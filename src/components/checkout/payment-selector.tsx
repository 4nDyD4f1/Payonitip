'use client';

import { QrCode, Building, Banknote } from 'lucide-react';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

const PAYMENT_OPTIONS: PaymentMethod[] = [
  {
    id: 'qris',
    name: 'QRIS',
    description: 'Scan & bayar',
  },
  {
    id: 'transfer',
    name: 'Transfer Bank',
    description: 'BCA / Mandiri / BRI',
  },
  {
    id: 'cod',
    name: 'COD',
    description: 'Bayar di tempat',
  }
];

interface PaymentSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export function PaymentSelector({ selected, onChange }: PaymentSelectorProps) {
  return (
    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl font-bold font-montserrat text-text dark:text-slate-100 mb-6">Metode Pembayaran</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all text-center ${
                isSelected
                  ? 'border-[#ef85f8] bg-blue-50/50 dark:bg-[#ef85f8]/10 dark:border-[#f5b0fb]'
                  : 'border-slate-200 dark:border-slate-700 hover:border-[#ef85f8]/50 dark:hover:border-[#f5b0fb]/50'
              }`}
            >
              <div className={`mx-auto w-10 h-10 mb-3 flex items-center justify-center rounded-full ${isSelected ? 'bg-[#ef85f8]/10 text-[#ef85f8] dark:text-[#f5b0fb]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {option.id === 'qris' && <QrCode className="w-5 h-5" />}
                {option.id === 'transfer' && <Building className="w-5 h-5" />}
                {option.id === 'cod' && <Banknote className="w-5 h-5" />}
              </div>
              <h3 className={`font-semibold text-sm ${isSelected ? 'text-[#ef85f8] dark:text-[#f5b0fb]' : 'text-slate-700 dark:text-slate-300'}`}>{option.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
