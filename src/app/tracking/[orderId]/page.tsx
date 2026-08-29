'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TrackingStepper, TrackingStep } from '@/components/tracking/tracking-stepper';
import { formatRupiah } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { getOrderByOrderId, getOrderTracking, subscribeToOrderUpdates } from '@/lib/supabase/api';

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackingStep[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('pesanan_dibuat');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function fetchOrderData() {
      setLoading(true);
      try {
        const orderData = await getOrderByOrderId(orderId);
        
        if (orderData) {
          // Map to match UI shape
          const uiOrder = {
            ...orderData,
            id: orderData.id,
            shippingCost: orderData.shipping_cost
          };
          setOrder(uiOrder);
          setCurrentStatus(orderData.status || 'pesanan_dibuat');
          
          // Fetch tracking
          const tracking = await getOrderTracking(orderData.id);
          if (tracking && tracking.length > 0) {
            setTrackingHistory(tracking);
          } else {
            // Initial tracking entry if none in DB for some reason
            setTrackingHistory([{
              status: orderData.status || 'pesanan_dibuat',
              description: 'Pesanan telah dibuat',
              created_at: orderData.created_at
            }]);
          }
          
          // Subscribe to real-time updates
          const subscription = subscribeToOrderUpdates(orderData.id, (payload: any) => {
            if (payload.eventType === 'INSERT') {
              const newEntry = payload.new as TrackingStep;
              setTrackingHistory(prev => [...prev, newEntry]);
              setCurrentStatus(newEntry.status);
            }
          });
          
          unsubscribe = () => {
            subscription.unsubscribe();
          };
        } else {
          // Fallback to localStorage
          loadFallbackData();
        }
      } catch (error) {
        console.error('Error fetching order tracking:', error);
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    }

    function loadFallbackData() {
      const savedData = localStorage.getItem(`order_${orderId}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setOrder(parsedData);
        
        // Mock status mapping for fallback
        const mockStatus = parsedData.status === 'paid' ? 'diproses' : 'pesanan_dibuat';
        setCurrentStatus(mockStatus);
        
        const history: TrackingStep[] = [
          { status: 'pesanan_dibuat', description: 'Pesanan telah kami terima dan menunggu pembayaran.', created_at: new Date(Date.now() - 86400000).toISOString() },
        ];
        
        if (mockStatus !== 'pesanan_dibuat') {
          history.push({ status: 'diproses', description: 'Pembayaran berhasil. Pesanan sedang disiapkan.', created_at: new Date(Date.now() - 3600000).toISOString() });
        }
        setTrackingHistory(history);
      } else {
        // Ultimate fallback demo data
        setOrder({
          id: orderId,
          status: 'diproses',
          total: 150000,
          subtotal: 135000,
          shippingCost: 15000,
          items: [
            { id: '1', name: 'Pempek Kapal Selam', price: 25000, quantity: 2 },
            { id: '2', name: 'Pempek Lenjer', price: 15000, quantity: 4 }
          ]
        });
        setCurrentStatus('diproses');
        setTrackingHistory([
          { status: 'pesanan_dibuat', description: 'Pesanan telah kami terima dan menunggu pembayaran.', created_at: new Date(Date.now() - 86400000).toISOString() },
          { status: 'diproses', description: 'Pembayaran berhasil. Pesanan sedang disiapkan.', created_at: new Date(Date.now() - 3600000).toISOString() }
        ]);
      }
    }

    if (orderId) {
      fetchOrderData();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [orderId]);

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#020617]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef85f8]"></div>
      </div>
    );
  }

  // Calculate est arrival
  const estArrivalDate = new Date();
  if (order.created_at) {
    estArrivalDate.setTime(new Date(order.created_at).getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days
  } else {
    estArrivalDate.setTime(Date.now() + 86400000);
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#020617] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-montserrat text-text dark:text-slate-100">Lacak Pesanan {orderId}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Estimasi tiba: {estArrivalDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="inline-flex px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#ef85f8] dark:text-[#f5b0fb] rounded-full text-sm font-semibold border border-blue-100 dark:border-blue-800">
            Status: {currentStatus.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TrackingStepper currentStatus={currentStatus} trackingHistory={trackingHistory} />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)]">
              <h2 className="text-xl font-bold font-montserrat text-text dark:text-slate-100 mb-6">Detail Pesanan</h2>
              
              <div className="space-y-4 mb-6">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shrink-0 border border-slate-200 dark:border-slate-700" />
                    <div>
                      <p className="font-medium text-sm text-text dark:text-slate-200">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm border-t border-slate-100 dark:border-slate-800 pt-4 mb-4">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatRupiah(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(order.shippingCost || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-text dark:text-slate-100 pt-2 border-t border-slate-50 dark:border-slate-800/50 mt-2">
                  <span>Total</span>
                  <span className="text-[#ef85f8] dark:text-[#f5b0fb]">{formatRupiah(order.total || 0)}</span>
                </div>
              </div>
            </div>

            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
