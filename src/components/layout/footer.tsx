'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Payonitip"
                width={120}
                height={40}
                style={{ width: "auto" }} className="h-10 object-contain"
              />
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Platform jastip kuliner pempek Palembang terpercaya. Nikmati cita rasa asli Palembang langsung di depan pintu Anda.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">Navigasi</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]">Beranda</Link></li>
              <li><Link href="/katalog" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]">Katalog</Link></li>
              <li><Link href="/tentang" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">Layanan</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/faq" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]">Bantuan & FAQ</Link></li>
              <li><Link href="/syarat" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]">Syarat & Ketentuan</Link></li>
              <li><Link href="/privasi" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]">Kebijakan Privasi</Link></li>
              <li><Link href="/retur" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#ef85f8] dark:hover:text-[#f5b0fb]">Kebijakan Retur</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">Kontak</h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li>WhatsApp: +62 812-3456-7890</li>
              <li>Email: halo@payonitip.com</li>
              <li>Jam Operasional:<br />Senin - Sabtu: 08:00 - 17:00</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-500">
          <p>Copyright © {new Date().getFullYear()} Payonitip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
