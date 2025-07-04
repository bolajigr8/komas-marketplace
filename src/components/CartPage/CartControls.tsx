'use client'

import React, { useEffect, useState } from 'react'
import CartCounter from './CartCounter'
import { formatNumber } from '@/lib/utils'
import { BsTrash3 } from 'react-icons/bs'
import {
  getCartProducts,
  removeProductFromCart,
} from '@/lib/server-actions/product'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { Spinner } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'

type PropsType = {
  productId: string
  quantity: number
  price?: number
}

const CartControls = ({ productId, quantity }: PropsType) => {
  const cartProducts = useAppSelector((state) => state.cart?.products)
  const item = cartProducts?.find((p) => p.product?._id === productId)
  const [calculatedPrice, setCalculatedPrice] = useState<number>()
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const router = useRouter()

  console.log('product id from the cart controls', productId)

  useEffect(() => {
    const calculatePrice = () => {
      if (!item || !item.product) return 0
      return item.product?.price * item?.quantity
    }
    setCalculatedPrice(calculatePrice())
  }, [item, cartProducts])

  // const handleDelete = async () => {
  //   setIsDeleting(true);
  //   try {
  //     dispatch(
  //       cartActions.removeFromCart({
  //         productId,
  //         // isAuthenticated: !!session?.user,
  //       })
  //     );
  //     const res = await removeProductFromCart({
  //       productId,
  //       quantity: item?.quantity || quantity,
  //     });

  //     if (!res.hasError) {
  //       router.refresh();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // First update Redux state
      dispatch(
        cartActions.removeFromCart({
          productId,
        })
      )

      // Then sync with backend
      if (session?.user) {
        const res = await removeProductFromCart({
          productId,
          quantity: item?.quantity || quantity,
        })

        if (res.hasError) {
          throw new Error(res.message || 'Failed to remove from cart')
        }

        // Fetch updated cart after successful backend update
        const updatedCart = await getCartProducts()
        if (!updatedCart.hasError && updatedCart.data) {
          dispatch(cartActions.setCart({ cartItems: updatedCart.data }))
        }
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      // Rollback Redux state
      if (item) {
        dispatch(
          cartActions.addToCart({
            product: item.product,
            quantity: item.quantity,
          })
        )
      }

      toast({
        title: 'Error removing item',
        description: 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='flex items-center space-x-4 max-sm:w-full max-sm:justify-between'>
      <CartCounter
        productId={productId}
        initialQuantity={item?.quantity || quantity}
        maxQuantity={item?.product?.quantity}
      />
      <div className='flex items-center space-x-3'>
        <span className='font-semibold text-gray-700'>
          ₦{formatNumber(calculatedPrice || 0)}
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className='
            text-blue-500 hover:text-red-700 
            disabled:opacity-50 
            transition-colors
          '
        >
          {isDeleting ? <Spinner /> : <BsTrash3 size={18} />}
        </button>
      </div>
    </div>
  )
}

export default CartControls
