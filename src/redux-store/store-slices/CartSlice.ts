// "use client";

// import { Product } from '@/lib/types';
// import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// type CartItem = {
//   product: Product;
//   quantity: number;
// };

// type InitialState = {
//   products: CartItem[];
//   isInitialized: boolean;
// };

// const getStorageKey = (isAuthenticated: boolean) =>
//   isAuthenticated ? 'cart' : 'guestCart';

// const loadCartFromStorage = (isAuthenticated: boolean): CartItem[] => {
//   if (typeof window === 'undefined') return [];
//   try {
//     const key = getStorageKey(isAuthenticated);
//     const stored = localStorage.getItem(key);
//     return stored ? JSON.parse(stored) : [];
//   } catch (error) {
//     console.error('Error loading cart from storage:', error);
//     return [];
//   }
// };

// const saveCartToStorage = (cart: CartItem[], isAuthenticated: boolean) => {
//   if (typeof window === 'undefined') return;
//   try {
//     const key = getStorageKey(isAuthenticated);
//     localStorage.setItem(key, JSON.stringify(cart));
//   } catch (error) {
//     console.error('Error saving cart to storage:', error);
//   }
// };

// const initialState: InitialState = {
//   products: [],
//   isInitialized: false,
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     initializeCart: (state, action: PayloadAction<{ isAuthenticated: boolean }>) => {
//       if (!state.isInitialized) {
//         state.products = loadCartFromStorage(action.payload.isAuthenticated);
//         state.isInitialized = true;
//       }
//     },

//     addToCart: (state, action: PayloadAction<{
//       product: Product,
//       quantity: number,
//       isAuthenticated: boolean
//     }>) => {
//       const existingProductIndex = state.products.findIndex(
//         item => item.product._id === action.payload.product._id
//       );

//       if (existingProductIndex !== -1) {
//         state.products[existingProductIndex].quantity += action.payload.quantity;
//       } else {
//         state.products.push({
//           product: action.payload.product,
//           quantity: action.payload.quantity
//         });
//       }

//       saveCartToStorage(state.products, action.payload.isAuthenticated);
//     },

//     updateCartQuantity: (state, action: PayloadAction<{
//       productId: string,
//       quantity: number,
//       isAuthenticated: boolean
//     }>) => {
//       const productIndex = state.products.findIndex(
//         item => item.product?._id === action.payload.productId
//       );

//       if (productIndex !== -1) {
//         state.products[productIndex].quantity = Math.max(0, action.payload.quantity);

//         if (state.products[productIndex].quantity === 0) {
//           state.products = state.products.filter((_, index) => index !== productIndex);
//         }

//         saveCartToStorage(state.products, action.payload.isAuthenticated);
//       }
//     },

//     removeFromCart: (state, action: PayloadAction<{
//       productId: string,
//       isAuthenticated: boolean
//     }>) => {
//       state.products = state.products.filter(
//         item => item.product?._id !== action.payload.productId
//       );
//       saveCartToStorage(state.products, action.payload.isAuthenticated);
//     },

//     clearCart: (state, action: PayloadAction<{ isAuthenticated: boolean }>) => {
//       state.products = [];
//       const key = getStorageKey(action.payload.isAuthenticated);
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem(key);
//       }
//     },

//     setCart: (state, action: PayloadAction<{
//       cartItems: CartItem[],
//       isAuthenticated: boolean
//     }>) => {
//       state.products = action.payload.cartItems;
//       saveCartToStorage(state.products, action.payload.isAuthenticated);
//     },
//   },
// });

// export const cartActions = cartSlice.actions;
// export default cartSlice.reducer;

// 'use client'

// import { Product } from '@/lib/types'
// import { PayloadAction, createSlice } from '@reduxjs/toolkit'
// import { PURGE } from 'redux-persist'

// type CartItem = {
//   product: Product
//   quantity: number
// }

// type InitialState = {
//   products: CartItem[]
//   isInitialized: boolean
// }

// const initialState: InitialState = {
//   products: [],
//   isInitialized: false,
// }

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     initializeCart: (state) => {
//       if (!state.isInitialized) {
//         state.isInitialized = true
//       }
//     },

//     addToCart: (
//       state,
//       action: PayloadAction<{
//         product: Product
//         quantity: number
//         // isAuthenticated: boolean
//       }>
//     ) => {
//       const existingProductIndex = state.products.findIndex(
//         (item) => item.product._id === action.payload.product._id
//       )

//       if (existingProductIndex !== -1) {
//         if (
//           state.products[existingProductIndex].quantity !==
//           action.payload.quantity
//         ) {
//           state.products[existingProductIndex].quantity +=
//             action.payload.quantity
//         }
//       } else {
//         state.products.push({
//           product: action.payload.product,
//           quantity: action.payload.quantity,
//         })
//       }
//     },

//     updateCartQuantity: (
//       state,
//       action: PayloadAction<{
//         productId: string
//         quantity: number
//         // isAuthenticated: boolean
//       }>
//     ) => {
//       const productIndex = state.products.findIndex(
//         (item) => item.product?._id === action.payload.productId
//       )

//       if (productIndex !== -1) {
//         state.products[productIndex].quantity = Math.max(
//           0,
//           action.payload.quantity
//         )

//         if (state.products[productIndex].quantity === 0) {
//           state.products = state.products.filter(
//             (_, index) => index !== productIndex
//           )
//         }
//       }
//     },

//     removeFromCart: (
//       state,
//       action: PayloadAction<{
//         productId: string
//         // isAuthenticated: boolean
//       }>
//     ) => {
//       state.products = state.products.filter(
//         (item) => item.product?._id !== action.payload.productId
//       )
//     },

//     clearCart: (state) => {
//       state.products = []
//     },
//     setCart: (
//       state,
//       action: PayloadAction<{
//         cartItems: CartItem[]
//       }>
//     ) => {
//       const productMap = new Map<string, CartItem>()

//       action.payload.cartItems.forEach((item) => {
//         const productId = item.product._id

//         if (productMap.has(productId)) {
//           const existingItem = productMap.get(productId)!
//           if (existingItem.quantity !== item.quantity) {
//             existingItem.quantity += item.quantity
//           }
//         } else {
//           productMap.set(productId, { ...item })
//         }
//       })

//       state.products = Array.from(productMap.values())
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(PURGE, () => initialState)
//   },
// })

// export const cartActions = cartSlice.actions
// export default cartSlice.reducer

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
