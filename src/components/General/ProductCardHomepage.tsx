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

// Loading skeleton for images
const ImageSkeleton = () => (
  <div className='w-full h-full bg-gray-100 animate-pulse flex items-center justify-center'>
    <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
      <RiImageLine className='w-8 h-8 text-gray-300' />
    </div>
  </div>
)

// Fallback component for missing images
const ImageFallback = ({ message = 'No image available' }) => (
  <div className='flex items-center justify-center w-full h-full bg-gray-100 rounded-t-lg'>
    <div className='flex flex-col items-center justify-center p-4 text-gray-400'>
      <RiImageLine className='w-12 h-12 mb-2' />
      <span className='text-sm text-center'>{message}</span>
    </div>
  </div>
)

type ProductCardHomepageProps = {
  product: Product
  showCartBtn?: boolean
  categoryName?: string
  className?: string
  priority?: boolean
}

const ProductCardHomepage = memo(
  ({
    product,
    categoryName,
    showCartBtn = true,
    className,
    priority = false,
  }: ProductCardHomepageProps) => {
    const [isSync, setIsSync] = useState(true)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([])
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

    // Process images with optimization
    const processedImages = useMemo(() => {
      if (!product.images) return []

      const imageArray = Array.isArray(product.images)
        ? product.images
        : [product.images]
      return imageArray
        .filter((img) => !!img)
        .map((image) => `${process.env.NEXT_PUBLIC_AWS_URL}/products/${image}`)
    }, [product.images])

    // Optimized sizes attribute for Temu-style responsive design
    const getSizesAttribute = (isSlider = false) => {
      // Temu-style responsive sizing: 2 columns mobile, 3-6 desktop
      return '(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.66vw'
    }

    const cartProducts = useAppSelector((state) => state.cart.products)
    const cartItem = cartProducts.find(
      (item) => item.product?._id === product._id
    )

    // Reset image states when product changes
    useEffect(() => {
      setImageError(false)
      setIsImageLoaded(false)
      setImageLoadingStates(Array(processedImages.length).fill(true))
    }, [product._id, processedImages.length])

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
      setIsImageLoaded(false)
    }

    const handleImageLoad = (index = 0) => {
      setIsImageLoaded(true)
      setImageLoadingStates((prev) => {
        const newStates = [...prev]
        newStates[index] = false
        return newStates
      })
    }

    // Preload first image for better performance
    useEffect(() => {
      if (processedImages.length > 0 && priority) {
        const img = new window.Image()
        img.src = processedImages[0]
      }
    }, [processedImages, priority])

    // Calculate discounted price
    const discountedPrice = product.price * (1 - (product.discount || 0) / 100)
    const hasDiscount = product.discount && product.discount > 0

    return (
      <Card
        key={product._id}
        className={`group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full overflow-hidden 
          bg-white border border-gray-100 hover:border-[#3bb77e]/20 flex-shrink-0 ${className}`}
      >
        <div className='flex flex-col h-full'>
          {/* Image Container - Temu-style aspect ratio */}
          <div className='relative aspect-square overflow-hidden bg-gray-50'>
            {hasDiscount && (
              <div className='absolute top-1 left-1 sm:top-2 sm:left-2 z-20'>
                <span className='bg-gradient-to-r from-red-500 to-red-600 text-white px-1 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-semibold shadow-sm'>
                  -{product.discount}%
                </span>
              </div>
            )}

            <Button
              variant='ghost'
              size='icon'
              className='absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 
                bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 shadow-sm w-6 h-6 sm:w-8 sm:h-8'
              onClick={handleAddToWishlist}
              aria-label='Add to wishlist'
            >
              <RiHeartLine className='w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-red-500' />
            </Button>

            <Link
              href={`/product/${product._id}`}
              className='block w-full h-full'
            >
              {hasImages && !imageError ? (
                processedImages.length > 1 ? (
                  <div className='relative w-full h-full'>
                    <CustomSlider
                      options={{ loop: true, align: 'center', dragFree: true }}
                      autoplay={true}
                      autoplayDelay={4000}
                      classNames={{
                        outerWrapper: 'overflow-hidden w-full h-full',
                      }}
                    >
                      {processedImages.map((imageUrl, index) => (
                        <div
                          key={`${product._id}-${index}`}
                          className='relative w-full h-full flex-shrink-0'
                        >
                          {/* Loading skeleton */}
                          {imageLoadingStates[index] && (
                            <div className='absolute inset-0 z-10'>
                              <ImageSkeleton />
                            </div>
                          )}

                          <Image
                            src={imageUrl}
                            alt={`${product.name} - ${index + 1}`}
                            fill
                            sizes={getSizesAttribute(true)}
                            className='object-cover transition-all duration-500 group-hover:scale-110'
                            style={{
                              opacity: imageLoadingStates[index] ? 0 : 1,
                              objectPosition: 'center',
                            }}
                            priority={priority && index === 0}
                            onLoad={() => handleImageLoad(index)}
                            onError={handleImageError}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            quality={90}
                            placeholder='blur'
                            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
                          />
                        </div>
                      ))}
                    </CustomSlider>
                  </div>
                ) : (
                  <div className='relative w-full h-full'>
                    {/* Loading skeleton for single image */}
                    {!isImageLoaded && (
                      <div className='absolute inset-0 z-10'>
                        <ImageSkeleton />
                      </div>
                    )}

                    <Image
                      src={processedImages[0]}
                      alt={product.name}
                      fill
                      sizes={getSizesAttribute(false)}
                      className='object-cover transition-all duration-500 group-hover:scale-110'
                      style={{
                        opacity: isImageLoaded ? 1 : 0,
                        objectPosition: 'center',
                      }}
                      priority={priority}
                      onLoad={() => handleImageLoad()}
                      onError={handleImageError}
                      loading={priority ? 'eager' : 'lazy'}
                      quality={90}
                      placeholder='blur'
                      blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
                    />
                  </div>
                )
              ) : (
                <ImageFallback />
              )}
            </Link>
          </div>

          {/* Content Container - Temu-style compact layout with responsive padding */}
          <div className='p-2 sm:p-3 flex flex-col flex-grow'>
            <Link href={`/product/${product._id}`} className='flex-grow'>
              {/* Category - responsive text */}
              <p className='text-[10px] sm:text-xs text-gray-500 mb-1 truncate uppercase tracking-wide'>
                {typeof product.category === 'object' &&
                product.category !== null
                  ? product.category.name
                  : categoryName || 'Category'}
              </p>

              {/* Product Name - responsive with line clamping */}
              <h3
                className='font-medium mb-2 group-hover:text-[#3bb77e] transition-colors 
                line-clamp-2 text-xs sm:text-sm leading-tight min-h-[2.5rem] sm:min-h-[2.8rem]'
              >
                {product.name}
              </h3>

              {/* Rating - compact responsive design */}
              {product.rating && product.rating > 0 && (
                <div className='flex items-center mb-2'>
                  <div className='flex items-center text-yellow-400 mr-1'>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <RiStarFill
                          key={i}
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                  </div>
                  <span className='text-[10px] sm:text-xs text-gray-500'>
                    ({product.rating})
                  </span>
                </div>
              )}
            </Link>

            {/* Price and Cart Section - Temu-style bottom layout */}
            <div className='mt-auto pt-2 border-t border-gray-50'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  {/* Price display - responsive typography */}
                  <div className='flex flex-col'>
                    <div className='flex items-baseline gap-1 flex-wrap'>
                      <span className='text-sm sm:text-base font-bold text-[#3bb77e] leading-none'>
                        ₦{discountedPrice.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className='text-[10px] sm:text-xs text-gray-400 line-through'>
                          ₦{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <span className='text-[10px] sm:text-xs text-red-500 font-medium mt-0.5'>
                        Save ₦
                        {(product.price - discountedPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cart Button - responsive sizing */}
                {showCartBtn && (
                  <div className='flex-shrink-0'>
                    {cartItem ? (
                      <div className='scale-90 sm:scale-100 origin-right'>
                        <CartCounter
                          productId={product._id}
                          initialQuantity={cartItem.quantity}
                          maxQuantity={product.quantity}
                        />
                      </div>
                    ) : (
                      <Button
                        size='icon'
                        className='bg-gradient-to-r from-[#3bb77e] to-[#2ea56c] hover:from-[#2ea56c] hover:to-[#259c5a] 
                          text-white transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg
                          w-7 h-7 sm:w-9 sm:h-9'
                        onClick={handleAddToCart}
                        disabled={!isSync}
                        aria-label='Add to cart'
                      >
                        <RiShoppingCart2Line className='w-3 h-3 sm:w-4 sm:h-4' />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }
)

ProductCardHomepage.displayName = 'ProductCardHomepage'

export default ProductCardHomepage
