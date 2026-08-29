'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Search, Filter } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { getAllOrders, updateOrderStatus, addTrackingEntry } from '@/lib/supabase/api';

const initialOrders = [
  { id: '#PYN-00092', name: 'Budi Santoso', phone: '081234567890', address: 'Jl. Sudirman No. 123, Jakarta Selatan', items: [{name: 'Pempek Kapal Selam', qty: 10, price: 25000}, {name: 'Kerupuk Kemplang', qty: 2, price: 47500}], total: 345000, status: 'Diproses', date: '28 Okt 2023, 14:30' },
  { id: '#PYN-00091', name: 'Siti Aminah', phone: '085678901234', address: 'Komp. Mawar Indah Blok B/4, Bandung', items: [{name: 'Pempek Lenjer', qty: 5, price: 20000}], total: 130000, status: 'Dikirim', date: '28 Okt 2023, 10:15' },
];

const tabs = ['Semua', 'Diproses', 'Dikemas', 'Dikirim', 'Selesai'];

export default function PesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      if (data && data.length > 0) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status) return;
    
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      await addTrackingEntry(selectedOrder.id, newStatus, `Status pesanan diupdate ke ${newStatus}`);
      setSelectedOrder({...selectedOrder, status: newStatus});
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'Semua' || o.status === activeTab;
    const nameMatch = (o.name || o.customer_name || '').toLowerCase().includes(search.toLowerCase());
    const idMatch = (o.id || o.order_id || '').toString().toLowerCase().includes(search.toLowerCase());
    return matchesTab && (nameMatch || idMatch);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Diproses': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Dikemas': return 'bg-[#fde8ff] text-[#c45cc4] dark:bg-amber-900/30 dark:text-[#f5b0fb]';
      case 'Dikirim': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Selesai': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-[#ef85f8] dark:bg-blue-900/30 dark:text-[#f5b0fb] rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Kelola Pesanan</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pantau dan proses pesanan pelanggan</p>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
        <CardContent className="p-0">
          <div className="border-b dark:border-slate-800 px-6 pt-4 flex overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab 
                    ? 'text-[#ef85f8] dark:text-[#f5b0fb]' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ef85f8] dark:bg-[#f5b0fb]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  className="pl-10" 
                  placeholder="Cari Order ID atau nama..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter size={16} /> Filter
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><div className="animate-pulse h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div></div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b dark:border-slate-800">
                    <th className="pb-3 font-medium px-2">Order ID</th>
                    <th className="pb-3 font-medium px-2">Tanggal</th>
                    <th className="pb-3 font-medium px-2">Pelanggan</th>
                    <th className="pb-3 font-medium px-2">Total</th>
                    <th className="pb-3 font-medium px-2">Status</th>
                    <th className="pb-3 font-medium px-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="border-b dark:border-slate-800/50 last:border-0 text-sm">
                      <td className="py-4 px-2 font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{o.id || o.order_id}</td>
                      <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{o.date || new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-2 text-[#1A1C1E] dark:text-slate-300">
                        {o.name || o.customer_name}
                        <div className="text-xs text-slate-500">{o.items?.length || 0} items</div>
                      </td>
                      <td className="py-4 px-2 font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{formatRupiah(o.total)}</td>
                      <td className="py-4 px-2">
                        <Badge variant="secondary" className={`rounded-full ${getStatusColor(o.status)}`}>
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#ef85f8] dark:text-[#f5b0fb] hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => { setSelectedOrder(o); setNewStatus(o.status); }}
                        >
                          <Eye size={16} className="mr-1" /> Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  Pesanan tidak ditemukan.
                </div>
              )}
            </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#0F172A] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center pr-6">
                  <DialogTitle className="text-xl text-[#1A1C1E] dark:text-[#F1F5F9]">
                    Detail Pesanan {selectedOrder.id || selectedOrder.order_id}
                  </DialogTitle>
                  <Badge variant="secondary" className={`rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tanggal Pesanan</p>
                    <p className="text-sm font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{selectedOrder.date || (selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pembayaran</p>
                    <p className="text-sm font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{formatRupiah(selectedOrder.total)}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-semibold text-[#1A1C1E] dark:text-[#F1F5F9]">Informasi Pelanggan</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-500 dark:text-slate-400 inline-block w-20">Nama:</span> {selectedOrder.name || selectedOrder.customer_name}</p>
                    <p><span className="text-slate-500 dark:text-slate-400 inline-block w-20">No. HP:</span> {selectedOrder.phone || '-'}</p>
                    <p className="flex"><span className="text-slate-500 dark:text-slate-400 inline-block w-20 shrink-0">Alamat:</span> <span>{selectedOrder.address || '-'}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#1A1C1E] dark:text-[#F1F5F9] mb-3">Daftar Produk</h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex gap-2">
                          <span className="font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{item.quantity || item.qty}x</span>
                          <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{formatRupiah(item.price * (item.quantity || item.qty))}</span>
                      </div>
                    ))}
                  </div>

                  {selectedOrder.payment_proof && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Bukti Pembayaran</p>
                      <a href={selectedOrder.payment_proof} target="_blank" rel="noopener noreferrer" className="block max-w-[200px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:opacity-90">
                        <img src={selectedOrder.payment_proof} alt="Bukti Pembayaran" className="w-full h-auto object-cover" />
                      </a>
                    </div>
                  )}

                  {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                    <div className="text-sm text-slate-500">Tidak ada detail produk</div>
                  )}
                  <div className="border-t dark:border-slate-800 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">Total</span>
                    <span className="font-bold text-[#1A1C1E] dark:text-[#F1F5F9] text-lg">{formatRupiah(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="border-t dark:border-slate-800 pt-4 space-y-4">
                  <h3 className="text-sm font-semibold text-[#1A1C1E] dark:text-[#F1F5F9]">Update Status Pesanan</h3>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ef85f8] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Diproses">Diproses</option>
                      <option value="Dikemas">Dikemas</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                    <Button className="bg-[#ef85f8] hover:bg-[#004A8B] text-white" onClick={handleUpdateStatus}>Update</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
