// 'use client'

// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import { addProductToCart } from '@/lib/server-actions/product'
// import { useEffect } from 'react'
// import { useSession } from 'next-auth/react'

// const useCartSync = () => {
//   const { data: session } = useSession()
//   const dispatch = useAppDispatch()
//   const localCart = useAppSelector((state) => state.cart.products)

//   useEffect(() => {
//     // When a user logs in and if there are products in the local cart,
//     // sync them with the backend.
//     const syncCart = async () => {
//       if (session && localCart.length > 0) {
//         for (const product of localCart) {
//           try {
//             // You might want to handle quantity merging logic on the backend.
//             const res = await addProductToCart({
//               productId: product.product._id,
//               quantity: product.quantity,
//             })

//             if (res.hasError) {
//               console.error(
//                 `Failed to sync product ${product.product._id}: ${res.message}`
//               )
//             }
//           } catch (err) {
//             console.error(err)
//           }
//         }

//         // Optionally clear the local cart after successful sync.
//         dispatch(cartActions.setCart({ cartItems: [] }))
//       }
//     }

//     syncCart()
//   }, [session, localCart, dispatch])
// }

// export default useCartSync

'use client'

import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { addProductToCart } from '@/lib/server-actions/product'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

const useCartSync = () => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const localCart = useAppSelector((state) => state.cart.products)

  useEffect(() => {
    const syncCart = async () => {
      if (session && localCart.length > 0) {
        console.log('🔁 Syncing local cart to backend cart...')

        for (const product of localCart) {
          console.log(
            `➡️ Syncing product ${product.product._id} (qty: ${product.quantity})`
          )

          try {
            const res = await addProductToCart({
              productId: product.product._id,
              quantity: product.quantity,
            })

            if (res.hasError) {
              console.error(
                `❌ Failed to sync product ${product.product._id}: ${res.message}`
              )
            } else {
              console.log(`✅ Synced product ${product.product._id}`)
            }
          } catch (err) {
            console.error(
              `❗ Error syncing product ${product.product._id}:`,
              err
            )
          }
        }

        console.log('🧹 Clearing local cart after sync...')
        dispatch(cartActions.setCart({ cartItems: [] }))
      }
    }

    syncCart()
  }, [session, localCart, dispatch])
}

export default useCartSync
