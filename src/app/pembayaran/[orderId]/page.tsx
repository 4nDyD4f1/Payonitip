'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';
import { Copy, Clock, CheckCircle2, ChevronRight, QrCode, Banknote } from 'lucide-react';
import { getOrderByOrderId, confirmPayment } from '@/lib/supabase/api';
import { ImageUpload } from '@/components/ui/image-upload';

export default function PembayaranPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const data = await getOrderByOrderId(orderId);
        if (data) {
          // Adapt to UI expected structure if it differs slightly
          setOrder({
            ...data,
            id: data.id,
            paymentMethod: data.payment_method,
            total: data.total
          });
          if (data.status === 'diproses' || data.payment_confirmed) {
            setIsPaid(true);
          }
        } else {
          // Try localStorage fallback for demo
          const stored = localStorage.getItem(`order_${orderId}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            setOrder(parsed);
            if (parsed.status === 'paid' || parsed.status === 'diproses') {
              setIsPaid(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePaid = async () => {
    if (!proofUrl && order.paymentMethod !== 'cod') {
      alert('Harap unggah bukti pembayaran terlebih dahulu.');
      return;
    }
    
    setConfirming(true);
    try {
      if (order.id) {
        // We have a DB record ID
        await confirmPayment(order.id, proofUrl);
      }
      
      // Update local state and storage
      setIsPaid(true);
      const updatedOrder = { ...order, status: 'paid', payment_proof: proofUrl };
      localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Terjadi kesalahan saat mengkonfirmasi pembayaran.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#020617]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef85f8]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-[#020617]">
        <h2 className="text-xl font-bold mb-4">Pesanan tidak ditemukan</h2>
        <Link href="/" className="px-4 py-2 bg-[#ef85f8] text-white rounded-lg">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#020617] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {isPaid ? (
          <div className="bg-surface dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-2xl font-bold font-montserrat text-text dark:text-slate-100 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Terima kasih, pesanan {orderId} sedang kami proses.</p>
            
            <Link
              href={`/tracking/${orderId}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#ef85f8] hover:bg-[#004A8C] dark:bg-[#f5b0fb] dark:hover:bg-[#4E93ED] text-white dark:text-slate-900 rounded-xl font-medium transition-colors"
            >
              Cek Status Pesanan <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold font-montserrat text-text dark:text-slate-100">Pembayaran Pesanan {orderId}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Selesaikan pembayaran agar pesanan dapat diproses</p>
            </div>

            <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
              {order.paymentMethod !== 'cod' && (
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Batas Waktu Pembayaran</span>
                  <div className="flex items-center gap-2 text-[#6dadff] dark:text-[#a3ccff] font-bold">
                    <Clock className="w-5 h-5" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center justify-center mb-8">
                {order.paymentMethod === 'qris' && (
                  <>
                    <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                      <QrCode className="w-16 h-16 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Scan QR code untuk membayar</p>
                  </>
                )}
                
                {order.paymentMethod === 'transfer' && (
                  <div className="w-full max-w-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Transfer ke Rekening BCA</p>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-2">
                      <span className="font-bold text-lg tracking-wider text-text dark:text-slate-200">123 456 7890</span>
                      <button className="text-[#ef85f8] dark:text-[#f5b0fb] hover:opacity-80 transition-opacity">
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">a.n. Payonitip</p>
                  </div>
                )}
                
                {order.paymentMethod === 'cod' && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Banknote className="w-10 h-10 text-[#ef85f8] dark:text-[#f5b0fb]" />
                    </div>
                    <p className="font-medium text-lg text-slate-700 dark:text-slate-300">Siapkan uang pas saat kurir tiba</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-[#ef85f8] dark:text-[#f5b0fb]">{formatRupiah(order.total)}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Pastikan nominal transfer sesuai hingga 3 digit terakhir</p>
                
                {order.paymentMethod !== 'cod' && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Unggah Bukti Pembayaran</p>
                    <ImageUpload 
                      value={proofUrl} 
                      onChange={setProofUrl} 
                      bucket="payment_proofs"
                    />
                  </div>
                )}
              </div>

              {order.paymentMethod !== 'cod' && (
                <button
                  onClick={handlePaid}
                  disabled={confirming || !proofUrl}
                  className="w-full h-14 bg-[#ef85f8] hover:bg-[#004A8B] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {confirming ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
                  {!confirming && <ChevronRight className="w-5 h-5" />}
                </button>
              )}
              
              {order.paymentMethod === 'cod' && (
                <Link
                  href={`/tracking/${orderId}`}
                  className="flex w-full justify-center py-4 bg-[#ef85f8] hover:bg-[#004A8C] dark:bg-[#f5b0fb] dark:hover:bg-[#4E93ED] text-white dark:text-slate-900 rounded-xl font-bold text-lg transition-colors"
                >
                  Cek Status Pesanan
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
