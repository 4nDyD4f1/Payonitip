"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function PromoBanner() {
  const { toast } = useToast();

  const handleClaim = () => {
    navigator.clipboard.writeText("BOGORSEGAR");
    toast({
      title: "Berhasil diklaim!",
      description: "Kode promo BOGORSEGAR telah disalin. Gunakan saat checkout!",
      type: "success"
    });
  };

  return (
    <section className="py-16 bg-white dark:bg-[#0F172A]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[24px] bg-[#004A8B] dark:from-[#0f3d6b] dark:to-[#09223e] shadow-xl p-8 md:p-12 lg:p-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-[#fde8ff] text-[#ef85f8] font-bold text-sm mb-4">
              Promo Terbatas
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Diskon Ongkir 50%
            </h2>
            <p className="text-white/90 text-lg md:text-xl">
              Gunakan kode <strong className="bg-white/20 px-2 py-1 rounded font-mono">BOGORSEGAR</strong> untuk diskon ongkir hingga Rp 25.000.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Button 
              size="lg" 
              className="bg-white hover:bg-slate-100 text-[#004A8B] rounded-full font-bold px-8 text-lg w-full sm:w-auto shadow-lg"
              onClick={handleClaim}
            >
              Klaim Promo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
