// 'use client'

// import React, { useState, useMemo, useEffect, useRef } from 'react'
// import { Product } from '@/lib/types'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// // import { Badge } from '@/components/ui/badge'
// import { MinusIcon, PlusIcon, X } from 'lucide-react'
// import {
//   RiShoppingCart2Line,
//   RiCloseLine,
//   RiStarFill,
//   RiImageLine,
// } from 'react-icons/ri'
// import Image from 'next/image'
// import { addProductToCart } from '@/lib/server-actions/product'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { useToast } from '@/hooks/use-toast'
// import { useSession } from 'next-auth/react'

// interface SelectedVariant {
//   color?: string
//   size?: string
//   price?: number
//   quantity?: number
// }

// interface AddProductToCartModalProps {
//   product: Product
//   isOpen: boolean
//   onClose: () => void
// }

// const AddProductToCartModal = ({
//   product,
//   isOpen,
//   onClose,
// }: AddProductToCartModalProps) => {
//   const [quantity, setQuantity] = useState<number>(1)
//   const [selectedVariant, setSelectedVariant] = useState<SelectedVariant>({})
//   const [isSync, setIsSync] = useState(true)
//   const [imageError, setImageError] = useState(false)
//   const [isImageLoaded, setIsImageLoaded] = useState(false)
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)

//   const dispatch = useAppDispatch()
//   const { toast } = useToast()
//   const { data: session } = useSession()
//   const cartProducts = useAppSelector((state) => state.cart.products)

//   // Process product images - handle both product images and variant images
//   const productImages = useMemo(() => {
//     let allImages = []

//     // Add main product images
//     if (product.images && product.images.length > 0) {
//       const imageArray = Array.isArray(product.images)
//         ? product.images
//         : [product.images]
//       const productImageUrls = imageArray
//         .filter((img) => !!img)
//         .map((img) => `${process.env.NEXT_PUBLIC_AWS_URL}/products/${img}`)
//       allImages.push(...productImageUrls)
//     }

//     // Add variant images if they exist
//     if (product.variants && product.variants.length > 0) {
//       product.variants.forEach((variant) => {
//         if (variant.images && variant.images.length > 0) {
//           const variantImageArray = Array.isArray(variant.images)
//             ? variant.images
//             : [variant.images]
//           const variantImageUrls = variantImageArray
//             .filter((img) => !!img)
//             .map((img) => `${process.env.NEXT_PUBLIC_AWS_URL}/products/${img}`)
//           allImages.push(...variantImageUrls)
//         }
//       })
//     }

//     // Remove duplicates and return
//     return Array.from(new Set(allImages))
//   }, [product.images, product.variants])

//   // Auto-slide functionality
//   useEffect(() => {
//     if (productImages.length > 1 && isOpen) {
//       intervalRef.current = setInterval(() => {
//         setCurrentImageIndex((prev) =>
//           prev === productImages.length - 1 ? 0 : prev + 1
//         )
//       }, 3000) // Change image every 3 seconds

//       return () => {
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current)
//         }
//       }
//     }
//   }, [productImages.length, isOpen])

//   // Reset state when modal opens/closes or product changes
//   useEffect(() => {
//     if (isOpen) {
//       setSelectedVariant({})
//       setQuantity(1)
//       setImageError(false)
//       setIsImageLoaded(false)
//       setCurrentImageIndex(0)
//     } else {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//       }
//     }
//   }, [isOpen, product._id])

//   // Extract unique colors and sizes from variants
//   const availableOptions = useMemo(() => {
//     if (!product.variants || product.variants.length === 0) {
//       return { colors: [], sizes: [] }
//     }

//     const colors = Array.from(
//       new Set(product.variants.map((v) => v.color).filter(Boolean))
//     )
//     const sizes = Array.from(
//       new Set(product.variants.map((v) => v.size).filter(Boolean))
//     )

//     return { colors, sizes }
//   }, [product.variants])

//   // Check if product has variants with both colors and sizes
//   const hasVariants = product.variants && product.variants.length > 0
//   const hasColors = availableOptions.colors.length > 0
//   const hasSizes = availableOptions.sizes.length > 0

//   // Get available colors - show all colors that have stock, regardless of size selection
//   const availableColors = useMemo(() => {
//     if (!product.variants || product.variants.length === 0) return []

//     return availableOptions.colors.filter((color) => {
//       return product.variants?.some(
//         (variant) => variant.color === color && variant.quantity > 0
//       )
//     })
//   }, [product.variants, availableOptions.colors])

//   // Get available sizes - show all sizes that have stock, regardless of color selection
//   const availableSizes = useMemo(() => {
//     if (!product.variants || product.variants.length === 0) return []

//     return availableOptions.sizes.filter((size) => {
//       return product.variants?.some(
//         (variant) => variant.size === size && variant.quantity > 0
//       )
//     })
//   }, [product.variants, availableOptions.sizes])

//   // Get sizes available for selected color
//   const sizesForSelectedColor = useMemo(() => {
//     if (!selectedVariant.color || !product.variants) return availableSizes

//     return availableSizes.filter((size) => {
//       return product.variants?.some(
//         (variant) =>
//           variant.color === selectedVariant.color &&
//           variant.size === size &&
//           variant.quantity > 0
//       )
//     })
//   }, [selectedVariant.color, product.variants, availableSizes])

//   // Get colors available for selected size
//   const colorsForSelectedSize = useMemo(() => {
//     if (!selectedVariant.size || !product.variants) return availableColors

//     return availableColors.filter((color) => {
//       return product.variants?.some(
//         (variant) =>
//           variant.size === selectedVariant.size &&
//           variant.color === color &&
//           variant.quantity > 0
//       )
//     })
//   }, [selectedVariant.size, product.variants, availableColors])

//   // Check if a color is available
//   const isColorAvailable = (color: string) => {
//     if (color === selectedVariant.color) return true
//     if (!selectedVariant.size) return availableColors.includes(color)
//     return colorsForSelectedSize.includes(color)
//   }

//   // Check if a size is available
//   const isSizeAvailable = (size: string) => {
//     if (size === selectedVariant.size) return true
//     if (!selectedVariant.color) return availableSizes.includes(size)
//     return sizesForSelectedColor.includes(size)
//   }

//   // Get current variant based on selection
//   const currentVariant = useMemo(() => {
//     if (!product.variants || product.variants.length === 0) {
//       return null
//     }

//     const needsColor = hasColors
//     const needsSize = hasSizes

//     if (needsColor && !selectedVariant.color) return null
//     if (needsSize && !selectedVariant.size) return null

//     return (
//       product.variants.find((variant) => {
//         const colorMatch =
//           !needsColor || variant.color === selectedVariant.color
//         const sizeMatch = !needsSize || variant.size === selectedVariant.size
//         return colorMatch && sizeMatch
//       }) || null
//     )
//   }, [product.variants, selectedVariant, hasColors, hasSizes])

//   // Find cart item that matches both product and variant
//   const cartItem = useMemo(() => {
//     const currentVariantId = currentVariant?._id

//     return cartProducts.find((item) => {
//       const productMatches = item.product?._id === product._id
//       const variantMatches = currentVariantId
//         ? item.variant?._id === currentVariantId
//         : !item.variant

//       return productMatches && variantMatches
//     })
//   }, [cartProducts, product._id, currentVariant])

//   // Calculate current price and stock
//   const currentPrice = useMemo(() => {
//     if (currentVariant && currentVariant.price) {
//       return parseFloat(currentVariant.price.toString())
//     }
//     return product.price || 0
//   }, [currentVariant, product.price])

//   const currentStock = useMemo(() => {
//     if (currentVariant && currentVariant.quantity !== undefined) {
//       return currentVariant.quantity
//     }
//     return product.quantity || 0
//   }, [currentVariant, product.quantity])

//   // Check if we can add to cart
//   const canAddToCart = useMemo(() => {
//     if (!hasVariants) return true

//     const needsColor = hasColors
//     const needsSize = hasSizes

//     if (needsColor && !selectedVariant.color) return false
//     if (needsSize && !selectedVariant.size) return false

//     return currentVariant !== null
//   }, [
//     hasVariants,
//     hasColors,
//     hasSizes,
//     selectedVariant.color,
//     selectedVariant.size,
//     currentVariant,
//   ])

//   const currentCartQuantity = cartItem ? cartItem.quantity : 0
//   const maxQuantity = Math.min(currentStock, 99) // Reasonable max
//   const canIncrease =
//     quantity < maxQuantity && quantity + currentCartQuantity < currentStock
//   const canDecrease = quantity > 1

//   const handleColorSelect = (color: string) => {
//     if (selectedVariant.color === color) {
//       setSelectedVariant((prev) => ({ ...prev, color: undefined }))
//     } else {
//       setSelectedVariant((prev) => ({ ...prev, color: color }))
//     }
//   }

//   const handleSizeSelect = (size: string) => {
//     if (selectedVariant.size === size) {
//       setSelectedVariant((prev) => ({ ...prev, size: undefined }))
//     } else {
//       setSelectedVariant((prev) => ({ ...prev, size: size }))
//     }
//   }

//   const handleQuantityChange = (newQuantity: number) => {
//     if (newQuantity >= 1 && newQuantity <= maxQuantity) {
//       setQuantity(newQuantity)
//     }
//   }

//   const handleThumbnailClick = (index: number) => {
//     setCurrentImageIndex(index)
//     // Reset auto-slide timer
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current)
//     }
//     if (productImages.length > 1) {
//       intervalRef.current = setInterval(() => {
//         setCurrentImageIndex((prev) =>
//           prev === productImages.length - 1 ? 0 : prev + 1
//         )
//       }, 3000)
//     }
//   }

//   const handleAddToCart = async () => {
//     if (!isSync || !canAddToCart) return

//     try {
//       setIsSync(false)

//       const productForCart = {
//         ...product,
//         price: currentPrice,
//       }

//       dispatch(
//         cartActions.addToCart({
//           product: productForCart,
//           variant: currentVariant ?? undefined,
//           quantity: quantity,
//         })
//       )

//       toast({
//         description: `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`,
//         duration: 2000,
//       })

//       if (session?.user) {
//         const variantId = currentVariant?._id
//         const res = await addProductToCart({
//           productId: product._id,
//           quantity: quantity,
//           variantId: variantId,
//         })
//         if (res.hasError) throw new Error(res.message)
//       }

//       // Close modal after successful add
//       onClose()
//     } catch (error) {
//       const variantId = currentVariant?._id
//       dispatch(
//         cartActions.removeFromCart({
//           productId: product._id,
//           variantId: variantId,
//         })
//       )

//       toast({
//         title: 'Error syncing cart',
//         description: 'Please try again',
//         variant: 'destructive',
//       })
//     } finally {
//       setIsSync(true)
//     }
//   }

//   const handleImageError = () => {
//     setImageError(true)
//     setIsImageLoaded(false)
//   }

//   const handleImageLoad = () => {
//     setIsImageLoaded(true)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='max-w-[95vw] max-h-[75vh] lg:max-w-[70vw] lg:max-h-[80vh] overflow-y-auto p-0 gap-0 bg-white'>
//         {/* Large Screen Layout */}
//         <div className='hidden lg:flex h-[80vh]'>
//           {/* Left Side - Image */}
//           <div className='w-1/2 bg-gray-100 flex flex-col items-center justify-center p-6'>
//             <div className='w-full max-w-md aspect-square bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-4'>
//               {productImages.length > 0 && !imageError ? (
//                 <div className='relative w-full h-full'>
//                   {!isImageLoaded && (
//                     <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center'>
//                       <RiImageLine className='w-16 h-16 text-gray-400' />
//                     </div>
//                   )}
//                   <Image
//                     src={productImages[currentImageIndex]}
//                     alt={product.name}
//                     fill
//                     className='object-contain p-6'
//                     style={{ opacity: isImageLoaded ? 1 : 0 }}
//                     onLoad={handleImageLoad}
//                     onError={handleImageError}
//                   />
//                 </div>
//               ) : (
//                 <div className='w-full h-full flex items-center justify-center text-gray-400 bg-gray-200'>
//                   <RiImageLine className='w-16 h-16' />
//                 </div>
//               )}
//             </div>

//             {/* Thumbnails at bottom for large screens */}
//             {productImages.length > 1 && (
//               <div className='w-full max-w-md overflow-hidden pb-2'>
//                 <div className='flex gap-2 lg:gap-4 snap-x scrollbar-hide'>
//                   {productImages.map((image, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleThumbnailClick(index)}
//                       className={`relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all snap-start ${
//                         currentImageIndex === index
//                           ? 'ring-2 ring-[#3bb77e] ring-offset-2 scale-105'
//                           : 'hover:ring-2 hover:ring-gray-200 hover:scale-102'
//                       }`}
//                       aria-label={`View image ${index + 1}`}
//                     >
//                       <Image
//                         src={image}
//                         alt={`${product.name} ${index + 1}`}
//                         fill
//                         className='object-cover bg-gray-200'
//                         sizes='(max-width: 1024px) 64px, (max-width: 1280px) 80px, 96px'
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Side - Content */}
//           <div className='w-1/2 flex flex-col h-[80vh]'>
//             {/* Header - Fixed */}
//             <DialogHeader className='p-6 pb-4 border-b border-gray-100 flex-shrink-0'>
//               <DialogTitle className='text-2xl font-bold text-gray-900 line-clamp-2 leading-tight'>
//                 {product.name}
//               </DialogTitle>
//               <div className='flex items-center gap-2 mt-2'>
//                 <div className='flex items-center'>
//                   {Array(5)
//                     .fill(0)
//                     .map((_, i) => (
//                       <RiStarFill
//                         key={i}
//                         className={`w-4 h-4 ${
//                           i < Math.floor(product.rating || 4.5)
//                             ? 'text-yellow-400'
//                             : 'text-gray-200'
//                         }`}
//                       />
//                     ))}
//                 </div>
//                 <span className='text-sm text-gray-600'>
//                   ({product.rating || '4.5'})
//                 </span>
//               </div>
//             </DialogHeader>

//             {/* Content Area */}
//             <div className='flex-1 p-6 space-y-6'>
//               {/* Price and Stock */}
//               <div className='space-y-3'>
//                 <div className='space-y-1'>
//                   <div className='flex items-baseline gap-3'>
//                     <span className='text-3xl font-bold text-[#3bb77e]'>
//                       ₦{currentPrice.toLocaleString()}
//                     </span>
//                     {currentVariant && currentPrice !== product.price && (
//                       <span className='text-xl text-gray-400 line-through'>
//                         ₦{product.price?.toLocaleString()}
//                       </span>
//                     )}
//                   </div>
//                   <div className='flex items-center gap-2'>
//                     <div
//                       className={`w-2 h-2 rounded-full ${
//                         currentStock > 0 ? 'bg-green-500' : 'bg-red-500'
//                       }`}
//                     />
//                     <span className='text-sm text-gray-600'>
//                       {currentStock > 0
//                         ? `${currentStock} in stock`
//                         : 'Out of stock'}
//                     </span>
//                   </div>
//                 </div>

//                 {currentCartQuantity > 0 && (
//                   <div className='bg-blue-50 rounded-lg p-3'>
//                     <p className='text-sm text-blue-700'>
//                       <span className='font-medium'>{currentCartQuantity}</span>{' '}
//                       already in cart
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Variants Selection */}
//               {hasVariants && (
//                 <div className='space-y-6'>
//                   {/* Color Selection */}
//                   {hasColors && (
//                     <div className='space-y-3'>
//                       <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
//                         Color
//                         {selectedVariant.color && (
//                           <span className='normal-case text-gray-600 font-normal ml-2'>
//                             - {selectedVariant.color}
//                           </span>
//                         )}
//                       </h3>
//                       <div className='flex flex-wrap gap-2'>
//                         {availableColors.map((color) => {
//                           const isSelected = selectedVariant.color === color
//                           const isAvailable = isColorAvailable(color)

//                           return (
//                             <button
//                               key={color}
//                               onClick={() => handleColorSelect(color)}
//                               disabled={!isAvailable}
//                               className={`
//                                 px-4 py-2.5 rounded-lg font-medium transition-all text-sm
//                                 ${
//                                   isSelected
//                                     ? 'bg-[#3bb77e] text-white shadow-md scale-105'
//                                     : isAvailable
//                                     ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
//                                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 }
//                               `}
//                             >
//                               {color}
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Size Selection */}
//                   {hasSizes && (
//                     <div className='space-y-3'>
//                       <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
//                         Size
//                         {selectedVariant.size && (
//                           <span className='normal-case text-gray-600 font-normal ml-2'>
//                             - {selectedVariant.size}
//                           </span>
//                         )}
//                       </h3>
//                       <div className='flex flex-wrap gap-2'>
//                         {availableSizes.map((size) => {
//                           const isSelected = selectedVariant.size === size
//                           const isAvailable = isSizeAvailable(size)

//                           return (
//                             <button
//                               key={size}
//                               onClick={() => handleSizeSelect(size)}
//                               disabled={!isAvailable}
//                               className={`
//                                 px-4 py-2.5 rounded-lg font-medium transition-all text-sm min-w-[3rem]
//                                 ${
//                                   isSelected
//                                     ? 'bg-[#3bb77e] text-white shadow-md scale-105'
//                                     : isAvailable
//                                     ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
//                                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 }
//                               `}
//                             >
//                               {size}
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Selection Requirements Warning */}
//                   {!canAddToCart && hasVariants && (
//                     <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
//                       <p className='text-sm text-amber-700'>
//                         Please select{' '}
//                         {hasColors &&
//                         !selectedVariant.color &&
//                         hasSizes &&
//                         !selectedVariant.size
//                           ? 'both color and size'
//                           : hasColors && !selectedVariant.color
//                           ? 'a color'
//                           : hasSizes && !selectedVariant.size
//                           ? 'a size'
//                           : 'your preferences'}{' '}
//                         to continue.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Quantity Selector */}
//               {canAddToCart && currentStock > 0 && (
//                 <div className='space-y-3'>
//                   <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
//                     Quantity
//                   </h3>
//                   <div className='flex items-center gap-4'>
//                     <div className='flex items-center border border-gray-200 rounded-lg'>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         onClick={() => handleQuantityChange(quantity - 1)}
//                         disabled={!canDecrease}
//                         className='h-10 w-10 hover:bg-gray-50'
//                       >
//                         <MinusIcon className='w-4 h-4' />
//                       </Button>
//                       <div className='w-16 text-center font-medium'>
//                         {quantity}
//                       </div>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         onClick={() => handleQuantityChange(quantity + 1)}
//                         disabled={!canIncrease}
//                         className='h-10 w-10 hover:bg-gray-50'
//                       >
//                         <PlusIcon className='w-4 h-4' />
//                       </Button>
//                     </div>
//                     <div className='text-sm text-gray-600'>
//                       Max: {maxQuantity}
//                       {currentCartQuantity > 0 && (
//                         <span className='ml-2'>
//                           ({currentCartQuantity} in cart)
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Footer - Fixed at bottom */}
//             <div className='border-t border-gray-100 p-6 flex-shrink-0 bg-white'>
//               <div className='flex gap-3'>
//                 <Button
//                   variant='outline'
//                   onClick={onClose}
//                   className='flex-1 h-12 border-gray-200 hover:bg-gray-50'
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleAddToCart}
//                   disabled={
//                     !canAddToCart ||
//                     !isSync ||
//                     currentStock === 0 ||
//                     quantity + currentCartQuantity > currentStock
//                   }
//                   className='flex-1 h-12 bg-[#3bb77e] hover:bg-[#2da56d] text-white'
//                 >
//                   <RiShoppingCart2Line className='w-5 h-5 mr-2' />
//                   {isSync ? `Add ${quantity} to Cart` : 'Adding...'}
//                 </Button>
//               </div>

//               {quantity + currentCartQuantity > currentStock && (
//                 <p className='text-sm text-red-600 mt-2 text-center'>
//                   Cannot add more items than available stock
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Layout */}
//         <div className='lg:hidden h-[90vh]  '>
//           {/* Mobile Image Section with Left Vertical Thumbnails */}
//           <div className='relative bg-gray-100  py-4 pt-6 px-2 h-[30vh] flex justify-between'>
//             {/* Left Vertical Thumbnails for Mobile */}

