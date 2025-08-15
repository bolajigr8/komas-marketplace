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
// import AddProductToCartModal from './AddProductsToCartModal'
// import { fetchSignedImageUrl } from '@/lib/getImages'

// // Loading skeleton for images
// const ImageSkeleton = () => (
//   <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center'>
//     <div className='w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner'>
//       <RiImageLine className='w-8 h-8 text-gray-400' />
//     </div>
//   </div>
// )

// // Fallback component for missing images
// const ImageFallback = ({ message = 'No image available' }) => (
//   <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg border-2 border-dashed border-gray-200'>
//     <div className='flex flex-col items-center justify-center p-6 text-gray-400'>
//       <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3'>
//         <RiImageLine className='w-8 h-8' />
//       </div>
//       <span className='text-sm text-center font-medium'>{message}</span>
//     </div>
//   </div>
// )

// type ProductCardHomepageProps = {
//   product: Product
//   showCartBtn?: boolean
//   categoryName?: string
//   className?: string
//   priority?: boolean
// }

// const ProductCardSlider = memo(
//   ({
//     product,
//     categoryName,
//     showCartBtn = true,
//     className,
//     priority = false,
//   }: ProductCardHomepageProps) => {
//     const [isSync, setIsSync] = useState(true)
//     const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([])
//     const [showModal, setShowModal] = useState(false)
//     const [signedImageUrls, setSignedImageUrls] = useState<string[]>([])
//     const [isLoadingImages, setIsLoadingImages] = useState(true)

//     const dispatch = useAppDispatch()
//     const { toast } = useToast()
//     const { data: session } = useSession()

//     // Check if product has variants
//     const hasVariants = useMemo(() => {
//       return product.variants && product.variants.length > 0
//     }, [product.variants])

//     // Use useMemo to calculate hasImages whenever product changes
//     const hasImages = useMemo(() => {
//       return (
//         Array.isArray(product.images) &&
//         product.images.length > 0 &&
//         product.images.some((img) => !!img)
//       )
//     }, [product.images])

//     // Process original images array
//     const originalImages = useMemo(() => {
//       if (!product.images) return []
//       const imageArray = Array.isArray(product.images)
//         ? product.images
//         : [product.images]
//       return imageArray.filter((img) => !!img)
//     }, [product.images])

//     // Fetch signed image URLs dynamically - similar to CategoryList
//     useEffect(() => {
//       let isMounted = true
//       setIsLoadingImages(true)
//       setSignedImageUrls([])

//       const loadImages = async () => {
//         if (!originalImages.length) {
//           setIsLoadingImages(false)
//           return
//         }

//         try {
//           console.log(
//             `Attempting to fetch signed URLs for product: ${product.name}`
//           )

//           // Fetch signed URLs for all images
//           const urlPromises = originalImages.map(async (imageUrl) => {
//             try {
//               console.log(`Fetching signed URL for: ${imageUrl}`)
//               const signedUrl = await fetchSignedImageUrl(imageUrl, 'products')
//               return signedUrl || null
//             } catch (error) {
//               console.error(`Error fetching signed URL for ${imageUrl}:`, error)
//               return null
//             }
//           })

//           const urls = await Promise.all(urlPromises)
//           const validUrls = urls.filter((url): url is string => url !== null)

//           if (isMounted) {
//             setSignedImageUrls(validUrls)
//             setImageLoadingStates(Array(validUrls.length).fill(true))
//             console.log(
//               `Successfully loaded ${validUrls.length} signed URLs for product: ${product.name}`
//             )
//           }
//         } catch (error) {
//           console.error(
//             `Error loading images for product ${product.name}:`,
//             error
//           )
//         } finally {
//           if (isMounted) {
//             setIsLoadingImages(false)
//           }
//         }
//       }

//       loadImages()

//       return () => {
//         isMounted = false
//       }
//     }, [product._id, product.name, originalImages])

//     // Optimized sizes attribute for slider layout - Enhanced for better image quality
//     const getSizesAttribute = (isSlider = false) => {
//       return '(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 22vw, 18vw'
//     }

