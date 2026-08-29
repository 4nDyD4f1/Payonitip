import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CustomJastipCta() {
  return (
    <div className="mt-12 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 md:p-10 dark:from-[#ef85f8]/10 dark:to-[#6dadff]/10">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex-1 space-y-4">
          <Badge className="bg-[#6dadff]/10 text-[#6dadff] hover:bg-[#6dadff]/20 dark:bg-[#a3ccff]/20 dark:text-[#a3ccff] dark:hover:bg-[#a3ccff]/30 border-none">
            Fitur Spesial
          </Badge>
          <h2 className="font-montserrat text-2xl font-bold md:text-3xl text-[#1A1C1E] dark:text-[#F1F5F9]">
            Tidak Menemukan yang Kamu Cari?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-lg">
            Gunakan fitur Titip Buat Aku untuk request pempek custom sesuai keinginanmu! Kami siap mencarikan pempek favorit langsung dari Palembang.
          </p>
          <Button asChild className="mt-2 bg-[#6dadff] hover:bg-[#6dadff]/90 text-white dark:bg-[#a3ccff] dark:text-slate-900 dark:hover:bg-[#a3ccff]/90 rounded-full px-6">
            <Link href="/titip">
              Request Titipan Khusus
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center justify-center text-7xl md:text-8xl space-x-2 md:space-x-4">
          <span className="drop-shadow-lg">🛒</span>
          <span className="drop-shadow-lg -translate-y-4">🌉</span>
          <span className="drop-shadow-lg">🐟</span>
        </div>
      </div>
    </div>
  );
}