//             <div className=' mr-2 w-1/6 border-2   overflow-hidden'>
//               {productImages.length > 1 && (
//                 <div className=' bg-gray-50 border-r  border-gray-200  overflow-hidden'>
//                   <div className='p-1 space-y-1'>
//                     {productImages.map((image, index) => (
//                       <button
//                         key={index}
//                         onClick={() => handleThumbnailClick(index)}
//                         className={`w-18 h-14 rounded-lg overflow-hidden border-2 transition-all ${
//                           currentImageIndex === index
//                             ? 'ring-2 ring-[#3bb77e] ring-offset-2 scale-105'
//                             : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         aria-label={`View image ${index + 1}`}
//                       >
//                         <Image
//                           src={image}
//                           alt={`${product.name} ${index + 1}`}
//                           width={48}
//                           height={48}
//                           className='object-cover w-full h-full bg-gray-200'
//                           sizes='48px'
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Main Image Display */}
//             <div className=' w-4/6 mr-2  relative'>
//               {productImages.length > 0 && !imageError ? (
//                 <div className='w-full h-full relative bg-gray-200'>
//                   {!isImageLoaded && (
//                     <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center'>
//                       <RiImageLine className='w-12 h-12 text-gray-400' />
//                     </div>
//                   )}
//                   <Image
//                     src={productImages[currentImageIndex]}
//                     alt={product.name}
//                     fill
//                     className='object-contain p-2'
//                     style={{ opacity: isImageLoaded ? 1 : 0 }}
//                     onLoad={handleImageLoad}
//                     onError={handleImageError}
//                   />

//                   {/* Image Counter */}
//                   {productImages.length > 1 && (
//                     <div className='absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full'>
//                       {currentImageIndex + 1}/{productImages.length}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className='w-full h-full flex items-center justify-center text-gray-400 bg-gray-200'>
//                   <RiImageLine className='w-12 h-12' />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mobile Content */}
//           <div className='flex-1 flex flex-col'>
//             {/* Header - Fixed */}
//             <div className='p-4 pb-3 border-b border-gray-100 flex-shrink-0'>
//               <h2 className='text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2'>
//                 {product.name}
//               </h2>
//               <div className='flex items-center justify-between'>
//                 <div className='flex items-center gap-2'>
//                   <div className='flex items-center'>
//                     {Array(5)
//                       .fill(0)
//                       .map((_, i) => (
//                         <RiStarFill
//                           key={i}
//                           className={`w-3 h-3 ${
//                             i < Math.floor(product.rating || 4.5)
//                               ? 'text-yellow-400'
//                               : 'text-gray-200'
//                           }`}
//                         />
//                       ))}
//                   </div>
//                   <span className='text-xs text-gray-600'>
//                     ({product.rating || '4.5'})
//                   </span>
//                 </div>
//                 <div className='flex items-center gap-2'>
//                   <div
//                     className={`w-2 h-2 rounded-full ${
//                       currentStock > 0 ? 'bg-green-500' : 'bg-red-500'
//                     }`}
//                   />
//                   <span className='text-xs text-gray-600'>
//                     {currentStock > 0 ? `${currentStock} left` : 'Out of stock'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Content Area */}
//             <div className='flex-1 p-4 space-y-4'>
//               {/* Price */}
//               <div className='flex items-baseline gap-2'>
//                 <span className='text-2xl font-bold text-[#3bb77e]'>
//                   ₦{currentPrice.toLocaleString()}
//                 </span>
//                 {currentVariant && currentPrice !== product.price && (
//                   <span className='text-lg text-gray-400 line-through'>
//                     ₦{product.price?.toLocaleString()}
//                   </span>
//                 )}
//               </div>

//               {currentCartQuantity > 0 && (
//                 <div className='bg-blue-50 rounded-lg p-2'>
//                   <p className='text-xs text-blue-700'>
//                     <span className='font-medium'>{currentCartQuantity}</span>{' '}
//                     in cart
//                   </p>
//                 </div>
//               )}

//               {/* Variants - Compact */}
//               {hasVariants && (
//                 <div className='space-y-3'>
//                   {/* Colors */}
//                   {hasColors && (
//                     <div>
//                       <h3 className='text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2'>
//                         Color{' '}
//                         {selectedVariant.color && (
//                           <span className='normal-case text-gray-600 font-normal'>
//                             - {selectedVariant.color}
//                           </span>
//                         )}
//                       </h3>
//                       <div className='flex flex-wrap gap-1.5'>
//                         {availableColors.map((color) => {
//                           const isSelected = selectedVariant.color === color
//                           const isAvailable = isColorAvailable(color)

//                           return (
//                             <button
//                               key={color}
//                               onClick={() => handleColorSelect(color)}
//                               disabled={!isAvailable}
//                               className={`
//                                 px-3 py-1.5 rounded-md font-medium transition-all text-xs
//                                 ${
//                                   isSelected
//                                     ? 'bg-[#3bb77e] text-white shadow-md'
//                                     : isAvailable
//                                     ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
//                                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 }
//                               `}
//                             >
//                               {color}
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Sizes */}
//                   {hasSizes && (
//                     <div>
//                       <h3 className='text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2'>
//                         Size{' '}
//                         {selectedVariant.size && (
//                           <span className='normal-case text-gray-600 font-normal'>
//                             - {selectedVariant.size}
//                           </span>
//                         )}
//                       </h3>
//                       <div className='flex flex-wrap gap-1.5'>
//                         {availableSizes.map((size) => {
//                           const isSelected = selectedVariant.size === size
//                           const isAvailable = isSizeAvailable(size)

