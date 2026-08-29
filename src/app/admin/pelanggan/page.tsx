'use client';

import { useState, useEffect } from 'react';
import { Users, Search, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/utils';
import { getAllProfiles } from '@/lib/supabase/api';

const initialCustomers = [
  { id: 1, name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567890', totalOrders: 5, totalSpent: 1200000, joinDate: '12 Jan 2023' },
  { id: 2, name: 'Siti Aminah', email: 'siti@email.com', phone: '085678901234', totalOrders: 3, totalSpent: 450000, joinDate: '05 Mar 2023' },
];

export default function PelangganPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);
      try {
        const data = await getAllProfiles();
        if (data && data.length > 0) {
          setCustomers(data.map((p: any) => ({
            id: p.id,
            name: p.full_name || p.username || 'Unknown',
            email: p.email || '-',
            phone: p.phone || '-',
            totalOrders: p.total_orders || 0,
            totalSpent: p.total_spent || 0,
            joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'
          })));
        } else {
          setCustomers([]);
        }
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Data Pelanggan</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kelola daftar pelanggan Payonitip</p>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Cari nama atau email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-pulse h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div></div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b dark:border-slate-800">
                  <th className="pb-3 font-medium px-2">Nama</th>
                  <th className="pb-3 font-medium px-2">Kontak</th>
                  <th className="pb-3 font-medium px-2 text-center">Total Pesanan</th>
                  <th className="pb-3 font-medium px-2 text-right">Total Belanja</th>
                  <th className="pb-3 font-medium px-2">Bergabung</th>
                  <th className="pb-3 font-medium px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="border-b dark:border-slate-800/50 last:border-0 text-sm">
                    <td className="py-4 px-2">
                      <div className="font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{c.name}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-[#1A1C1E] dark:text-slate-300">{c.email}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{c.phone}</div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-8 h-8 rounded-full font-medium">
                        {c.totalOrders}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">
                      {formatRupiah(c.totalSpent)}
                    </td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400">
                      {c.joinDate}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                        <MoreHorizontal size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                Pelanggan tidak ditemukan.
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
