// // 'use client'

// // import { useEffect } from 'react'
// // import { useSession } from 'next-auth/react'
// // import { addProductToCart } from '@/lib/server-actions/product'

// // const CartSyncer = () => {
// //   const { data: session } = useSession()

// //   useEffect(() => {
// //     if (!session) return

// //     const syncCart = async () => {
// //       const localCart = JSON.parse(localStorage.getItem('cart') || '[]')

// //       for (const item of localCart) {
// //         await addProductToCart({ productId: item._id, quantity: item.quantity })
// //       }

// //       localStorage.removeItem('cart') // Clear after syncing
// //     }

// //     syncCart()
// //   }, [session])

// //   return null
// // }

// // export default CartSyncer

// 'use client'

// import { useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { addProductToCart, getCartProducts } from '@/lib/server-actions/product'
// import { useAppDispatch } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'

// const CartSyncer = () => {
//   const { data: session } = useSession()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     if (!session?.user) return

//     const syncCart = async () => {
//       const localCart = JSON.parse(localStorage.getItem('cart') || '[]')

//       // Sync local cart to backend
//       for (const item of localCart) {
//         await addProductToCart({
//           productId: item.product?._id || item._id,
//           quantity: item.quantity,
//         })
//       }

//       localStorage.removeItem('cart')

//       // Pull backend cart to Redux
//       const backendCart = await getCartProducts()

//       if (!backendCart.hasError && backendCart.data) {
//         dispatch(cartActions.setCart({ cartItems: backendCart.data }))
//       }
//     }

//     syncCart()
//   }, [session])

//   return null
// }

// export default CartSyncer

// 'use client'

// import { useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { addProductToCart, getCartProducts } from '@/lib/server-actions/product'
// import { useAppDispatch } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import { CartItem } from '@/lib/types'

// const CartSyncer = () => {
//   const { data: session } = useSession()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     if (!session?.user) return

//     const syncCart = async () => {
//       try {
//         const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
//         if (localCart.length === 0) return

//         // Fetch server cart first to check for existing items
//         const backendCartResponse = await getCartProducts()

//         if (backendCartResponse.hasError) {
//           console.error(
//             'Failed to fetch backend cart:',
//             backendCartResponse.message
//           )
//           return
//         }

//         const serverCart = backendCartResponse.data || []
//         const serverProductMap = new Map(
//           serverCart.map((item) => [item.product._id, item.quantity || 1])
//         )

//         // Process each local cart item
//         const syncPromises = localCart.map(async (item: CartItem) => {
//           const productId = item.product?._id
//           if (!productId) return null

//           const localQty = item.quantity || 1
//           const serverQty = serverProductMap.get(productId) || 0

//           // Only add the difference to avoid duplicating quantities
//           if (localQty > serverQty) {
//             return addProductToCart({
//               productId,
//               quantity: localQty - serverQty,
//             })
//           }
//           return null
//         })

//         // Wait for all sync operations to complete
//         await Promise.all(syncPromises.filter(Boolean))

//         // Clear local storage after successful sync
//         localStorage.removeItem('cart')

//         // Fetch updated cart state from backend
//         const updatedCartResponse = await getCartProducts()
//         if (!updatedCartResponse.hasError && updatedCartResponse.data) {
//           // Update Redux with the latest cart state
//           dispatch(cartActions.setCart({ cartItems: updatedCartResponse.data }))
//         }
//       } catch (error) {
//         console.error('Error syncing cart:', error)
//       }
//     }

//     syncCart()
//   }, [session])

//   return null
// }

// export default CartSyncer

// 'use client'
// import { useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import {
//   addProductToCart,
//   removeProductFromCart,
//   getCartProducts,
// } from '@/lib/server-actions/product'
// import { useAppDispatch } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import { CartItem } from '@/lib/types'

// const CartSyncer = () => {
//   const { data: session } = useSession()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     if (!session?.user) return

//     const syncCart = async () => {
//       try {
//         // Always fetch server cart first to get the current state
//         const backendCartResponse = await getCartProducts()

//         if (backendCartResponse.hasError) {
//           console.error(
//             'Failed to fetch backend cart:',
//             backendCartResponse.message
//           )
//           return
//         }

//         const serverCart = backendCartResponse.data || []

//         // Check if localStorage has any cart data
//         const localCartString = localStorage.getItem('cart')

//         // If no local cart data, just use server cart
//         if (!localCartString) {
//           dispatch(cartActions.setCart({ cartItems: serverCart }))
//           return
//         }

//         let localCart: CartItem[] = []
//         try {
//           localCart = JSON.parse(localCartString)
//         } catch (parseError) {
//           console.error('Invalid localStorage cart data:', parseError)
//           // Clear invalid data and use server cart
//           localStorage.removeItem('cart')
//           dispatch(cartActions.setCart({ cartItems: serverCart }))
//           return
//         }

//         // If local cart is empty, just use server cart
//         if (!Array.isArray(localCart) || localCart.length === 0) {
//           dispatch(cartActions.setCart({ cartItems: serverCart }))
//           localStorage.removeItem('cart') // Clean up empty cart
//           return
//         }

//         // Only sync if we have meaningful local cart data
//         // Filter out invalid items from local cart
//         const validLocalCart = localCart.filter(
//           (item) =>
//             item && item.product && item.product._id && item.quantity > 0
//         )

//         if (validLocalCart.length === 0) {
//           // No valid items in local cart, use server cart
//           dispatch(cartActions.setCart({ cartItems: serverCart }))
//           localStorage.removeItem('cart')
//           return
//         }

//         // Create maps for easier comparison
//         const serverProductMap = new Map(
//           serverCart.map((item) => [item.product._id, item.quantity || 1])
//         )

//         const localProductMap = new Map(
//           validLocalCart.map((item: CartItem) => [
//             item.product._id,
//             item.quantity || 1,
//           ])
//         )

//         // Calculate operations needed to sync server with local state
//         const syncOperations: Array<{
//           productId: string
//           type: 'add' | 'remove'
//           quantity: number
//         }> = []

//         // Check each local item against server
//         for (const [productId, localQty] of Array.from(localProductMap)) {
//           if (!productId) continue

//           const serverQty = serverProductMap.get(productId) || 0

//           if (localQty > serverQty) {
//             // Local has more - add the difference
//             syncOperations.push({
//               productId,
//               type: 'add',
//               quantity: localQty - serverQty,
//             })
//           } else if (localQty < serverQty && localQty > 0) {
//             // Local has fewer - remove the difference
//             syncOperations.push({
//               productId,
//               type: 'remove',
//               quantity: serverQty - localQty,
//             })
//           }
//         }

//         // Check for items that exist on server but not locally (should be removed)
//         for (const [productId, serverQty] of Array.from(serverProductMap)) {
//           if (!localProductMap.has(productId) && serverQty > 0) {
//             syncOperations.push({
//               productId,
//               type: 'remove',
//               quantity: serverQty,
//             })
//           }
//         }

//         // Only proceed with sync if there are operations to perform
//         if (syncOperations.length > 0) {
//           console.log('Syncing cart operations:', syncOperations)

//           // Execute sync operations
//           const syncPromises = syncOperations.map(async (operation) => {
//             try {
//               if (operation.type === 'add') {
//                 return await addProductToCart({
//                   productId: operation.productId,
//                   quantity: operation.quantity,
//                 })
//               } else {
//                 return await removeProductFromCart({
//                   productId: operation.productId,
//                   quantity: operation.quantity,
//                 })
//               }
//             } catch (error: any) {
//               console.error(
//                 `Failed to sync ${operation.type} for ${operation.productId}:`,
//                 error
//               )
//               return { hasError: true, message: error.message }
//             }
//           })

//           // Wait for all sync operations to complete
//           const results = await Promise.all(syncPromises)

//           // Check if any sync operation failed
//           const hasFailedSync = results.some((result) => result?.hasError)

//           if (hasFailedSync) {
//             console.warn('Some cart sync operations failed, but continuing...')
//           }

//           // Fetch updated cart state from backend after sync
//           const updatedCartResponse = await getCartProducts()
//           if (!updatedCartResponse.hasError && updatedCartResponse.data) {
//             dispatch(
//               cartActions.setCart({ cartItems: updatedCartResponse.data })
//             )
//           }
//         } else {
//           // No sync needed, just use server cart
//           console.log('No cart sync needed, using server cart')
//           dispatch(cartActions.setCart({ cartItems: serverCart }))
//         }

//         // IMPORTANT: Always clear localStorage after sync attempt
//         // This prevents future conflicts
//         localStorage.removeItem('cart')
//       } catch (error) {
//         console.error('Error syncing cart:', error)

//         // On sync failure, still try to load server cart
//         try {
//           const fallbackCartResponse = await getCartProducts()
//           if (!fallbackCartResponse.hasError && fallbackCartResponse.data) {
//             dispatch(
//               cartActions.setCart({ cartItems: fallbackCartResponse.data })
//             )
//           }
//           // Clear localStorage even on error to prevent future conflicts
//           localStorage.removeItem('cart')
//         } catch (fallbackError) {
//           console.error('Fallback cart load failed:', fallbackError)
//         }
//       }
//     }

//     // Small delay to ensure session is fully loaded
//     const timeoutId = setTimeout(() => {
//       syncCart()
//     }, 100)

//     return () => clearTimeout(timeoutId)
//   }, [session, dispatch])

//   // Handle logout cleanup
//   useEffect(() => {
//     if (!session?.user) {
//       // When user logs out, load cart from localStorage
//       try {
//         const localCart = JSON.parse(localStorage.getItem('cart') || '[]')

//         // Validate the local cart data
//         const validLocalCart = Array.isArray(localCart)
//           ? localCart.filter(
//               (item: any) =>
//                 item && item.product && item.product._id && item.quantity > 0
//             )
//           : []

//         dispatch(cartActions.setCart({ cartItems: validLocalCart }))
//       } catch (error) {
//         console.error('Error loading local cart after logout:', error)
//         dispatch(cartActions.clearCart())
//         // Clear corrupted localStorage data
//         localStorage.removeItem('cart')
//       }
//     }
//   }, [session?.user, dispatch])

//   return null
// }

// export default CartSyncer

'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  addProductToCart,
  removeProductFromCart,
  getCartProducts,
} from '@/lib/server-actions/product'
import { useAppDispatch } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { CartItem } from '@/lib/types'

const CartSyncer = () => {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()

  // Handle login - sync local cart with server
  useEffect(() => {
    if (status === 'loading' || !session?.user) return

    const syncCartOnLogin = async () => {
      try {
        console.log('🚀 Starting cart sync on login...')

        // First, get server cart to see current state
        const serverCartResponse = await getCartProducts()
        if (serverCartResponse.hasError) {
          console.error(
            'Failed to fetch server cart:',
            serverCartResponse.message
          )
          return
        }

        const serverCart = serverCartResponse.data || []
        console.log('📦 Server cart:', serverCart)

        // Check localStorage for any pending changes
        const localCartString = localStorage.getItem('cart')
        if (!localCartString) {
          // No local cart, just use server cart
          console.log('✅ No local cart found, using server cart')
          dispatch(cartActions.setCart({ cartItems: serverCart }))
          return
        }

        let localCart: CartItem[] = []
        try {
          localCart = JSON.parse(localCartString)
        } catch (parseError) {
          console.error('❌ Invalid localStorage cart data:', parseError)
          localStorage.removeItem('cart')
          dispatch(cartActions.setCart({ cartItems: serverCart }))
          return
        }

        // Validate local cart data
        const validLocalCart = localCart.filter(
          (item) => item?.product?._id && item.quantity >= 0
        )

        if (validLocalCart.length === 0) {
          console.log('✅ No valid local cart items, using server cart')
          localStorage.removeItem('cart')
          dispatch(cartActions.setCart({ cartItems: serverCart }))
          return
        }

        console.log('🔄 Local cart found:', validLocalCart)

        // ✅ IMPROVED SYNC LOGIC
        // Instead of trying to merge, we'll replace server cart with local cart state
        // This ensures that any deletions made while offline are preserved

        // Create a map of local cart for easier lookup
        const localCartMap = new Map(
          validLocalCart.map((item) => [item.product._id, item.quantity])
        )

        // Create a map of server cart for comparison
        const serverCartMap = new Map(
          serverCart.map((item) => [item.product._id, item.quantity])
        )

        // Build sync operations
        const syncOperations: Array<{
          productId: string
          action: 'set' | 'remove'
          quantity: number
        }> = []

        // Handle items in local cart
        for (const [productId, localQty] of Array.from(localCartMap)) {
          const serverQty = serverCartMap.get(productId) || 0

          if (localQty === 0 && serverQty > 0) {
            // Item was removed locally, remove from server
            syncOperations.push({
              productId,
              action: 'remove',
              quantity: serverQty,
            })
          } else if (localQty !== serverQty && localQty > 0) {
            // Quantity differs, set to local quantity
            syncOperations.push({
              productId,
              action: 'set',
              quantity: localQty,
            })
          }
        }

        // Handle items that exist on server but not in local cart (should be removed)
        for (const [productId, serverQty] of Array.from(serverCartMap)) {
          if (!localCartMap.has(productId) && serverQty > 0) {
            syncOperations.push({
              productId,
              action: 'remove',
              quantity: serverQty,
            })
          }
        }

        if (syncOperations.length > 0) {
          console.log('🔄 Executing sync operations:', syncOperations)

          // Execute all sync operations
          for (const operation of syncOperations) {
            try {
              if (operation.action === 'remove') {
                await removeProductFromCart({
                  productId: operation.productId,
                  quantity: operation.quantity,
                })
                console.log(`✅ Removed ${operation.productId}`)
              } else if (operation.action === 'set') {
                // For setting quantity, we need to calculate the difference
                const currentServerQty =
                  serverCartMap.get(operation.productId) || 0
                const quantityDiff = operation.quantity - currentServerQty

                if (quantityDiff > 0) {
                  await addProductToCart({
                    productId: operation.productId,
                    quantity: quantityDiff,
                  })
                } else if (quantityDiff < 0) {
                  await removeProductFromCart({
                    productId: operation.productId,
                    quantity: Math.abs(quantityDiff),
                  })
                }
                console.log(
                  `✅ Set ${operation.productId} to ${operation.quantity}`
                )
              }
            } catch (error) {
              console.error(`❌ Failed to sync ${operation.productId}:`, error)
              // Continue with other operations even if one fails
            }
          }

          // Fetch final cart state after all operations
          const finalCartResponse = await getCartProducts()
          if (!finalCartResponse.hasError && finalCartResponse.data) {
            dispatch(cartActions.setCart({ cartItems: finalCartResponse.data }))
            console.log('✅ Cart sync completed, final state loaded')
          }
        } else {
          // No sync needed, carts are already in sync
          console.log('✅ Carts already in sync')
          dispatch(cartActions.setCart({ cartItems: serverCart }))
        }

        // Always clear localStorage after successful sync
        localStorage.removeItem('cart')
        console.log('✅ Local cart cleared after sync')
      } catch (error) {
        console.error('❌ Cart sync failed:', error)

        // Fallback: just load server cart
        try {
          const fallbackResponse = await getCartProducts()
          if (!fallbackResponse.hasError && fallbackResponse.data) {
            dispatch(cartActions.setCart({ cartItems: fallbackResponse.data }))
          }
        } catch (fallbackError) {
          console.error('❌ Fallback cart load failed:', fallbackError)
        }

        // Clear localStorage to prevent future issues
        localStorage.removeItem('cart')
      }
    }

    // Add small delay to ensure session is stable
    const timeoutId = setTimeout(syncCartOnLogin, 100)
    return () => clearTimeout(timeoutId)
  }, [session?.user, status, dispatch])

  // Handle logout - save current cart to localStorage
  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      console.log('🔄 User logged out, managing local cart...')

      // When user logs out, try to load from localStorage
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const localCart = JSON.parse(savedCart)
          const validCart = Array.isArray(localCart)
            ? localCart.filter(
                (item) => item?.product?._id && item.quantity > 0
              )
            : []

          dispatch(cartActions.setCart({ cartItems: validCart }))
          console.log('✅ Loaded local cart after logout')
        } else {
          // No saved cart, start fresh
          dispatch(cartActions.clearCart())
          console.log('✅ No local cart found, starting fresh')
        }
      } catch (error) {
        console.error('❌ Error loading local cart:', error)
        dispatch(cartActions.clearCart())
        localStorage.removeItem('cart')
      }
    }
  }, [session?.user, status, dispatch])

  return null
}

export default CartSyncer