//                           return (
//                             <button
//                               key={size}
//                               onClick={() => handleSizeSelect(size)}
//                               disabled={!isAvailable}
//                               className={`
//                                 px-3 py-1.5 rounded-md font-medium transition-all text-xs min-w-[2.5rem]
//                                 ${
//                                   isSelected
//                                     ? 'bg-[#3bb77e] text-white shadow-md'
//                                     : isAvailable
//                                     ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
//                                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 }
//                               `}
//                             >
//                               {size}
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Selection Warning */}
//                   {!canAddToCart && hasVariants && (
//                     <div className='bg-amber-50 border border-amber-200 rounded-lg p-2'>
//                       <p className='text-xs text-amber-700'>
//                         Please select{' '}
//                         {hasColors &&
//                         !selectedVariant.color &&
//                         hasSizes &&
//                         !selectedVariant.size
//                           ? 'color and size'
//                           : hasColors && !selectedVariant.color
//                           ? 'a color'
//                           : hasSizes && !selectedVariant.size
//                           ? 'a size'
//                           : 'your preferences'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Quantity - Compact */}
//               {canAddToCart && currentStock > 0 && (
//                 <div>
//                   <h3 className='text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2'>
//                     Quantity
//                   </h3>
//                   <div className='flex items-center gap-3'>
//                     <div className='flex items-center border border-gray-200 rounded-lg'>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         onClick={() => handleQuantityChange(quantity - 1)}
//                         disabled={!canDecrease}
//                         className='h-8 w-8 hover:bg-gray-50'
//                       >
//                         <MinusIcon className='w-3 h-3' />
//                       </Button>
//                       <div className='w-12 text-center font-medium text-sm'>
//                         {quantity}
//                       </div>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         onClick={() => handleQuantityChange(quantity + 1)}
//                         disabled={!canIncrease}
//                         className='h-8 w-8 hover:bg-gray-50'
//                       >
//                         <PlusIcon className='w-3 h-3' />
//                       </Button>
//                     </div>
//                     <div className='text-xs text-gray-600'>
//                       Max: {maxQuantity}
//                       {currentCartQuantity > 0 && (
//                         <span className='ml-1'>
//                           ({currentCartQuantity} in cart)
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Mobile Footer - Fixed at bottom */}
//             <div className='border-t border-gray-100 p-4 bg-white flex-shrink-0'>
//               <div className='flex gap-2'>
//                 <Button
//                   variant='outline'
//                   onClick={onClose}
//                   className='flex-1 h-10 border-gray-200 hover:bg-gray-50 text-sm'
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleAddToCart}
//                   disabled={
//                     !canAddToCart ||
//                     !isSync ||
//                     currentStock === 0 ||
//                     quantity + currentCartQuantity > currentStock
//                   }
//                   className='flex-2 h-10 bg-[#3bb77e] hover:bg-[#2da56d] text-white text-sm'
//                 >
//                   <RiShoppingCart2Line className='w-4 h-4 mr-1' />
//                   {isSync ? `Add ${quantity} to Cart` : 'Adding...'}
//                 </Button>
//               </div>

//               {quantity + currentCartQuantity > currentStock && (
//                 <p className='text-xs text-red-600 mt-1 text-center'>
//                   Cannot add more items than available stock
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default AddProductToCartModal

'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Product } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
import { MinusIcon, PlusIcon, X } from 'lucide-react'
import {
  RiShoppingCart2Line,
  RiCloseLine,
  RiStarFill,
  RiImageLine,
} from 'react-icons/ri'
import Image from 'next/image'
import { addProductToCart } from '@/lib/server-actions/product'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { fetchSignedImageUrl } from '@/lib/getImages'

interface SelectedVariant {
  color?: string
  size?: string
  price?: number
  quantity?: number
}

interface AddProductToCartModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

// Loading skeleton for images - same as ProductCard
const ImageSkeleton = () => (
  <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center'>
    <div className='w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner'>
      <RiImageLine className='w-8 h-8 text-gray-400' />
    </div>
  </div>
)

