"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Annisa R.",
    location: "Bogor Tengah",
    quote: "Pempeknya enak banget, berasa kayak makan langsung di Palembang! Pengiriman juga cepat.",
    initials: "AR",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
  },
  {
    id: 2,
    name: "Budi Santoso",
    location: "Sentul",
    quote: "Sudah langganan Payonitip dari awal. Kualitas konsisten, pelayanan ramah.",
    initials: "BS",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
  },
  {
    id: 3,
    name: "Citra W.",
    location: "Cibinong",
    quote: "Paket hemat keluarganya worth it banget! Anak-anak suka semua.",
    initials: "CW",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-[#F9F9FC] dark:bg-[#020617]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9] mb-4">
            Testimoni Pelanggan ⭐
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Apa kata mereka yang sudah mencoba layanan jastip pempek Payonitip?
          </p>
        </div>
        
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 gap-6">
          {TESTIMONIALS.map((testi) => (
            <Card key={testi.id} className="min-w-[300px] w-full snap-center bg-white dark:bg-[#0F172A] border-none shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] rounded-[16px]">
              <CardContent className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#f5b0fb] text-[#f5b0fb]" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic mb-6 grow">
                  &quot;{testi.quote}&quot;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${testi.color}`}>
                    {testi.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">{testi.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{testi.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
