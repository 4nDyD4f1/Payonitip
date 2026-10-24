'use client';

import { useState, useMemo, useEffect } from 'react';
import { FilterSidebar } from '@/components/catalog/filter-sidebar';
import { SearchBar } from '@/components/catalog/search-bar';
import { ProductGrid } from '@/components/catalog/product-grid';
import { CustomJastipCta } from '@/components/catalog/custom-jastip-cta';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Product } from '@/components/catalog/product-card';
import { getProducts, getCategories } from '@/lib/supabase/api';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';




export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ categories: ['Semua Kategori'], minPrice: '', maxPrice: '' });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Terlaris');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        if (productsData && productsData.length > 0) {
          setProducts(productsData as any);
        } else {
          setProducts(MOCK_PRODUCTS as any);
        }

        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData as any);
        } else {
          setCategories(MOCK_CATEGORIES as any);
        }
      } catch (error) {
        console.error("Failed to fetch catalog data:", error);
        setProducts(MOCK_PRODUCTS as any);
        setCategories(MOCK_CATEGORIES as any);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category (handle both flat category and nested categories.name)
      const catName = product.categories?.name || product.category || '';
      if (!filters.categories.includes('Semua Kategori') && !filters.categories.includes(catName)) {
        return false;
      }
      
      // Price
      if (filters.minPrice && product.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && product.price > parseInt(filters.maxPrice)) return false;
      
      return true;
    }).sort((a, b) => {
      if (sortBy === 'Harga Terendah') return a.price - b.price;
      if (sortBy === 'Harga Tertinggi') return b.price - a.price;
      if (sortBy === 'Rating') return (b.rating || 0) - (a.rating || 0);
      // Default: Terlaris
      return (b.total_orders || 0) - (a.total_orders || 0);
    });
  }, [searchQuery, filters, sortBy, products]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="font-montserrat text-3xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9] mb-8">
        Katalog Pempek
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar 
              bestSellers={[...products].sort((a, b) => (b.total_orders || 0) - (a.total_orders || 0))} 
              categories={categories}
              onFilterChange={setFilters} 
            />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/50 lg:hidden">
            <div className="ml-auto w-[300px] h-full bg-white dark:bg-slate-900 p-4 shadow-xl overflow-y-auto">
              <FilterSidebar 
                isMobileDrawer 
                onClose={() => setIsMobileFilterOpen(false)}
                bestSellers={[...products].sort((a, b) => (b.total_orders || 0) - (a.total_orders || 0))} 
                categories={categories}
                onFilterChange={setFilters} 
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            
            <div className="flex w-full sm:w-auto gap-2">
              <Button 
                variant="outline" 
                className="lg:hidden flex-1 sm:flex-none border-slate-200 dark:border-slate-800"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter
              </Button>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm outline-none dark:border-slate-800 dark:bg-slate-900 focus:ring-1 focus:ring-[#ef85f8] flex-1 sm:flex-none"
              >
                <option>Terlaris</option>
                <option>Harga Terendah</option>
                <option>Harga Tertinggi</option>
                <option>Rating</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
          
          <CustomJastipCta />
        </div>
      </div>
    </div>
  );
}