//     const cartProducts = useAppSelector((state) => state.cart.products)

//     // For products without variants, find cart item normally
//     // For products with variants, we'll handle this in the modal
//     const cartItem = useMemo(() => {
//       if (hasVariants) {
//         // For products with variants, we can't determine the exact cart item here
//         // since we don't know which variant the user wants to add
//         // Return any cart item for this product to show that something is in cart
//         return cartProducts.find((item) => item.product?._id === product._id)
//       } else {
//         // For products without variants, find exact match
//         return cartProducts.find(
//           (item) => item.product?._id === product._id && !item.variant
//         )
//       }
//     }, [cartProducts, product._id, hasVariants])

//     useEffect(() => {
//       dispatch(cartActions.initializeCart())
//     }, [dispatch, session?.user])

//     const handleAddToCart = async () => {
//       if (!isSync) return

//       // If product has variants, show modal instead of directly adding to cart
//       if (hasVariants) {
//         setShowModal(true)
//         return
//       }

//       // For products without variants, add directly to cart
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

//     const handleImageLoad = (index = 0) => {
//       setImageLoadingStates((prev) => {
//         const newStates = [...prev]
//         newStates[index] = false
//         return newStates
//       })
//     }

//     const handleImageError = (index = 0) => {
//       console.error(
//         `Image failed to load at index ${index}:`,
//         signedImageUrls[index]
//       )
//     }

//     // Preload first image for better performance
//     useEffect(() => {
//       if (signedImageUrls.length > 0 && priority) {
//         const img = new window.Image()
//         img.src = signedImageUrls[0]
//       }
//     }, [signedImageUrls, priority])

//     // Component to render optimized images
//     const OptimizedImage = ({
//       src,
//       alt,
//       index,
//       className = '',
//     }: {
//       src: string
//       alt: string
//       index: number
//       className?: string
//     }) => {
//       return (
//         <div className={`relative w-full h-full ${className}`}>
//           {/* Loading skeleton */}
//           {imageLoadingStates[index] && (
//             <div className='absolute inset-0 z-10'>
//               <ImageSkeleton />
//             </div>
//           )}

//           {/* Use regular img tag for S3 signed URLs to avoid Next.js Image optimization issues */}
//           {src.includes('amazonaws.com') || src.includes('X-Amz-Signature') ? (
//             <img
//               src={src}
//               alt={alt}
//               className='object-contain transition-all duration-500 group-hover:scale-105 p-3 sm:p-4 w-full h-full'
//               style={{
//                 opacity: imageLoadingStates[index] ? 0 : 1,
//                 objectPosition: 'center',
//               }}
//               onLoad={() => handleImageLoad(index)}
//               onError={() => handleImageError(index)}
//               loading={priority && index === 0 ? 'eager' : 'lazy'}
//             />
//           ) : (
//             <Image
//               src={src}
//               alt={alt}
//               fill
//               sizes={getSizesAttribute(signedImageUrls.length > 1)}
//               className='object-contain transition-all duration-500 group-hover:scale-105 p-3 sm:p-4'
//               style={{
//                 opacity: imageLoadingStates[index] ? 0 : 1,
//                 objectPosition: 'center',
//               }}
//               priority={priority && index === 0}
//               onLoad={() => handleImageLoad(index)}
//               onError={() => handleImageError(index)}
//               loading={index === 0 ? 'eager' : 'lazy'}
//               quality={90}
//               placeholder='blur'
//               blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
//             />
//           )}
//         </div>
//       )
//     }

//     return (
//       <>
//         <Card
//           key={product._id}
//           className={`group hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden border-0 shadow-sm bg-white w-full min-w-[270px] max-w-md mx-auto ${className}`}
//         >
//           <div className='flex flex-col justify-between h-full w-full'>
//             {/* Enhanced Image Container with increased height and gray background */}
//             <div className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/5] w-full min-h-[280px] max-h-[400px] rounded-t-lg'>
//               {/* Enhanced discount badge with modern styling */}
//               {product.discount && product.discount > 0 && (
//                 <div className='absolute top-3 left-3 z-20'>
//                   <div className='bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm'>
//                     -{product.discount}%
//                   </div>
//                 </div>
//               )}