const AddProductToCartModal = ({
  product,
  isOpen,
  onClose,
}: AddProductToCartModalProps) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant>({})
  const [isSync, setIsSync] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // New state for signed image URLs - same as ProductCard
  const [signedImageUrls, setSignedImageUrls] = useState<string[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([])

  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { data: session } = useSession()
  const cartProducts = useAppSelector((state) => state.cart.products)

  // Process product images - handle both product images and variant images
  const originalImages = useMemo(() => {
    let allImages = []

    // Add main product images
    if (product.images && product.images.length > 0) {
      const imageArray = Array.isArray(product.images)
        ? product.images
        : [product.images]
      const productImageUrls = imageArray.filter((img) => !!img)
      allImages.push(...productImageUrls)
    }

    // Add variant images if they exist
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        if (variant.images && variant.images.length > 0) {
          const variantImageArray = Array.isArray(variant.images)
            ? variant.images
            : [variant.images]
          const variantImageUrls = variantImageArray.filter((img) => !!img)
          allImages.push(...variantImageUrls)
        }
      })
    }

    // Remove duplicates and return
    return Array.from(new Set(allImages))
  }, [product.images, product.variants])

  // Fetch signed image URLs dynamically - same logic as ProductCard
  useEffect(() => {
    let isMounted = true
    setIsLoadingImages(true)
    setSignedImageUrls([])

    const loadImages = async () => {
      if (!originalImages.length) {
        setIsLoadingImages(false)
        return
      }

      try {
        console.log(
          `Attempting to fetch signed URLs for product modal: ${product.name}`
        )

        // Fetch signed URLs for all images
        const urlPromises = originalImages.map(async (imageUrl) => {
          try {
            console.log(`Fetching signed URL for: ${imageUrl}`)
            const signedUrl = await fetchSignedImageUrl(imageUrl, 'products')
            return signedUrl || null
          } catch (error) {
            console.error(`Error fetching signed URL for ${imageUrl}:`, error)
            return null
          }
        })

        const urls = await Promise.all(urlPromises)
        const validUrls = urls.filter((url): url is string => url !== null)

        if (isMounted) {
          setSignedImageUrls(validUrls)
          setImageLoadingStates(Array(validUrls.length).fill(true))
          console.log(
            `Successfully loaded ${validUrls.length} signed URLs for product modal: ${product.name}`
          )
        }
      } catch (error) {
        console.error(
          `Error loading images for product modal ${product.name}:`,
          error
        )
      } finally {
        if (isMounted) {
          setIsLoadingImages(false)
        }
      }
    }

    if (isOpen) {
      loadImages()
    }

    return () => {
      isMounted = false
    }
  }, [product._id, product.name, originalImages, isOpen])

  // Auto-slide functionality - updated to use signedImageUrls
  useEffect(() => {
    if (signedImageUrls.length > 1 && isOpen) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === signedImageUrls.length - 1 ? 0 : prev + 1
        )
      }, 3000) // Change image every 3 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [signedImageUrls.length, isOpen])

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setSelectedVariant({})
      setQuantity(1)
      setImageError(false)
      setIsImageLoaded(false)
      setCurrentImageIndex(0)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isOpen, product._id])

  // Image loading handlers - same as ProductCard
  const handleImageLoad = (index = 0) => {
    setImageLoadingStates((prev) => {
      const newStates = [...prev]
      newStates[index] = false
      return newStates
    })
    if (index === currentImageIndex) {
      setIsImageLoaded(true)
    }
  }

  const handleImageError = (index = 0) => {
    console.error(
      `Image failed to load at index ${index}:`,
      signedImageUrls[index]
    )
    if (index === currentImageIndex) {
      setImageError(true)
      setIsImageLoaded(false)
    }
  }

  // Extract unique colors and sizes from variants
  const availableOptions = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return { colors: [], sizes: [] }
    }

    const colors = Array.from(
      new Set(product.variants.map((v) => v.color).filter(Boolean))
    )
    const sizes = Array.from(
      new Set(product.variants.map((v) => v.size).filter(Boolean))
    )

    return { colors, sizes }
  }, [product.variants])

  // Check if product has variants with both colors and sizes
  const hasVariants = product.variants && product.variants.length > 0
  const hasColors = availableOptions.colors.length > 0
  const hasSizes = availableOptions.sizes.length > 0

  // Get available colors - show all colors that have stock, regardless of size selection
  const availableColors = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return []

    return availableOptions.colors.filter((color) => {
      return product.variants?.some(
        (variant) => variant.color === color && variant.quantity > 0
      )
    })
  }, [product.variants, availableOptions.colors])

  // Get available sizes - show all sizes that have stock, regardless of color selection
  const availableSizes = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return []

    return availableOptions.sizes.filter((size) => {
      return product.variants?.some(
        (variant) => variant.size === size && variant.quantity > 0
      )
    })
  }, [product.variants, availableOptions.sizes])

  // Get sizes available for selected color
  const sizesForSelectedColor = useMemo(() => {
    if (!selectedVariant.color || !product.variants) return availableSizes

    return availableSizes.filter((size) => {
      return product.variants?.some(
        (variant) =>
          variant.color === selectedVariant.color &&
          variant.size === size &&
          variant.quantity > 0
      )
    })
  }, [selectedVariant.color, product.variants, availableSizes])

  // Get colors available for selected size
  const colorsForSelectedSize = useMemo(() => {
    if (!selectedVariant.size || !product.variants) return availableColors

    return availableColors.filter((color) => {
      return product.variants?.some(
        (variant) =>
          variant.size === selectedVariant.size &&
          variant.color === color &&
          variant.quantity > 0
      )
    })
  }, [selectedVariant.size, product.variants, availableColors])

  // Check if a color is available
  const isColorAvailable = (color: string) => {
    if (color === selectedVariant.color) return true
    if (!selectedVariant.size) return availableColors.includes(color)
    return colorsForSelectedSize.includes(color)
  }

  // Check if a size is available
  const isSizeAvailable = (size: string) => {
    if (size === selectedVariant.size) return true
    if (!selectedVariant.color) return availableSizes.includes(size)
    return sizesForSelectedColor.includes(size)
  }

  // Get current variant based on selection
  const currentVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return null
    }

    const needsColor = hasColors
    const needsSize = hasSizes

    if (needsColor && !selectedVariant.color) return null
    if (needsSize && !selectedVariant.size) return null

    return (
      product.variants.find((variant) => {
        const colorMatch =
          !needsColor || variant.color === selectedVariant.color
        const sizeMatch = !needsSize || variant.size === selectedVariant.size
        return colorMatch && sizeMatch
      }) || null
    )
  }, [product.variants, selectedVariant, hasColors, hasSizes])

  // Find cart item that matches both product and variant
  const cartItem = useMemo(() => {
    const currentVariantId = currentVariant?._id

    return cartProducts.find((item) => {
      const productMatches = item.product?._id === product._id
      const variantMatches = currentVariantId
        ? item.variant?._id === currentVariantId
        : !item.variant

      return productMatches && variantMatches
    })
  }, [cartProducts, product._id, currentVariant])

  // Calculate current price and stock
  const currentPrice = useMemo(() => {
    if (currentVariant && currentVariant.price) {
      return parseFloat(currentVariant.price.toString())
    }
    return product.price || 0
  }, [currentVariant, product.price])

  const currentStock = useMemo(() => {
    if (currentVariant && currentVariant.quantity !== undefined) {
      return currentVariant.quantity
    }
    return product.quantity || 0
  }, [currentVariant, product.quantity])

  // Check if we can add to cart
  const canAddToCart = useMemo(() => {
    if (!hasVariants) return true

    const needsColor = hasColors
    const needsSize = hasSizes

    if (needsColor && !selectedVariant.color) return false
    if (needsSize && !selectedVariant.size) return false

    return currentVariant !== null
  }, [
    hasVariants,
    hasColors,
    hasSizes,
    selectedVariant.color,
    selectedVariant.size,
    currentVariant,
  ])

  const currentCartQuantity = cartItem ? cartItem.quantity : 0
  const maxQuantity = Math.min(currentStock, 99) // Reasonable max
  const canIncrease =
    quantity < maxQuantity && quantity + currentCartQuantity < currentStock
  const canDecrease = quantity > 1

  const handleColorSelect = (color: string) => {
    if (selectedVariant.color === color) {
      setSelectedVariant((prev) => ({ ...prev, color: undefined }))
    } else {
      setSelectedVariant((prev) => ({ ...prev, color: color }))
    }
  }

  const handleSizeSelect = (size: string) => {
    if (selectedVariant.size === size) {
      setSelectedVariant((prev) => ({ ...prev, size: undefined }))
    } else {
      setSelectedVariant((prev) => ({ ...prev, size: size }))
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
    // Reset auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (signedImageUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === signedImageUrls.length - 1 ? 0 : prev + 1
        )
      }, 3000)
    }
  }

  const handleAddToCart = async () => {
    if (!isSync || !canAddToCart) return

    try {
      setIsSync(false)

      const productForCart = {
        ...product,
        price: currentPrice,
      }

      dispatch(
        cartActions.addToCart({
          product: productForCart,
          variant: currentVariant ?? undefined,
          quantity: quantity,
        })
      )

      toast({
        description: `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`,
        duration: 2000,
      })

      if (session?.user) {
        const variantId = currentVariant?._id
        const res = await addProductToCart({
          productId: product._id,
          quantity: quantity,
          variantId: variantId,
        })
        if (res.hasError) throw new Error(res.message)
      }

      // Close modal after successful add
      onClose()
    } catch (error) {
      const variantId = currentVariant?._id
      dispatch(
        cartActions.removeFromCart({
          productId: product._id,
          variantId: variantId,
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

  // Component to render optimized images - same logic as ProductCard
  const OptimizedImage = ({
    src,
    alt,
    index,
    className = '',
  }: {
    src: string
    alt: string
    index: number
    className?: string
  }) => {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {/* Loading skeleton */}
        {imageLoadingStates[index] && (
          <div className='absolute inset-0 z-10'>
            <ImageSkeleton />
          </div>
        )}

        {/* Use regular img tag for S3 signed URLs to avoid Next.js Image optimization issues */}
        {src.includes('amazonaws.com') || src.includes('X-Amz-Signature') ? (
          <img
            src={src}
            alt={alt}
            className='object-contain p-6 w-full h-full'
            style={{
              opacity: imageLoadingStates[index] ? 0 : 1,
              objectPosition: 'center',
            }}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            loading='lazy'
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className='object-contain p-6'
            style={{
              opacity: imageLoadingStates[index] ? 0 : 1,
              objectPosition: 'center',
            }}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            quality={90}
          />
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[95vw] max-h-[75vh] lg:max-w-[70vw] lg:max-h-[80vh] overflow-y-auto p-0 gap-0 bg-white'>
        {/* Large Screen Layout */}
        <div className='hidden lg:flex h-[80vh]'>
          {/* Left Side - Image */}
          <div className='w-1/2 bg-gray-100 flex flex-col items-center justify-center p-6'>
            <div className='w-full max-w-md aspect-square bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-4'>
              {/* Show loading state while fetching signed URLs */}
              {isLoadingImages ? (
                <div className='w-full h-full'>
                  <ImageSkeleton />
                </div>
              ) : signedImageUrls.length > 0 && !imageError ? (
                <OptimizedImage
                  src={signedImageUrls[currentImageIndex]}
                  alt={product.name}
                  index={currentImageIndex}
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400 bg-gray-200'>
                  <RiImageLine className='w-16 h-16' />
                </div>
              )}
            </div>

            {/* Thumbnails at bottom for large screens */}
            {signedImageUrls.length > 1 && (
              <div className='w-full max-w-md overflow-hidden pb-2'>
                <div className='flex gap-2 lg:gap-4 snap-x scrollbar-hide'>
                  {signedImageUrls.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all snap-start ${
                        currentImageIndex === index
                          ? 'ring-2 ring-[#3bb77e] ring-offset-2 scale-105'
                          : 'hover:ring-2 hover:ring-gray-200 hover:scale-102'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      {/* Use regular img tag for thumbnails with signed URLs */}
                      {image.includes('amazonaws.com') ||
                      image.includes('X-Amz-Signature') ? (
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className='object-cover w-full h-full bg-gray-200'
                        />
                      ) : (
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className='object-cover bg-gray-200'
                          sizes='(max-width: 1024px) 64px, (max-width: 1280px) 80px, 96px'
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Content */}
          <div className='w-1/2 flex flex-col h-[80vh]'>
            {/* Header - Fixed */}
            <DialogHeader className='p-6 pb-4 border-b border-gray-100 flex-shrink-0'>
              <DialogTitle className='text-2xl font-bold text-gray-900 line-clamp-2 leading-tight'>
                {product.name}
              </DialogTitle>
              <div className='flex items-center gap-2 mt-2'>
                <div className='flex items-center'>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <RiStarFill
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 4.5)
                            ? 'text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                </div>
                <span className='text-sm text-gray-600'>
                  ({product.rating || '4.5'})
                </span>
              </div>
            </DialogHeader>

            {/* Content Area */}
            <div className='flex-1 p-6 space-y-6'>
              {/* Price and Stock */}
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <div className='flex items-baseline gap-3'>
                    <span className='text-3xl font-bold text-[#3bb77e]'>
                      ₦{currentPrice.toLocaleString()}
                    </span>
                    {currentVariant && currentPrice !== product.price && (
                      <span className='text-xl text-gray-400 line-through'>
                        ₦{product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        currentStock > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className='text-sm text-gray-600'>
                      {currentStock > 0
                        ? `${currentStock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {currentCartQuantity > 0 && (
                  <div className='bg-blue-50 rounded-lg p-3'>
                    <p className='text-sm text-blue-700'>
                      <span className='font-medium'>{currentCartQuantity}</span>{' '}
                      already in cart
                    </p>
                  </div>
                )}
              </div>

              {/* Variants Selection */}
              {hasVariants && (
                <div className='space-y-6'>
                  {/* Color Selection */}
                  {hasColors && (
                    <div className='space-y-3'>
                      <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
                        Color
                        {selectedVariant.color && (
                          <span className='normal-case text-gray-600 font-normal ml-2'>
                            - {selectedVariant.color}
                          </span>
                        )}
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {availableColors.map((color) => {
                          const isSelected = selectedVariant.color === color
                          const isAvailable = isColorAvailable(color)

                          return (
                            <button
                              key={color}
                              onClick={() => handleColorSelect(color)}
                              disabled={!isAvailable}
                              className={`
                                px-4 py-2.5 rounded-lg font-medium transition-all text-sm
                                ${
                                  isSelected
                                    ? 'bg-[#3bb77e] text-white shadow-md scale-105'
                                    : isAvailable
                                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
                              `}
                            >
                              {color}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {hasSizes && (
                    <div className='space-y-3'>
                      <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
                        Size
                        {selectedVariant.size && (
                          <span className='normal-case text-gray-600 font-normal ml-2'>
                            - {selectedVariant.size}
                          </span>
                        )}
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {availableSizes.map((size) => {
                          const isSelected = selectedVariant.size === size
                          const isAvailable = isSizeAvailable(size)

                          return (
                            <button
                              key={size}
                              onClick={() => handleSizeSelect(size)}
                              disabled={!isAvailable}
                              className={`
                                px-4 py-2.5 rounded-lg font-medium transition-all text-sm min-w-[3rem]
                                ${
                                  isSelected
                                    ? 'bg-[#3bb77e] text-white shadow-md scale-105'
                                    : isAvailable
                                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
                              `}
                            >
                              {size}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selection Requirements Warning */}
                  {!canAddToCart && hasVariants && (
                    <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                      <p className='text-sm text-amber-700'>
                        Please select{' '}
                        {hasColors &&
                        !selectedVariant.color &&
                        hasSizes &&
                        !selectedVariant.size
                          ? 'both color and size'
                          : hasColors && !selectedVariant.color
                          ? 'a color'
                          : hasSizes && !selectedVariant.size
                          ? 'a size'
                          : 'your preferences'}{' '}
                        to continue.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              {canAddToCart && currentStock > 0 && (
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
                    Quantity
                  </h3>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center border border-gray-200 rounded-lg'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={!canDecrease}
                        className='h-10 w-10 hover:bg-gray-50'
                      >
                        <MinusIcon className='w-4 h-4' />
                      </Button>
                      <div className='w-16 text-center font-medium'>
                        {quantity}
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={!canIncrease}
                        className='h-10 w-10 hover:bg-gray-50'
                      >
                        <PlusIcon className='w-4 h-4' />
                      </Button>
                    </div>
                    <div className='text-sm text-gray-600'>
                      Max: {maxQuantity}
                      {currentCartQuantity > 0 && (
                        <span className='ml-2'>
                          ({currentCartQuantity} in cart)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom */}
            <div className='border-t border-gray-100 p-6 flex-shrink-0 bg-white'>
              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={onClose}
                  className='flex-1 h-12 border-gray-200 hover:bg-gray-50'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !canAddToCart ||
                    !isSync ||
                    currentStock === 0 ||
                    quantity + currentCartQuantity > currentStock
                  }
                  className='flex-1 h-12 bg-[#3bb77e] hover:bg-[#2da56d] text-white'
                >
                  <RiShoppingCart2Line className='w-5 h-5 mr-2' />
                  {isSync ? `Add ${quantity} to Cart` : 'Adding...'}
                </Button>
              </div>

              {quantity + currentCartQuantity > currentStock && (
                <p className='text-sm text-red-600 mt-2 text-center'>
                  Cannot add more items than available stock
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='lg:hidden h-[90vh]  '>
          {/* Mobile Image Section with Left Vertical Thumbnails */}
          <div className='relative bg-gray-100  py-4 pt-6 px-2 h-[30vh] flex justify-between'>
            {/* Left Vertical Thumbnails for Mobile */}

            <div className=' mr-2 w-1/6 border-2   overflow-hidden'>
              {signedImageUrls.length > 1 && (
                <div className=' bg-gray-50 border-r  border-gray-200  overflow-hidden'>
                  <div className='p-1 space-y-1'>
                    {signedImageUrls.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-18 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'ring-2 ring-[#3bb77e] ring-offset-2 scale-105'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        {/* Use regular img tag for thumbnails with signed URLs */}
                        {image.includes('amazonaws.com') ||
                        image.includes('X-Amz-Signature') ? (
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className='object-cover w-full h-full bg-gray-200'
                          />
                        ) : (
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            width={48}
                            height={48}
                            className='object-cover w-full h-full bg-gray-200'
                            sizes='48px'
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Image Display */}
            <div className=' w-4/6 mr-2  relative'>
              {/* Show loading state while fetching signed URLs */}
              {isLoadingImages ? (
                <div className='w-full h-full'>
                  <ImageSkeleton />
                </div>
              ) : signedImageUrls.length > 0 && !imageError ? (
                <div className='w-full h-full relative bg-gray-200'>
                  <OptimizedImage
                    src={signedImageUrls[currentImageIndex]}
                    alt={product.name}
                    index={currentImageIndex}
                    className='p-2'
                  />

                  {/* Image Counter */}
                  {signedImageUrls.length > 1 && (
                    <div className='absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full'>
                      {currentImageIndex + 1}/{signedImageUrls.length}
                    </div>
                  )}
                </div>
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400 bg-gray-200'>
                  <RiImageLine className='w-12 h-12' />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Content */}
          <div className='flex-1 flex flex-col'>
            {/* Header - Fixed */}
            <div className='p-4 pb-3 border-b border-gray-100 flex-shrink-0'>
              <h2 className='text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2'>
                {product.name}
              </h2>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center'>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <RiStarFill
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating || 4.5)
                              ? 'text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                  </div>
                  <span className='text-xs text-gray-600'>
                    ({product.rating || '4.5'})
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentStock > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className='text-xs text-gray-600'>
                    {currentStock > 0 ? `${currentStock} left` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className='flex-1 p-4 space-y-4'>
              {/* Price */}
              <div className='flex items-baseline gap-2'>
                <span className='text-2xl font-bold text-[#3bb77e]'>
                  ₦{currentPrice.toLocaleString()}
                </span>
                {currentVariant && currentPrice !== product.price && (
                  <span className='text-lg text-gray-400 line-through'>
                    ₦{product.price?.toLocaleString()}
                  </span>
                )}
              </div>

              {currentCartQuantity > 0 && (
                <div className='bg-blue-50 rounded-lg p-2'>
                  <p className='text-xs text-blue-700'>
                    <span className='font-medium'>{currentCartQuantity}</span>{' '}
                    in cart
                  </p>
                </div>
              )}

              {/* Variants - Compact */}
              {hasVariants && (
                <div className='space-y-3'>
                  {/* Colors */}
                  {hasColors && (
                    <div>
                      <h3 className='text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2'>
                        Color{' '}
                        {selectedVariant.color && (
                          <span className='normal-case text-gray-600 font-normal'>
                            - {selectedVariant.color}
                          </span>
                        )}
                      </h3>
                      <div className='flex flex-wrap gap-1.5'>
                        {availableColors.map((color) => {
                          const isSelected = selectedVariant.color === color
                          const isAvailable = isColorAvailable(color)

                          return (
                            <button
                              key={color}
                              onClick={() => handleColorSelect(color)}
                              disabled={!isAvailable}
                              className={`
                                px-3 py-1.5 rounded-md font-medium transition-all text-xs
                                ${
                                  isSelected
                                    ? 'bg-[#3bb77e] text-white shadow-md'
                                    : isAvailable
                                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
                              `}
                            >
                              {color}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {hasSizes && (
                    <div>
                      <h3 className='text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2'>
                        Size{' '}
                        {selectedVariant.size && (
                          <span className='normal-case text-gray-600 font-normal'>
                            - {selectedVariant.size}
                          </span>
                        )}
                      </h3>
                      <div className='flex flex-wrap gap-1.5'>
                        {availableSizes.map((size) => {
                          const isSelected = selectedVariant.size === size
                          const isAvailable = isSizeAvailable(size)

                          return (
                            <button
                              key={size}
                              onClick={() => handleSizeSelect(size)}
                              disabled={!isAvailable}
                              className={`
                                px-3 py-1.5 rounded-md font-medium transition-all text-xs min-w-[2.5rem]
                                ${
                                  isSelected
                                    ? 'bg-[#3bb77e] text-white shadow-md'
                                    : isAvailable
                                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
                              `}
                            >
                              {size}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selection Warning */}
                  {!canAddToCart && hasVariants && (
                    <div className='bg-amber-50 border border-amber-200 rounded-lg p-2'>
                      <p className='text-xs text-amber-700'>
                        Please select{' '}
                        {hasColors &&
                        !selectedVariant.color &&
                        hasSizes &&
                        !selectedVariant.size
                          ? 'color and size'
                          : hasColors && !selectedVariant.color
                          ? 'a color'
                          : hasSizes && !selectedVariant.size
                          ? 'a size'
                          : 'your preferences'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity - Compact */}
              {canAddToCart && currentStock > 0 && (
                <div>
                  <h3 className='text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2'>
                    Quantity
                  </h3>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center border border-gray-200 rounded-lg'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={!canDecrease}
                        className='h-8 w-8 hover:bg-gray-50'
                      >
                        <MinusIcon className='w-3 h-3' />
                      </Button>
                      <div className='w-12 text-center font-medium text-sm'>
                        {quantity}
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={!canIncrease}
                        className='h-8 w-8 hover:bg-gray-50'
                      >
                        <PlusIcon className='w-3 h-3' />
                      </Button>
                    </div>
                    <div className='text-xs text-gray-600'>
                      Max: {maxQuantity}
                      {currentCartQuantity > 0 && (
                        <span className='ml-1'>
                          ({currentCartQuantity} in cart)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Footer - Fixed at bottom */}
            <div className='border-t border-gray-100 p-4 bg-white flex-shrink-0'>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={onClose}
                  className='flex-1 h-10 border-gray-200 hover:bg-gray-50 text-sm'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !canAddToCart ||
                    !isSync ||
                    currentStock === 0 ||
                    quantity + currentCartQuantity > currentStock
                  }
                  className='flex-2 h-10 bg-[#3bb77e] hover:bg-[#2da56d] text-white text-sm'
                >
                  <RiShoppingCart2Line className='w-4 h-4 mr-1' />
                  {isSync ? `Add ${quantity} to Cart` : 'Adding...'}
                </Button>
              </div>

              {quantity + currentCartQuantity > currentStock && (
                <p className='text-xs text-red-600 mt-1 text-center'>
                  Cannot add more items than available stock
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddProductToCartModal
