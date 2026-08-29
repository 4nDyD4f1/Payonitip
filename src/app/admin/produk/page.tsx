'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  adminGetAllProducts, 
  adminCreateProduct, 
  adminUpdateProduct, 
  adminDeleteProduct, 
  getCategories 
} from '@/lib/supabase/api';
import { ImageUpload } from '@/components/ui/image-upload';

const initialProducts = [
  { id: 1, name: 'Pempek Kapal Selam', category: 'Pempek', price: 25000, stock: 150, status: 'Aktif', image_url: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Pempek Lenjer', category: 'Pempek', price: 20000, stock: 200, status: 'Aktif', image_url: 'https://via.placeholder.com/40' },
];

export default function ProdukPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    status: 'Aktif'
  });

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminGetAllProducts();
      setProducts(data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openDialog = (product?: any) => {
    if (product) {
      setIsEditing(true);
      setCurrentId(product.id);
      setFormData({
        name: product.name || '',
        category_id: product.category_id || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
        image: product.image || '',
        status: product.status || 'Aktif'
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        status: 'Aktif'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        name: formData.name,
        category_id: formData.category_id,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        image: formData.image,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      };
      
      if (isEditing && currentId) {
        await adminUpdateProduct(currentId as string, payload);
      } else {
        await adminCreateProduct(payload);
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await adminDeleteProduct(id);
        fetchProducts();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-[#6dadff] dark:bg-purple-900/30 dark:text-[#a3ccff] rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">Manajemen Produk</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Atur katalog produk dan stok pempek</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="bg-[#ef85f8] hover:bg-[#004A8B] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#0F172A] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-montserrat text-[#1A1C1E] dark:text-[#F1F5F9]">
                {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Produk</label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Contoh: Pempek Kapal Selam" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Harga (Rp)</label>
                  <Input 
                    type="text"
                    value={formData.price ? Number(formData.price).toLocaleString('id-ID') : ''} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({...formData, price: val});
                    }}
                    placeholder="25000" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stok (Porsi)</label>
                  <Input 
                    type="number"
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="50" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi Singkat</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef85f8] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950"
                  placeholder="Deskripsi produk..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gambar Produk</label>
                <ImageUpload 
                  value={formData.image} 
                  onChange={(url) => setFormData({...formData, image: url})} 
                  bucket="products"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="status" 
                  className="rounded text-[#ef85f8] focus:ring-[#ef85f8]" 
                  checked={formData.status === 'Aktif'}
                  onChange={e => setFormData({...formData, status: e.target.checked ? 'Aktif' : 'Nonaktif'})}
                />
                <label htmlFor="status" className="text-sm text-slate-700 dark:text-slate-300">Aktifkan Produk</label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button className="bg-[#ef85f8] hover:bg-[#004A8B] text-white" onClick={handleSave}>Simpan Produk</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white dark:bg-[#0F172A]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Cari produk..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center p-8"><div className="animate-pulse h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div></div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b dark:border-slate-800">
                  <th className="pb-3 font-medium px-2">Produk</th>
                  <th className="pb-3 font-medium px-2">Kategori</th>
                  <th className="pb-3 font-medium px-2">Harga</th>
                  <th className="pb-3 font-medium px-2">Stok</th>
                  <th className="pb-3 font-medium px-2">Status</th>
                  <th className="pb-3 font-medium px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b dark:border-slate-800/50 last:border-0 text-sm">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url || p.image || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 rounded object-cover bg-slate-100" />
                        <span className="font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{p.category?.name || p.category || 'N/A'}</td>
                    <td className="py-4 px-2 font-medium text-[#1A1C1E] dark:text-[#F1F5F9]">{formatRupiah(p.price)}</td>
                    <td className="py-4 px-2">
                      <span className={p.stock < 50 ? 'text-rose-500 font-medium' : 'text-slate-600 dark:text-slate-400'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant={p.status === 'Aktif' ? 'default' : 'secondary'} className={p.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => openDialog(p)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20" onClick={() => handleDelete(p.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                Produk tidak ditemukan.
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