//               {/* Enhanced wishlist button */}
//               <Button
//                 variant='ghost'
//                 size='icon'
//                 className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 bg-white/90 backdrop-blur-md hover:bg-white hover:scale-110 shadow-lg border-0 w-9 h-9 sm:w-10 sm:h-10'
//                 onClick={handleAddToWishlist}
//                 aria-label='Add to wishlist'
//               >
//                 <RiHeartLine className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700 hover:text-red-500 transition-colors' />
//               </Button>

//               <Link
//                 href={`/product/${product._id}`}
//                 className='block w-full h-full relative group/image'
//               >
//                 {/* Show loading state while fetching signed URLs */}
//                 {isLoadingImages ? (
//                   <div className='w-full h-full'>
//                     <ImageSkeleton />
//                   </div>
//                 ) : signedImageUrls.length > 0 ? (
//                   <div className='relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100'>
//                     {/* Primary image - always visible */}
//                     <div className='absolute inset-0 w-full h-full'>
//                       <OptimizedImage
//                         src={signedImageUrls[0]}
//                         alt={product.name}
//                         index={0}
//                       />
//                     </div>

//                     {/* Secondary image - shows on hover if available */}
//                     {signedImageUrls.length > 1 && (
//                       <div className='absolute inset-0 w-full h-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 ease-in-out'>
//                         <OptimizedImage
//                           src={signedImageUrls[1]}
//                           alt={`${product.name} - alternative view`}
//                           index={1}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <ImageFallback />
//                 )}
//               </Link>
//             </div>

//             {/* Enhanced Content Container with better spacing */}
//             <div className='p-5 sm:p-6 flex flex-col bg-white flex-grow'>
//               <Link
//                 href={`/product/${product._id}`}
//                 className='flex-grow space-y-2.5'
//               >
//                 {/* Enhanced category display */}
//                 <p className='text-xs sm:text-sm text-gray-500 font-semibold capitalize tracking-wide truncate'>
//                   {typeof product.category === 'object' &&
//                   product.category !== null
//                     ? product.category.name
//                     : categoryName || 'Category'}
//                 </p>

//                 {/* Enhanced product name with better typography */}
//                 <h3 className='font-semibold mb-2 group-hover:text-[#3bb77e] capitalize transition-colors duration-300 line-clamp-2 text-sm sm:text-base leading-tight'>
//                   {product.name}
//                 </h3>

//                 {/* Enhanced rating display */}
//                 {product.rating && product.rating > 0 && (
//                   <div className='flex items-center mb-3 space-x-2'>
//                     <div className='flex items-center'>
//                       {Array(5)
//                         .fill(0)
//                         .map((_, i) => (
//                           <RiStarFill
//                             key={i}
//                             className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
//                               i < Math.floor(product.rating || 0)
//                                 ? 'text-yellow-400'
//                                 : 'text-gray-200'
//                             }`}
//                           />
//                         ))}
//                     </div>
//                     <span className='text-xs sm:text-sm text-gray-500 font-medium'>
//                       ({product.rating})
//                     </span>
//                   </div>
//                 )}
//               </Link>

//               {/* Enhanced price and cart section */}
//               <div className='flex items-center justify-between w-full mt-auto pt-4'>
//                 <div className='flex-1 mr-3'>
//                   <p className='font-bold text-xl sm:text-2xl text-[#3bb77e] truncate'>
//                     ₦
//                     {(
//                       product.price *
//                       (1 - (product.discount || 0) / 100)
//                     ).toLocaleString()}
//                   </p>
//                   {product.discount && product.discount > 0 && (
//                     <p className='text-sm text-gray-500 line-through font-medium'>
//                       ₦{product.price.toLocaleString()}
//                     </p>
//                   )}
//                 </div>

