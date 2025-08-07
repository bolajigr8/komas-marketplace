'use client'

import React from 'react'
import { Product } from '@/lib/types'
import { EmblaOptionsType } from 'embla-carousel'
import CustomSlider from './CustomSlider'
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
  return (
    <section className={`w-full ${className}`}>
      <div className='w-full max-w-screen-2xl mx-auto'>
        {title && (
          <div className='px-4 mb-4 md:mb-6'>
            <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>
              {title}
            </h2>
          </div>
        )}

        {products.length ? (
          <div className='pl-4'>
            <CustomSlider
              options={{
                loop: true,
                align: 'start',
                slidesToScroll: 1,
                skipSnaps: true,
                breakpoints: {
                  '(min-width: 640px)': {
                    slidesToScroll: 1,
                  },
                  '(min-width: 1024px)': {
                    slidesToScroll: 2,
                  },
                  '(min-width: 1280px)': {
                    slidesToScroll: 2,
                  },
                  '(min-width: 1536px)': {
                    slidesToScroll: 3,
                  },
                },
              }}
              classNames={{
                outerWrapper: 'w-full overflow-hidden',
                innerWrapper: 'gap-3 sm:gap-4 lg:gap-5',
                innerWrapperItem: `
                  w-[calc(83.333%-0.75rem)]
                  min-[450px]:w-[calc(58.823%-1rem)]
                  sm:w-[calc(43.478%-1rem)]
                  md:w-[calc(31.25%-1.25rem)]
                  lg:w-[calc(23.256%-1.5rem)]
                  xl:w-[calc(19.231%-1.5rem)]
                  flex-shrink-0
                  min-w-[240px]
                `,
                customArrowWrapper: 'hidden',
              }}
              autoplay={false}
            >
              {products.map((product, index) => (
                <ProductCardSlider
                  key={product._id}
                  product={product}
                  categoryName={categoryName}
                  showCartBtn={showCartBtn}
                  className='h-full'
                  priority={index < 6}
                />
              ))}
            </CustomSlider>
          </div>
        ) : (
          <div className='px-4'>
            <div className='w-full h-[300px] flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200'>
              <div className='text-center'>
                <div className='text-gray-400 mb-4'>
                  <svg
                    className='w-16 h-16 mx-auto'
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
                <p className='font-semibold text-gray-600 text-lg mb-2'>
                  No products available
                </p>
                <p className='text-sm text-gray-500'>
                  Check back later for new items
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsListSlider
