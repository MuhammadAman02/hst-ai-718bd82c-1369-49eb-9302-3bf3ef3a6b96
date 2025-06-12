import { create } from 'zustand'
import { Cart, CartItem, AddToCartData } from '../types'
import { cartApi } from '../services/api'
import toast from 'react-hot-toast'

interface CartState {
  cart: Cart | null
  isLoading: boolean
  fetchCart: () => Promise<void>
  addItem: (data: AddToCartData) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  getItemCount: () => number
  getTotalAmount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const cart = await cartApi.getCart()
      set({ cart, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      console.error('Failed to fetch cart:', error)
    }
  },

  addItem: async (data: AddToCartData) => {
    try {
      await cartApi.addItem(data)
      await get().fetchCart()
      toast.success('Item added to cart!')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to add item to cart'
      toast.error(message)
    }
  },

  updateItem: async (itemId: number, quantity: number) => {
    try {
      await cartApi.updateItem(itemId, { quantity })
      await get().fetchCart()
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update item'
      toast.error(message)
    }
  },

  removeItem: async (itemId: number) => {
    try {
      await cartApi.removeItem(itemId)
      await get().fetchCart()
      toast.success('Item removed from cart')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to remove item'
      toast.error(message)
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clearCart()
      set({ cart: null })
      toast.success('Cart cleared')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to clear cart'
      toast.error(message)
    }
  },

  getItemCount: () => {
    const { cart } = get()
    return cart?.total_items || 0
  },

  getTotalAmount: () => {
    const { cart } = get()
    return cart?.total_amount || 0
  }
}))