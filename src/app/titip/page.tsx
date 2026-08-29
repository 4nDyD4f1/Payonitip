'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Send, Calendar, ArrowLeft, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { createCustomOrder } from '@/lib/supabase/api';

const PEMPEK_BRANDS = [
  'Pempek Candy',
  'Pempek Vico',
  'Pempek Beringin',
  'Pempek Pak Raden',
  'Pempek Nony 168',
  'Pempek Lince',
  'Lainnya (Tulis di request)'
];

const BOGOR_AREAS = [
  'Bogor Tengah',
  'Bogor Timur',
  'Bogor Selatan',
  'Bogor Barat',
  'Bogor Utara',
  'Tanah Sareal',
  'Kabupaten Bogor',
  'Depok',
  'Lainnya'
];

export default function TitipPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brand: '',
    request: '',
    minBudget: '',
    maxBudget: '',
    date: '',
    addressArea: '',
    fullAddress: '',
    notes: ''
  });

  const formatRupiahInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue ? Number(numericValue).toLocaleString('id-ID') : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const minVal = formData.minBudget ? parseInt(formData.minBudget.replace(/\./g, '')) : undefined;
      const maxVal = formData.maxBudget ? parseInt(formData.maxBudget.replace(/\./g, '')) : undefined;
      
      const finalRequestText = `Brand: ${formData.brand || 'Bebas'}
Pesanan: ${formData.request}
Area: ${formData.addressArea}
Alamat Lengkap: ${formData.fullAddress}`;
      
      await createCustomOrder({
        user_id: session?.user?.id || undefined,
        request_text: finalRequestText,
        budget_min: minVal,
        budget_max: maxVal,
        desired_date: formData.date || undefined,
        notes: formData.notes
      });
      
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold font-montserrat text-slate-900 dark:text-slate-50 mb-4">
          Permintaan kamu sudah terkirim! 🥟
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          Admin akan segera merespon dan memberikan estimasi harga. Cek status di halaman akun kamu ya.
        </p>
        <Link href="/">
          <Button className="bg-[#ef85f8] hover:bg-[#004f91] dark:bg-[#f5b0fb] dark:hover:bg-[#5a99ee] text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9] mb-4">
          Request Jastip Spesial
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Gak nemu varian yang kamu mau? Atau ada request khusus? Tulis aja di sini, biar kami yang urus!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#ef85f8]/10 dark:bg-[#f5b0fb]/10 text-[#ef85f8] dark:text-[#f5b0fb] flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Tulis Detail</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tulis permintaan kamu dengan detail sesuai keinginan
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#6dadff]/10 dark:bg-[#a3ccff]/10 text-[#6dadff] dark:text-[#a3ccff] flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Review Admin</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Admin akan review dan kasih estimasi harga
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Deal & Proses</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Setuju? Kami langsung proseskan pesananmu!
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-6">
          <CardTitle className="text-2xl font-montserrat text-slate-900 dark:text-slate-50">Form Request Jastip</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Isi form di bawah ini selengkap-lengkapnya ya kak 🥟
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand Pempek Pilihan</Label>
                <select 
                  id="brand"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                >
                  <option value="" className="bg-white dark:bg-slate-900">-- Bebas (Rekomendasi Admin) --</option>
                  {PEMPEK_BRANDS.map(b => (
                    <option key={b} value={b} className="bg-white dark:bg-slate-900">{b}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressArea">Area Pengiriman <span className="text-red-500">*</span></Label>
                <select 
                  id="addressArea"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.addressArea}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData, 
                      addressArea: val,
                      fullAddress: val ? `Kecamatan ${val}, ` : ''
                    });
                  }}
                  required
                >
                  <option value="" className="bg-white dark:bg-slate-900">-- Pilih Area --</option>
                  {BOGOR_AREAS.map(a => (
                    <option key={a} value={a} className="bg-white dark:bg-slate-900">{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullAddress">Alamat Lengkap Pengiriman <span className="text-red-500">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Textarea
                  id="fullAddress"
                  placeholder="Jalan, RT/RW, Patokan..."
                  className="min-h-[80px] resize-none pl-9"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({...formData, fullAddress: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="request">Permintaan Pesanan <span className="text-red-500">*</span></Label>
              <Textarea
                id="request"
                placeholder="Contoh: Kak, aku mau 2 kapal selam + 3 lenjer + cuko pedas ekstra ya!"
                className="min-h-[100px] resize-none"
                value={formData.request}
                onChange={(e) => setFormData({...formData, request: e.target.value})}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Budget Estimasi (Rp)</Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                    <Input 
                      type="text" 
                      placeholder="Min" 
                      className="pl-9"
                      value={formData.minBudget}
                      onChange={(e) => setFormData({...formData, minBudget: formatRupiahInput(e.target.value)})}
                    />
                  </div>
                  <span className="text-slate-500">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                    <Input 
                      type="text" 
                      placeholder="Max" 
                      className="pl-9"
                      value={formData.maxBudget}
                      onChange={(e) => setFormData({...formData, maxBudget: formatRupiahInput(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Tanggal Diinginkan</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    type="date" 
                    id="date" 
                    className="pl-9"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                placeholder="Ada catatan khusus? (Optional)"
                className="resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-[#ef85f8] hover:bg-[#004f91] dark:bg-[#f5b0fb] dark:hover:bg-[#5a99ee] text-white dark:text-slate-900 rounded-xl transition-all"
              disabled={isSubmitting || !formData.request || !formData.addressArea}
            >
              {isSubmitting ? 'Mengirim...' : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Kirim Permintaan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
