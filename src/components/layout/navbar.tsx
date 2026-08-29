'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, Heart, Package, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';
import { useCartStore } from '@/hooks/use-cart';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { items } = useCartStore();
  const [isMounted, setIsMounted] = React.useState(false);
  
  const [user, setUser] = React.useState<any>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const supabase = createClient();
    
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role === 'admin') setIsAdmin(true);
      }
    }
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const cartCount = isMounted ? items.length : 0;
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog', href: '/katalog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Payonitip"
                width={120}
                height={40}
                style={{ width: "auto" }} className="h-10 object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#ef85f8] dark:hover:text-[#f5b0fb] relative ${
                    isActive ? 'text-[#ef85f8] dark:text-[#f5b0fb]' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#ef85f8] dark:bg-[#f5b0fb] rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <Link href="/keranjang" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb] transition-colors hidden sm:block">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#6dadff] dark:bg-[#a3ccff] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ef85f8] text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : user?.email?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <p className="text-sm font-semibold">{user?.user_metadata?.full_name || 'Pengguna'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <Link href="/akun" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <User className="w-4 h-4" /> Profil
                    </Link>
                    <Link href="/akun/pesanan" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Package className="w-4 h-4" /> Pesanan Saya
                    </Link>
                    <Link href="/akun/favorit" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Heart className="w-4 h-4" /> Favorit
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-[#ef85f8] dark:text-[#f5b0fb] hover:bg-slate-50 dark:hover:bg-slate-800">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#ef85f8] hover:bg-[#004a8c] dark:bg-[#ef85f8] dark:hover:bg-[#004a8c] rounded-lg transition-colors">
                Masuk
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg px-4 py-4 z-40">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium p-2 rounded-lg ${
                    isActive ? 'bg-[#ef85f8]/10 text-[#ef85f8] dark:text-[#f5b0fb]' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
            
            {isLoggedIn ? (
              <>
                <Link href="/akun" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300">
                  <User className="w-5 h-5" /> Profil
                </Link>
                <Link href="/akun/pesanan" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300">
                  <Package className="w-5 h-5" /> Pesanan Saya
                </Link>
                <Link href="/akun/favorit" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300">
                  <Heart className="w-5 h-5" /> Favorit
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 p-2 text-[#ef85f8] dark:text-[#f5b0fb]">
                    <LayoutDashboard className="w-5 h-5" /> Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 p-2 text-red-600">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-3 text-white bg-[#ef85f8] rounded-lg">
                Masuk / Daftar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
