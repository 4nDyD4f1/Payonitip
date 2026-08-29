'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { getAllOrders } from '@/lib/supabase/api';

const sampleChartData = [
  { day: 'Sen', value: 2400000, height: '45%' },
  { day: 'Sel', value: 1800000, height: '35%' },
  { day: 'Rab', value: 3100000, height: '60%' },
  { day: 'Kam', value: 2700000, height: '50%' },
  { day: 'Jum', value: 4200000, height: '80%' },
  { day: 'Sab', value: 5100000, height: '100%' },
  { day: 'Min', value: 3800000, height: '70%' },
];

const sampleTopProducts = [
  { rank: 1, name: 'Pempek Kapal Selam', sold: 450, revenue: 11250000 },
  { rank: 2, name: 'Kerupuk Kemplang Super', sold: 320, revenue: 14400000 },
];

const sampleSummaryTransactions = [
  { date: '1 - 7 Okt 2023', orders: 145, revenue: 24500000, avg: 168965 },
];

export default function LaporanPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 106600000,
    totalOrders: 629,
    avgOrder: 169475,
    productsSold: 1455
  });
  const [chartData, setChartData] = useState(sampleChartData);
  const [topProducts, setTopProducts] = useState(sampleTopProducts);
  const [summaryTransactions, setSummaryTransactions] = useState(sampleSummaryTransactions);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const orders = await getAllOrders();
        if (orders && orders.length > 0) {
          // Calculate basic stats
          const totalSales = orders.reduce((acc, order) => acc + (order.total || 0), 0);
          const totalOrders = orders.length;
          const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
          
          let productsSold = 0;
          const productMap: Record<string, {sold: number, revenue: number}> = {};
          
          // Generate chart data for last 7 days
          const last7Days = Array.from({length: 7}).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
              dateStr: d.toISOString().split('T')[0],
              day: d.toLocaleDateString('id-ID', { weekday: 'short' }),
              value: 0
            };
          });

          orders.forEach(order => {
            const orderDateStr = order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '';
            const dayMatch = last7Days.find(d => d.dateStr === orderDateStr);
            if (dayMatch) {
              dayMatch.value += (order.total || 0);
            }

            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                const qty = item.qty || item.quantity || 1;
                const price = item.price || 0;
                productsSold += qty;
                
                const name = item.name || item.product_name;
                if (name) {
                  if (!productMap[name]) productMap[name] = { sold: 0, revenue: 0 };
                  productMap[name].sold += qty;
                  productMap[name].revenue += (qty * price);
                }
              });
            }
          });

          // Top products
          const sortedProducts = Object.entries(productMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)
            .map((p, i) => ({ rank: i + 1, ...p }));

          // Chart height calculation
          const maxVal = Math.max(...last7Days.map(d => d.value), 1);
          const calculatedChart = last7Days.map(d => ({
            day: d.day,
            value: d.value,
            height: `${Math.max((d.value / maxVal) * 100, 5)}%`
          }));

          setStats({
            totalSales,
            totalOrders,
            avgOrder,
            productsSold
          });
          setChartData(calculatedChart);
          if (sortedProducts.length > 0) setTopProducts(sortedProducts);
          
          // Generate a simple summary based on data
          setSummaryTransactions([
            { date: 'Bulan Ini', orders: totalOrders, revenue: totalSales, avg: avgOrder }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Laporan Penjualan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ringkasan performa bisnis dan penjualan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Penjualan</p>
                <h3 className="text-2xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">{loading ? '...' : formatRupiah(stats.totalSales)}</h3>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-[#ef85f8] dark:text-[#f5b0fb] rounded-lg">
                <DollarSign size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Jumlah Transaksi</p>
                <h3 className="text-2xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">{loading ? '...' : stats.totalOrders}</h3>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-[#6dadff] dark:text-[#a3ccff] rounded-lg">
                <ShoppingCart size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Rata-rata Pesanan</p>
                <h3 className="text-2xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">{loading ? '...' : formatRupiah(stats.avgOrder)}</h3>
              </div>
              <div className="p-2 bg-[#fef5ff] dark:bg-amber-900/20 text-[#e06ee0] dark:text-[#f5b0fb] rounded-lg">
                <BarChart3 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Produk Terjual</p>
                <h3 className="text-2xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">{loading ? '...' : stats.productsSold}</h3>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Package size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
          <CardHeader className="pb-2 border-b dark:border-slate-800 mb-4">
            <CardTitle className="text-lg font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Penjualan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center">...</div>
            ) : (
            <div className="h-64 flex items-end justify-between gap-2 pt-6">
              {chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full relative flex items-end justify-center h-48 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg">
                    <div 
                      className="w-full bg-[#ef85f8] hover:bg-[#f5b0fb] dark:bg-[#f5b0fb] dark:hover:bg-[#6dadff] rounded-t-md transition-all duration-300 relative group cursor-pointer"
                      style={{ height: d.height }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none transition-opacity">
                        {formatRupiah(d.value)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{d.day}</span>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
          <CardHeader className="pb-2 border-b dark:border-slate-800 mb-4">
            <CardTitle className="text-lg font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="py-4">...</div>
            ) : (
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 shrink-0">
                    {p.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#1A1C1E] dark:text-[#F1F5F9] truncate">{p.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.sold} terjual</p>
                  </div>
                  <div className="text-sm font-semibold text-[#1A1C1E] dark:text-[#F1F5F9]">
                    {formatRupiah(p.revenue)}
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
        <CardHeader className="pb-2 border-b dark:border-slate-800 mb-4">
          <CardTitle className="text-lg font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Ringkasan Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b dark:border-slate-800">
                  <th className="pb-3 font-medium px-2">Periode</th>
                  <th className="pb-3 font-medium px-2 text-center">Jumlah Pesanan</th>
                  <th className="pb-3 font-medium px-2 text-right">Pendapatan</th>
                  <th className="pb-3 font-medium px-2 text-right">Rata-rata Nilai Pesanan</th>
                </tr>
              </thead>
              <tbody>
                {summaryTransactions.map((t, i) => (
                  <tr key={i} className="border-b dark:border-slate-800/50 last:border-0 text-sm">
                    <td className="py-4 px-2 font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{t.date}</td>
                    <td className="py-4 px-2 text-center text-slate-600 dark:text-slate-300">{t.orders}</td>
                    <td className="py-4 px-2 text-right font-medium text-[#ef85f8] dark:text-[#f5b0fb]">
                      {formatRupiah(t.revenue)}
                    </td>
                    <td className="py-4 px-2 text-right text-slate-600 dark:text-slate-300">
                      {formatRupiah(t.avg)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
