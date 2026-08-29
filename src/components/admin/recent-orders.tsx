'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { getAllOrders, subscribeToNewOrders } from '@/lib/supabase/api';
import { formatRupiah } from '@/lib/utils';

export function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const SAMPLE_DATA = [
    { id: '#PYN-00092', customer_name: 'Budi Santoso', total: 345000, status: 'Diproses' },
    { id: '#PYN-00091', customer_name: 'Siti Aminah', total: 130000, status: 'Dikirim' },
    { id: '#PYN-00090', customer_name: 'Andi Wijaya', total: 240000, status: 'Selesai' },
    { id: '#PYN-00089', customer_name: 'Rina Marlina', total: 270000, status: 'Diproses' },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAllOrders();
        if (data && data.length > 0) {
          setOrders(data.slice(0, 5));
        } else {
          setOrders([]);
        }
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();

    try {
      subscribeToNewOrders(() => {
        fetchData();
      });
    } catch(e) {}
    
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Diproses':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200';
      case 'Dikirim':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200';
      case 'Selesai':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200';
    }
  };

  return (
    <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A] rounded-xl flex-1">
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b dark:border-slate-800 mb-4">
        <CardTitle className="text-lg font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Pesanan Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="h-12 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b dark:border-slate-800">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Pelanggan</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i} className="border-b dark:border-slate-800/50 last:border-0 text-sm">
                    <td className="py-4 font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{order.order_id || order.id}</td>
                    <td className="py-4 text-[#1A1C1E] dark:text-slate-300">{order.customer_name}</td>
                    <td className="py-4 font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">
                      {typeof order.total === 'number' ? formatRupiah(order.total) : order.total}
                    </td>
                    <td className="py-4">
                      <Badge className={`rounded-full ${getStatusColor(order.status)}`} variant="secondary">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreHorizontal size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-center">
          <Link href="/admin/pesanan" className="text-sm font-medium text-[#ef85f8] dark:text-[#f5b0fb] hover:underline">
            Lihat Semua Pesanan
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
