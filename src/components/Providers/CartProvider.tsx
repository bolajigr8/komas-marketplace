// 'use client'

// import { useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import useCartSync from '@/hooks/UseCartSync'

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const dispatch = useAppDispatch()
//   const { data: session } = useSession()

//   // useEffect(() => {
//   //   dispatch(cartActions.initializeCart())
//   // }, [dispatch, session])

//   useEffect(() => {
//     dispatch(cartActions.initializeCart())
//   }, [dispatch])

//   // Add this line to call your hook:
//   useCartSync()

//   return <>{children}</>
// }

'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  useEffect(() => {
    dispatch(cartActions.initializeCart())
  }, [dispatch, session])

  return <>{children}</>
}
