'use client'

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { PanInfo, motion, useMotionValue } from 'framer-motion'
import { RiImageLine } from 'react-icons/ri'
import Image from 'next/image'

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
  <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-200'>
    <div className='flex flex-col items-center justify-center p-6 text-gray-400'>
      <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3'>
        <RiImageLine className='w-8 h-8' />
      </div>
      <span className='text-sm text-center font-medium'>{message}</span>
    </div>
  </div>
)

type PropsType = {
  images: string | string[]
  folderName: string // Keep for consistency but use AWS URL approach
  altText?: string
  autoplayInterval?: number
  className?: string
  priority?: boolean
}

const ProductImages = ({
  images,
  folderName,
  altText = 'Product Image',
  autoplayInterval = 1000,
  className = '',
  priority = false,
}: PropsType) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([])
  const [imageErrors, setImageErrors] = useState<boolean[]>([])
  const dragX = useMotionValue(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Process images using AWS URL approach like ProductCardSlider
  const processedImages = useMemo(() => {
    if (!images) return []

    const imageArray = Array.isArray(images) ? images : [images]
    return imageArray
      .filter((img) => !!img)
      .map(
        (image) => `${process.env.NEXT_PUBLIC_AWS_URL}/${folderName}/${image}`
      )
  }, [images, folderName])

  // Use useMemo to calculate hasImages
  const hasImages = useMemo(() => {
    return processedImages.length > 0
  }, [processedImages])

  // Optimized sizes attribute for product detail page
  const getSizesAttribute = () => {
    return '(max-width: 480px) 340px, (max-width: 768px) 460px, (max-width: 1024px) 512px, 600px'
  }

  // Thumbnail sizes
  const getThumbnailSizes = () => {
    return '(max-width: 1024px) 64px, (max-width: 1280px) 80px, 96px'
  }

  // Reset states when images change
  useEffect(() => {
    setCurrentIndex(0)
    setImageLoadingStates(Array(processedImages.length).fill(true))
    setImageErrors(Array(processedImages.length).fill(false))
  }, [processedImages.length])

  const goToNext = useCallback(() => {
    if (currentIndex < processedImages.length - 1)
      setCurrentIndex(currentIndex + 1)
    else setCurrentIndex(0)
  }, [processedImages.length, currentIndex])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
    else setCurrentIndex(processedImages.length - 1)
  }, [processedImages.length, currentIndex])

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

  // Handle image loading
  const handleImageLoad = (index: number) => {
    setImageLoadingStates((prev) => {
      const newStates = [...prev]
      newStates[index] = false
      return newStates
    })
  }

  // Handle image errors
  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev]
      newErrors[index] = true
      return newErrors
    })
    setImageLoadingStates((prev) => {
      const newStates = [...prev]
      newStates[index] = false
      return newStates
    })
  }

  // Preload priority images
  useEffect(() => {
    if (processedImages.length > 0 && priority) {
      const img = new window.Image()
      img.src = processedImages[0]
    }
  }, [processedImages, priority])

  // Autoplay functionality
  useEffect(() => {
    if (processedImages.length <= 1) return

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
  }, [goToNext, dragX, autoplayInterval, processedImages.length])

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

    if (processedImages.length > 1) {
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
      {/* Mobile Layout with thumbnails on the left */}
      <div className='md:hidden'>
        {processedImages.length > 1 ? (
          <div className='flex gap-4'>
            {/* Thumbnails on the left for mobile */}
            <div className='flex flex-col gap-2 w-16'>
              {processedImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative w-16 h-16 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    currentIndex === index
                      ? 'ring-2 ring-[#3bb77e] ring-offset-2 scale-105'
                      : 'hover:ring-2 hover:ring-gray-200'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  {/* Thumbnail loading state and error handling */}
                  {imageLoadingStates[index] && (
                    <div className='absolute inset-0 z-10'>
                      <ImageSkeleton />
                    </div>
                  )}

                  {!imageErrors[index] ? (
                    <Image
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes='64px'
                      className='object-cover'
                      style={{
                        opacity: imageLoadingStates[index] ? 0 : 1,
                      }}
                      priority={false}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                      loading='lazy'
                      quality={80}
                      placeholder='blur'
                      blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
                    />
                  ) : (
                    <div className='flex items-center justify-center h-full w-full bg-gray-100'>
                      <RiImageLine className='w-6 h-6 text-gray-400' />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main image container */}
            <div
              className='relative flex-1 aspect-square rounded-2xl overflow-hidden bg-white p-2 sm:p-4 shadow-sm'
              onMouseEnter={pauseAutoplay}
              onMouseLeave={resumeAutoplay}
              onTouchStart={pauseAutoplay}
              onTouchEnd={resumeAutoplay}
              ref={carouselRef}
            >
              <div className='relative w-full h-full overflow-hidden rounded-lg'>
                <motion.div
                  drag='x'
                  dragConstraints={{ left: 0, right: 0 }}
                  style={{ x: dragX }}
                  animate={{ translateX: `-${currentIndex * 100}%` }}
                  transition={springOptions}
                  onDragEnd={onDragEnd}
                  className='flex h-full cursor-grab active:cursor-grabbing'
                >
                  {processedImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className='w-full h-full flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'
                    >
                      <motion.div
                        animate={{ scale: currentIndex === index ? 1 : 0.95 }}
                        transition={springOptions}
                        className='w-full h-full relative'
                      >
                        {/* Loading skeleton */}
                        {imageLoadingStates[index] && (
                          <div className='absolute inset-0 z-10'>
                            <ImageSkeleton />
                          </div>
                        )}

                        {/* Show image if not errored, otherwise show fallback */}
                        {!imageErrors[index] ? (
                          <Image
                            src={imageUrl}
                            alt={`${altText} - ${index + 1}`}
                            fill
                            sizes={getSizesAttribute()}
                            className='object-contain transition-all duration-500 p-3 sm:p-4'
                            style={{
                              opacity: imageLoadingStates[index] ? 0 : 1,
                              objectPosition: 'center',
                            }}
                            priority={
                              priority &&
                              (index === 0 || index === currentIndex)
                            }
                            onLoad={() => handleImageLoad(index)}
                            onError={() => handleImageError(index)}
                            loading={index === 0 && priority ? 'eager' : 'lazy'}
                            quality={90}
                            placeholder='blur'
                            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
                          />
                        ) : (
                          <ImageFallback />
                        )}
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className='relative w-full aspect-square rounded-2xl overflow-hidden bg-white p-2 sm:p-4 shadow-sm'
            ref={carouselRef}
          >
            {hasImages ? (
              <div className='relative w-full h-full overflow-hidden rounded-lg'>
                <motion.div className='flex h-full'>
                  <div className='w-full h-full flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
                    <motion.div className='w-full h-full relative'>
                      {/* Loading skeleton */}
                      {imageLoadingStates[0] && (
                        <div className='absolute inset-0 z-10'>
                          <ImageSkeleton />
                        </div>
                      )}

                      {/* Show image if not errored, otherwise show fallback */}
                      {!imageErrors[0] && processedImages[0] ? (
                        <Image
                          src={processedImages[0]}
                          alt={altText}
                          fill
                          sizes={getSizesAttribute()}
                          className='object-contain transition-all duration-500 p-3 sm:p-4'
                          style={{
                            opacity: imageLoadingStates[0] ? 0 : 1,
                            objectPosition: 'center',
                          }}
                          priority={priority}
                          onLoad={() => handleImageLoad(0)}
                          onError={() => handleImageError(0)}
                          loading={priority ? 'eager' : 'lazy'}
                          quality={90}
                          placeholder='blur'
                          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
                        />
                      ) : (
                        <ImageFallback />
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <ImageFallback />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Layout (unchanged) */}
      <div className='hidden md:block space-y-4'>
        <div
          className='relative w-full aspect-square rounded-2xl overflow-hidden bg-white p-2 sm:p-4 shadow-sm'
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          onTouchStart={pauseAutoplay}
          onTouchEnd={resumeAutoplay}
          ref={carouselRef}
        >
          {hasImages ? (
            <div className='relative w-full h-full overflow-hidden rounded-lg'>
              <motion.div
                drag='x'
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x: dragX }}
                animate={{ translateX: `-${currentIndex * 100}%` }}
                transition={springOptions}
                onDragEnd={onDragEnd}
                className='flex h-full cursor-grab active:cursor-grabbing'
              >
                {processedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className='w-full h-full flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'
                  >
                    <motion.div
                      animate={{ scale: currentIndex === index ? 1 : 0.95 }}
                      transition={springOptions}
                      className='w-full h-full relative'
                    >
                      {/* Loading skeleton */}
                      {imageLoadingStates[index] && (
                        <div className='absolute inset-0 z-10'>
                          <ImageSkeleton />
                        </div>
                      )}

                      {/* Show image if not errored, otherwise show fallback */}
                      {!imageErrors[index] ? (
                        <Image
                          src={imageUrl}
                          alt={`${altText} - ${index + 1}`}
                          fill
                          sizes={getSizesAttribute()}
                          className='object-contain transition-all duration-500 p-3 sm:p-4'
                          style={{
                            opacity: imageLoadingStates[index] ? 0 : 1,
                            objectPosition: 'center',
                          }}
                          priority={
                            priority && (index === 0 || index === currentIndex)
                          }
                          onLoad={() => handleImageLoad(index)}
                          onError={() => handleImageError(index)}
                          loading={index === 0 && priority ? 'eager' : 'lazy'}
                          quality={90}
                          placeholder='blur'
                          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
                        />
                      ) : (
                        <ImageFallback />
                      )}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <ImageFallback />
            </div>
          )}
        </div>

        {/* Thumbnails - Only show when multiple images and on larger screens */}
        {processedImages.length > 1 && (
          <div className='flex gap-2 lg:gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide'>
            {processedImages.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all snap-start ${
                  currentIndex === index
                    ? 'ring-2 ring-[#3bb77e] ring-offset-2 scale-105'
                    : 'hover:ring-2 hover:ring-gray-200 hover:scale-102'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                {/* Thumbnail loading state and error handling */}
                {imageLoadingStates[index] && (
                  <div className='absolute inset-0 z-10'>
                    <ImageSkeleton />
                  </div>
                )}

                {!imageErrors[index] ? (
                  <Image
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes={getThumbnailSizes()}
                    className='object-cover'
                    style={{
                      opacity: imageLoadingStates[index] ? 0 : 1,
                    }}
                    priority={false}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    loading='lazy'
                    quality={80}
                    placeholder='blur'
                    blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuwjA'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full w-full bg-gray-100'>
                    <RiImageLine className='w-6 h-6 text-gray-400' />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductImages
