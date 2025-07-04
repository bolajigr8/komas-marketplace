'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Filter } from 'lucide-react'
import { Product } from '@/lib/types'
import { getProductsByCategory } from '@/lib/server-actions/product'
import { CategoryFilters } from '@/types/category'
import { FeaturedProducts } from '@/components/CategoryPage/FeaturedProducts'
import { FilterSidebar } from '@/components/CategoryPage/FilterSidebar'
import { ViewControls } from '@/components/CategoryPage/ViewControls'
import { ProductGrid } from '@/components/CategoryPage/ProductGrid'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import ProductsList from '@/components/General/ProductsList'
import Loader from '@/components/General/Loader'
import { getProducts } from '@/lib/server-actions/product'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const Category = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('query')
  const pageParam = searchParams.get('page')

  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CategoryFilters>({
    sortBy: 'newest',
    priceRange: [],
    brands: [],
    colors: [],
    shipsFrom: [],
    ratings: [],
    features: [],
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)

  // Pagination state
  const itemsPerPage = 9
  const currentPage = pageParam ? parseInt(pageParam) : 1
  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  // First fetch all products to determine the total count
  useEffect(() => {
    const fetchProductsCount = async () => {
      try {
        if (categoryId) {
          const response = await getProductsByCategory(categoryId)
          console.log(response, 'response for categories')

          setAllProducts(response.data || [])
          console.log(response.data, 'response.data for categories')
          setTotalProducts(response.data?.length || 0)
        } else {
          const response = await getProducts({ page: 1, perPage: 1000 })
          const products = response.data?.products || []
          setAllProducts(products)
          setTotalProducts(products.length)
        }
      } catch (error) {
        console.error('Error fetching products count:', error)
      }
    }

    fetchProductsCount()
  }, [categoryId])

  // Apply filters and pagination
  useEffect(() => {
    setLoading(true)

    // First apply filters
    const filteredProducts = applyFilters(allProducts)

    // Then apply sorting
    const sortedProducts = applySorting(filteredProducts)

    // Finally apply pagination
    const start = (currentPage - 1) * itemsPerPage
    const end = currentPage * itemsPerPage
    setProducts(sortedProducts.slice(start, end))

    // Update total count based on filtered results
    setTotalProducts(filteredProducts.length)

    setLoading(false)
  }, [allProducts, currentPage, filters])

  // Filter featured products from all loaded products
  const featuredProducts = allProducts.filter(
    (p) => p.tags?.includes('featured') || false
  )

  // Apply filters to products - Updated to match actual product structure
  const applyFilters = (products: Product[]) => {
    return products.filter((product) => {
      // Price Range filter
      if (filters.priceRange.length > 0) {
        const productPrice = product.price
        const matchesPrice = filters.priceRange.some((range) => {
          // Parse the price range (e.g., "0-100", "100-500", "500+")
          const rangeValues = range.split('-')
          if (rangeValues.length === 2) {
            const min = parseInt(rangeValues[0])
            const max = parseInt(rangeValues[1])
            return productPrice >= min && productPrice <= max
          } else if (range.endsWith('+')) {
            const min = parseInt(range.replace('+', ''))
            return productPrice >= min
          }
          return false
        })
        if (!matchesPrice) return false
      }

      // Brands filter
      if (filters.brands.length > 0 && product.brand) {
        // Check if brand matches any of the selected brands
        // Adapt to the nested brand structure
        const brandName =
          typeof product.brand === 'string'
            ? product.brand
            : product.brand?.name

        if (brandName && !filters.brands.includes(brandName)) return false
      }

      // Region/Location filter (Ships From)
      if (filters.shipsFrom.length > 0 && product.region) {
        if (!filters.shipsFrom.includes(product.region)) return false
      }

      // For features, we'll check against tags or other properties
      // Since your product doesn't have specific features property,
      // we can check against tags or adapt this to your data structure
      if (filters.features.length > 0 && product.tags) {
        const productTags = Array.isArray(product.tags) ? product.tags : []
        const hasMatchingFeature = filters.features.some((feature) =>
          productTags.includes(feature)
        )
        if (!hasMatchingFeature) return false
      }

      // We don't have ratings in the sample product data, but if it exists:
      // if (filters.ratings.length > 0 && product.rating !== undefined) {
      //   const matchesRating = filters.ratings.some((rating) => {
      //     const ratingValue = typeof rating === 'string' ? parseInt(rating) : rating
      //     return Math.round(product.rating) === ratingValue
      //   })
      //   if (!matchesRating) return false
      // }

      return true
    })
  }

  // Apply sorting to products - Updated to match your data structure
  const applySorting = (products: Product[]) => {
    const sortedProducts = [...products]

    switch (filters.sortBy) {
      case 'price-low-high':
        return sortedProducts.sort((a, b) => a.price - b.price)
      case 'price-high-low':
        return sortedProducts.sort((a, b) => b.price - a.price)
      case 'newest':
        return sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case 'rating':
        // If ratings exist in your data, uncomment this
        // return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        return sortedProducts // Default if no ratings
      case 'featured':
      default:
        // Prioritize featured products using tags
        return sortedProducts.sort((a, b) => {
          const aFeatured = a.tags?.includes('featured') ? 1 : 0
          const bFeatured = b.tags?.includes('featured') ? 1 : 0
          return bFeatured - aFeatured
        })
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    // Create new search params
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())

    // Navigate to new URL with updated page
    router.push(`?${params.toString()}`)
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

  // console.log(allProducts, 'products')

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          {!categoryId && 'All Products'}
          {categoryId &&
            (products.length > 0
              ? typeof products[0]?.category === 'string'
                ? products[0]?.category
                : products[0]?.category?.name || 'Category'
              : 'Category')}
        </h1>

        <p className='text-gray-600 mt-2'>
          {!categoryId &&
            'Browse through all available products across categories.'}
          {categoryId &&
            (products.length > 0
              ? typeof products[0]?.category === 'string'
                ? products[0]?.category
                : products[0]?.category?.description ||
                  'No description available.'
              : 'No description available.')}
        </p>
      </div>

      {featuredProducts.length > 0 && (
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>Featured Products</h2>
          <FeaturedProducts products={featuredProducts} />
        </section>
      )}

      <div className='flex flex-col lg:flex-row gap-8'>
        <aside
          className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        </aside>

        <main className='flex-1'>
          <div className='flex justify-between items-center mb-6'>
            <ViewControls
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={filters.sortBy}
              setSortBy={(sort) =>
                setFilters((prev) => ({ ...prev, sortBy: sort }))
              }
            />
            <button
              className='lg:hidden flex items-center gap-2 text-gray-600'
              onClick={() => setShowFilters(true)}
            >
              <Filter className='w-5 h-5 ' />
              Filters
            </button>
          </div>

          {loading ? (
            <div className='w-full h-full flex items-center justify-center'>
              <Loader />
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <ProductsList
                  products={products}
                  showCartBtn
                  viewMode={viewMode}
                />
              ) : (
                <div className='text-center py-12'>
                  <p className='text-gray-500 text-lg'>
                    No products match your filters.
                  </p>
                  <button
                    className='mt-4 px-4 py-2 bg-[#3bb77e] text-white rounded-md hover:bg-[#2a9d68]'
                    onClick={() =>
                      setFilters({
                        sortBy: 'newest',
                        priceRange: [],
                        brands: [],
                        colors: [],
                        shipsFrom: [],
                        ratings: [],
                        features: [],
                      })
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination component */}
              {totalPages > 1 && (
                <div className='mt-8'>
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
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : ''
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
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Category
