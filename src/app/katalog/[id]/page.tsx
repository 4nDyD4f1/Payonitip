'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { Star, Heart, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatRupiah } from '@/lib/utils';
import { useCartStore } from '@/hooks/use-cart';
import { ProductCard, Product } from '@/components/catalog/product-card';
import { getProductBySlug, getProducts, getProductReviews } from '@/lib/supabase/api';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

const SAMPLE_PRODUCTS: Product[] = MOCK_PRODUCTS as any;

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const productData = await getProductBySlug(resolvedParams.id);
        
        if (productData) {
          setProduct(productData as any);
          
          // Fetch related and reviews in parallel
          const [relatedData, reviewsData] = await Promise.all([
            getProducts(), // Could optimize this with getProductsByCategory but using simple getProducts for now
            getProductReviews(productData.id)
          ]);

          if (relatedData) {
            const filteredRelated = relatedData
              .filter(p => p.id !== productData.id && p.categories?.slug === productData.categories?.slug)
              .slice(0, 4);
            setRelatedProducts(filteredRelated.length > 0 ? filteredRelated as any : SAMPLE_PRODUCTS.slice(0, 4));
          }
          if (reviewsData) {
            setReviews(reviewsData);
          }
        } else {
          // Fallback
          const fallbackProduct = SAMPLE_PRODUCTS.find(p => p.slug === resolvedParams.id);
          setProduct(fallbackProduct || null);
          setRelatedProducts(SAMPLE_PRODUCTS.filter(p => p.id !== fallbackProduct?.id).slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        const fallbackProduct = SAMPLE_PRODUCTS.find(p => p.slug === resolvedParams.id);
        setProduct(fallbackProduct || null);
        setRelatedProducts(SAMPLE_PRODUCTS.filter(p => p.id !== fallbackProduct?.id).slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
            <div className="space-y-4">
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-10 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
        <Button asChild><Link href="/katalog">Kembali ke Katalog</Link></Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
  };

  const categoryName = product.categories?.name || product.category || 'Uncategorized';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/katalog" className="inline-flex items-center text-sm text-slate-500 hover:text-[#ef85f8] mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Section */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#e8f1ff] to-red-100 dark:from-orange-900/40 dark:to-red-900/40 relative flex items-center justify-center">
          {(product.image || product.image_url) ? (
            <img src={product.image || product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6">
              <span className="text-2xl font-bold text-orange-800/20 dark:text-orange-200/20 uppercase tracking-wider block mb-2">{product.name}</span>
              <span className="text-sm text-orange-800/50 dark:text-orange-200/50 font-medium">Image coming soon</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <Badge className="w-fit mb-4 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">{categoryName}</Badge>
          
          <h1 className="font-montserrat text-3xl md:text-4xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9] mb-2">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#f5b0fb] text-[#f5b0fb]" />
              <span className="font-medium text-slate-700 dark:text-slate-300">{product.rating || '4.9'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <span className="text-slate-500 dark:text-slate-400">{product.total_orders || 0} terjual</span>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <span className="text-slate-500 dark:text-slate-400">Berat: {product.weight || 'N/A'}</span>
          </div>

          <div className="text-3xl font-bold text-[#ef85f8] dark:text-[#f5b0fb] mb-6">
            {formatRupiah(product.price)}
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-slate-700 dark:text-slate-300">Kuantitas:</span>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-900 p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-slate-500">Stok: {('stock' in product) ? (product as any).stock : 50}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button 
              className="flex-1 bg-[#ef85f8] hover:bg-[#ef85f8]/90 dark:bg-[#f5b0fb] dark:text-slate-900 dark:hover:bg-[#f5b0fb]/90 h-12 rounded-full text-base font-semibold"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Tambah ke Keranjang
            </Button>
            <Button 
              variant="outline"
              className={cn(
                "h-12 w-full sm:w-12 rounded-full border-2",
                isFavorite 
                  ? "border-[#6dadff] bg-[#6dadff]/5 dark:border-[#a3ccff] dark:bg-[#a3ccff]/10 text-[#6dadff] dark:text-[#a3ccff]" 
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              <span className="sm:hidden ml-2">Tambah ke Favorit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-montserrat text-2xl font-bold mb-6 text-[#1A1C1E] dark:text-[#F1F5F9]">
            Produk Lainnya
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
