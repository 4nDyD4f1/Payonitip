'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, Star, ShoppingBag, Loader2 } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import { useCartStore } from '@/hooks/use-cart';
import { createClient } from '@/lib/supabase/client';
import { getUserFavorites, toggleFavorite } from '@/lib/supabase/api';

const SAMPLE_FAVORITES = [
  {
    id: 'prod-1',
    name: 'Pempek Kapal Selam',
    price: 35000,
    rating: 4.8,
    imageColor: 'from-blue-400 to-blue-600',
  },
  {
    id: 'prod-2',
    name: 'Paket Campur A',
    price: 150000,
    rating: 4.9,
    imageColor: 'from-purple-400 to-purple-600',
  },
  {
    id: 'prod-3',
    name: 'Tekwan Kuah Udang',
    price: 45000,
    rating: 4.7,
    imageColor: 'from-emerald-400 to-emerald-600',
  }
];

export default function FavoritPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const fetchedFavs = await getUserFavorites(user.id);
          if (fetchedFavs && fetchedFavs.length > 0) {
            setFavorites(fetchedFavs.map((f: any) => f.product || f));
          } else {
            setFavorites(SAMPLE_FAVORITES);
          }
        } else {
          router.push('/login');
          setFavorites(SAMPLE_FAVORITES);
        }
      } catch (error) {
        setFavorites(SAMPLE_FAVORITES);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [router, supabase.auth]);

  const handleRemoveFavorite = async (productId: string) => {
    if (user) {
      await toggleFavorite(user.id, productId);
    }
    setFavorites(favorites.filter(fav => fav.id !== productId));
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: '' 
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#ef85f8]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-slate-50 mb-6">
        Produk Favorit
      </h2>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900 overflow-hidden group">
              <div className="relative">
                <div className={cn("w-full h-40 bg-gradient-to-br flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity", product.imageColor || 'from-slate-400 to-slate-600')}>
                  <div className="w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm" />
                </div>
                <button 
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1 truncate">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{product.rating || 5.0}</span>
                </div>
                <div className="font-bold text-[#ef85f8] dark:text-[#f5b0fb]">
                  {formatRupiah(product.price)}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-900"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  + Keranjang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
            Belum ada produk favorit
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Temukan pempek favoritmu dan simpan di sini agar mudah dicari nanti.
          </p>
          <Link href="/">
            <Button className="bg-[#ef85f8] hover:bg-[#004f91] dark:bg-[#f5b0fb] dark:hover:bg-[#5a99ee] text-white">
              Jelajahi Katalog
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
