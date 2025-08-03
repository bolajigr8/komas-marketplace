'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { FeaturedProducts } from '@/components/CategoryPage/FeaturedProducts'
import BgCardsSlider from '@/components/General/BgCardsSlider'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import ProductsList from '@/components/General/ProductsList'
import ProductsListSlider from '@/components/General/ProductsListSlider'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface SingleCategoryClientProps {
  categoryId: string
  initialAllProducts: Product[]
  initialProducts: Product[]
  initialTotalProducts: number
  initialCurrentPage: number
  totalPages: number
  itemsPerPage: number
  categoryInfo: {
    name: string
    description: string
  }
  error?: string
}

// Enhanced Loader Component
const ProductsLoader = () => (
  <div className='w-full h-64 flex items-center justify-center'>
    <div className='text-center'>
      <div className='loader mx-auto mb-4'></div>
      <p className='text-gray-500 animate-pulse'>Loading products...</p>
    </div>
  </div>
)

// Featured Products Skeleton
const FeaturedProductsSkeleton = () => (
  <section className='mb-12'>
    <div className='h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse'></div>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
      {[...Array(5)].map((_, i) => (
        <div key={i} className='bg-gray-100 rounded-lg p-4 animate-pulse'>
          <div className='h-48 bg-gray-200 rounded mb-4'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </div>
      ))}
    </div>
  </section>
)

// Product Slider Component (using ProductsListSlider)
const ProductSlider = ({
  products,
  title,
}: {
  products: Product[]
  title: string
}) => {
  if (products.length === 0) return null

  return (
    <div className='mb-12'>
      <ProductsListSlider
        products={products}
        title={title}
        showCartBtn={true}
        viewMode='grid'
        className='px-0' // Remove extra padding since parent already has padding
      />
    </div>
  )
}

// Product Grid Component (using ProductsList)
const ProductGrid = ({
  products,
  title,
}: {
  products: Product[]
  title: string
}) => {
  if (products.length === 0) return null

  return (
    <div className='mb-12'>
      <ProductsList
        products={products}
        title={title}
        showCartBtn={true}
        viewMode='grid'
        className='px-0' // Remove extra padding since parent already has padding
      />
    </div>
  )
}

const SingleCategoryClient = ({
  categoryId,
  initialAllProducts,
  initialProducts,
  initialTotalProducts,
  initialCurrentPage,
  totalPages: propTotalPages,
  itemsPerPage,
  categoryInfo: initialCategoryInfo,
  error,
}: SingleCategoryClientProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [allProducts, setAllProducts] = useState<Product[]>(initialAllProducts)
  const [paginationLoading, setPaginationLoading] = useState(false)
  const [categoryInfo, setCategoryInfo] = useState(initialCategoryInfo)
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)
  const [totalPages, setTotalPages] = useState(propTotalPages)

  // Update state when props change (for navigation)
  useEffect(() => {
    setProducts(initialProducts)
    setAllProducts(initialAllProducts)
    setCategoryInfo(initialCategoryInfo)
    setTotalProducts(initialTotalProducts)
    setCurrentPage(initialCurrentPage)
    setTotalPages(propTotalPages)
  }, [
    initialProducts,
    initialAllProducts,
    initialCategoryInfo,
    initialTotalProducts,
    initialCurrentPage,
    propTotalPages,
  ])

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page === currentPage) return

    setPaginationLoading(true)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)

    // Simulate slight delay for better UX (optional)
    const timeoutId = setTimeout(() => {
      try {
        // Apply pagination to sorted products
        const start = (page - 1) * itemsPerPage
        const end = page * itemsPerPage
        setProducts(allProducts.slice(start, end))
        setCurrentPage(page)
      } catch (error) {
        console.error('Error processing products:', error)
      } finally {
        setPaginationLoading(false)
      }
    }, 150) // Small delay for smoother UX

    return () => clearTimeout(timeoutId)
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    // Always show first page
    items.push(
      <PaginationItem key='page-1'>
        <PaginationLink
          href='#'
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(1)
          }}
          isActive={currentPage === 1}
          size='default'
        >
          1
        </PaginationLink>
      </PaginationItem>
    )

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

    // Adjust start if end is maxed out
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3))
    }

    // Show ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key='ellipsis-1'>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            href='#'
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
            isActive={currentPage === i}
            size='default'
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Show ellipsis before last page if needed
    if (endPage < totalPages - 1 && totalPages > 2) {
      items.push(
        <PaginationItem key='ellipsis-2'>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Always show last page if totalPages > 1
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            href='#'
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  // Show error state
  if (error || !categoryId) {
    return (
      <div className='max-w-7xl mx-auto mt-10 px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Category</h1>
          <p className='text-gray-600 mt-2'>
            Browse products in this category.
          </p>
        </div>
        <div className='text-center py-12'>
          <p className='text-red-500 text-lg'>
            {error || 'Category not found.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Split products into sections following the pattern
  const featuredProducts = allProducts
    .filter((p) => p.tags?.includes('featured') || false)
    .slice(0, 25)
  const firstSliderProducts = products.slice(0, 25) // First Slider: 25 products
  const secondSliderProducts = products.slice(25, 50) // Second Slider: 25 products
  const firstGridProducts = products.slice(50, 62) // First Grid: 12 products
  const thirdSliderProducts = products.slice(62, 87) // Third Slider: 25 products
  const secondGridProducts = products.slice(87, 99) // Second Grid: 12 products

  return (
    <div className='max-w-7xl mx-auto mt-10 px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          {categoryInfo.name || 'Category'}
        </h1>
        <p className='text-gray-600 mt-2'>
          {categoryInfo.description || 'No description available.'}
        </p>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>Featured Products</h2>
          <FeaturedProducts products={featuredProducts} />
        </section>
      )}

      {/* Main Content Area */}
      <div className='relative'>
        {/* Pagination Loading Overlay */}
        {paginationLoading && (
          <div className='absolute inset-0 bg-white/70 z-10 flex items-center justify-center'>
            <div className='text-center'>
              <div className='loader mx-auto mb-2'></div>
              <p className='text-gray-500 text-sm'>Loading page...</p>
            </div>
          </div>
        )}

        {/* Products Content */}
        <div
          className={`transition-opacity duration-200 ${
            paginationLoading ? 'opacity-30' : 'opacity-100'
          }`}
        >
          {/* First Slider - 25 products */}
          <ProductSlider
            products={firstSliderProducts}
            title='Latest products'
          />

          {/* First BgCardsSlider - Positioned after the first slider */}
          <div className='mb-12'>
            <BgCardsSlider />
          </div>

          {/* Second Slider - 25 products */}
          <ProductSlider
            products={secondSliderProducts}
            title='Trending Products'
          />

          {/* First Grid Block - 12 products */}
          <ProductGrid
            products={firstGridProducts}
            title='Featured Collection'
          />

          {/* Second BgCardsSlider - Only show if we have enough products for a good layout */}
          {products.length >= 75 && (
            <div className='mb-12'>
              <BgCardsSlider />
            </div>
          )}

          {/* Third Slider - 25 products */}
          <ProductSlider
            products={thirdSliderProducts}
            title='You Might Like'
          />

          {/* Second Grid Block - 12 products */}
          <ProductGrid products={secondGridProducts} title='More Products' />

          {/* No products message */}
          {products.length === 0 && !paginationLoading && (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>
                No products found in this category.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`mt-8 transition-opacity duration-200 ${
              paginationLoading
                ? 'opacity-50 pointer-events-none'
                : 'opacity-100'
            }`}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1)
                      }
                    }}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                    size='default'
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1)
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                    size='default'
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleCategoryClient
