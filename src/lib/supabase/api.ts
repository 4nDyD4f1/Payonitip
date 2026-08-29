import { createClient } from '@/lib/supabase/client'
import type { Product, Category, Order, OrderTracking, Voucher, CustomOrder, Review } from '@/types'

function getSupabase() {
  return createClient()
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts() {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('total_orders', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data || []
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  return data
}

export async function getProductsByCategory(categorySlug: string) {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories!inner(name, slug)')
    .eq('categories.slug', categorySlug)
    .eq('is_active', true)
    .order('total_orders', { ascending: false })

  if (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
  return data || []
}

export async function searchProducts(query: string) {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('total_orders', { ascending: false })

  if (error) {
    console.error('Error searching products:', error)
    return []
  }
  return data || []
}

export async function getBestSellers(limit = 4) {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('total_orders', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching best sellers:', error.message || error)
    return []
  }
  return data || []
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories() {
  const { data, error } = await getSupabase()
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error.message || error)
    return []
  }
  return data || []
}

// ============================================
// ORDERS
// ============================================

export async function createOrder(orderData: {
  order_id: string
  user_id?: string
  items: unknown[]
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  shipping_method: string
  payment_method: string
  customer_name: string
  customer_phone: string
  customer_address: string
  notes?: string
  voucher_code?: string
}) {
  const { data, error } = await getSupabase()
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    return null
  }
  return data
}

export async function getOrderByOrderId(orderId: string) {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  return data
}

export async function getUserOrders(userId: string) {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
  return data || []
}

export async function getAllOrders() {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all orders:', error)
    return []
  }
  return data || []
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await getSupabase()
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating order status:', error)
    return null
  }
  return data
}

export async function confirmPayment(orderId: string, proofUrl?: string) {
  const updateData: any = { payment_confirmed: true, status: 'diproses', updated_at: new Date().toISOString() };
  if (proofUrl) {
    updateData.payment_proof = proofUrl;
  }
  
  const { data, error } = await getSupabase()
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error confirming payment:', error)
    return null
  }
  return data
}

// ============================================
// ORDER TRACKING
// ============================================

export async function getOrderTracking(orderId: string) {
  const { data, error } = await getSupabase()
    .from('order_tracking')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching order tracking:', error)
    return []
  }
  return data || []
}

export async function addTrackingEntry(orderId: string, status: string, description: string) {
  const { data, error } = await getSupabase()
    .from('order_tracking')
    .insert({ order_id: orderId, status, description })
    .select()
    .single()

  if (error) {
    console.error('Error adding tracking entry:', error)
    return null
  }
  return data
}

// ============================================
// VOUCHERS
// ============================================

export async function validateVoucher(code: string, subtotal: number) {
  const { data, error } = await getSupabase()
    .from('vouchers')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return { valid: false, message: 'Kode voucher tidak valid', discount: 0 }
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, message: 'Voucher sudah kadaluarsa', discount: 0 }
  }

  if (data.usage_count >= data.max_usage) {
    return { valid: false, message: 'Voucher sudah habis digunakan', discount: 0 }
  }

  if (subtotal < data.min_purchase) {
    return { valid: false, message: `Minimum pembelian Rp ${data.min_purchase.toLocaleString('id-ID')}`, discount: 0 }
  }

  let discount = 0
  if (data.discount_type === 'percentage') {
    discount = Math.floor(subtotal * data.discount_value / 100)
    if (data.max_discount > 0) {
      discount = Math.min(discount, data.max_discount)
    }
  } else {
    discount = data.discount_value
  }

  return { valid: true, message: 'Voucher berhasil diterapkan!', discount, voucher: data }
}

export async function getVouchers() {
  const { data, error } = await getSupabase()
    .from('vouchers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vouchers:', error)
    return []
  }
  return data || []
}

export async function createVoucher(voucherData: Partial<Voucher>) {
  const { data, error } = await getSupabase()
    .from('vouchers')
    .insert(voucherData)
    .select()
    .single()

  if (error) {
    console.error('Error creating voucher:', error)
    return null
  }
  return data
}

// ============================================
// FAVORITES
// ============================================

export async function getUserFavorites(userId: string) {
  const { data, error } = await getSupabase()
    .from('favorites')
    .select('*, products(*, categories(name, slug))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
  return data || []
}

export async function toggleFavorite(userId: string, productId: string) {
  // Check if already favorited
  const { data: existing } = await getSupabase()
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await getSupabase().from('favorites').delete().eq('id', existing.id)
    return { isFavorited: false }
  } else {
    await getSupabase().from('favorites').insert({ user_id: userId, product_id: productId })
    return { isFavorited: true }
  }
}

// ============================================
// CUSTOM ORDERS ("Titip Buat Aku")
// ============================================

export async function createCustomOrder(orderData: {
  user_id?: string
  request_text: string
  budget_min?: number
  budget_max?: number
  desired_date?: string
  notes?: string
}) {
  const { data, error } = await getSupabase()
    .from('custom_orders')
    .insert(orderData)
    .select()
    .single()

  if (error) {
    console.error('Error creating custom order:', error)
    return null
  }
  return data
}

export async function getCustomOrders() {
  const { data, error } = await getSupabase()
    .from('custom_orders')
    .select('*, profiles(full_name, phone)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching custom orders:', error)
    return []
  }
  return data || []
}

// ============================================
// REVIEWS
// ============================================

export async function getProductReviews(productId: string) {
  const { data, error } = await getSupabase()
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
  return data || []
}

// ============================================
// PROFILES
// ============================================

export async function getProfile(userId: string) {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}

export async function updateProfile(userId: string, updates: { full_name?: string; phone?: string; address?: string; avatar_url?: string }) {
  const { data, error } = await getSupabase()
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  return data
}

export async function getAllProfiles() {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all profiles:', error)
    return []
  }
  return data || []
}

// ============================================
// ADMIN — PRODUCTS CRUD
// ============================================

export async function adminCreateProduct(productData: Partial<Product>) {
  const { data, error } = await getSupabase()
    .from('products')
    .insert(productData)
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return null
  }
  return data
}

export async function adminUpdateProduct(productId: string, updates: Partial<Product>) {
  const { data, error } = await getSupabase()
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return null
  }
  return data
}

export async function adminDeleteProduct(productId: string) {
  const { error } = await getSupabase()
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Error deleting product:', error)
    return false
  }
  return true
}

export async function adminGetAllProducts() {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all products:', error)
    return []
  }
  return data || []
}

// ============================================
// ADMIN — DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString()

  // Total sales this month
  const { data: monthlyOrders } = await getSupabase()
    .from('orders')
    .select('total')
    .gte('created_at', startOfMonth)
    .neq('status', 'dibatalkan')

  const totalSales = monthlyOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

  // Today's orders
  const { count: todayOrders } = await getSupabase()
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay)

  // New customers this week
  const { count: newCustomers } = await getSupabase()
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user')
    .gte('created_at', startOfWeek)

  // Total active products
  const { count: activeProducts } = await getSupabase()
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return {
    totalSales,
    todayOrders: todayOrders || 0,
    newCustomers: newCustomers || 0,
    activeProducts: activeProducts || 0,
  }
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToOrderUpdates(orderId: string, callback: (payload: unknown) => void) {
  return getSupabase()
    .channel(`order-${orderId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'order_tracking',
      filter: `order_id=eq.${orderId}`,
    }, callback)
    .subscribe()
}

export function subscribeToNewOrders(callback: (payload: unknown) => void) {
  return getSupabase()
    .channel('new-orders')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'orders',
    }, callback)
    .subscribe()
}
