'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { getVouchers, createVoucher } from '@/lib/supabase/api';

const initialVouchers = [
  { id: 1, code: 'PAYONITIP20', type: 'Persentase', value: 20, minPurchase: 100000, maxDiscount: 25000, usage: '45/100', status: 'Aktif', validUntil: '31 Des 2023' },
];

export default function PromoPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'Persentase',
    discount_value: '',
    min_purchase: '',
    max_discount: '',
    usage_limit: '',
    valid_until: '',
    status: 'Aktif'
  });

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await getVouchers();
      if (data && data.length > 0) {
        setVouchers(data.map((v: any) => ({
          ...v,
          type: v.discount_type === 'percentage' ? 'Persentase' : 'Nominal',
          value: v.discount_value,
          minPurchase: v.min_purchase,
          maxDiscount: v.max_discount,
          usage: `${v.usage_count}/${v.max_usage}`,
          status: v.is_active ? 'Aktif' : 'Nonaktif',
          validUntil: v.expires_at ? new Date(v.expires_at).toLocaleDateString() : '-',
        })));
      } else {
        setVouchers([]);
      }
    } catch {
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleSave = async () => {
    try {
      await createVoucher({
        code: formData.code,
        discount_type: formData.discount_type as 'percentage' | 'fixed',
        discount_value: Number(formData.discount_value),
        min_purchase: Number(formData.min_purchase),
        max_discount: Number(formData.max_discount),
        max_usage: Number(formData.usage_limit),
        expires_at: formData.valid_until ? new Date(formData.valid_until).toISOString() : undefined,
        is_active: formData.status === 'active'
      });
      setIsDialogOpen(false);
      fetchVouchers();
    } catch (e) {
      console.error(e);
      setIsDialogOpen(false);
    }
  };

  const filteredVouchers = vouchers.filter(v => 
    v.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#fde8ff] text-[#e06ee0] dark:bg-amber-900/30 dark:text-[#f5b0fb] rounded-lg">
            <Tag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Kelola Promo</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Atur voucher dan diskon untuk pelanggan</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ef85f8] hover:bg-[#004A8B] text-white">
              <Plus className="mr-2" size={16} /> Buat Voucher Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0F172A]">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#1A1C1E] dark:text-[#F1F5F9]">Buat Voucher Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kode Voucher</label>
                <Input placeholder="Contoh: PAYONITIP20" className="uppercase" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipe Diskon</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input type="radio" name="discountType" value="Persentase" checked={formData.discount_type === 'Persentase'} onChange={e => setFormData({...formData, discount_type: 'Persentase'})} className="text-[#ef85f8]" />
                    Persentase (%)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input type="radio" name="discountType" value="Nominal" checked={formData.discount_type === 'Nominal'} onChange={e => setFormData({...formData, discount_type: 'Nominal'})} className="text-[#ef85f8]" />
                    Nominal (Rp)
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nilai Diskon</label>
                  <Input type="number" placeholder="20" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Maksimal Diskon (Rp)</label>
                  <Input type="number" placeholder="25000" value={formData.max_discount} onChange={e => setFormData({...formData, max_discount: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Minimal Pembelian (Rp)</label>
                <Input type="number" placeholder="100000" value={formData.min_purchase} onChange={e => setFormData({...formData, min_purchase: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Batas Penggunaan</label>
                  <Input type="number" placeholder="100" value={formData.usage_limit} onChange={e => setFormData({...formData, usage_limit: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Berakhir</label>
                  <Input type="date" value={formData.valid_until} onChange={e => setFormData({...formData, valid_until: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="promo-status" className="rounded text-[#ef85f8] focus:ring-[#ef85f8]" checked={formData.status === 'Aktif'} onChange={e => setFormData({...formData, status: e.target.checked ? 'Aktif' : 'Nonaktif'})} />
                <label htmlFor="promo-status" className="text-sm text-slate-700 dark:text-slate-300">Aktifkan Voucher</label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button className="bg-[#ef85f8] hover:bg-[#004A8B] text-white" onClick={handleSave}>Simpan Voucher</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Cari kode voucher..." 
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
                  <th className="pb-3 font-medium px-2">Kode Voucher</th>
                  <th className="pb-3 font-medium px-2">Diskon</th>
                  <th className="pb-3 font-medium px-2">Min. Pembelian</th>
                  <th className="pb-3 font-medium px-2">Penggunaan</th>
                  <th className="pb-3 font-medium px-2">Status</th>
                  <th className="pb-3 font-medium px-2">Berlaku Hingga</th>
                  <th className="pb-3 font-medium px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.map((v) => (
                  <tr key={v.id} className="border-b dark:border-slate-800/50 last:border-0 text-sm">
                    <td className="py-4 px-2">
                      <div className="font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">{v.code}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-medium text-[#ef85f8] dark:text-[#f5b0fb]">
                        {v.type === 'Persentase' ? `${v.value}%` : formatRupiah(v.value)}
                      </div>
                      {v.type === 'Persentase' && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">Maks. {formatRupiah(v.maxDiscount)}</div>
                      )}
                    </td>
                    <td className="py-4 px-2 text-[#1A1C1E] dark:text-slate-300">
                      {formatRupiah(v.minPurchase)}
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-slate-600 dark:text-slate-400">{v.usage}</div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant={v.status === 'Aktif' ? 'default' : 'secondary'} className={v.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400">
                      {v.validUntil}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVouchers.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                Voucher tidak ditemukan.
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
