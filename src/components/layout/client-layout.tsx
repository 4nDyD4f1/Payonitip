'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { MobileBottomNav } from './mobile-bottom-nav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/register');
  
  return (
    <div className="flex min-h-screen flex-col">
      {!isExcluded && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isExcluded && <Footer />}
      {!isExcluded && <MobileBottomNav />}
    </div>
  );
}