//                 {showCartBtn && (
//                   <div className='flex-shrink-0'>
//                     {cartItem && !hasVariants ? (
//                       <CartCounter
//                         productId={product._id}
//                         initialQuantity={cartItem.quantity}
//                         maxQuantity={product.quantity}
//                       />
//                     ) : (
//                       <Button
//                         size='icon'
//                         className='bg-gradient-to-r from-[#3bb77e] to-[#2ea56c] hover:from-[#2ea56c] hover:to-[#259c5a] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg w-11 h-11 sm:w-12 sm:h-12 rounded-full border-0'
//                         onClick={handleAddToCart}
//                         disabled={!isSync}
//                         aria-label='Add to cart'
//                       >
//                         <RiShoppingCart2Line className='w-5 h-5 sm:w-6 sm:h-6' />
//                       </Button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Add Product to Cart Modal */}
//         <AddProductToCartModal
//           product={product}
//           isOpen={showModal}
//           onClose={() => setShowModal(false)}
//         />
//       </>
//     )
//   }
// )

// ProductCardSlider.displayName = 'ProductCardSlider'

// export default ProductCardSlider
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
import AddProductToCartModal from './AddProductsToCartModal'

// Loading skeleton for images
const ImageSkeleton = () => (
  <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center'>
    <div className='w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner'>
      <RiImageLine className='w-8 h-8 text-gray-400' />
    </div>
  </div>
)

