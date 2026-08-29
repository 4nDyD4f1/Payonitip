'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { getBestSellers } from '@/lib/supabase/api';
import { formatRupiah } from '@/lib/utils';

export function TopProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const SAMPLE_DATA = [
    { name: 'Pempek Kapal Selam', orders: '124 Pesanan', price: 25000, color: 'from-blue-400 to-blue-600' },
    { name: 'Kerupuk Kemplang Super', orders: '98 Pesanan', price: 45000, color: 'from-purple-400 to-purple-600' },
    { name: 'Tekwan Kuah Udang', orders: '85 Pesanan', price: 35000, color: 'from-[#f5b0fb] to-[#e06ee0]' },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getBestSellers(3);
        if (data && data.length > 0) {
          setProducts(data.map((d: any, i: number) => ({
            name: d.name,
            orders: `${d.total_orders || d.total_sales || 10} Pesanan`,
            price: d.price,
            color: i % 2 === 0 ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'
          })));
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A] rounded-xl lg:w-96">
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b dark:border-slate-800 mb-4">
        <CardTitle className="text-lg font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Produk Terlaris</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${product.color || 'from-blue-400 to-blue-600'} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#1A1C1E] dark:text-[#F1F5F9] truncate">{product.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{product.orders}</p>
                </div>
                <div className="text-sm font-semibold text-[#ef85f8] dark:text-[#f5b0fb]">
                  {typeof product.price === 'number' ? formatRupiah(product.price) : product.price}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center pt-2 border-t dark:border-slate-800">
          <Link href="/admin/produk" className="text-sm font-medium text-[#ef85f8] dark:text-[#f5b0fb] hover:underline">
            Lihat Katalog Lengkap
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
