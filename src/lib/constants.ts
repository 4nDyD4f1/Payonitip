export const APP_NAME = 'Payonitip'
export const APP_TAGLINE = 'Titip Pempek Asli Palembang, Sampai di Bogor dengan Segar'
export const APP_DESCRIPTION = 'Layanan jastip terpercaya untuk mengobati rindu cita rasa otentik Palembang tanpa perlu ribet.'
export const WHATSAPP_NUMBER = '6281234567890'

export const SHIPPING_METHODS = [
  { name: 'Reguler', description: 'Pengiriman standar 2-3 hari', price: 15000, eta: '2-3 hari' },
  { name: 'Sameday', description: 'Pengiriman sampai di hari yang sama', price: 35000, eta: 'Hari ini' },
]

export const PAYMENT_METHODS = [
  { id: 'transfer_bca', name: 'Transfer BCA' },
  { id: 'transfer_mandiri', name: 'Transfer Mandiri' },
  { id: 'qris', name: 'QRIS' }
]

export const ORDER_STATUSES = [
  { id: 'pesanan_dibuat', label: 'Pesanan Dibuat', icon: 'FileText', description: 'Pesanan Anda telah kami terima' },
  { id: 'diproses', label: 'Diproses', icon: 'Clock', description: 'Pesanan sedang diverifikasi' },
  { id: 'dikemas', label: 'Dikemas', icon: 'Package', description: 'Pesanan sedang dikemas dengan rapi dan aman' },
  { id: 'dikirim', label: 'Dikirim', icon: 'Truck', description: 'Pesanan dalam perjalanan menuju alamat Anda' },
  { id: 'selesai', label: 'Selesai', icon: 'CheckCircle', description: 'Pesanan telah diterima' }
]

export const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Produk', href: '/products' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'FAQ', href: '/faq' }
]

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Pesanan', href: '/admin/orders' },
  { label: 'Produk', href: '/admin/products' },
  { label: 'Pengguna', href: '/admin/users' }
]

export const SOCIAL_LINKS = [
  { platform: 'Instagram', url: 'https://instagram.com/payonitip' },
  { platform: 'TikTok', url: 'https://tiktok.com/@payonitip' }
]
