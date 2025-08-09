'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import LocationSelector from './LocationSelector'
import Search from '../General/Search'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  FaShieldAlt,
  FaTruck,
  FaExchangeAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import ProductsList from '../General/ProductsList'
import { Products } from '@/lib/types'

type PropsType = {
  query?: string
  category?: string
  // products: Products;
}

const slides = [
  {
    id: 1,
    image: '/Images/Home/New Home Pics/_komas-Beauty Perfume Banner/2.png',
    title: 'Beauty Perfume',
    subtitle: 'White new organic formula for your daily use',
  },
  {
    id: 2,
    image: '/Images/Home/New Home Pics/komas-Cosmetic skincare/2.png',
    title: 'Cosmetic Sale',
    subtitle: 'Your Favorite Brands at Irresistible Prices',
  },
  {
    id: 3,
    image: '/Images/Home/New Home Pics/komas-Skincare & Cosmetics Promo/2.png',
    title: ' Liceria Beauty SkinCare',
    subtitle:
      'Infused with rosehip and olive oil, help tighten, lighten and enrich your skin',
  },
  {
    id: 4,
    image: '/Images/Home/New Home Pics/pef-komas/2.png',
    title: ' Borcelle Beauty SkinCare',
    subtitle: 'Glow Naturally with Borcelle, Now on Sale!',
  },
]

export default function HeroSection({ query, category }: PropsType) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className='relative w-full min-h-[630px] lg:min-h-[670px] overflow-hidden bg-gray-900'>
      {/* Render all slides, but only show the current one */}
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={false}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            scale: index === currentSlide ? 1 : 1.05,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoother transition
          }}
          className='absolute inset-0'
          style={{
            zIndex: index === currentSlide ? 1 : 0,
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title || ''}
            fill
            className='object-cover'
            priority={index === 0} // Only prioritize the first image
            sizes='100vw'
          />
          <div className='absolute inset-0 bg-black/30' />
        </motion.div>
      ))}

      {/* Navigation dots */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-[#3BB77E]' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div className='container mx-auto px-4 py-8 relative z-10'>
        <LocationSelector />

        <div className='mt-12 lg:mt-16 max-w-4xl mx-auto text-center'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6'>
                {slides[currentSlide].title}
              </h1>
              <p className='text-xl text-white/90 mb-8'>
                {slides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='max-w-2xl mx-auto'
          >
            <Search
              searchFor='product'
              q={query}
              placeholder='search for products...'
              classNames={{
                wrapper: 'shadow-xl',
                input: 'text-lg',
                button: 'px-8 text-lg bg-[#3BB77E] hover:bg-[#2ea46c]',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className='absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm z-10'>
        <div className='container mx-auto px-4 py-1 mb-6'>
          <div className='flex flex-wrap  justify-center gap-8  text-white text-sm'>
            <div className='flex items-center gap-2'>
              <FaShieldAlt className='w-5 h-5' />
              <span>Secure Payments</span>
            </div>
            <div className='flex items-center gap-2'>
              <FaTruck className='w-5 h-5' />
              <span>Fast Delivery</span>
            </div>

            <div className=' hidden lg:flex items-center gap-2'>
              <FaExchangeAlt className='w-5 h-5' />
              <span>Easy Returns</span>
            </div>

            <div className='flex items-center gap-2'>
              <FaTruck className='w-5 h-5' />
              <span>Call to Order: (+234) 8029636616</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
