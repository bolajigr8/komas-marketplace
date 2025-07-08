'use client'
import { calculateDiscountPrice, formatNumber } from '@/lib/utils'
import React, { useState, useEffect } from 'react'
import { BsStarFill } from 'react-icons/bs'
import AddToCartBtn from '../General/AddToCartBtn'
import Accordion from './Accordion'
import { BiCheckCircle } from 'react-icons/bi'
import { Product } from '@/lib/types'
import { MinusIcon, PlusIcon, StarIcon } from '@radix-ui/react-icons'
import { RiShoppingCart2Line } from 'react-icons/ri'
import { addProductToCart } from '@/lib/server-actions/product'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import CartCounter from '../CartPage/CartCounter'
import { Button } from '../ui/button'

type PropsType = {
  product: Product
}

const ProductDetailsCard = ({ product }: PropsType) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [isSync, setIsSync] = useState(true)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { data: session } = useSession()

  console.log('Product Details Section', product)

  const cartProducts = useAppSelector((state) => state.cart.products)
  const cartItem = cartProducts.find(
    (item) => item.product?._id === product._id
  )

  useEffect(() => {
    dispatch(cartActions.initializeCart())
  }, [dispatch, session?.user])

  const handleChangeQuantity = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    if (!isSync) return

    try {
      setIsSync(false)
      dispatch(
        cartActions.addToCart({
          product: product,
          quantity: quantity,
        })
      )

      toast({
        description: 'Added to cart',
        duration: 2000,
      })

      if (session?.user) {
        const res = await addProductToCart({
          productId: product._id,
          quantity: quantity,
        })
        if (res.hasError) throw new Error(res.message)
      }
    } catch (error) {
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

  return (
    <div className='space-y-8'>
      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <div className='space-y-4 pb-6 border-b'>
          <h1 className='text-2xl font-bold text-gray-900'>{product.name}</h1>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <span className='text-2xl font-bold text-[#3bb77e]'>
                ₦{product.price.toLocaleString()}
              </span>
              {/* {product.oldPrice && ( */}
              <span className='text-lg text-gray-400 line-through'>
                ₦200,000
                {/* {product.oldPrice.toLocaleString()} */}
              </span>
              {/* )} */}
            </div>
            <div className='flex items-center gap-2'>
              <StarIcon className='w-5 h-5 text-yellow-400' />
              <span className='font-medium'>4.8</span>
              <span className='text-gray-500'>
                {/* ({product.reviews?.length || 0} reviews) */}2 reviews
              </span>
            </div>
          </div>
        </div>

        <div className='py-4 border-b'>
          <div className='flex items-center gap-2'>
            <span
              className={`w-3 h-3 rounded-full ${
                product.quantity > 0 ? 'bg-[#3bb77e]' : 'bg-red-500'
              }`}
            ></span>
            <span className='text-sm font-medium text-gray-700'>
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              {product.quantity > 0 && ` (${product.quantity} units)`}
            </span>
          </div>
        </div>

        <div className='py-6 border-b'>
          <p className='text-gray-600 leading-relaxed'>{product.description}</p>
        </div>

        <div className='pt-6 space-y-4'>
          {product.quantity > 0 ? (
            <>
              <div className='flex items-center gap-4'>
                {/* Show quantity selector only if item is not in cart */}
                {!cartItem && (
                  <QuantitySelector
                    value={quantity}
                    onChange={handleChangeQuantity}
                    max={product.quantity}
                    min={1}
                  />
                )}

                {/* Conditional rendering based on cart status */}
                {cartItem ? (
                  <div className='flex-1'>
                    <CartCounter
                      productId={product._id}
                      initialQuantity={cartItem.quantity}
                      maxQuantity={product.quantity}
                    />
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isSync}
                    className='flex-1 bg-[#3bb77e] hover:bg-[#2da56d] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                  >
                    <RiShoppingCart2Line className='w-5 h-5' />
                    Add to cart
                  </Button>
                )}
              </div>
              <button className='w-full border-2 border-[#3bb77e] text-[#3bb77e] px-8 py-3 rounded-lg font-medium hover:bg-[#3bb77e] hover:text-white transition-colors'>
                Buy Now
              </button>
            </>
          ) : (
            <button
              disabled
              className='w-full bg-gray-100 text-gray-400 px-8 py-3 rounded-lg font-medium cursor-not-allowed'
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <ul className='space-y-4'>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl' />
            <p className='text-sm text-gray-700'>
              Free delivery on orders over{' '}
              <span className='font-medium text-[#3bb77e]'>₦10,000</span>
            </p>
          </li>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl' />
            <p className='text-sm text-gray-700'>
              Delivery within Lagos: 24 hours
            </p>
          </li>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl' />
            <p className='text-sm text-gray-700'>
              Support available 7 days a week
            </p>
          </li>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl' />
            <p className='text-sm text-gray-700'>
              Secure payment with multiple options
            </p>
          </li>
        </ul>
      </div>

      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <Accordion
          data={[
            {
              title: 'Product Details',
              description: product.description,
            },
            {
              title: 'Return & Refund Policy',
              description:
                '7-day return policy for unused items in original packaging. Contact our customer service for return authorization.',
            },
            {
              title: 'Shipping Information',
              description:
                'Free shipping on orders above ₦10,000. Standard delivery within Lagos takes 24 hours. Nationwide delivery: 2-5 working days.',
            },
          ]}
        />
      </div>
    </div>
  )
}

const QuantitySelector = ({
  value,
  onChange,
  max,
  min = 1,
}: {
  value: number
  onChange: (quantity: number) => void
  max: number
  min: number
}) => {
  return (
    <div className='flex items-center border rounded-lg'>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className='px-3 py-2 text-gray-600 hover:text-[#3bb77e] disabled:text-gray-300'
      >
        <MinusIcon className='w-4 h-4' />
      </button>
      <span className='w-12 text-center font-medium'>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className='px-3 py-2 text-gray-600 hover:text-[#3bb77e] disabled:text-gray-300'
      >
        <PlusIcon className='w-4 h-4' />
      </button>
    </div>
  )
}

export default ProductDetailsCard