// Fallback component for missing images
const ImageFallback = ({ message = 'No image available' }) => (
  <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg border-2 border-dashed border-gray-200'>
    <div className='flex flex-col items-center justify-center p-6 text-gray-400'>
      <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3'>
        <RiImageLine className='w-8 h-8' />
      </div>
      <span className='text-sm text-center font-medium'>{message}</span>
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

const ProductCardSlider = memo(
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
    const [showModal, setShowModal] = useState(false)
    const dispatch = useAppDispatch()
    const { toast } = useToast()
    const { data: session } = useSession()

    // Check if product has variants
    const hasVariants = useMemo(() => {
      return product.variants && product.variants.length > 0
    }, [product.variants])

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

    // Optimized sizes attribute for slider layout - Enhanced for better image quality
    const getSizesAttribute = (isSlider = false) => {
      return '(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 22vw, 18vw'
    }

    const cartProducts = useAppSelector((state) => state.cart.products)

    // For products without variants, find cart item normally
    // For products with variants, we'll handle this in the modal
    const cartItem = useMemo(() => {
      if (hasVariants) {
        // For products with variants, we can't determine the exact cart item here
        // since we don't know which variant the user wants to add
        // Return any cart item for this product to show that something is in cart
        return cartProducts.find((item) => item.product?._id === product._id)
      } else {
        // For products without variants, find exact match
        return cartProducts.find(
          (item) => item.product?._id === product._id && !item.variant
        )
      }
    }, [cartProducts, product._id, hasVariants])

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

      // If product has variants, show modal instead of directly adding to cart
      if (hasVariants) {
        setShowModal(true)
        return
      }

      // For products without variants, add directly to cart
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
      <>
        <Card
          key={product._id}
          className={`group hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden border-0 shadow-sm bg-white w-full min-w-[240px] max-w-md mx-auto ${className}`}
        >
          <div className='flex flex-col justify-between h-full w-full'>
            {/* Enhanced Image Container with increased height and gray background */}
            <div className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/5] w-full min-h-[280px] max-h-[400px] rounded-t-lg'>
              {/* Enhanced discount badge with modern styling */}
              {product.discount && product.discount > 0 && (
                <div className='absolute top-3 left-3 z-20'>
                  <div className='bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm'>
                    -{product.discount}%
                  </div>
                </div>
              )}

              {/* Enhanced wishlist button */}
              <Button
                variant='ghost'
                size='icon'
                className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 bg-white/90 backdrop-blur-md hover:bg-white hover:scale-110 shadow-lg border-0 w-9 h-9 sm:w-10 sm:h-10'
                onClick={handleAddToWishlist}
                aria-label='Add to wishlist'
              >
                <RiHeartLine className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700 hover:text-red-500 transition-colors' />
              </Button>

              <Link
                href={`/product/${product._id}`}
                className='block w-full h-full relative'
              >
                {hasImages && !imageError ? (
                  processedImages.length > 1 ? (
                    <div className='relative w-full h-full'>
                      <CustomSlider
                        options={{
                          loop: true,
                          align: 'center',
                          dragFree: true,
                        }}
                        autoplay={true}
                        autoplayDelay={4000}
                        classNames={{
                          outerWrapper:
                            'rounded-t-lg overflow-hidden w-full h-full',
                        }}
                      >
                        {processedImages.map((imageUrl, index) => (
                          <div
                            key={`${product._id}-${index}`}
                            className='relative w-full h-full flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100'
                          >
                            {/* Enhanced loading skeleton */}
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
                              className='object-contain transition-all duration-500 group-hover:scale-105 p-3 sm:p-4'
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
                    <div className='relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100'>
                      {/* Enhanced loading skeleton for single image */}
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
                        className='object-contain transition-all duration-500 group-hover:scale-105 p-3 sm:p-4'
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

            {/* Enhanced Content Container with better spacing */}
            <div className='p-5 sm:p-6 flex flex-col bg-white flex-grow'>
              <Link
                href={`/product/${product._id}`}
                className='flex-grow space-y-2.5'
              >
                {/* Enhanced category display */}
                <p className='text-xs sm:text-sm text-gray-500 font-semibold capitalize tracking-wide truncate'>
                  {typeof product.category === 'object' &&
                  product.category !== null
                    ? product.category.name
                    : categoryName || 'Category'}
                </p>

                {/* Enhanced product name with better typography */}
                <h3 className='font-semibold mb-2 group-hover:text-[#3bb77e] capitalize transition-colors duration-300 line-clamp-2 text-sm sm:text-base leading-tight'>
                  {product.name}
                </h3>

                {/* Enhanced rating display */}
                {product.rating && product.rating > 0 && (
                  <div className='flex items-center mb-3 space-x-2'>
                    <div className='flex items-center'>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <RiStarFill
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                    </div>
                    <span className='text-xs sm:text-sm text-gray-500 font-medium'>
                      ({product.rating})
                    </span>
                  </div>
                )}
              </Link>

              {/* Enhanced price and cart section */}
              <div className='flex items-center justify-between w-full mt-auto pt-4'>
                <div className='flex-1 mr-3'>
                  <p className='font-bold text-xl sm:text-2xl text-[#3bb77e] truncate'>
                    ₦
                    {(
                      product.price *
                      (1 - (product.discount || 0) / 100)
                    ).toLocaleString()}
                  </p>
                  {product.discount && product.discount > 0 && (
                    <p className='text-sm text-gray-500 line-through font-medium'>
                      ₦{product.price.toLocaleString()}
                    </p>
                  )}
                </div>

                {showCartBtn && (
                  <div className='flex-shrink-0'>
                    {cartItem && !hasVariants ? (
                      <CartCounter
                        productId={product._id}
                        initialQuantity={cartItem.quantity}
                        maxQuantity={product.quantity}
                      />
                    ) : (
                      <Button
                        size='icon'
                        className='bg-gradient-to-r from-[#3bb77e] to-[#2ea56c] hover:from-[#2ea56c] hover:to-[#259c5a] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg w-11 h-11 sm:w-12 sm:h-12 rounded-full border-0'
                        onClick={handleAddToCart}
                        disabled={!isSync}
                        aria-label='Add to cart'
                      >
                        <RiShoppingCart2Line className='w-5 h-5 sm:w-6 sm:h-6' />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Add Product to Cart Modal */}
        <AddProductToCartModal
          product={product}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    )
  }
)

ProductCardSlider.displayName = 'ProductCardSlider'

export default ProductCardSlider
