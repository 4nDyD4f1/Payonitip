export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category_id: string
  stock: number
  weight: number
  rating: number
  total_orders: number
  is_active: boolean
  variants?: any[]
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type OrderStatus = 'pesanan_dibuat' | 'diproses' | 'dikemas' | 'dikirim' | 'selesai'

export interface Order {
  id: string
  order_id: string
  user_id: string
  items: CartItem[]
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  status: OrderStatus
  shipping_method: string
  payment_method: string
  customer_info: {
    name: string
    phone: string
    address: string
  }
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderTracking {
  id: string
  order_id: string
  status: string
  description: string
  timestamp: string
}

export interface Profile {
  id: string
  full_name: string
  phone: string
  email: string
  address: string
  avatar_url?: string
  role: 'user' | 'admin'
  favorites: string[]
}

export interface Voucher {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_purchase: number
  max_discount?: number
  usage_count?: number
  max_usage?: number
  is_active: boolean
  expires_at?: string
}

export interface CustomOrder {
  id: string
  user_id: string
  request_text: string
  budget_min?: number
  budget_max?: number
  desired_date?: string
  notes?: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  admin_reply?: string
  quoted_price?: number
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string
  created_at: string
}

export interface DashboardStats {
  total_sales: number
  today_orders: number
  active_shoppers: number
  new_customers: number
}
