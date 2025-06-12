// User types
export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  updated_at?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

// Product types
export interface Category {
  id: number
  name: string
  description?: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text?: string
  is_main: boolean
  sort_order: number
  created_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price?: number
  sku: string
  category_id: number
  brand: string
  is_featured: boolean
  is_active: boolean
  stock_quantity: number
  weight?: number
  sizes: string[]
  colors: string[]
  created_at: string
  updated_at?: string
  category: Category
  images: ProductImage[]
  main_image?: string
  is_on_sale: boolean
  discount_percentage: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  per_page: number
  pages: number
}

// Cart types
export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  quantity: number
  size: string
  color: string
  unit_price: number
  total_price: number
  added_at: string
  product?: Product
}

export interface Cart {
  id: number
  user_id: number
  items: CartItem[]
  total_items: number
  total_amount: number
  created_at: string
  updated_at?: string
}

export interface AddToCartData {
  product_id: number
  quantity: number
  size: string
  color: string
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  size: string
  color: string
  unit_price: number
  total_price: number
  product?: Product
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  shipping_first_name: string
  shipping_last_name: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip_code: string
  shipping_country: string
  shipping_phone?: string
  payment_method?: string
  payment_transaction_id?: string
  tracking_number?: string
  notes?: string
  items: OrderItem[]
  created_at: string
  updated_at?: string
  shipped_at?: string
  delivered_at?: string
}

export interface OrderListResponse {
  orders: Order[]
  total: number
  page: number
  per_page: number
  pages: number
}

export interface CreateOrderData {
  shipping_first_name: string
  shipping_last_name: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip_code: string
  shipping_country: string
  shipping_phone?: string
  payment_method?: string
  notes?: string
}

// API Error type
export interface ApiError {
  error: string
  message: string
  details?: string
}

// Filter types
export interface ProductFilters {
  category_id?: number
  search?: string
  is_featured?: boolean
  min_price?: number
  max_price?: number
  page?: number
  per_page?: number
}