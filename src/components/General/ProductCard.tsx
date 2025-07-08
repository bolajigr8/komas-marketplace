// 'use client'

// import { Product } from '@/lib/types'
// import React, { useEffect, useState, memo, useMemo } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Card } from '../ui/card'
// import { Button } from '../ui/button'
// import {
//   RiHeartLine,
//   RiShoppingCart2Line,
//   RiStarFill,
//   RiImageLine,
// } from 'react-icons/ri'
// import { addProductToCart } from '@/lib/server-actions/product'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { useToast } from '@/hooks/use-toast'
// import { useSession } from 'next-auth/react'
// import CartCounter from '../CartPage/CartCounter'
// import CustomSlider from './CustomSlider'

// // Loading skeleton for images
// const ImageSkeleton = () => (
//   <div className='w-full h-full bg-gray-100 animate-pulse flex items-center justify-center'>
//     <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
//       <RiImageLine className='w-8 h-8 text-gray-300' />
//     </div>
//   </div>
// )

// // Fallback component for missing images
// const ImageFallback = ({ message = 'No image available' }) => (
//   <div className='flex items-center justify-center w-full h-full bg-gray-100 rounded-t-lg'>
//     <div className='flex flex-col items-center justify-center p-4 text-gray-400'>
//       <RiImageLine className='w-12 h-12 mb-2' />
//       <span className='text-sm text-center'>{message}</span>
//     </div>
//   </div>
// )

// type ProductCardProps = {
//   product: Product
//   showCartBtn?: boolean
//   categoryName?: string
//   className?: string
//   viewMode?: 'grid' | 'list'
//   priority?: boolean
// }

// const ProductCard = memo(
//   ({
//     product,
//     categoryName,
//     showCartBtn = true,
//     className,
//     viewMode = 'grid',
//     priority = false,
//   }: ProductCardProps) => {
//     const isGrid = viewMode === 'grid'
//     const [isSync, setIsSync] = useState(true)
//     const [isImageLoaded, setIsImageLoaded] = useState(false)
//     const [imageError, setImageError] = useState(false)
//     const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([])
//     const dispatch = useAppDispatch()
//     const { toast } = useToast()
//     const { data: session } = useSession()

//     // Use useMemo to calculate hasImages whenever product changes
//     const hasImages = useMemo(() => {
//       return (
//         Array.isArray(product.images) &&
//         product.images.length > 0 &&
//         product.images.some((img) => !!img)
//       )
//     }, [product.images])

//     // Process images with optimization
//     const processedImages = useMemo(() => {
//       if (!product.images) return []

//       const imageArray = Array.isArray(product.images)
//         ? product.images
//         : [product.images]
//       return imageArray
//         .filter((img) => !!img)
//         .map((image) => `${process.env.NEXT_PUBLIC_AWS_URL}/products/${image}`)
//     }, [product.images])

//     // Optimized sizes attribute for different layouts
//     const getSizesAttribute = (isSlider = false) => {
//       if (isGrid) {
//         return isSlider
//           ? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
//           : '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
//       }
//       return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
//     }

//     const cartProducts = useAppSelector((state) => state.cart.products)
//     const cartItem = cartProducts.find(
//       (item) => item.product?._id === product._id
//     )

//     // Reset image states when product changes
//     useEffect(() => {
//       setImageError(false)
//       setIsImageLoaded(false)
//       setImageLoadingStates(Array(processedImages.length).fill(true))
//     }, [product._id, processedImages.length])

//     useEffect(() => {
//       dispatch(cartActions.initializeCart())
//     }, [dispatch, session?.user])

//     const handleAddToCart = async () => {
//       if (!isSync) return

//       try {
//         setIsSync(false)
//         dispatch(
//           cartActions.addToCart({
//             product: product,
//             quantity: 1,
//           })
//         )

//         toast({
//           description: 'Added to cart',
//           duration: 2000,
//         })

//         if (session?.user) {
//           const res = await addProductToCart({
//             productId: product._id,
//             quantity: 1,
//           })
//           if (res.hasError) throw new Error(res.message)
//         }
//       } catch (error) {
//         dispatch(
//           cartActions.removeFromCart({
//             productId: product._id,
//           })
//         )

//         toast({
//           title: 'Error syncing cart',
//           description: 'Please try again',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsSync(true)
//       }
//     }

//     const handleAddToWishlist = () => {
//       toast({
//         description: 'Added to wishlist',
//         duration: 2000,
//       })
//     }

//     const handleImageError = () => {
//       setImageError(true)
//       setIsImageLoaded(false)
//     }

//     const handleImageLoad = (index = 0) => {
//       setIsImageLoaded(true)
//       setImageLoadingStates((prev) => {
//         const newStates = [...prev]
//         newStates[index] = false
//         return newStates
//       })
//     }

//     // Preload first image for better performance
//     useEffect(() => {
//       if (processedImages.length > 0 && priority) {
//         const img = new window.Image()
//         img.src = processedImages[0]
//       }
//     }, [processedImages, priority])

//     return (
//       <Card
//         key={product._id}
//         className={`group hover:shadow-lg transition-shadow h-full ${
//           isGrid ? 'w-full max-w-sm' : 'w-full'
//         } ${className}`}
//       >
//         <div
//           className={`flex flex-col justify-between h-full w-full ${
//             isGrid ? '' : 'sm:flex-row items-stretch'
//           }`}
//         >
//           <div
//             className={`relative ${
//               isGrid ? 'aspect-square w-full' : 'w-full sm:w-1/3'
//             }`}
//           >
//             {product.discount && product.discount > 0 && (
//               <span className='absolute top-2 left-2 bg-[#3bb77e] text-white px-2 py-1 rounded-full text-sm z-20'>
//                 {product.discount}% Off
//               </span>
//             )}
//             <Button
//               variant='ghost'
//               size='icon'
//               className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white/80 backdrop-blur-sm hover:bg-white/90'
//               onClick={handleAddToWishlist}
//               aria-label='Add to wishlist'
//             >
//               <RiHeartLine className='w-5 h-5' />
//             </Button>

//             <Link
//               href={`/product/${product._id}`}
//               className='block w-full h-full'
//             >
//               {hasImages && !imageError ? (
//                 processedImages.length > 1 ? (
//                   <div className='relative w-full h-full'>
//                     <CustomSlider
//                       options={{ loop: true, align: 'center', dragFree: true }}
//                       autoplay={true}
//                       autoplayDelay={3000}
//                       classNames={{
//                         outerWrapper:
//                           'rounded-lg overflow-hidden w-full h-full',
//                       }}
//                     >
//                       {processedImages.map((imageUrl, index) => (
//                         <div
//                           key={`${product._id}-${index}`}
//                           className='relative w-full h-full'
//                         >
//                           {/* Loading skeleton */}
//                           {imageLoadingStates[index] && (
//                             <div className='absolute inset-0 z-10'>
//                               <ImageSkeleton />
//                             </div>
//                           )}

//                           <Image
//                             src={imageUrl}
//                             alt={`${product.name} - ${index + 1}`}
//                             fill
//                             sizes={getSizesAttribute(true)}
//                             className='object-contain md:object-cover object-center transition-all duration-300 group-hover:scale-105'
//                             style={{
//                               opacity: imageLoadingStates[index] ? 0 : 1,
//                             }}
//                             priority={priority && index === 0}
//                             onLoad={() => handleImageLoad(index)}
//                             onError={handleImageError}
//                             loading={index === 0 ? 'eager' : 'lazy'}
//                             quality={85}
//                             unoptimized={false}
//                             placeholder='blur'
//                             blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
//                           />
//                         </div>
//                       ))}
//                     </CustomSlider>
//                   </div>
//                 ) : (
//                   <div className='relative w-full h-full'>
//                     {/* Loading skeleton for single image */}
//                     {!isImageLoaded && (
//                       <div className='absolute inset-0 z-10'>
//                         <ImageSkeleton />
//                       </div>
//                     )}

