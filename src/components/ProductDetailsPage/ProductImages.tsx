'use client'

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { PanInfo, motion, useMotionValue } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { RiImageLine } from 'react-icons/ri'
import ServerImageRender from '../General/ServerImageRender'

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
  images: string | string[]
  folderName: string // New prop for server image folder
  altText?: string
  autoplayInterval?: number
  className?: string
  priority?: boolean
}

const ProductImages = ({
  images,
  folderName,
  altText = 'Product Image',
  autoplayInterval = 10000,
  className = '',
  priority = false,
}: PropsType) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const dragX = useMotionValue(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Process images to get array of image names
  const processedImages = useMemo(() => {
    if (!images) return []

    const imageArray = Array.isArray(images) ? images : [images]
    return imageArray.filter((img) => !!img)
  }, [images])

  // Use useMemo to calculate hasImages
  const hasImages = useMemo(() => {
    return processedImages.length > 0
  }, [processedImages])

  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0)
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
              {processedImages.map((imageName, index) => (
                <div
                  key={index}
                  className='w-full h-full flex-shrink-0 relative overflow-hidden'
                >
                  <motion.div
                    animate={{ scale: currentIndex === index ? 1 : 0.95 }}
                    transition={springOptions}
                    className='w-full h-full relative'
                  >
                    <ServerImageRender
                      folderName={folderName}
                      src={imageName}
                      alt={`${altText} - ${index + 1}`}
                      className='w-full h-full object-contain'
                      width={600} // Adjust based on your needs
                      height={600}
                      priority={
                        priority && (index === 0 || index === currentIndex)
                      }
                    />
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

        {/* Navigation Arrows - Only show when multiple images */}
        {processedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label='Previous image'
              className='absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 z-20'
            >
              <ChevronLeftIcon className='w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-gray-700' />
            </button>
            <button
              onClick={goToNext}
              aria-label='Next image'
              className='absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 z-20'
            >
              <ChevronRightIcon className='w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-gray-700' />
            </button>
          </>
        )}

        {/* Image indicators for small screens */}
        {processedImages.length > 1 && (
          <div className='absolute bottom-1 sm:bottom-2 left-0 right-0 flex justify-center gap-1 sm:gap-1.5 md:hidden z-20'>
            {processedImages.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all backdrop-blur-sm ${
                  currentIndex === index
                    ? 'bg-[#3bb77e] w-3 sm:w-4 shadow-md'
                    : 'bg-white/70 hover:bg-white/90'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails - Only show when multiple images and on larger screens */}
      {processedImages.length > 1 && (
        <div className='hidden md:flex gap-2 lg:gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide'>
          {processedImages.map((imageName, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 transition-all snap-start ${
                currentIndex === index
                  ? 'ring-2 ring-[#3bb77e] ring-offset-2 scale-105'
                  : 'hover:ring-2 hover:ring-gray-200 hover:scale-102'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <ServerImageRender
                folderName={folderName}
                src={imageName}
                alt={`Thumbnail ${index + 1}`}
                className='w-full h-full object-cover'
                width={80} // Smaller for thumbnails
                height={80}
                priority={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImages
