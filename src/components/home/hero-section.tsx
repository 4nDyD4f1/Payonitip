"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#ef85f8] via-[#c76de8] to-[#6dadff] dark:from-[#a33daf] dark:via-[#7b3d9e] dark:to-[#4a8ad4] py-20 lg:py-32">
      {/* Decorative blurred circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#ef85f8]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6dadff]/30 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-3xl mx-auto lg:mx-0">
          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-1000 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-lg">
            Titip Pempek Asli Palembang, Sampai di Bogor dengan Segar
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
            Layanan jastip terpercaya untuk mengobati rindu cita rasa otentik Palembang tanpa perlu ribet.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="bg-white text-[#ef85f8] hover:bg-white/90 rounded-full font-semibold px-8 shadow-lg" asChild>
              <Link href="/katalog">Pesan Sekarang</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#ef85f8] rounded-full font-semibold px-8" asChild>
              <Link href="/katalog">Lihat Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
