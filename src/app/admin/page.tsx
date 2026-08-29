import { LayoutDashboard } from 'lucide-react';
import { KpiCards } from '@/components/admin/kpi-cards';
import { RecentOrders } from '@/components/admin/recent-orders';
import { TopProducts } from '@/components/admin/top-products';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 text-[#ef85f8] dark:bg-blue-900/30 dark:text-[#f5b0fb] rounded-lg">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Selamat datang di Admin Panel Payonitip</p>
        </div>
      </div>

      <KpiCards />

      <div className="flex flex-col lg:flex-row gap-6">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}
