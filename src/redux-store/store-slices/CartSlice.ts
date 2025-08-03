'use client'
import { Product, ProductVariant } from '@/lib/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

// CORRECTED: CartItem to match the actual cart structure with separate variant
type CartItem = {
  product: Product
  variant?: ProductVariant // Separate variant object (matches API structure)
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

// Helper function to create unique cart item identifier using only _id
const createCartItemId = (productId: string, variantId?: string) => {
  return variantId ? `${productId}-${variantId}` : productId
}

// CORRECTED: Helper function to find cart item by product and variant using _id
const findCartItem = (
  products: CartItem[],
  productId: string,
  variantId?: string
) => {
  return products.findIndex((item) => {
    // FIXED: Use item.variant?._id instead of selectedVariant.variantId
    const itemVariantId = item.variant?._id
    const itemCartId = createCartItemId(item.product._id, itemVariantId)
    const searchCartId = createCartItemId(productId, variantId)
    return itemCartId === searchCartId
  })
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

    // CORRECTED: addToCart to accept separate variant parameter
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product
        variant?: ProductVariant // Separate variant parameter
        quantity: number
      }>
    ) => {
      const { product, variant, quantity } = action.payload
      const variantId = variant?._id // Use _id from variant

      const existingProductIndex = findCartItem(
        state.products,
        product._id,
        variantId
      )

      if (existingProductIndex !== -1) {
        // Update existing item quantity
        state.products[existingProductIndex].quantity += quantity

        // Ensure quantity doesn't go below 0
        if (state.products[existingProductIndex].quantity <= 0) {
          state.products = state.products.filter(
            (_, index) => index !== existingProductIndex
          )
        }
      } else if (quantity > 0) {
        // Only add new item if quantity is positive
        state.products.push({
          product,
          variant, // Store variant separately
          quantity,
        })
      }
    },

    // CORRECTED: updateCartQuantity with variantId parameter
    updateCartQuantity: (
      state,
      action: PayloadAction<{
        productId: string
        variantId?: string // Use variantId parameter (will receive _id value)
        quantity: number
      }>
    ) => {
      const { productId, variantId, quantity } = action.payload
      const productIndex = findCartItem(state.products, productId, variantId)

      if (productIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.products = state.products.filter(
            (_, index) => index !== productIndex
          )
        } else {
          // Update quantity
          state.products[productIndex].quantity = quantity
        }
      }
      // If product doesn't exist and quantity > 0, we don't add it here
      // because we don't have the product details
    },

    // CORRECTED: removeFromCart with variantId parameter
    removeFromCart: (
      state,
      action: PayloadAction<{
        productId: string
        variantId?: string // Use variantId parameter (will receive _id value)
        quantity?: number // Optional: remove specific quantity, or remove all if not provided
      }>
    ) => {
      const { productId, variantId, quantity } = action.payload
      const productIndex = findCartItem(state.products, productId, variantId)

      if (productIndex !== -1) {
        if (quantity && quantity > 0) {
          // Remove specific quantity
          state.products[productIndex].quantity -= quantity

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

    // CORRECTED: setCart to handle the new cart structure from server
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

      // Remove duplicates by merging quantities (considering variants)
      const productMap = new Map<string, CartItem>()

      validItems.forEach((item) => {
        const productId = item.product._id
        const variantId = item.variant?._id // Use _id from variant
        const cartItemId = createCartItemId(productId, variantId)

        if (productMap.has(cartItemId)) {
          const existingItem = productMap.get(cartItemId)!
          existingItem.quantity += item.quantity
        } else {
          productMap.set(cartItemId, { ...item })
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
