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
    image: '/images/Home/slide1.webp',
    // title: "Shop Global, Delivered Local",
    // subtitle: "Fast same-day delivery from ₦200",
    title: 'Transform Your Space',
    subtitle: 'Lowest price guaranteed',
  },
  {
    id: 2,
    image: '/images/Home/slide2.webp',
    // title: "Quality Products, Amazing Prices",
    // subtitle: "Shop with confidence from verified sellers",
    itle: 'Shop Smart, Live Smart',
    subtitle: 'Exclusive tech deals',
  },
  {
    id: 3,
    image: '/images/Home/slide3.webp',
    title: 'Flash Sales & Deals',
    subtitle: 'Up to 70% off on trending items',
  },
]

// const textsList = [
//   ["Enjoy easy and fast same", "day delivery with", "Komas500"],
//   ["Fast and hassle-free", "checkout with", "Komas500"],
//   ["Shop top-notch items", "only at", "Komas500"],
//   ["Komas500:", "Your destination for", "high-quality products"],
// ];
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
    <section className='relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden'>
      <AnimatePresence mode='wait'>
        <motion.div
          // key={currentSlide}
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          // transition={{ duration: 0.5 }}
          // className="absolute inset-0"
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className='absolute inset-0'
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset, velocity }) => {
            if (offset.x > 50 || velocity.x > 1) prevSlide()
            else if (offset.x < -50 || velocity.x < -1) nextSlide()
          }}
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title || ''}
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-black/40' />
        </motion.div>
      </AnimatePresence>

      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-6 h-6 text-white" />
      </button> */}

      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'w-8 bg-[#3BB77E]' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className='container mx-auto px-4 py-8 relative z-10'>
        <LocationSelector />

        <div className='mt-12 lg:mt-16 max-w-4xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6'>
              {slides[currentSlide].title}
            </h1>
            <p className='text-xl text-white/90 mb-8'>
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='max-w-2xl mx-auto'
          >
            <Search
              searchFor='product'
              // addFilter
              q={query}
              // products={products }
              // category={category}
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

      <div className='absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-wrap justify-center gap-8 text-white text-sm'>
            <div className='flex items-center gap-2'>
              <FaShieldAlt className='w-5 h-5' />
              <span>Secure Payments</span>
            </div>
            <div className='flex items-center gap-2'>
              <FaTruck className='w-5 h-5' />
              <span>Fast Delivery</span>
            </div>
            <div className='flex items-center gap-2'>
              <FaExchangeAlt className='w-5 h-5' />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
