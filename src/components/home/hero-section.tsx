"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 sm:py-24 lg:py-32 min-h-[520px] flex items-center">
      {/* Background Image of Pempek */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/paket_campur.jpg"
          alt="Pempek Palembang Asli"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Multi-layered dark & brand overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[#ef85f8]/10 mix-blend-overlay" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-3xl mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#f5b0fb] text-sm font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#ef85f8] animate-ping inline-block" />
            <span>Jastip Kuliner Otentik Palembang</span>
          </div>

          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-1000 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            Titip Pempek Asli Palembang, Sampai di Bogor dengan Segar
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 text-lg sm:text-xl text-slate-200 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
            Layanan jastip terpercaya untuk mengobati rindu cita rasa otentik Palembang tanpa perlu ribet.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="bg-[#ef85f8] hover:bg-[#ef85f8]/90 text-white rounded-full font-semibold px-8 shadow-[0_4px_20px_rgba(239,133,248,0.4)] transition-all hover:scale-105" asChild>
              <Link href="/katalog">Pesan Sekarang</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/80 text-white rounded-full font-semibold px-8 transition-all hover:scale-105" asChild>
              <Link href="/katalog">Lihat Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
