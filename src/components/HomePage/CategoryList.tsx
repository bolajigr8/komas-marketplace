// "use client";
// import React from "react";
// import { Category } from "@/lib/types";
// import { EmblaOptionsType } from "embla-carousel";
// import Link from "next/link";
// import CustomSlider from "../General/CustomSlider";
// import ServerImageRender from "../General/ServerImageRender";

// type CategoryListProps = {
//   title?: string;
//   categories: Category[];
//   selectedCategory: string;
//   baseRoute: string;
//   stopNavigateScroll?: boolean;
//   getItemsLengthFor: "allProducts" | "vendorProducts";
//   vendorId?: string;
// };

// const SLIDER_SETTINGS: EmblaOptionsType = {
//   loop: true,
//   align: "start" as const,
//   slidesToScroll: 1,
//   skipSnaps: true,
//   breakpoints: {
//     "(min-width: 640px)": { slidesToScroll: 1 },
//     "(min-width: 1024px)": { slidesToScroll: 2 },
//     "(min-width: 1280px)": { slidesToScroll: 3 },
//   },
// };

// const CategoryList = ({
//   title,
//   categories,
//   selectedCategory,
//   baseRoute,
//   stopNavigateScroll,
//   getItemsLengthFor,
//   vendorId,
// }: CategoryListProps) => {
//   if (!categories.length) {
//     return (
//       <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
//         <p className="text-gray-500">No categories available</p>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full py-8">
//       {title && (
//         <div className="px-4 mb-6">
//           <h2 className="text-xl font-semibold">{title}</h2>
//         </div>
//       )}

//       <CustomSlider
//         options={SLIDER_SETTINGS}
//         classNames={{
//           outerWrapper: "px-4",
//           innerWrapper: "flex-1",
//           // Fixed width calculation - using fixed width values instead of percentages
//           innerWrapperItem: "w-[150px] px-2 flex-shrink-0",
//           customArrowWrapper:
//             "flex items-center w-[25vw] absolute bottom-[-30px] left-1/2 -translate-x-1/2",
//         }}
//       >
//         {categories.map((category) => (
//           <CategoryCard
//             key={category._id}
//             category={category}
//             isSelected={category._id === selectedCategory}
//             baseRoute={baseRoute}
//             stopNavigateScroll={stopNavigateScroll}
//             getItemsLengthFor={getItemsLengthFor}
//             vendorId={vendorId}
//           />
//         ))}
//       </CustomSlider>
//     </section>
//   );
// };

// const CategoryCard = ({
//   category,
//   isSelected,
//   baseRoute,
//   stopNavigateScroll,
// }: {
//   category: Category;
//   isSelected: boolean;
//   baseRoute: string;
//   stopNavigateScroll?: boolean;
//   getItemsLengthFor: "allProducts" | "vendorProducts";
//   vendorId?: string;
// }) => {
//   return (
//     <Link
//       href={`${baseRoute}${category._id}`}
//       scroll={!stopNavigateScroll}
//       className={`
//         block p-3 rounded-xl transition-all duration-200 h-full w-full
//         ${
//           isSelected
//             ? "bg-primary text-white shadow-lg"
//             : "bg-white hover:shadow-md hover:scale-[1.02]"
//         }
//       `}
//     >
//       <div className="aspect-square mb-3 relative overflow-hidden rounded-lg">
//         {category.imageUrl ? (
//           <ServerImageRender
//             folderName="products"
//             src={category.imageUrl}
//             alt={category.name}
//             className="object-cover w-full h-full"
//             width={120}
//             height={120}
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-100 flex items-center justify-center">
//             <span className="text-gray-400 text-2xl font-bold">
//               {category.name.charAt(0).toUpperCase()}
//             </span>
//           </div>
//         )}
//       </div>

//       <h3
//         className={`font-medium text-sm truncate ${
//           isSelected ? "" : "text-gray-800"
//         }`}
//       >
//         {category.name}
//       </h3>
//     </Link>
//   );
// };

