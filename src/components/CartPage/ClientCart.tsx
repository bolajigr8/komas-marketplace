'use client'

import { useEffect, useMemo, useState } from 'react'
import CartGroups from '@/components/CartPage/CartGroups'
import { CartItem } from '@/lib/types'
import Link from 'next/link'
import Loader from '../General/Loader'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'

export function ClientCart() {
  const dispatch = useAppDispatch()
  const { products: cartProducts, isInitialized } = useAppSelector(
    (state) => state.cart
  )

  const { data: session, status: authStatus } = useSession()
  const isLoggedIn = !!session?.user

  const [isFetching, setIsFetching] = useState(false)

  // Initialize cart on first load (not per session change)
  useEffect(() => {
    if (!isInitialized && authStatus !== 'loading') {
      dispatch(cartActions.initializeCart())
    }
  }, [dispatch, isInitialized, authStatus])

  const productsByVendors = useMemo(() => {
    return cartProducts.reduce((groups, item) => {
      const vendorId = item.product?.vendor as string
      if (!vendorId) return groups

      if (!groups[vendorId]) groups[vendorId] = []
      groups[vendorId].push(item)

      return groups
    }, {} as Record<string, CartItem[]>)
  }, [cartProducts])

  // Loader if cart is still initializing or session is loading
  if (
    (authStatus === 'loading' || !isInitialized || isFetching) &&
    !cartProducts.length
  ) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Loader />
      </div>
    )
  }

  if (!cartProducts.length) {
    return (
      <div className='container mx-auto mt-12  px-4 py-16 text-center'>
        <div className='max-w-md mx-auto'>
          <h2 className='text-2xl font-bold mb-4'>Your cart is empty</h2>
          <p className='text-gray-600 mb-8'>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            href='/'
            className='bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mt-12 w-full container mx-auto px-4 pr-2 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Your Cart</h1>
      <CartGroups cart={productsByVendors} />
    </div>
  )
}
