"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Plus } from "lucide-react";
import { getBestSellers } from "@/lib/supabase/api";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBestSellers(4);
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(MOCK_PRODUCTS.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
        setProducts(MOCK_PRODUCTS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="py-16 bg-[#F9F9FC] dark:bg-[#020617]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9] mb-4">
            Produk Terlaris 🔥
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Pilihan favorit pelanggan Payonitip. Dibuat dengan ikan tenggiri asli dan bahan berkualitas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 w-full animate-pulse rounded-[16px] bg-slate-200 dark:bg-slate-800" />
            ))
          ) : (
            products.map((product) => {
              const imageSrc = product.image || product.image_url;
              return (
                <Link key={product.id} href={`/katalog/${product.slug}`} className="group">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-[#0F172A] border-none shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] rounded-[16px]">
                    <div className="aspect-square w-full bg-gradient-to-br from-[#fde8ff] to-[#e8f1ff] dark:from-slate-800 dark:to-slate-700 relative flex items-center justify-center overflow-hidden">
                      {imageSrc ? (
                        <img src={imageSrc} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Gambar {product.name}</span>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-[#f5b0fb] text-[#f5b0fb]" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {product.rating || 4.9}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1A1C1E] dark:text-[#F1F5F9] mb-1 group-hover:text-[#ef85f8] dark:group-hover:text-[#f5b0fb] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {product.description || product.desc}
                      </p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex items-center justify-between">
                      <span className="font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">
                        {formatRupiah(product.price)}
                      </span>
                      <Button size="icon" className="rounded-full bg-[#6dadff] hover:bg-[#7a2e8f] dark:bg-[#a3ccff] dark:hover:bg-[#d671ec] text-white dark:text-slate-900 w-10 h-10 shadow-md">
                        <Plus className="w-5 h-5" />
                        <span className="sr-only">Tambah ke keranjang</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
