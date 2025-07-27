'use client'

import React, { useMemo } from 'react'
import ProductDetailsCard from './ProductDetailsCard'
import ProductImages from './ProductImages'
import { Product } from '@/lib/types'
import Link from 'next/link'

type PropsType = {
  product: Product
}

const ProductDetailsSection = ({ product }: PropsType) => {
  // console.log('Product Details Section', product)

  // Combine product images with variant images
  const allImages = useMemo(() => {
    const images: string[] = []

    // Add main product images first
    if (product.images) {
      const productImages = Array.isArray(product.images)
        ? product.images
        : [product.images]
      images.push(...productImages.filter((img) => img)) // Filter out any null/undefined images
    }

    // Add variant images
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach((variant) => {
        if (variant.images && Array.isArray(variant.images)) {
          // Extract just the filename from the full path for variant images
          const variantImages = variant.images
            .filter((img) => img) // Filter out any null/undefined images
            .map((img) => {
              // Extract filename from path like "public/temporary-files/1746514176974-images.jpeg"
              const filename = img.split('/').pop() || img
              return filename
            })
          images.push(...variantImages)
        }
      })
    }

    return images
  }, [product.images, product.variants])

  return (
    <section className='w-full min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
        <nav className='flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8'>
          <Link href='/' className='hover:text-primary-300 truncate'>
            Home
          </Link>
          <span>/</span>
          <Link
            className='hover:text-primary-300 truncate'
            href={`/store?category=/${
              typeof product.category === 'string'
                ? product.category
                : product.category._id
            }`}
          >
            {typeof product.category === 'string'
              ? product.category
              : product.category.name}
          </Link>
          <span>/</span>
          <span className='text-[#3bb77e] truncate'>{product.name}</span>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12'>
          <div className='w-full'>
            <ProductImages
              folderName='products'
              images={allImages}
              autoplayInterval={10000} // 10 seconds
            />
          </div>
          <div className='w-full'>
            <ProductDetailsCard product={product} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsSection
