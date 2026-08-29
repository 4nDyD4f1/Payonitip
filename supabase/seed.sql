-- ============================================
-- PAYONITIP SEED DATA
-- Sample data for development & demo
-- ============================================

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Individual', 'individual', 'Pempek satuan pilihan'),
  ('a1000000-0000-0000-0000-000000000002', 'Paket', 'paket', 'Paket pempek hemat dan campur'),
  ('a1000000-0000-0000-0000-000000000003', 'Cemilan', 'cemilan', 'Kerupuk, kemplang, dan cemilan Palembang'),
  ('a1000000-0000-0000-0000-000000000004', 'Hemat', 'hemat', 'Paket hemat untuk keluarga');

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO public.products (id, name, slug, description, price, image, category_id, stock, weight, rating, total_orders, is_active, variants) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Pempek Kapal Selam',
    'pempek-kapal-selam',
    'Pempek kapal selam asli Palembang dengan isian telur bebek pilihan. Adonan ikan tenggiri segar yang diracik dengan resep turun-temurun. Disajikan dengan cuko khas Palembang yang gurih dan pedas.',
    25000,
    'https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=400&h=300&fit=crop',
    'a1000000-0000-0000-0000-000000000001',
    50,
    '150g',
    4.8,
    124,
    true,
    '[{"name": "Telur Ayam", "price": 0}, {"name": "Telur Bebek", "price": 3000}]'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Pempek Lenjer Besar',
    'pempek-lenjer-besar',
    'Pempek lenjer ukuran besar dengan tekstur kenyal dan rasa ikan yang kuat. Cocok dipotong-potong dan disajikan dengan cuko hangat. Favorit keluarga!',
    30000,
    'https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=400&h=300&fit=crop',
    'a1000000-0000-0000-0000-000000000001',
    40,
    '200g',
    4.7,
    98,
    true,
    '[]'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Pempek Kulit',
    'pempek-kulit',
    'Pempek kulit ikan khas Palembang. Tekstur renyah di luar, lembut di dalam. Ukuran pas untuk camilan sore hari bersama keluarga.',
    8000,
    'https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=400&h=300&fit=crop',
    'a1000000-0000-0000-0000-000000000001',
    100,
    '50g',
    4.5,
    76,
    true,
    4.9,
    620,
    true,
    '[]'::jsonb
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Pempek Adaan',
    'pempek-adaan',
    'Pempek bulat bentuk bakso (adaan) dengan tambahan daun bawang dan santan. Sangat gurih.',
    7000,
    '/images/pempek_adaan.jpg',
    'a1000000-0000-0000-0000-000000000001',
    400,
    '40g',
    4.8,
    850,
    true,
    '[]'::jsonb
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Paket Campur A',
    'paket-campur-a',
    'Terdiri dari 3 lenjer kecil, 2 adaan, 2 telur kecil, dan 1 kulit. Cocok untuk porsi 1-2 orang.',
    50000,
    '/images/paket_campur.jpg',
    'a1000000-0000-0000-0000-000000000002',
    50,
    '450g',
    4.9,
    210,
    true,
    '[]'::jsonb
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'Kerupuk Kemplang Super',
    'kerupuk-kemplang-super',
    'Kerupuk kemplang panggang khas Palembang (tanpa minyak) dengan tekstur renyah dan rasa ikan yang kuat.',
    35000,
    '/images/kerupuk_kemplang.jpg',
    'a1000000-0000-0000-0000-000000000003',
    80,
    '250g',
    4.7,
    145,
    true,
    '[]'::jsonb
  ),
  (
    'b1000000-0000-0000-0000-000000000007',
    'Tekwan Kuah Udang',
    'tekwan-kuah-udang',
    'Bola-bola ikan tekwan lengkap dengan kuah kaldu udang, jamur kuping, sedap malam, dan soun.',
    28000,
    '/images/tekwan_kuah_udang.jpg',
    'a1000000-0000-0000-0000-000000000001',
    60,
    '300g',
    4.8,
    230,
    true,
    '[]'::jsonb
  ),
  (
    'b1000000-0000-0000-0000-000000000008',
    'Paket Hemat Keluarga',
    'paket-hemat-keluarga',
    'Paket besar untuk 4-5 orang. Berisi 2 Kapal Selam, 2 Lenjer Besar, 5 Adaan, 5 Telur Kecil.',
    135000,
    '/images/paket_campur.jpg',
    'a1000000-0000-0000-0000-000000000004',
    20,
    '20 Pcs',
    4.9,
    67,
    true,
    '[{"name": "Cuko Biasa", "price": 0}, {"name": "Cuko Pedas Ekstra", "price": 5000}, {"name": "Tambah Kerupuk 250g", "price": 20000}]'
  );

-- ============================================
-- VOUCHERS
-- ============================================
INSERT INTO public.vouchers (code, discount_type, discount_value, min_purchase, max_discount, max_usage, is_active, expires_at) VALUES
  ('BOGORSEGAR', 'percentage', 50, 50000, 25000, 100, true, '2025-12-31 23:59:59+07'),
  ('PEMPEK10', 'fixed', 10000, 30000, 10000, 50, true, '2025-12-31 23:59:59+07'),
  ('WELCOME', 'percentage', 15, 0, 15000, 200, true, '2025-12-31 23:59:59+07');

-- ============================================
-- SAMPLE ORDERS (for demo/admin dashboard)
-- ============================================
INSERT INTO public.orders (id, order_id, user_id, items, subtotal, shipping_cost, discount, total, status, shipping_method, payment_method, customer_name, customer_phone, customer_address, notes, payment_confirmed, created_at) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'PYN-00092',
    NULL,
    '[{"name": "Pempek Kapal Selam", "price": 25000, "quantity": 5, "image": "https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=100&h=100&fit=crop"}, {"name": "Paket Campur A", "price": 65000, "quantity": 3, "image": "https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=100&h=100&fit=crop"}]',
    320000,
    25000,
    0,
    345000,
    'diproses',
    'sameday',
    'qris',
    'Budi Santoso',
    '081234567890',
    'Jl. Pajajaran No. 15, Bogor Tengah',
    'Cuko dipisah ya',
    true,
    NOW() - INTERVAL '2 hours'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'PYN-00091',
    NULL,
    '[{"name": "Pempek Kulit", "price": 8000, "quantity": 10, "image": "https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=100&h=100&fit=crop"}, {"name": "Kerupuk Kemplang Super", "price": 45000, "quantity": 1, "image": "https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=100&h=100&fit=crop"}]',
    125000,
    15000,
    10000,
    130000,
    'dikirim',
    'regular',
    'transfer',
    'Siti Aminah',
    '085678901234',
    'Perumahan Sentul City Blok A5, Sentul',
    '',
    true,
    NOW() - INTERVAL '1 day'
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    'PYN-00090',
    NULL,
    '[{"name": "Paket Hemat Keluarga", "price": 120000, "quantity": 2, "image": "https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=100&h=100&fit=crop"}]',
    240000,
    25000,
    25000,
    240000,
    'selesai',
    'sameday',
    'qris',
    'Andi Wijaya',
    '087890123456',
    'Jl. Raya Cibinong No. 88, Cibinong',
    'Untuk acara arisan',
    true,
    NOW() - INTERVAL '3 days'
  ),
  (
    'c1000000-0000-0000-0000-000000000004',
    'PYN-00089',
    NULL,
    '[{"name": "Pempek Lenjer Besar", "price": 30000, "quantity": 5, "image": "https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=100&h=100&fit=crop"}, {"name": "Tekwan Kuah Udang", "price": 35000, "quantity": 3, "image": "https://images.unsplash.com/photo-1626404819934-f6e4e0797e60?w=100&h=100&fit=crop"}]',
    255000,
    15000,
    0,
    270000,
    'diproses',
    'regular',
    'cod',
    'Rina Marlina',
    '089012345678',
    'Jl. Surya Kencana No. 22, Bogor Selatan',
    'Tolong packing rapi',
    false,
    NOW() - INTERVAL '5 hours'
  );

-- ============================================
-- SAMPLE ORDER TRACKING
-- ============================================
INSERT INTO public.order_tracking (order_id, status, description, created_at) VALUES
  -- Order PYN-00092 (diproses)
  ('c1000000-0000-0000-0000-000000000001', 'pesanan_dibuat', 'Pesanan berhasil dibuat.', NOW() - INTERVAL '2 hours'),
  ('c1000000-0000-0000-0000-000000000001', 'diproses', 'Pembayaran terkonfirmasi. Jastiper kami sedang memproses pesanan Anda di Pempek Candy Palembang.', NOW() - INTERVAL '1 hour 30 minutes'),

  -- Order PYN-00091 (dikirim)
  ('c1000000-0000-0000-0000-000000000002', 'pesanan_dibuat', 'Pesanan berhasil dibuat.', NOW() - INTERVAL '1 day'),
  ('c1000000-0000-0000-0000-000000000002', 'diproses', 'Pembayaran terkonfirmasi.', NOW() - INTERVAL '23 hours'),
  ('c1000000-0000-0000-0000-000000000002', 'dikemas', 'Pesanan sedang dikemas dengan hati-hati.', NOW() - INTERVAL '20 hours'),
  ('c1000000-0000-0000-0000-000000000002', 'dikirim', 'Paket sedang dalam perjalanan via Paxel. Estimasi tiba hari ini.', NOW() - INTERVAL '18 hours'),

  -- Order PYN-00090 (selesai)
  ('c1000000-0000-0000-0000-000000000003', 'pesanan_dibuat', 'Pesanan berhasil dibuat.', NOW() - INTERVAL '3 days'),
  ('c1000000-0000-0000-0000-000000000003', 'diproses', 'Pembayaran terkonfirmasi.', NOW() - INTERVAL '2 days 22 hours'),
  ('c1000000-0000-0000-0000-000000000003', 'dikemas', 'Pesanan dikemas.', NOW() - INTERVAL '2 days 20 hours'),
  ('c1000000-0000-0000-0000-000000000003', 'dikirim', 'Paket dikirim via Paxel Sameday.', NOW() - INTERVAL '2 days 18 hours'),
  ('c1000000-0000-0000-0000-000000000003', 'selesai', 'Pesanan telah diterima. Terima kasih telah berbelanja di Payonitip!', NOW() - INTERVAL '2 days 10 hours'),

  -- Order PYN-00089 (pesanan_dibuat - belum bayar)
  ('c1000000-0000-0000-0000-000000000004', 'pesanan_dibuat', 'Pesanan berhasil dibuat. Menunggu konfirmasi pembayaran.', NOW() - INTERVAL '5 hours');

-- ============================================
-- SAMPLE REVIEWS
-- ============================================
INSERT INTO public.reviews (user_id, product_id, rating, comment, created_at) VALUES
  (NULL, 'b1000000-0000-0000-0000-000000000001', 5, 'Pempek kapal selamnya enak banget! Ikan tenggirinya kerasa, telurnya juga pas. Cuko-nya mantap!', NOW() - INTERVAL '5 days'),
  (NULL, 'b1000000-0000-0000-0000-000000000005', 5, 'Paket campurnya worth it banget. Isi banyak, rasanya autentik Palembang. Pasti order lagi!', NOW() - INTERVAL '3 days'),
  (NULL, 'b1000000-0000-0000-0000-000000000002', 4, 'Lenjernya besar-besar dan kenyal. Pengiriman cepat, sampai masih hangat. Recommended!', NOW() - INTERVAL '7 days');
