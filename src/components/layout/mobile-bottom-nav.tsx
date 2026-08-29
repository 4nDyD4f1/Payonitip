'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  
  // Mock cart count
  const cartCount = 0;

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Katalog', href: '/katalog' },
    { icon: ShoppingCart, label: 'Keranjang', href: '/keranjang', badge: cartCount },
    { icon: User, label: 'Akun', href: '/profil' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]"
            >
              <div className="relative">
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-[#ef85f8] dark:text-[#f5b0fb] fill-current/20' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-[#6dadff] dark:bg-[#a3ccff] rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#ef85f8] dark:text-[#f5b0fb]' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
