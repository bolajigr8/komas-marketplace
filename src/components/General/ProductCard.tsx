'use client'

import { Product } from '@/lib/types'
import React, { useEffect, useState, memo, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import {
  RiHeartLine,
  RiShoppingCart2Line,
  RiStarFill,
  RiImageLine,
} from 'react-icons/ri'
import { addProductToCart } from '@/lib/server-actions/product'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import CartCounter from '../CartPage/CartCounter'
import CustomSlider from './CustomSlider'

type ProductCardProps = {
  product: Product
  showCartBtn?: boolean
  className?: string
  viewMode?: 'grid' | 'list'
}

const ProductCard = memo(
  ({
    product,
    showCartBtn = true,
    className,
    viewMode = 'grid',
  }: ProductCardProps) => {
    const isGrid = viewMode === 'grid'
    const [isSync, setIsSync] = useState(true)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const dispatch = useAppDispatch()
    const { toast } = useToast()
    const { data: session } = useSession()

    // Use useMemo to calculate hasImages whenever product changes
    const hasImages = useMemo(() => {
      return (
        Array.isArray(product.images) &&
        product.images.length > 0 &&
        product.images.some((img) => !!img)
      )
    }, [product.images])
    // console.log(product.name, product._id, hasImages, product.images);
    const cartProducts = useAppSelector((state) => state.cart.products)
    const cartItem = cartProducts.find(
      (item) => item.product?._id === product._id
    )

    // Reset image error state when product changes
    useEffect(() => {
      setImageError(false)
      setIsImageLoaded(false)
    }, [product._id])

    useEffect(() => {
      dispatch(cartActions.initializeCart())
    }, [dispatch, session?.user])

    const handleAddToCart = async () => {
      if (!isSync) return

      try {
        setIsSync(false)
        dispatch(
          cartActions.addToCart({
            product: product,
            quantity: 1,
            // isAuthenticated: !!session?.user,
          })
        )

        toast({
          description: 'Added to cart',
          duration: 2000,
        })

        if (session?.user) {
          const res = await addProductToCart({
            productId: product._id,
            quantity: 1,
          })
          if (res.hasError) throw new Error(res.message)
        }
      } catch (error) {
        dispatch(
          cartActions.removeFromCart({
            productId: product._id,
            // isAuthenticated: !!session?.user,
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

    const handleAddToWishlist = () => {
      toast({
        description: 'Added to wishlist',
        duration: 2000,
      })
    }

    const handleImageError = () => {
      setImageError(true)
    }

    // Default image URL
    const imageUrl =
      'https://komas500.s3.eu-north-1.amazonaws.com/products/1-product-stockings-test-1740343084936.jpeg'

    // Determine if we should show images or placeholder
    // const shouldShowImages = hasImages && !imageError;

    return (
      <Card
        key={product._id}
        className={`group hover:shadow-lg transition-shadow h-full ${className}`}
      >
        <div
          className={`flex flex-col justify-between h-full w-full ${
            isGrid ? '' : 'sm:flex-row items-stretch'
          }`}
        >
          <div
            className={`relative ${
              isGrid ? 'aspect-square w-full' : 'w-full sm:w-1/3'
            }`}
          >
            {product.discount && product.discount > 0 && (
              <span className='absolute top-2 left-2 bg-[#3bb77e] text-white px-2 py-1 rounded-full text-sm z-10'>
                {product.discount}% Off
              </span>
            )}
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'
              onClick={handleAddToWishlist}
              aria-label='Add to wishlist'
            >
              <RiHeartLine className='w-5 h-5' />
            </Button>

            <Link
              href={`/product/${product._id}`}
              className='block w-full h-full'
            >
              {product.images && !imageError ? (
                Array.isArray(product.images) && product.images.length > 1 ? (
                  <CustomSlider
                    options={{ loop: true, align: 'center', dragFree: true }}
                    autoplay={true}
                    autoplayDelay={3000}
                    classNames={{
                      outerWrapper: 'rounded-lg overflow-hidden w-full h-full',
                    }}
                  >
                    {product.images.map((image, index) => (
                      <div
                        key={`${product._id}-${index}`}
                        className='relative w-full h-full'
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_AWS_URL}/products/${image}`}
                          alt={`${product.name} - ${index + 1}`}
                          fill
                          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                          className='object-cover'
                          priority={index === 0}
                          onLoad={() => index === 0 && setIsImageLoaded(true)}
                          onError={handleImageError}
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                    ))}
                  </CustomSlider>
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_AWS_URL}/products/${product.images}`}
                      alt={product.name}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                      className='object-cover rounded-t-lg'
                      priority
                      onLoad={() => setIsImageLoaded(true)}
                      onError={handleImageError}
                      loading='eager'
                    />
                  </div>
                )
              ) : (
                <div className='flex items-center justify-center w-full h-full bg-gray-100 rounded-t-lg'>
                  <div className='flex flex-col items-center justify-center p-4 text-gray-400'>
                    <RiImageLine className='w-12 h-12 mb-2' />
                    <span className='text-sm text-center'>
                      No image available
                    </span>
                  </div>
                </div>
              )}
            </Link>
          </div>
          <div
            className={`p-4 flex flex-col ${
              isGrid ? 'flex-grow' : 'w-full sm:w-2/3 h-full justify-between'
            }`}
          >
            <Link href={`/product/${product._id}`} className='flex-grow'>
              <p className='text-sm text-gray-500 mb-1 truncate'>
                {typeof product.category === 'string'
                  ? product.category
                  : product.category?.name}
              </p>
              <h3 className='font-medium mb-2 group-hover:text-[#3bb77e] transition-colors line-clamp-2'>
                {product.name}
              </h3>

              {!isGrid && (
                <p className='text-gray-600 mb-4 line-clamp-2'>
                  {product.description}
                </p>
              )}

              {product.rating && product.rating > 0 && (
                <div className='flex items-center mb-3'>
                  <div className='flex items-center text-yellow-400 mr-2'>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <RiStarFill
                          key={i}
                          className={
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-200'
                          }
                        />
                      ))}
                  </div>
                  <span className='text-sm text-gray-500'>
                    ({product.rating})
                  </span>
                </div>
              )}
            </Link>

            <div className='flex items-center justify-between w-full mt-auto pt-2'>
              <div>
                <p className='font-medium text-lg text-[#3bb77e]'>
                  ₦
                  {(
                    product.price *
                    (1 - (product.discount || 0) / 100)
                  ).toLocaleString()}
                </p>
                {product.discount && product.discount > 0 && (
                  <p className='text-sm text-gray-500 line-through'>
                    ₦{product.price.toLocaleString()}
                  </p>
                )}
              </div>

              {showCartBtn && (
                <div>
                  {cartItem ? (
                    <CartCounter
                      productId={product._id}
                      initialQuantity={cartItem.quantity}
                      maxQuantity={product.quantity}
                    />
                  ) : (
                    <Button
                      size='icon'
                      className='bg-[#3bb77e] hover:bg-[#2ea56c] text-white'
                      onClick={handleAddToCart}
                      disabled={!isSync}
                      aria-label='Add to cart'
                    >
                      <RiShoppingCart2Line className='w-5 h-5' />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }
)

ProductCard.displayName = 'ProductCard'

export default ProductCard
