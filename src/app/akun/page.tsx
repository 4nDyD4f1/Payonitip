'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getProfile, updateProfile } from '@/lib/supabase/api';
import { useAuth } from '@/hooks/use-auth';

const SAMPLE_PROFILE = { full_name: 'Andy Dwi Putra', email: 'andy@email.com', phone: '081234567890', address: 'Jl. Pajajaran No. 15, Bogor Tengah, Kota Bogor', avatar_url: '', role: 'user' };

export default function ProfilPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const profile = await getProfile(user.id);
          if (profile) {
            setFormData({
              name: profile.full_name || '',
              email: profile.email || user.email || '',
              phone: profile.phone || '',
              address: profile.address || ''
            });
          } else {
            setFormData({
              name: SAMPLE_PROFILE.full_name,
              email: user.email || SAMPLE_PROFILE.email,
              phone: SAMPLE_PROFILE.phone,
              address: SAMPLE_PROFILE.address
            });
          }
        } else {
          router.push('/login');
          setFormData({
            name: SAMPLE_PROFILE.full_name,
            email: SAMPLE_PROFILE.email,
            phone: SAMPLE_PROFILE.phone,
            address: SAMPLE_PROFILE.address
          });
        }
      } catch {
        setFormData({
          name: SAMPLE_PROFILE.full_name,
          email: SAMPLE_PROFILE.email,
          phone: SAMPLE_PROFILE.phone,
          address: SAMPLE_PROFILE.address
        });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router, supabase.auth]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (user) {
        await updateProfile(user.id, {
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address
        });
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#ef85f8]" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in fade-in slide-in-from-top-5">
          <CheckCircle className="w-5 h-5" />
          <span>Perubahan berhasil disimpan!</span>
        </div>
      )}

      <h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-slate-50 md:hidden mb-4">
        Profil
      </h2>

      <Card className="border-none shadow-md bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>Ubah detail informasi akun kamu di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl overflow-hidden">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {formData.name.substring(0, 2).toUpperCase() || 'AD'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-sm text-[#ef85f8] dark:text-[#f5b0fb] font-medium cursor-pointer hover:underline">
                Ubah Foto
              </span>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    disabled 
                    className="bg-slate-50 dark:bg-slate-800/50" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor HP</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Pengiriman</Label>
                <Textarea 
                  id="address" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="resize-none h-24"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-[#ef85f8] hover:bg-[#004f91] dark:bg-[#f5b0fb] dark:hover:bg-[#5a99ee] text-white"
                disabled={isSaving}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Keamanan Akun</CardTitle>
          <CardDescription>Kelola password dan keamanan akun kamu.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordForm(true)}
              className="border-slate-200 dark:border-slate-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Ubah Password
            </Button>
          ) : (
            <form className="space-y-4 max-w-md animate-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label htmlFor="old-pw">Password Saat Ini</Label>
                <Input id="old-pw" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pw">Password Baru</Label>
                <Input id="new-pw" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pw">Konfirmasi Password Baru</Label>
                <Input id="confirm-pw" type="password" />
              </div>
              <div className="flex space-x-2 pt-2">
                <Button type="button" className="bg-[#ef85f8] hover:bg-[#004f91] dark:bg-[#f5b0fb] dark:hover:bg-[#5a99ee] text-white">
                  Update Password
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowPasswordForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
