'use client'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import React, { useState } from 'react'
import { addProductToCart, getCartProducts } from '@/lib/server-actions/product'
import { useToast } from '@/hooks/use-toast'
import { Product } from '@/lib/types'
import { Button } from '@nextui-org/react'
import { PiShoppingCartSimple, PiShoppingCartFill } from 'react-icons/pi'
import { useSession } from 'next-auth/react'

type AddToCartBtnProps = {
  product: Product
  className?: string
  children?: React.ReactNode
  quantity: number
  text?: string
}

const AddToCartBtn = ({
  product,
  className,
  quantity,
  text,
}: AddToCartBtnProps) => {
  const [isSync, setIsSync] = useState(true)
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const cartProducts = useAppSelector((state) => state.cart.products)
  const isInCart = cartProducts.some((item) => item.product._id === product._id)
  const { data: session, status } = useSession()

  // const handleAddToCart = async () => {
  //   try {
  //     dispatch(
  //       cartActions.addToCart({
  //         product: product,
  //         quantity: quantity,
  //         // isAuthenticated: !!session?.user,
  //       })
  //     );

  //     toast({
  //       description: "Added to cart",
  //       duration: 2000,
  //     });

  //     setIsSync(false);
  //     if (!!session?.user) {
  //       const res = await addProductToCart({
  //         productId: product._id,
  //         quantity: quantity,
  //       });

  //       if (res.hasError) throw new Error(res.message);
  //     }
  //   } catch (error) {
  //     dispatch(
  //       cartActions.removeFromCart({
  //         productId: product._id,
  //         // isAuthenticated: !!session?.user,
  //       })
  //     );

  //     toast({
  //       title: "Error syncing cart",
  //       description: "Please try again",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSync(true);
  //   }
  // };

  const handleAddToCart = async () => {
    if (!isSync) return

    try {
      setIsSync(false)

      // First update Redux store
      dispatch(
        cartActions.addToCart({
          product: product,
          quantity: quantity,
        })
      )

      // Then sync with backend if authenticated
      if (session?.user) {
        const res = await addProductToCart({
          productId: product._id,
          quantity: quantity,
        })

        if (res.hasError) throw new Error(res.message)

        // Fetch updated cart after successful backend update
        const updatedCart = await getCartProducts()
        if (!updatedCart.hasError && updatedCart.data) {
          dispatch(cartActions.setCart({ cartItems: updatedCart.data }))
        }
      } else {
        // Store in localStorage for later sync
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingItemIndex = localCart.findIndex(
          (item: { product: { _id: string } }) =>
            item.product?._id === product._id
        )

        if (existingItemIndex !== -1) {
          localCart[existingItemIndex].quantity += quantity
        } else {
          localCart.push({
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              discount: product.discount,
              images: product.images?.[0] || null,
            },
            quantity: quantity,
          })
        }

        localStorage.setItem('cart', JSON.stringify(localCart))
      }

      toast({
        description: 'Added to cart',
        duration: 2000,
      })
    } catch (error) {
      // Rollback Redux state in case of error
      dispatch(
        cartActions.removeFromCart({
          productId: product._id,
        })
      )

      toast({
        title: 'Error syncing cart',
        description: 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsSync(true)
    }
  }

  // const handleRemoveFromCart = async () => {
  //   try {
  //     dispatch(
  //       cartActions.removeFromCart({
  //         productId: product._id,
  //         // isAuthenticated: !!session?.user,
  //       })
  //     )

  //     toast({
  //       description: 'Removed from cart',
  //       duration: 2000,
  //     })

  //     setIsSync(false)
  //     const res = await addProductToCart({
  //       productId: product._id,
  //       quantity: 0,
  //     })

  //     if (res.hasError) throw new Error(res.message)
  //   } catch (error) {
  //     dispatch(
  //       cartActions.addToCart({
  //         product: product,
  //         quantity: quantity,
  //         // isAuthenticated: !!session?.user,
  //       })
  //     )
  //     // dispatch(cartActions.addToCart({ ...product, quantity: 1 }));

  //     toast({
  //       title: 'Error syncing cart',
  //       description: 'Please try again',
  //       variant: 'destructive',
  //     })
  //   } finally {
  //     setIsSync(true)
  //   }
  // }

  const handleRemoveFromCart = async () => {
    try {
      setIsSync(false)

      // First update Redux
      dispatch(
        cartActions.removeFromCart({
          productId: product._id,
        })
      )

      toast({
        description: 'Removed from cart',
        duration: 2000,
      })

      if (session?.user) {
        // Remove from backend
        const res = await addProductToCart({
          productId: product._id,
          quantity: 0,
        })

        if (res.hasError) throw new Error(res.message)

        // Fetch updated cart from backend
        const updatedCart = await getCartProducts()
        if (!updatedCart.hasError && updatedCart.data) {
          dispatch(cartActions.setCart({ cartItems: updatedCart.data }))
        }
      } else {
        // Update localStorage for guests
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
        const filteredCart = localCart.filter(
          (item: { product: { _id: string } }) =>
            item.product._id !== product._id
        )
        localStorage.setItem('cart', JSON.stringify(filteredCart))
      }
    } catch (error) {
      // Rollback in Redux in case of error
      dispatch(
        cartActions.addToCart({
          product: product,
          quantity: quantity,
        })
      )

      toast({
        title: 'Error syncing cart',
        description: 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsSync(true)
    }
  }

  return (
    <Button
      size='sm'
      variant={isInCart ? 'flat' : 'solid'}
      color={isInCart ? 'secondary' : 'primary'}
      onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
      disabled={!isSync}
      className={`relative group ${className}`}
      aria-label={isInCart ? 'Remove from cart' : `Add ${product.name} to cart`}
    >
      <span className='flex items-center gap-2'>
        {text && <span>{text}</span>}
        {isInCart ? (
          <>
            <PiShoppingCartFill className='text-lg' />
            {/* <span className="hidden sm:inline">In Cart</span> */}
          </>
        ) : (
          <>
            <PiShoppingCartSimple className='text-lg' />
            {/* <span className="hidden sm:inline">Add to Cart</span> */}
          </>
        )}
      </span>

      {!isSync && (
        <div className='absolute inset-0 bg-black/5 flex items-center justify-center rounded-lg'>
          <div className='size-4 border-2 border-primary border-t-transparent rounded-full animate-spin' />
        </div>
      )}
    </Button>
  )
}

export default AddToCartBtn
