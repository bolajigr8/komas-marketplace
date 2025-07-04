// // "use client";

// // import Image from "next/image";
// // import React, { useCallback, useEffect, useRef, useState } from "react";
// // import { PanInfo, motion, useMotionValue } from "framer-motion";
// // import ClientImageRender from "../General/ClientImageRender";
// // import { springOptions } from "@/constants";
// // import { Button, Skeleton } from "@nextui-org/react";
// // import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

// // type PropsType = {
// //   images: string[];
// // };

// // const ProductImages = ({ images }: PropsType) => {
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const dragX = useMotionValue(0);
// //   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

// //   const goToNext = useCallback(() => {
// //     if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
// //     else setCurrentIndex(0);
// //   }, [images, currentIndex]);

// //   const goToPrevious = useCallback(() => {
// //     if (currentIndex >= 0) setCurrentIndex(currentIndex - 1);
// //     else setCurrentIndex(images.length - 1);
// //   }, [images, currentIndex]);

// //   const goToSlide = (index: number) => {
// //     setCurrentIndex(index);
// //   };

// //   const onDragEnd = (
// //     event: MouseEvent | TouchEvent | PointerEvent,
// //     info: PanInfo
// //   ) => {
// //     if (dragX.get() <= -50 && currentIndex < images.length - 1) goToNext();
// //     else if (dragX.get() >= 50 && currentIndex > 0) goToPrevious();
// //   };

// //   useEffect(() => {
// //     if (timerRef.current) {
// //       clearInterval(timerRef.current);
// //     }

// //     timerRef.current = setInterval(() => {
// //       dragX.get() === 0 && goToNext();
// //     }, 10000);

// //     return () => {
// //       if (timerRef.current) {
// //         clearInterval(timerRef.current);
// //       }
// //     };
// //   }, [goToNext, dragX]);

// //   return (
// //     <div className="space-y-6">
// //       <div className="relative aspect-square rounded-2xl overflow-hidden bg-white p-4 shadow-sm">
// //         {images.length ? (
// //           <motion.div
// //             drag="x"
// //             dragConstraints={{ left: 0, right: 0 }}
// //             style={{ x: dragX }}
// //             animate={{ translateX: `-${currentIndex * 100}%` }}
// //             transition={springOptions}
// //             onDragEnd={onDragEnd}
// //             className="flex h-full cursor-grab active:cursor-grabbing"
// //           >
// //             {images.map((image, index) => (
// //               <motion.div
// //                 key={index}
// //                 animate={{ scale: currentIndex === index ? 1 : 0.95 }}
// //                 transition={springOptions}
// //                 className="w-full shrink-0"
// //               >
// //                 <Skeleton isLoaded={!isLoading} className="object-contain">
// //                   <Image
// //                     src={`${process.env.NEXT_PUBLIC_AWS_URL}/products/${image}`}
// //                     alt={`Product Image - ${index + 1}`}
// //                     fill
// //                     className="object-contain"
// //                     priority={index === 0}
// //                     loading={index === 0 ? "eager" : "lazy"}
// //                   />
// //                 </Skeleton>
// //               </motion.div>
// //             ))}
// //           </motion.div>
// //         ) : (
// //           <div className="flex items-center justify-center h-full">
// //             <p className="text-gray-400">No images available</p>
// //           </div>
// //         )}

// //         {/* Navigation Arrows */}
// //         {images.length > 1 && (
// //           <>
// //             <button
// //               onClick={goToPrevious}
// //               className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
// //             >
// //               <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
// //             </button>
// //             <button
// //               onClick={goToNext}
// //               className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
// //             >
// //               <ChevronRightIcon className="w-6 h-6 text-gray-700" />
// //             </button>
// //           </>
// //         )}
// //       </div>

// //       {/* Thumbnails */}
// //       {images.length > 1 && (
// //         <div className="flex gap-4 overflow-x-auto pb-2">
// //           {images.map((image, index) => (
// //             <button
// //               key={index}
// //               onClick={() => goToSlide(index)}
// //               className={`relative w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all ${
// //                 currentIndex === index
// //                   ? "ring-2 ring-[#3bb77e] ring-offset-2"
// //                   : "hover:ring-2 hover:ring-gray-200"
// //               }`}
// //             >
// //               <Skeleton isLoaded={!isLoading} className="object-contain">
// //                 <Image
// //                   src={`${process.env.NEXT_PUBLIC_AWS_URL}/products/${image}`}
// //                   alt={`Thumbnail ${index + 1}`}
// //                   fill
// //                   className="object-cover"
// //                   // priority={index === 0}
// //                   // loading={index === 0 ? "eager" : "lazy"}
// //                 />
// //               </Skeleton>
// //             </button>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ProductImages;

// "use client";

// import Image from "next/image";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { PanInfo, motion, useMotionValue } from "framer-motion";
// import { Skeleton } from "@nextui-org/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

// type PropsType = {
//   images: string[];
//   altText?: string;
//   autoplayInterval?: number;
//   className?: string;
// };

// const ProductImages = ({
//   images,
//   altText = "Product Image",
//   autoplayInterval = 10000,
//   className = "",
// }: PropsType) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
//   const dragX = useMotionValue(0);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const carouselRef = useRef<HTMLDivElement>(null);

//   // Initialize images loaded state
//   useEffect(() => {
//     setImagesLoaded(Array(images.length).fill(false));
//   }, [images.length]);

//   const handleImageLoad = (index: number) => {
//     setImagesLoaded((prev) => {
//       const newState = [...prev];
//       newState[index] = true;
//       // Check if all images are loaded
//       if (newState.every((loaded) => loaded)) {
//         setIsLoading(false);
//       }
//       return newState;
//     });
//   };

//   const goToNext = useCallback(() => {
//     if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
//     else setCurrentIndex(0);
//   }, [images, currentIndex]);

//   const goToPrevious = useCallback(() => {
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//     else setCurrentIndex(images.length - 1);
//   }, [images, currentIndex]);

//   const goToSlide = (index: number) => {
//     setCurrentIndex(index);
//   };

//   const onDragEnd = (
//     event: MouseEvent | TouchEvent | PointerEvent,
//     info: PanInfo
//   ) => {
//     const threshold = carouselRef.current
//       ? carouselRef.current.offsetWidth * 0.15
//       : 50;

//     if (info.velocity.x < -500) {
//       goToNext();
//     } else if (info.velocity.x > 500) {
//       goToPrevious();
//     } else if (dragX.get() <= -threshold) {
//       goToNext();
//     } else if (dragX.get() >= threshold) {
//       goToPrevious();
//     }

//     // Reset drag value
//     dragX.set(0);
//   };

//   // Autoplay functionality
//   useEffect(() => {
//     if (images.length <= 1) return;

//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }

//     timerRef.current = setInterval(() => {
//       dragX.get() === 0 && goToNext();
//     }, autoplayInterval);

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [goToNext, dragX, autoplayInterval, images.length]);

//   // Pause autoplay on hover
//   const pauseAutoplay = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
//   };

//   // Resume autoplay when not hovering
//   const resumeAutoplay = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }

//     if (images.length > 1) {
//       timerRef.current = setInterval(() => {
//         dragX.get() === 0 && goToNext();
//       }, autoplayInterval);
//     }
//   };

//   // Spring animation options
//   const springOptions = {
//     type: "spring",
//     damping: 30,
//     stiffness: 300,
//   };

//   return (
//     <div className={`space-y-4 ${className}`}>
//       <div
//         className="relative aspect-square rounded-2xl overflow-hidden bg-white p-4 shadow-sm"
//         onMouseEnter={pauseAutoplay}
//         onMouseLeave={resumeAutoplay}
//         onTouchStart={pauseAutoplay}
//         onTouchEnd={resumeAutoplay}
//         ref={carouselRef}
//       >
//         {images && images.length > 0 ? (
//           <motion.div
//             drag="x"
//             dragConstraints={{ left: 0, right: 0 }}
//             style={{ x: dragX }}
//             animate={{ translateX: `-${currentIndex * 100}%` }}
//             transition={springOptions}
//             onDragEnd={onDragEnd}
//             className="flex h-full cursor-grab active:cursor-grabbing"
//           >
//             {images.map((image, index) => (
//               <motion.div
//                 key={index}
//                 animate={{ scale: currentIndex === index ? 1 : 0.95 }}
//                 transition={springOptions}
//                 className="w-full shrink-0"
//               >
//                 <Skeleton
//                   isLoaded={!isLoading || imagesLoaded[index]}
//                   className="h-full w-full rounded-xl"
//                 >
//                   <Image
//                     src={`https://komas500.s3.eu-north-1.amazonaws.com/products/1-product-stockings-test-1740343084936.jpeg`}
//                     alt={`${altText} - ${index + 1}`}
//                     fill
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                     className="object-contain"
//                     priority={index === 0 || index === currentIndex}
//                     loading={
//                       index === 0 || index === currentIndex ? "eager" : "lazy"
//                     }
//                     onLoad={() => handleImageLoad(index)}
//                     onError={() => handleImageLoad(index)}
//                   />
//                 </Skeleton>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <svg
//               viewBox="0 0 24 24"
//               className="w-20 h-20 text-gray-300"
//               stroke="currentColor"
//               fill="none"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//               />
//             </svg>
//             <p className="text-gray-400 absolute mt-24">No images available</p>
//           </div>
//         )}

//         {/* Navigation Arrows - Only show when multiple images */}
//         {images && images.length > 1 && (
//           <>
//             <button
//               onClick={goToPrevious}
//               aria-label="Previous image"
//               className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
//             >
//               <ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
//             </button>
//             <button
//               onClick={goToNext}
//               aria-label="Next image"
//               className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
//             >
//               <ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
//             </button>
//           </>
//         )}

//         {/* Image indicators for small screens */}
//         {images && images.length > 1 && (
//           <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 md:hidden">
//             {images.map((_, index) => (
//               <button
//                 key={`indicator-${index}`}
//                 onClick={() => goToSlide(index)}
//                 className={`w-2 h-2 rounded-full transition-all ${
//                   currentIndex === index ? "bg-[#3bb77e] w-4" : "bg-gray-300"
//                 }`}
//                 aria-label={`Go to image ${index + 1}`}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Thumbnails - Only show when multiple images and on larger screens */}
//       {images && images.length > 1 && (
//         <div className="hidden md:flex gap-2 lg:gap-4 overflow-x-auto pb-2 snap-x">
//           {images.map((image, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`relative w-16 lg:w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all snap-start ${
//                 currentIndex === index
//                   ? "ring-2 ring-[#3bb77e] ring-offset-2"
//                   : "hover:ring-2 hover:ring-gray-200"
//               }`}
//               aria-label={`View image ${index + 1}`}
//             >
//               <Skeleton
//                 isLoaded={!isLoading || imagesLoaded[index]}
//                 className="h-full w-full"
//               >
//                 <Image
//                   src={`https://komas500.s3.eu-north-1.amazonaws.com/products/${image}`}
//                   alt={`Thumbnail ${index + 1}`}
//                   fill
//                   sizes="80px"
//                   className="object-cover"
//                   loading="lazy"
//                   onLoad={() => handleImageLoad(index)}
//                   onError={() => handleImageLoad(index)}
//                 />
//               </Skeleton>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductImages;
'use client'

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { PanInfo, motion, useMotionValue } from 'framer-motion'
import { Skeleton } from '@nextui-org/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { RiImageLine } from 'react-icons/ri'
import { fetchSignedImageUrl } from '@/lib/getImages'

// Add a direct image fallback component for reuse
const ImageFallback = ({ message = 'No image available' }) => (
  <div className='flex items-center justify-center h-full w-full bg-gray-100'>
    <div className='flex flex-col items-center justify-center p-4 text-gray-400'>
      <RiImageLine className='w-12 h-12 mb-2' />
      <span className='text-sm text-center'>{message}</span>
    </div>
  </div>
)

type PropsType = {
  images: string[]
  altText?: string
  autoplayInterval?: number
  className?: string
}

const ProductImages = ({
  images,
  altText = 'Product Image',
  autoplayInterval = 10000,
  className = '',
}: PropsType) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [signedUrls, setSignedUrls] = useState<string[]>([])
  const [imageErrors, setImageErrors] = useState<boolean[]>([])
  const dragX = useMotionValue(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Use useMemo to calculate hasImages whenever images changes
  const hasImages = useMemo(() => {
    return (
      Array.isArray(images) && images.length > 0 && images.some((img) => !!img)
    )
  }, [images])

  // Fetch signed image URLs dynamically
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const loadImages = async () => {
      if (!hasImages) {
        setIsLoading(false)
        return
      }

      try {
        // Initialize error array with the expected length
        setImageErrors(Array(images.length).fill(false))

        // Fetch each URL individually to handle errors better
        const urlPromises = images.map(async (img, index) => {
          try {
            if (!img) return null
            return await fetchSignedImageUrl(img, 'products')
          } catch (err) {
            console.error(`Error fetching URL for image ${index}:`, err)
            // Mark this specific image as errored
            if (isMounted) {
              setImageErrors((prev) => {
                const newErrors = [...prev]
                newErrors[index] = true
                return newErrors
              })
            }
            return null
          }
        })

        const urls = await Promise.all(urlPromises)

        if (isMounted) {
          const filteredUrls = urls.filter((url): url is string => !!url)
          setSignedUrls(filteredUrls)

          // Always set loading to false when we're done processing
          setIsLoading(false)

          // Log information for debugging
          console.log(
            `Successfully fetched ${filteredUrls.length} of ${images.length} images`
          )
        }
      } catch (error) {
        console.error('Error in overall image fetching process:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadImages()

    return () => {
      isMounted = false
    }
  }, [images, hasImages])

  const handleImageError = (index: number) => {
    console.error(`Image at index ${index} failed to load`)
    setImageErrors((prev) => {
      const newErrors = [...prev]
      newErrors[index] = true
      return newErrors
    })
  }

  const goToNext = useCallback(() => {
    if (currentIndex < signedUrls.length - 1) setCurrentIndex(currentIndex + 1)
    else setCurrentIndex(0)
  }, [signedUrls, currentIndex])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
    else setCurrentIndex(signedUrls.length - 1)
  }, [signedUrls, currentIndex])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = carouselRef.current
      ? carouselRef.current.offsetWidth * 0.15
      : 50

    if (info.velocity.x < -500) {
      goToNext()
    } else if (info.velocity.x > 500) {
      goToPrevious()
    } else if (dragX.get() <= -threshold) {
      goToNext()
    } else if (dragX.get() >= threshold) {
      goToPrevious()
    }

    // Reset drag value
    dragX.set(0)
  }

  // Autoplay functionality
  useEffect(() => {
    if (signedUrls.length <= 1) return

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      dragX.get() === 0 && goToNext()
    }, autoplayInterval)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [goToNext, dragX, autoplayInterval, signedUrls.length])

  // Pause autoplay on hover
  const pauseAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  // Resume autoplay when not hovering
  const resumeAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (signedUrls.length > 1) {
      timerRef.current = setInterval(() => {
        dragX.get() === 0 && goToNext()
      }, autoplayInterval)
    }
  }

  // Spring animation options
  const springOptions = {
    type: 'spring',
    damping: 30,
    stiffness: 300,
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className='relative aspect-square rounded-2xl overflow-hidden bg-white p-4 shadow-sm'
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
        onTouchStart={pauseAutoplay}
        onTouchEnd={resumeAutoplay}
        ref={carouselRef}
      >
        {signedUrls.length > 0 ? (
          <motion.div
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX }}
            animate={{ translateX: `-${currentIndex * 100}%` }}
            transition={springOptions}
            onDragEnd={onDragEnd}
            className='flex h-full cursor-grab active:cursor-grabbing'
          >
            {signedUrls.map((url, index) => (
              <motion.div
                key={index}
                animate={{ scale: currentIndex === index ? 1 : 0.95 }}
                transition={springOptions}
                className='w-full shrink-0'
              >
                <Skeleton
                  isLoaded={!isLoading}
                  className='h-full w-full rounded-xl'
                >
                  <div className='relative w-full h-full'>
                    {!imageErrors[index] ? (
                      <Image
                        src={url}
                        alt={`${altText} - ${index + 1}`}
                        fill
                        sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                        className='object-contain'
                        onError={() => handleImageError(index)}
                        priority={index === 0 || index === currentIndex}
                        loading='eager'
                        unoptimized={true} // Skip Next.js image optimization to avoid additional problems
                      />
                    ) : (
                      <ImageFallback message='Image failed to load' />
                    )}
                  </div>
                </Skeleton>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <ImageFallback />
          </div>
        )}

        {/* Navigation Arrows - Only show when multiple images */}
        {signedUrls.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label='Previous image'
              className='absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
            >
              <ChevronLeftIcon className='w-4 h-4 md:w-6 md:h-6 text-gray-700' />
            </button>
            <button
              onClick={goToNext}
              aria-label='Next image'
              className='absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
            >
              <ChevronRightIcon className='w-4 h-4 md:w-6 md:h-6 text-gray-700' />
            </button>
          </>
        )}

        {/* Image indicators for small screens */}
        {signedUrls.length > 1 && (
          <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 md:hidden'>
            {signedUrls.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-[#3bb77e] w-4' : 'bg-gray-300'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails - Only show when multiple images and on larger screens */}
      {signedUrls.length > 1 && (
        <div className='hidden md:flex gap-2 lg:gap-4 overflow-x-auto pb-2 snap-x'>
          {signedUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-16 lg:w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all snap-start ${
                currentIndex === index
                  ? 'ring-2 ring-[#3bb77e] ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-200'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Skeleton isLoaded={!isLoading} className='h-full w-full'>
                {!imageErrors[index] ? (
                  <div className='relative w-full h-full'>
                    <Image
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                      className='object-cover'
                      onError={() => handleImageError(index)}
                      unoptimized={true} // Skip Next.js image optimization for thumbnails too
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center h-full w-full bg-gray-100'>
                    <RiImageLine className='w-6 h-6 text-gray-400' />
                  </div>
                )}
              </Skeleton>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImages
