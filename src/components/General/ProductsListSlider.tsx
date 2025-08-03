'use client'
import React from 'react'
import { Product } from '@/lib/types'
import { EmblaOptionsType } from 'embla-carousel'
import CustomSlider from './CustomSlider'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import ProductCardSlider from './ProductCardSlider'

type PropsType = {
  title?: string
  categoryName?: string
  products: Product[]
  showCartBtn?: boolean
  className?: string
  viewMode?: 'grid' | 'list'
}

const ProductsListSlider = ({
  products,
  categoryName,
  showCartBtn,
  className,
  title = '',
  viewMode = 'grid',
}: PropsType) => {
  // Arrow button components
  const ArrowButton = ({
    direction,
    ...props
  }: {
    direction: 'left' | 'right'
    [key: string]: any
  }) => (
    <button
      type='button'
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      className={`absolute top-1/2 z-30 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-2 border border-gray-200 transition-all duration-200 ${
        direction === 'left' ? 'left-2' : 'right-2'
      }`}
      {...props}
    >
      {direction === 'left' ? (
        <RiArrowLeftSLine className='w-6 h-6 text-gray-600' />
      ) : (
        <RiArrowRightSLine className='w-6 h-6 text-gray-600' />
      )}
    </button>
  )

  return (
    <section className={`w-full px-4 ${className}`}>
      <div className='w-full relative'>
        {title && (
          <h2 className='text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800'>
            {title}
          </h2>
        )}
        {products.length ? (
          <CustomSlider
            options={{
              loop: true,
              align: 'start',
              slidesToScroll: 1,
              skipSnaps: true,
            }}
            classNames={{
              outerWrapper: 'w-full',
              innerWrapper: 'gap-2 sm:gap-3 lg:gap-4',
              // Updated responsive grid:
              // Mobile: 2 columns (50% width)
              // Tablet: 3 columns (33.33% width)
              // Small desktop: 4 columns (25% width)
              // Large desktop: 5 columns (20% width)
              innerWrapperItem: `
                w-[calc(50%-0.25rem)]
                sm:w-[calc(33.333%-0.5rem)]
                md:w-[calc(25%-0.75rem)]
                lg:w-[calc(20%-0.8rem)]
                flex-shrink-0
              `,
              customArrowWrapper: 'block',
            }}
            // customArrows={{
            //   prev: <ArrowButton direction='left' />,
            //   next: <ArrowButton direction='right' />,
            // }}
            autoplay={false}
          >
            {products.map((product, index) => (
              <ProductCardSlider
                key={product._id}
                product={product}
                categoryName={categoryName}
                showCartBtn={showCartBtn}
                className='h-full'
                priority={index < 4}
              />
            ))}
          </CustomSlider>
        ) : (
          <div className='w-full h-[200px] flex items-center justify-center rounded-lg bg-gray-50 border-2 border-dashed border-gray-200'>
            <div className='text-center'>
              <div className='text-gray-400 mb-2'>
                <svg
                  className='w-12 h-12 mx-auto'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                  />
                </svg>
              </div>
              <p className='font-medium text-gray-500'>No products available</p>
              <p className='text-sm text-gray-400 mt-1'>
                Check back later for new items
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsListSlider
