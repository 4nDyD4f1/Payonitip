'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/hooks/use-cart';
import { DeliveryForm } from '@/components/checkout/delivery-form';
import { ShippingSelector } from '@/components/checkout/shipping-selector';
import { PaymentSelector } from '@/components/checkout/payment-selector';
import { OrderSummary } from '@/components/checkout/order-summary';
import { generateOrderId } from '@/lib/utils';
import { createOrder, addTrackingEntry } from '@/lib/supabase/api';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  
  const [delivery, setDelivery] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [shippingMethod, setShippingMethod] = useState('regular');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  
  useEffect(() => {
    if (items.length === 0) {
      router.push('/keranjang');
    }
  }, [items, router]);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
        
        // Optionally fetch profile info for delivery form defaults
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profile) {
          setDelivery(prev => ({
            ...prev,
            name: profile.full_name || '',
            phone: profile.phone || '',
            address: profile.address || ''
          }));
        }
      }
    }
    checkUser();
  }, []);

  const handleDeliveryChange = (field: string, value: string) => {
    setDelivery(prev => ({ ...prev, [field]: value }));
  };

  const subtotal = getTotal();
  const shippingCost = shippingMethod === 'sameday' ? 25000 : 15000;
  const discount = 0; // Or whatever promo applies (ideally would come from cart state)
  const total = subtotal + shippingCost - discount;

  const handleSubmit = async () => {
    if (!delivery.name || !delivery.phone || !delivery.address) {
      alert('Mohon lengkapi data pengiriman');
      return;
    }
    
    setLoading(true);
    
    try {
      const orderId = generateOrderId();
      
      const orderData = {
        order_id: orderId,
        user_id: userId,
        items,
        subtotal,
        shipping_cost: shippingCost,
        discount,
        total,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        customer_name: delivery.name,
        customer_phone: delivery.phone,
        customer_address: delivery.address,
        notes: delivery.notes,
        status: 'pending' // DB defaults to pending, but we can set it
      };
      
      // Try saving to DB
      const result = await createOrder(orderData);
      
      // Local fallback for UI components that rely on local storage (like tracking sample)
      const localData = {
        id: orderId,
        items,
        delivery,
        shippingMethod,
        shippingCost,
        paymentMethod,
        subtotal,
        discount,
        total,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      localStorage.setItem(`order_${orderId}`, JSON.stringify(localData));
      
      if (result) {
        // Add initial tracking entry
        await addTrackingEntry(result.id, 'pesanan_dibuat', 'Pesanan berhasil dibuat');
      }
      
      clearCart();
      router.push(`/pembayaran/${orderId}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background dark:bg-[#020617] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-montserrat text-text dark:text-slate-100">Checkout</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Review pesanan dan selesaikan pembayaran</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DeliveryForm values={delivery} onChange={handleDeliveryChange} />
            <ShippingSelector selected={shippingMethod} onChange={setShippingMethod} />
            <PaymentSelector selected={paymentMethod} onChange={setPaymentMethod} />
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary 
              items={items}
              subtotal={subtotal}
              shipping={shippingCost}
              discount={discount}
              total={total}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
