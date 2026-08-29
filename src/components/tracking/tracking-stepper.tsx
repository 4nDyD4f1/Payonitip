'use client';

import { ShoppingCart, RefreshCw, Package, Truck, CheckCircle } from 'lucide-react';

export interface TrackingStep {
  status: string;
  description: string;
  created_at?: string;
}

interface TrackingStepperProps {
  currentStatus: string;
  trackingHistory: TrackingStep[];
}

const ALL_STEPS = [
  { id: 'pesanan_dibuat', title: 'Pesanan Dibuat', icon: ShoppingCart },
  { id: 'diproses', title: 'Diproses', icon: RefreshCw },
  { id: 'dikemas', title: 'Dikemas', icon: Package },
  { id: 'dikirim', title: 'Dikirim', icon: Truck },
  { id: 'selesai', title: 'Selesai', icon: CheckCircle },
];

export function TrackingStepper({ currentStatus, trackingHistory }: TrackingStepperProps) {
  // Find current step index
  const currentIndex = ALL_STEPS.findIndex(s => s.id === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)]">
      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-12 pb-4">
        {ALL_STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isPending = index > activeIndex;
          
          const Icon = step.icon;
          const historyItem = trackingHistory.find(h => h.status === step.id);
          
          return (
            <div key={step.id} className="relative pl-8 md:pl-10">
              {/* Dynamic Line Color Update based on completion */}
              {isCompleted && (
                <div className="absolute -left-[2px] top-0 bottom-[-3rem] w-[2px] bg-green-500 dark:bg-green-400" />
              )}
              
              <div 
                className={`absolute -left-[17px] md:-left-[21px] top-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 border-surface dark:border-slate-900 transition-colors ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? 'bg-[#ef85f8] dark:bg-[#f5b0fb] text-white shadow-[0_0_0_4px_rgba(0,95,175,0.1)] dark:shadow-[0_0_0_4px_rgba(107,170,255,0.1)]' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'animate-pulse' : ''}`} />}
              </div>
              
              <div>
                <h3 className={`font-semibold text-base md:text-lg ${isCompleted ? 'text-green-600 dark:text-green-400' : isActive ? 'text-[#ef85f8] dark:text-[#f5b0fb]' : 'text-slate-500 dark:text-slate-400'}`}>
                  {step.title}
                </h3>
                
                {historyItem && (
                  <>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {historyItem.created_at ? new Date(historyItem.created_at).toLocaleString() : ''}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                      {historyItem.description}
                    </p>
                  </>
                )}
                
                {!historyItem && isActive && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    Sedang diproses...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