//                     <Image
//                       src={processedImages[0]}
//                       alt={product.name}
//                       fill
//                       sizes={getSizesAttribute(false)}
//                       className='object-contain md:object-cover object-center rounded-t-lg transition-all duration-300 group-hover:scale-105'
//                       style={{
//                         opacity: isImageLoaded ? 1 : 0,
//                       }}
//                       priority={priority}
//                       onLoad={() => handleImageLoad()}
//                       onError={handleImageError}
//                       loading={priority ? 'eager' : 'lazy'}
//                       quality={85}
//                       unoptimized={false}
//                       placeholder='blur'
//                       blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
//                     />
//                   </div>
//                 )
//               ) : (
//                 <ImageFallback />
//               )}
//             </Link>
//           </div>

//           <div
//             className={`p-4 flex flex-col ${
//               isGrid ? 'flex-grow' : 'w-full sm:w-2/3 h-full justify-between'
//             }`}
//           >
//             <Link href={`/product/${product._id}`} className='flex-grow'>
//               <p className='text-sm text-gray-500 mb-1 truncate'>
//                 {typeof product.category === 'object' &&
//                 product.category !== null
//                   ? product.category.name
//                   : categoryName || 'Category'}
//               </p>
//               <h3 className='font-medium mb-2 group-hover:text-[#3bb77e] transition-colors line-clamp-2'>
//                 {product.name}
//               </h3>

//               {!isGrid && (
//                 <p className='text-gray-600 mb-4 line-clamp-2'>
//                   {product.description}
//                 </p>
//               )}

//               {product.rating && product.rating > 0 && (
//                 <div className='flex items-center mb-3'>
//                   <div className='flex items-center text-yellow-400 mr-2'>
//                     {Array(5)
//                       .fill(0)
//                       .map((_, i) => (
//                         <RiStarFill
//                           key={i}
//                           className={
//                             i < Math.floor(product.rating || 0)
//                               ? 'text-yellow-400'
//                               : 'text-gray-200'
//                           }
//                         />
//                       ))}
//                   </div>
//                   <span className='text-sm text-gray-500'>
//                     ({product.rating})
//                   </span>
//                 </div>
//               )}
//             </Link>

//             <div className='flex items-center justify-between w-full mt-auto pt-2'>
//               <div>
//                 <p className='font-medium text-lg text-[#3bb77e]'>
//                   ₦
//                   {(
//                     product.price *
//                     (1 - (product.discount || 0) / 100)
//                   ).toLocaleString()}
//                 </p>
//                 {product.discount && product.discount > 0 && (
//                   <p className='text-sm text-gray-500 line-through'>
//                     ₦{product.price.toLocaleString()}
//                   </p>
//                 )}
//               </div>

//               {showCartBtn && (
//                 <div>
//                   {cartItem ? (
//                     <CartCounter
//                       productId={product._id}
//                       initialQuantity={cartItem.quantity}
//                       maxQuantity={product.quantity}
//                     />
//                   ) : (
//                     <Button
//                       size='icon'
//                       className='bg-[#3bb77e] hover:bg-[#2ea56c] text-white transition-all duration-200 hover:scale-105'
//                       onClick={handleAddToCart}
//                       disabled={!isSync}
//                       aria-label='Add to cart'
//                     >
//                       <RiShoppingCart2Line className='w-5 h-5' />
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Card>
//     )
//   }
// )

// ProductCard.displayName = 'ProductCard'

// export default ProductCard


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

type ProductCardProps = {
  product: Product
  showCartBtn?: boolean
  categoryName?: string
  className?: string
  viewMode?: 'grid' | 'list'
  priority?: boolean
}

