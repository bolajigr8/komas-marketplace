'use client'
import { Product } from '@/lib/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

type CartItem = {
  product: Product
  quantity: number
}

type InitialState = {
  products: CartItem[]
  isInitialized: boolean
}

const initialState: InitialState = {
  products: [],
  isInitialized: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state) => {
      if (!state.isInitialized) {
        state.isInitialized = true
      }
    },

    addToCart: (
      state,
      action: PayloadAction<{
        product: Product
        quantity: number
      }>
    ) => {
      const existingProductIndex = state.products.findIndex(
        (item) => item.product._id === action.payload.product._id
      )

      if (existingProductIndex !== -1) {
        // Update existing item quantity
        state.products[existingProductIndex].quantity += action.payload.quantity

        // Ensure quantity doesn't go below 0
        if (state.products[existingProductIndex].quantity <= 0) {
          state.products = state.products.filter(
            (_, index) => index !== existingProductIndex
          )
        }
      } else if (action.payload.quantity > 0) {
        // Only add new item if quantity is positive
        state.products.push({
          product: action.payload.product,
          quantity: action.payload.quantity,
        })
      }
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<{
        productId: string
        quantity: number
      }>
    ) => {
      const productIndex = state.products.findIndex(
        (item) => item.product?._id === action.payload.productId
      )

      if (productIndex !== -1) {
        if (action.payload.quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.products = state.products.filter(
            (_, index) => index !== productIndex
          )
        } else {
          // Update quantity
          state.products[productIndex].quantity = action.payload.quantity
        }
      }
      // If product doesn't exist and quantity > 0, we don't add it here
      // because we don't have the product details
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        productId: string
        quantity?: number // Optional: remove specific quantity, or remove all if not provided
      }>
    ) => {
      const productIndex = state.products.findIndex(
        (item) => item.product?._id === action.payload.productId
      )

      if (productIndex !== -1) {
        if (action.payload.quantity && action.payload.quantity > 0) {
          // Remove specific quantity
          state.products[productIndex].quantity -= action.payload.quantity

          // Remove item completely if quantity reaches 0 or below
          if (state.products[productIndex].quantity <= 0) {
            state.products = state.products.filter(
              (_, index) => index !== productIndex
            )
          }
        } else {
          // Remove item completely (default behavior)
          state.products = state.products.filter(
            (_, index) => index !== productIndex
          )
        }
      }
    },

    clearCart: (state) => {
      state.products = []
    },

    setCart: (
      state,
      action: PayloadAction<{
        cartItems: CartItem[]
      }>
    ) => {
      // Validate and clean the cart items
      const validItems = action.payload.cartItems.filter(
        (item) => item.product && item.product._id && item.quantity > 0
      )

      // Remove duplicates by merging quantities
      const productMap = new Map<string, CartItem>()

      validItems.forEach((item) => {
        const productId = item.product._id

        if (productMap.has(productId)) {
          const existingItem = productMap.get(productId)!
          existingItem.quantity += item.quantity
        } else {
          productMap.set(productId, { ...item })
        }
      })

      state.products = Array.from(productMap.values())
    },

    // Helper action to sync cart with localStorage for guest users
    syncWithLocalStorage: (state) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state.products))
        }
      } catch (error) {
        console.error('Failed to sync cart with localStorage:', error)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState)
  },
})

export const cartActions = cartSlice.actions
export default cartSlice.reducer
