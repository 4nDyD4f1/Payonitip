'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { getUserOrders } from '@/lib/supabase/api';

type OrderStatus = 'Semua' | 'Diproses' | 'Dikirim' | 'Selesai';

const SAMPLE_ORDERS = [
  {
    order_id: 'PYN-00092',
    created_at: '2026-08-28T00:00:00Z',
    status: 'Diproses' as OrderStatus,
    items: [
      { name: 'Pempek Kapal Selam', qty: 2 },
      { name: 'Pempek Lenjer', qty: 3 }
    ],
    total: 345000,
  },
  {
    order_id: 'PYN-00091',
    created_at: '2026-08-25T00:00:00Z',
    status: 'Dikirim' as OrderStatus,
    items: [
      { name: 'Tekwan Kuah Udang', qty: 1 }
    ],
    total: 130000,
  },
  {
    order_id: 'PYN-00090',
    created_at: '2026-08-20T00:00:00Z',
    status: 'Selesai' as OrderStatus,
    items: [
      { name: 'Paket Campur A', qty: 1 }
    ],
    total: 240000,
  },
  {
    order_id: 'PYN-00089',
    created_at: '2026-08-15T00:00:00Z',
    status: 'Diproses' as OrderStatus,
    items: [
      { name: 'Kerupuk Kemplang', qty: 5 }
    ],
    total: 270000,
  }
];

export default function PesananPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('Semua');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fetchedOrders = await getUserOrders(user.id);
          if (fetchedOrders && fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
          } else {
            setOrders(SAMPLE_ORDERS);
          }
        } else {
          router.push('/login');
          setOrders(SAMPLE_ORDERS);
        }
      } catch (error) {
        setOrders(SAMPLE_ORDERS);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [router, supabase.auth]);

  const filteredOrders = activeTab === 'Semua' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const tabs: OrderStatus[] = ['Semua', 'Diproses', 'Dikirim', 'Selesai'];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Diproses': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Dikirim': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Selesai': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Diproses': return <Clock className="w-3 h-3 mr-1" />;
      case 'Dikirim': return <Truck className="w-3 h-3 mr-1" />;
      case 'Selesai': return <CheckCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#ef85f8]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-slate-50 mb-6">
        Pesanan Saya
      </h2>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab
                ? "bg-[#ef85f8] text-white dark:bg-[#f5b0fb] dark:text-slate-900"
                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.order_id} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{formatDate(order.created_at)}</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-50">{order.order_id}</div>
                </div>
                <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex items-center", getStatusColor(order.status))}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {order.items && Array.isArray(order.items) ? order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ef85f8]/20 to-[#6dadff]/20 dark:from-[#f5b0fb]/20 dark:to-[#a3ccff]/20 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                          {item.name || item.product_name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {item.qty || item.quantity} barang
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-slate-500">Detail barang tidak tersedia</div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Belanja</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {formatRupiah(order.total || 0)}
                  </p>
                </div>
                <div className="flex w-full sm:w-auto space-x-2">
                  <Link href={`/tracking/${order.order_id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700">
                      Lacak Pesanan
                    </Button>
                  </Link>
                  <Button className="flex-1 sm:flex-none bg-[#ef85f8] hover:bg-[#004f91] dark:bg-[#f5b0fb] dark:hover:bg-[#5a99ee] text-white">
                    Pesan Lagi
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
            Belum ada pesanan
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Wah, kamu belum pernah pesan apapun nih. Yuk belanja sekarang!
          </p>
          <Link href="/">
            <Button className="bg-[#ef85f8] hover:bg-[#004f91] dark:bg-[#f5b0fb] dark:hover:bg-[#5a99ee] text-white">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
