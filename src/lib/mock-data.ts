export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  image_url: string;
  category_id: string;
  category: string;
  categories: {
    name: string;
    slug: string;
  };
  stock: number;
  weight: string;
  rating: number;
  total_orders: number;
  is_active: boolean;
  variants: any[];
  created_at: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 'cat-1', name: 'Individual', slug: 'individual', description: 'Pempek satuan per porsi' },
  { id: 'cat-2', name: 'Paket', slug: 'paket', description: 'Paket pempek campur hemat' },
  { id: 'cat-3', name: 'Hemat', slug: 'hemat', description: 'Paket porsi keluarga dan pesta' },
  { id: 'cat-4', name: 'Cemilan', slug: 'cemilan', description: 'Kemplang dan cemilan khas Palembang' },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod-1',
    name: 'Pempek Kapal Selam',
    slug: 'pempek-kapal-selam',
    description: 'Pempek kapal selam legendaris isi telur bebek utuh yang gurih dan renyah di luar, lembut di dalam. Dilengkapi cuko kental khas Palembang racikan otentik.',
    price: 25000,
    image: '/images/pempek_kapal_selam.jpg',
    image_url: '/images/pempek_kapal_selam.jpg',
    category_id: 'cat-1',
    category: 'Individual',
    categories: { name: 'Individual', slug: 'individual' },
    stock: 50,
    weight: '150g',
    rating: 4.8,
    total_orders: 450,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Pempek Lenjer Besar',
    slug: 'pempek-lenjer-besar',
    description: 'Pempek lenjer ukuran besar dengan aroma ikan tenggiri yang kuat dan tekstur kenyal sempurna. Dipotong-potong dan disiram kuah cuko manis pedas gurih.',
    price: 30000,
    image: '/images/pempek_lenjer.jpg',
    image_url: '/images/pempek_lenjer.jpg',
    category_id: 'cat-1',
    category: 'Individual',
    categories: { name: 'Individual', slug: 'individual' },
    stock: 40,
    weight: '200g',
    rating: 4.7,
    total_orders: 380,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Pempek Kulit',
    slug: 'pempek-kulit',
    description: 'Pempek kulit ikan tenggiri yang digoreng garing renyah di luar dan kenyal di dalam. Cita rasa gurih yang khas, favorit para penikmat pempek sejati.',
    price: 8000,
    image: '/images/pempek_kulit.jpg',
    image_url: '/images/pempek_kulit.jpg',
    category_id: 'cat-1',
    category: 'Individual',
    categories: { name: 'Individual', slug: 'individual' },
    stock: 100,
    weight: '50g',
    rating: 4.5,
    total_orders: 620,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Pempek Adaan',
    slug: 'pempek-adaan',
    description: 'Pempek bulat dengan campuran bawang merah dan daun bawang yang wangi. Tekstur empuk bersantan dengan rasa gurih yang menggugah selera.',
    price: 9000,
    image: '/images/pempek_adaan.jpg',
    image_url: '/images/pempek_adaan.jpg',
    category_id: 'cat-1',
    category: 'Individual',
    categories: { name: 'Individual', slug: 'individual' },
    stock: 80,
    weight: '60g',
    rating: 4.6,
    total_orders: 540,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Paket Campur A',
    slug: 'paket-campur-a',
    description: 'Paket hemat pempek campur isi 10 pcs (Telur kecil, Lenjer kecil, Adaan, dan Kulit). Cocok dinikmati bersama teman atau keluarga.',
    price: 65000,
    image: '/images/paket_campur.jpg',
    image_url: '/images/paket_campur.jpg',
    category_id: 'cat-2',
    category: 'Paket',
    categories: { name: 'Paket', slug: 'paket' },
    stock: 30,
    weight: '10 Pcs',
    rating: 4.9,
    total_orders: 890,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Kerupuk Kemplang Super',
    slug: 'kerupuk-kemplang-super',
    description: 'Kerupuk kemplang ikan tenggiri bakar khas Palembang. Tekstur renyah harum panggangan dengan sambal terasi khas Palembang.',
    price: 45000,
    image: '/images/kerupuk_kemplang.jpg',
    image_url: '/images/kerupuk_kemplang.jpg',
    category_id: 'cat-4',
    category: 'Cemilan',
    categories: { name: 'Cemilan', slug: 'cemilan' },
    stock: 60,
    weight: '500g',
    rating: 4.6,
    total_orders: 210,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Tekwan Kuah Udang',
    slug: 'tekwan-kuah-udang',
    description: 'Sup kuah kaldu udang gurih dengan butiran pentol ikan tenggiri kenyal, bihun, jamur kuping, bengkoang, bunga sedap malam, dan seledri.',
    price: 35000,
    image: '/images/tekwan_kuah_udang.jpg',
    image_url: '/images/tekwan_kuah_udang.jpg',
    category_id: 'cat-1',
    category: 'Individual',
    categories: { name: 'Individual', slug: 'individual' },
    stock: 25,
    weight: '300g',
    rating: 4.7,
    total_orders: 310,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Paket Hemat Keluarga',
    slug: 'paket-hemat-keluarga',
    description: 'Paket porsi besar isi 20 pcs pempek campur komplit + 2 botol cuko kental khas Palembang. Pilihan paling hemat untuk hidangan akhir pekan.',
    price: 120000,
    image: '/images/paket_campur.jpg',
    image_url: '/images/paket_campur.jpg',
    category_id: 'cat-3',
    category: 'Hemat',
    categories: { name: 'Hemat', slug: 'hemat' },
    stock: 20,
    weight: '20 Pcs',
    rating: 4.9,
    total_orders: 1200,
    is_active: true,
    variants: [],
    created_at: '2026-08-28T00:00:00Z',
  },
];
