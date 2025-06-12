import axios from 'axios'
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  Product,
  ProductListResponse,
  Category,
  Cart,
  CartItem,
  AddToCartData,
  Order,
  OrderListResponse,
  CreateOrderData
} from '../types'

// Create axios instance
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth-storage')
  if (authData) {
    try {
      const { state } = JSON.parse(authData)
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch (error) {
      console.error('Error parsing auth data:', error)
    }
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login-json', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  }
}

// Products API
export const productsApi = {
  getProducts: async (params?: {
    page?: number
    per_page?: number
    category_id?: number
    search?: string
    is_featured?: boolean
    min_price?: number
    max_price?: number
  }): Promise<ProductListResponse> => {
    const response = await api.get('/products', { params })
    return response.data
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  getFeaturedProducts: async (limit?: number): Promise<Product[]> => {
    const response = await api.get('/products/featured', { 
      params: { limit } 
    })
    return response.data
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/products/categories')
    return response.data
  }
}

// Cart API
export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart')
    return response.data
  },

  addItem: async (data: AddToCartData): Promise<CartItem> => {
    const response = await api.post('/cart/items', data)
    return response.data
  },

  updateItem: async (itemId: number, data: { quantity: number }): Promise<CartItem> => {
    const response = await api.put(`/cart/items/${itemId}`, data)
    return response.data
  },

  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/cart/items/${itemId}`)
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart')
  }
}

// Orders API
export const ordersApi = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders', data)
    return response.data
  },

  getOrders: async (params?: {
    page?: number
    per_page?: number
  }): Promise<OrderListResponse> => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/number/${orderNumber}`)
    return response.data
  }
}

export default api