// export default CategoryList;

// 'use client'
// import React, { useCallback, useEffect } from 'react'
// import { Category } from '@/lib/types'
// import { EmblaOptionsType } from 'embla-carousel'
// import Link from 'next/link'
// import CustomSlider from '../General/CustomSlider'
// import ServerImageRender from '../General/ServerImageRender'
// import { motion } from 'framer-motion'
// import { useMediaQuery } from '@/hooks/use-media-query'

// type CategoryListProps = {
//   title?: string
//   categories: Category[]
//   selectedCategory: string
//   baseRoute: string
//   stopNavigateScroll?: boolean
//   getItemsLengthFor: 'allProducts' | 'vendorProducts'
//   vendorId?: string
//   viewAllPath?: string
// }

// const SLIDER_SETTINGS: EmblaOptionsType = {
//   loop: true,
//   align: 'start',
//   slidesToScroll: 1,
//   skipSnaps: false,
//   dragFree: true,
//   breakpoints: {
//     '(min-width: 640px)': { slidesToScroll: 2 },
//     '(min-width: 1024px)': { slidesToScroll: 3 },
//     '(min-width: 1280px)': { slidesToScroll: 4 },
//   },
// }

// const CategoryList = ({
//   title,
//   categories,
//   selectedCategory,
//   baseRoute,
//   stopNavigateScroll,
//   getItemsLengthFor,
//   vendorId,
//   viewAllPath = '/category',
// }: CategoryListProps) => {
//   const isMobile = useMediaQuery('(max-width: 639px)')
//   const validCategories = categories.filter((cat) => cat && cat._id)

//   // Moved hooks before any conditional returns
//   // const preloadImages = useCallback(() => {
//   //   validCategories.forEach((category) => {
//   //     if (category.imageUrl) {
//   //       const img = new Image()
//   //       img.src = `/products/${category.imageUrl}`
//   //     }
//   //   })
//   // }, [validCategories])

//   // console.log(validCategories, 'validCategories')

//   const BASE_URL =
//     'https://backendapi-3ms0.onrender.com/api/v1/2401/file/get/products'

//   const preloadImages = useCallback(() => {
//     validCategories.forEach((category) => {
//       if (category.imageUrl) {
//         const img = new Image()
//         img.src =
//           category.imageUrl.startsWith('/') ||
//           category.imageUrl.startsWith('http')
//             ? category.imageUrl
//             : `${BASE_URL}/${category.imageUrl}`
//       }
//     })
//   }, [validCategories])

//   // Always call useEffect
//   useEffect(() => {
//     preloadImages()
//   }, [preloadImages])

//   // Now handle the case of no categories
//   if (!validCategories.length) {
//     return (
//       <div className='min-h-[160px] flex items-center justify-center bg-gray-50 rounded-xl shadow-inner'>
//         <p className='text-gray-500 font-medium'>No categories available</p>
//       </div>
//     )
//   }

//   return (
//     <section
//       className='w-full py-6'
//       aria-labelledby={title ? 'category-heading' : undefined}
//     >
//       {title && (
//         <div className='px-5 mb-4 flex justify-between items-center'>
//           <h2 id='category-heading' className='text-xl font-bold text-gray-800'>
//             {title}
//           </h2>
//           <Link
//             href={viewAllPath}
//             className='text-sm text-primary hover:underline font-medium transition-colors duration-200 flex items-center gap-1'
//           >
//             View all
//             <svg
//               xmlns='http://www.w3.org/2000/svg'
//               className='h-4 w-4'
//               viewBox='0 0 20 20'
//               fill='currentColor'
//             >
//               <path
//                 fillRule='evenodd'
//                 d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
//                 clipRule='evenodd'
//               />
//             </svg>
//           </Link>
//         </div>
//       )}

//       <CustomSlider
//         options={{
//           ...SLIDER_SETTINGS,
//           slidesToScroll: isMobile ? 1 : 2,
//         }}
//         classNames={{
//           outerWrapper: 'px-4 sm:px-5',
//           innerWrapper: 'flex-1',
//           innerWrapperItem: 'sm:w-[180px] w-[140px] px-2 flex-shrink-0 sm:px-3',
//           customArrowWrapper:
//             'flex items-center justify-end gap-2 w-full px-5 mt-4',
//         }}
//       >
//         {validCategories.map((category) => (
//           <CategoryCard
//             key={category._id}
//             category={category}
//             isSelected={category._id === selectedCategory}
//             baseRoute={baseRoute}
//             stopNavigateScroll={stopNavigateScroll}
//             getItemsLengthFor={getItemsLengthFor}
//             vendorId={vendorId}
//           />
//         ))}
//       </CustomSlider>
//     </section>
//   )
// }

// const CategoryCard = ({
//   category,
//   isSelected,
//   baseRoute,
//   stopNavigateScroll,
//   getItemsLengthFor,
//   vendorId,
// }: {
//   category: Category
//   isSelected: boolean
//   baseRoute: string
//   stopNavigateScroll?: boolean
//   getItemsLengthFor: 'allProducts' | 'vendorProducts'
//   vendorId?: string
// }) => {
//   // const imgSrc =
//   //   category.imageUrl &&
//   //   (category.imageUrl.startsWith("/") || category.imageUrl.startsWith("http"))
//   //     ? category.imageUrl
//   //     : `/${category.imageUrl}`;

//   const BASE_URL =
//     'https://backendapi-3ms0.onrender.com/api/v1/2401/file/get/products'

//   const imgSrc =
//     category.imageUrl &&
//     (category.imageUrl.startsWith('/') || category.imageUrl.startsWith('http'))
//       ? category.imageUrl
//       : `${BASE_URL}/${category.imageUrl}`

//   // console.log(imgSrc, 'imageSrc')
//   // console.log(category.imageUrl, 'category.imageSrc')

//   const cardVariants = {
//     initial: { y: 0 },
//     hover: { y: -5 },
//   }

//   return (
//     <motion.div
//       variants={cardVariants}
//       initial='initial'
//       whileHover='hover'
//       transition={{ type: 'spring', stiffness: 300, damping: 10 }}
//       className='h-full'
//     >
//       <Link
//         href={`${baseRoute}${category._id}`}
//         scroll={!stopNavigateScroll}
//         className={`
//           block rounded-xl transition-all duration-200 h-full w-full overflow-hidden
//           ${
//             isSelected
//               ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
//               : 'bg-white hover:shadow-lg border border-gray-100'
//           }
//         `}
//         aria-current={isSelected ? 'page' : undefined}
//       >
//         <div className='relative pt-3 px-3 h-full w-full flex flex-col'>
//           <div className='aspect-square w-full mb-3 relative overflow-hidden rounded-lg bg-gray-50'>
//             {category.imageUrl ? (
//               <div className='w-full h-full overflow-hidden'>
//                 <ServerImageRender
//                   folderName='products'
//                   src={imgSrc}
//                   alt={category.name}
//                   className='object-cover w-full h-full transition-transform group-hover:scale-105'
//                   width={160}
//                   height={160}
//                 />
//               </div>
//             ) : (
//               <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
//                 <span
//                   className={`text-3xl font-bold ${
//                     isSelected ? 'text-white/60' : 'text-gray-300'
//                   }`}
//                 >
//                   {category.name.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className='p-3 flex-grow flex flex-col justify-between'>
//             <h3
//               className={`font-medium text-sm truncate ${
//                 isSelected ? 'text-white' : 'text-gray-800'
//               }`}
//             >
//               {category.name}
//             </h3>
//           </div>

//           {isSelected && (
//             <div className='absolute -top-1 -right-1 z-10'>
//               <span className='flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md'>
//                 <svg
//                   xmlns='http://www.w3.org/2000/svg'
//                   className='h-3 w-3 text-primary'
//                   viewBox='0 0 20 20'
//                   fill='currentColor'
//                   aria-hidden='true'
//                 >
//                   <path
//                     fillRule='evenodd'
//                     d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
//                     clipRule='evenodd'
//                   />
//                 </svg>
//               </span>
//             </div>
//           )}
//         </div>
//       </Link>
//     </motion.div>
//   )
// }

// export default CategoryList

'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Category } from '@/lib/types'
import { EmblaOptionsType } from 'embla-carousel'
import Link from 'next/link'
import CustomSlider from '../General/CustomSlider'
import ServerImageRender from '../General/ServerImageRender'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'
import { fetchSignedImageUrl } from '@/lib/getImages'
import Image from 'next/image'

type CategoryListProps = {
  title?: string
  categories: Category[]
  selectedCategory: string
  baseRoute: string
  stopNavigateScroll?: boolean
  getItemsLengthFor: 'allProducts' | 'vendorProducts'
  vendorId?: string
  viewAllPath?: string
}

const SLIDER_SETTINGS: EmblaOptionsType = {
  loop: true,
  align: 'start',
  slidesToScroll: 1,
  skipSnaps: false,
  dragFree: true,
  breakpoints: {
    '(min-width: 640px)': { slidesToScroll: 2 },
    '(min-width: 1024px)': { slidesToScroll: 3 },
    '(min-width: 1280px)': { slidesToScroll: 4 },
  },
}

const CategoryList = ({
  title,
  categories,
  selectedCategory,
  baseRoute,
  stopNavigateScroll,
  getItemsLengthFor,
  vendorId,
  viewAllPath = '/category',
}: CategoryListProps) => {
  const isMobile = useMediaQuery('(max-width: 639px)')
  const validCategories = categories.filter((cat) => cat && cat._id)

  // Now handle the case of no categories
  if (!validCategories.length) {
    return (
      <div className='min-h-[160px] flex items-center justify-center bg-gray-50 rounded-xl shadow-inner'>
        <p className='text-gray-500 font-medium'>No categories available</p>
      </div>
    )
  }

  // console.log(categories, 'categories')
  return (
    <section
      className='w-full py-6'
      aria-labelledby={title ? 'category-heading' : undefined}
    >
      {title && (
        <div className='px-5 mb-4 flex justify-between items-center'>
          <h2 id='category-heading' className='text-xl font-bold text-gray-800'>
            {title}
          </h2>
          <Link
            href={viewAllPath}
            className='text-sm text-primary hover:underline font-medium transition-colors duration-200 flex items-center gap-1'
          >
            View all
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </Link>
        </div>
      )}

      <CustomSlider
        options={{
          ...SLIDER_SETTINGS,
          slidesToScroll: isMobile ? 1 : 2,
        }}
        classNames={{
          outerWrapper: 'px-4 sm:px-5',
          innerWrapper: 'flex-1',
          innerWrapperItem: 'sm:w-[180px] w-[140px] px-2 flex-shrink-0 sm:px-3',
          customArrowWrapper:
            'flex items-center justify-end gap-2 w-full px-5 mt-4',
        }}
      >
        {validCategories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            isSelected={category._id === selectedCategory}
            baseRoute={baseRoute}
            stopNavigateScroll={stopNavigateScroll}
            getItemsLengthFor={getItemsLengthFor}
            vendorId={vendorId}
          />
        ))}
      </CustomSlider>
    </section>
  )
}

const CategoryCard = ({
  category,
  isSelected,
  baseRoute,
  stopNavigateScroll,
  getItemsLengthFor,
  vendorId,
}: {
  category: Category
  isSelected: boolean
  baseRoute: string
  stopNavigateScroll?: boolean
  getItemsLengthFor: 'allProducts' | 'vendorProducts'
  vendorId?: string
}) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch signed image URL dynamically
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const loadImage = async () => {
      if (!category.imageUrl) {
        setIsLoading(false)
        return
      }

      try {
        console.log(`Attempting to fetch signed URL for: ${category.imageUrl}`)
        const url = await fetchSignedImageUrl(category.imageUrl, 'categories')
        // console.log(`Received URL from API: ${url ? 'Success' : 'Failed/Null'}`)

        if (isMounted && url) {
          setSignedUrl(url)
          // console.log(`Successfully set signed URL: ${url.substring(0, 50)}...`)
        }
      } catch (error) {
        console.error(
          `Error fetching signed URL for ${category.imageUrl}:`,
          error
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadImage()

    return () => {
      isMounted = false
    }
  }, [category._id, category.imageUrl])

  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -5 },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial='initial'
      whileHover='hover'
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      className='h-full'
    >
      <Link
        href={`${baseRoute}${category._id}`}
        scroll={!stopNavigateScroll}
        className={`
          block rounded-xl transition-all duration-200 h-full w-full overflow-hidden
          ${
            isSelected
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
              : 'bg-white hover:shadow-lg border border-gray-100'
          }
        `}
        aria-current={isSelected ? 'page' : undefined}
      >
        <div className='relative pt-3 px-3 h-full w-full flex flex-col'>
          <div className='aspect-square w-full mb-3 relative overflow-hidden rounded-lg bg-gray-50'>
            <OptimizedImage
              src={signedUrl || ''}
              alt={category.name}
              className='w-full h-full'
              width={160}
              height={160}
              priority={true}
              fallbackCharacter={category.name.charAt(0).toUpperCase()}
              isSelected={isSelected}
            />
          </div>

          <div className='p-3 flex-grow flex flex-col justify-between'>
            <h3
              className={`font-medium text-sm truncate ${
                isSelected ? 'text-white' : 'text-gray-800'
              }`}
            >
              {category.name}
            </h3>
          </div>

          {isSelected && (
            <div className='absolute -top-1 -right-1 z-10'>
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-3 w-3 text-primary'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default CategoryList

type OptimizedImageProps = {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  fallbackCharacter?: string
  isSelected?: boolean
}

// OptimizedImage component to handle image loading and error states

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  fallbackCharacter,
  isSelected = false,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Reset states when src changes
  useEffect(() => {
    if (src) {
      setIsLoading(true)
      setHasError(false)
    } else {
      setIsLoading(false)
      setHasError(true)
    }
  }, [src])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
    console.error('Image failed to load:', src)
  }

  // Show fallback for error states or if no image is available
  if (hasError || !src) {
    return (
      <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
        <span
          className={`text-3xl font-bold ${
            isSelected ? 'text-white/60' : 'text-gray-300'
          }`}
        >
          {fallbackCharacter || alt?.charAt(0).toUpperCase() || '?'}
        </span>
      </div>
    )
  }

  // Show the image - Using regular img tag for S3 signed URLs to avoid Next.js Image optimization issues
  return (
    <div className='relative w-full h-full'>
      {isLoading && (
        <div className='absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center'>
          <span className='text-gray-400'>Loading...</span>
        </div>
      )}

      {src.includes('amazonaws.com') || src.includes('X-Amz-Signature') ? (
        // Use regular img tag for S3 URLs to avoid Next.js optimization issues
        <img
          src={src}
          alt={alt}
          className={`rounded-lg object-cover w-full h-full ${className}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        // Use Next.js Image for other images
        <Image
          src={src}
          alt={alt}
          width={width || 300}
          height={height || 300}
          priority={priority}
          className={`rounded-lg object-cover w-full h-full ${className}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          unoptimized={src.includes('?') || src.length > 1000}
        />
      )}
    </div>
  )
}
