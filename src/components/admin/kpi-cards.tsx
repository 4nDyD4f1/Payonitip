'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, ShoppingCart, Users, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDashboardStats } from '@/lib/supabase/api';

export function KpiCards() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const fallbackData = {
    totalSales: 0,
    todayOrders: 0,
    activeProducts: 0,
    newCustomers: 0
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        if (data) {
          setStats(data);
        } else {
          setStats(fallbackData);
        }
      } catch {
        setStats(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cards = [
    {
      title: 'Total Penjualan',
      value: stats ? (typeof stats.totalSales === 'number' ? `Rp ${(stats.totalSales / 1000000).toFixed(1)}M` : stats.totalSales) : '',
      change: '+14.5%',
      isPositive: true,
      desc: 'dari bulan lalu',
      icon: Wallet,
      color: 'bg-blue-100 text-[#ef85f8] dark:bg-blue-900/30 dark:text-[#f5b0fb]',
    },
    {
      title: 'Pesanan Hari Ini',
      value: stats ? stats.todayOrders : '',
      change: '+5',
      isPositive: true,
      desc: 'dari kemarin',
      icon: ShoppingCart,
      color: 'bg-purple-100 text-[#6dadff] dark:bg-purple-900/30 dark:text-[#a3ccff]',
    },
    {
      title: 'Produk Aktif',
      value: stats ? stats.activeProducts : '',
      change: '0%',
      isPositive: null,
      desc: 'Sama dengan minggu lalu',
      icon: Users,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      title: 'Pelanggan Baru',
      value: stats ? stats.newCustomers : '',
      change: '+22%',
      isPositive: true,
      desc: 'minggu ini',
      icon: UserPlus,
      color: 'bg-[#fde8ff] text-[#e06ee0] dark:bg-amber-900/30 dark:text-[#f5b0fb]',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A] rounded-xl">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full mb-4 bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-4 w-24 mb-2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              <div className="h-8 w-32 mb-2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {cards.map((card, i) => (
        <Card key={i} className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A] rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-3 rounded-full', card.color)}>
                <card.icon size={24} strokeWidth={2} />
              </div>
              <div className="text-sm font-medium">
                {card.isPositive !== null && (
                  <span className={card.isPositive ? 'text-emerald-500' : 'text-rose-500'}>
                    {card.change}
                  </span>
                )}
                {card.isPositive === null && (
                  <span className="text-slate-400 dark:text-slate-500">{card.change}</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-2xl md:text-3xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">{card.value}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{card.desc}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