const ProductCard = memo(
  ({
    product,
    categoryName,
    showCartBtn = true,
    className,
    viewMode = 'grid',
    priority = false,
  }: ProductCardProps) => {
    const isGrid = viewMode === 'grid'
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

    // Optimized sizes attribute for different layouts
    const getSizesAttribute = (isSlider = false) => {
      if (isGrid) {
        return isSlider
          ? '(max-width: 640px) 95vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw'
          : '(max-width: 640px) 95vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw'
      }
      return '(max-width: 640px) 95vw, (max-width: 768px) 45vw, 30vw'
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

    return (
      <Card
        key={product._id}
        className={`group hover:shadow-lg transition-shadow h-full overflow-hidden ${
          isGrid ? 'w-full max-w-sm mx-auto' : 'w-full'
        } ${className}`}
      >
        <div
          className={`flex flex-col justify-between h-full w-full ${
            isGrid ? '' : 'sm:flex-row items-stretch'
          }`}
        >
          {/* Image Container - Fixed dimensions and overflow handling */}
          <div
            className={`relative overflow-hidden ${
              isGrid
                ? 'aspect-square w-full min-h-[200px] max-h-[300px] sm:min-h-[250px] sm:max-h-[350px]'
                : 'w-full sm:w-1/3 min-h-[200px] max-h-[250px] sm:min-h-[180px] sm:max-h-[220px]'
            }`}
          >
            {product.discount && product.discount > 0 && (
              <span className='absolute top-2 left-2 bg-[#3bb77e] text-white px-2 py-1 rounded-full text-xs sm:text-sm z-20'>
                {product.discount}% Off
              </span>
            )}
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white/80 backdrop-blur-sm hover:bg-white/90'
              onClick={handleAddToWishlist}
              aria-label='Add to wishlist'
            >
              <RiHeartLine className='w-4 h-4 sm:w-5 sm:h-5' />
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
                      autoplayDelay={3000}
                      classNames={{
                        outerWrapper:
                          'rounded-t-lg overflow-hidden w-full h-full',
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
                            className='object-contain transition-all duration-300 group-hover:scale-105'
                            style={{
                              opacity: imageLoadingStates[index] ? 0 : 1,
                              objectPosition: 'center',
                            }}
                            priority={priority && index === 0}
                            onLoad={() => handleImageLoad(index)}
                            onError={handleImageError}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            quality={85}
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
                      className='object-contain rounded-t-lg transition-all duration-300 group-hover:scale-105'
                      style={{
                        opacity: isImageLoaded ? 1 : 0,
                        objectPosition: 'center',
                      }}
                      priority={priority}
                      onLoad={() => handleImageLoad()}
                      onError={handleImageError}
                      loading={priority ? 'eager' : 'lazy'}
                      quality={85}
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

          {/* Content Container */}
          <div
            className={`p-3 sm:p-4 flex flex-col ${
              isGrid ? 'flex-grow' : 'w-full sm:w-2/3 h-full justify-between'
            }`}
          >
            <Link href={`/product/${product._id}`} className='flex-grow'>
              <p className='text-xs sm:text-sm text-gray-500 mb-1 truncate'>
                {typeof product.category === 'object' &&
                product.category !== null
                  ? product.category.name
                  : categoryName || 'Category'}
              </p>
              <h3 className='font-medium mb-2 group-hover:text-[#3bb77e] transition-colors line-clamp-2 text-sm sm:text-base'>
                {product.name}
              </h3>

              {!isGrid && (
                <p className='text-gray-600 mb-4 line-clamp-2 text-sm'>
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
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                  </div>
                  <span className='text-xs sm:text-sm text-gray-500'>
                    ({product.rating})
                  </span>
                </div>
              )}
            </Link>

            <div className='flex items-center justify-between w-full mt-auto pt-2'>
              <div className='flex-1 mr-2'>
                <p className='font-medium text-base sm:text-lg text-[#3bb77e] truncate'>
                  ₦
                  {(
                    product.price *
                    (1 - (product.discount || 0) / 100)
                  ).toLocaleString()}
                </p>
                {product.discount && product.discount > 0 && (
                  <p className='text-xs sm:text-sm text-gray-500 line-through'>
                    ₦{product.price.toLocaleString()}
                  </p>
                )}
              </div>

              {showCartBtn && (
                <div className='flex-shrink-0'>
                  {cartItem ? (
                    <CartCounter
                      productId={product._id}
                      initialQuantity={cartItem.quantity}
                      maxQuantity={product.quantity}
                    />
                  ) : (
                    <Button
                      size='icon'
                      className='bg-[#3bb77e] hover:bg-[#2ea56c] text-white transition-all duration-200 hover:scale-105 w-8 h-8 sm:w-10 sm:h-10'
                      onClick={handleAddToCart}
                      disabled={!isSync}
                      aria-label='Add to cart'
                    >
                      <RiShoppingCart2Line className='w-4 h-4 sm:w-5 sm:h-5' />
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