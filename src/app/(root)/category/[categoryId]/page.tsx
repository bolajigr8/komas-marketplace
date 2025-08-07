// 'use client'
// import React, { useState, useEffect } from 'react'
// import { useParams, useSearchParams, useRouter } from 'next/navigation'
// import { Filter } from 'lucide-react'
// import { Product } from '@/lib/types'
// import { getProductsByCategory } from '@/lib/server-actions/product'
// import { CategoryFilters } from '@/types/category'
// import { FeaturedProducts } from '@/components/CategoryPage/FeaturedProducts'
// import { FilterSidebar } from '@/components/CategoryPage/FilterSidebar'
// import { ViewControls } from '@/components/CategoryPage/ViewControls'
// import { ProductGrid } from '@/components/CategoryPage/ProductGrid'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import ProductsList from '@/components/General/ProductsList'
// import Loader from '@/components/General/Loader'
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination'

// const SingleCategoryPage = () => {
//   const router = useRouter()
//   const params = useParams()
//   const searchParams = useSearchParams()
//   const categoryId = params.categoryId as string
//   const pageParam = searchParams.get('page')

//   const [products, setProducts] = useState<Product[]>([])
//   const [allProducts, setAllProducts] = useState<Product[]>([])
//   const [initialLoading, setInitialLoading] = useState(true)
//   const [filterLoading, setFilterLoading] = useState(false)
//   const [categoryInfo, setCategoryInfo] = useState<{
//     name: string
//     description: string
//   }>({
//     name: '',
//     description: '',
//   })
//   const [filters, setFilters] = useState<CategoryFilters>({
//     sortBy: 'newest',
//     priceRange: [],
//     brands: [],
//     colors: [],
//     shipsFrom: [],
//     ratings: [],
//     features: [],
//   })
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [showFilters, setShowFilters] = useState(false)
//   const [totalProducts, setTotalProducts] = useState(0)

//   // Pagination state
//   const itemsPerPage = 9
//   const currentPage = pageParam ? parseInt(pageParam) : 1
//   const totalPages = Math.ceil(totalProducts / itemsPerPage)

//   // Fetch products for the specific category
//   useEffect(() => {
//     const fetchCategoryProducts = async () => {
//       try {
//         setInitialLoading(true)

//         if (!categoryId) return

//         const response = await getProductsByCategory(categoryId)
//         console.log(response, 'response for category')

//         // Define the expected type for category data
//         type CategoryData = {
//           products: Product[]
//           name?: string
//           description?: string
//         }

//         // Ensure response.data is always an object with a products property
//         const categoryData: CategoryData = Array.isArray(response.data)
//           ? { products: response.data }
//           : response.data &&
//             typeof response.data === 'object' &&
//             'products' in response.data
//           ? response.data
//           : { products: [] }

//         const categoryProducts = categoryData.products || []

//         // Ensure categoryProducts is an array
//         const productsArray = Array.isArray(categoryProducts)
//           ? categoryProducts
//           : []

//         setAllProducts(productsArray)
//         setTotalProducts(productsArray.length)

//         // Set category info from the response data
//         setCategoryInfo({
//           name: categoryData.name || 'Category',
//           description: categoryData.description || 'No description available.',
//         })
//       } catch (error) {
//         console.error('Error fetching category products:', error)
//         // Set empty array on error to prevent filter issues
//         setAllProducts([])
//         setTotalProducts(0)
//       } finally {
//         setInitialLoading(false)
//       }
//     }

//     fetchCategoryProducts()
//   }, [categoryId])

//   // Apply filters and pagination
//   useEffect(() => {
//     // Only show filter loading if we're not in initial loading state
//     if (!initialLoading) {
//       setFilterLoading(true)
//     }

//     // Add a small delay to make the loading state visible
//     const timer = setTimeout(
//       () => {
//         // Ensure allProducts is an array before filtering
//         if (!Array.isArray(allProducts)) {
//           setProducts([])
//           setTotalProducts(0)
//           setFilterLoading(false)
//           return
//         }

//         // First apply filters
//         const filteredProducts = applyFilters(allProducts)

//         // Then apply sorting
//         const sortedProducts = applySorting(filteredProducts)

//         // Finally apply pagination
//         const start = (currentPage - 1) * itemsPerPage
//         const end = currentPage * itemsPerPage
//         setProducts(sortedProducts.slice(start, end))

//         // Update total count based on filtered results
//         setTotalProducts(filteredProducts.length)

//         setFilterLoading(false)
//       },
//       initialLoading ? 0 : 150
//     ) // No delay for initial load, small delay for filters

//     return () => clearTimeout(timer)
//   }, [allProducts, currentPage, filters, initialLoading])

//   // Filter featured products from all loaded products
//   const featuredProducts = Array.isArray(allProducts)
//     ? allProducts.filter((p) => p.tags?.includes('featured') || false)
//     : []

//   // Apply filters to products
//   const applyFilters = (products: Product[]) => {
//     // Safety check to ensure products is an array
//     if (!Array.isArray(products)) {
//       return []
//     }

//     return products.filter((product) => {
//       // Price Range filter
//       if (filters.priceRange.length > 0) {
//         const productPrice = product.price
//         const matchesPrice = filters.priceRange.some((range) => {
//           const rangeValues = range.split('-')
//           if (rangeValues.length === 2) {
//             const min = parseInt(rangeValues[0])
//             const max = parseInt(rangeValues[1])
//             return productPrice >= min && productPrice <= max
//           } else if (range.endsWith('+')) {
//             const min = parseInt(range.replace('+', ''))
//             return productPrice >= min
//           }
//           return false
//         })
//         if (!matchesPrice) return false
//       }

//       // Brands filter
//       if (filters.brands.length > 0 && product.brand) {
//         const brandName =
//           typeof product.brand === 'string'
//             ? product.brand
//             : product.brand?.name

//         if (brandName && !filters.brands.includes(brandName)) return false
//       }

//       // Region/Location filter (Ships From)
//       if (filters.shipsFrom.length > 0 && product.region) {
//         if (!filters.shipsFrom.includes(product.region)) return false
//       }

//       // Features filter
//       if (filters.features.length > 0 && product.tags) {
//         const productTags = Array.isArray(product.tags) ? product.tags : []
//         const hasMatchingFeature = filters.features.some((feature) =>
//           productTags.includes(feature)
//         )
//         if (!hasMatchingFeature) return false
//       }

//       return true
//     })
//   }

//   // Apply sorting to products
//   const applySorting = (products: Product[]) => {
//     // Safety check to ensure products is an array
//     if (!Array.isArray(products)) {
//       return []
//     }

//     const sortedProducts = [...products]

//     switch (filters.sortBy) {
//       case 'price-low-high':
//         return sortedProducts.sort((a, b) => a.price - b.price)
//       case 'price-high-low':
//         return sortedProducts.sort((a, b) => b.price - a.price)
//       case 'newest':
//         return sortedProducts.sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )
//       case 'rating':
//         return sortedProducts // Default if no ratings
//       case 'featured':
//       default:
//         return sortedProducts.sort((a, b) => {
//           const aFeatured = a.tags?.includes('featured') ? 1 : 0
//           const bFeatured = b.tags?.includes('featured') ? 1 : 0
//           return bFeatured - aFeatured
//         })
//     }
//   }

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     const params = new URLSearchParams(searchParams.toString())
//     params.set('page', page.toString())
//     router.push(`?${params.toString()}`)
//   }

//   // Generate pagination items
//   const renderPaginationItems = () => {
//     const items = []
//     const maxVisiblePages = 5

//     // Always show first page
//     items.push(
//       <PaginationItem key='page-1'>
//         <PaginationLink
//           href='#'
//           onClick={(e) => {
//             e.preventDefault()
//             handlePageChange(1)
//           }}
//           isActive={currentPage === 1}
//           size='default'
//         >
//           1
//         </PaginationLink>
//       </PaginationItem>
//     )

//     // Calculate range of pages to show
//     let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
//     let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

//     // Adjust start if end is maxed out
//     if (endPage === totalPages - 1) {
//       startPage = Math.max(2, endPage - (maxVisiblePages - 3))
//     }

//     // Show ellipsis after first page if needed
//     if (startPage > 2) {
//       items.push(
//         <PaginationItem key='ellipsis-1'>
//           <PaginationEllipsis />
//         </PaginationItem>
//       )
//     }

//     // Add middle pages
//     for (let i = startPage; i <= endPage; i++) {
//       items.push(
//         <PaginationItem key={`page-${i}`}>
//           <PaginationLink
//             href='#'
//             onClick={(e) => {
//               e.preventDefault()
//               handlePageChange(i)
//             }}
//             isActive={currentPage === i}
//             size='default'
//           >
//             {i}
//           </PaginationLink>
//         </PaginationItem>
//       )
//     }

//     // Show ellipsis before last page if needed
//     if (endPage < totalPages - 1 && totalPages > 2) {
//       items.push(
//         <PaginationItem key='ellipsis-2'>
//           <PaginationEllipsis />
//         </PaginationItem>
//       )
//     }

//     // Always show last page if totalPages > 1
//     if (totalPages > 1) {
//       items.push(
//         <PaginationItem key={`page-${totalPages}`}>
//           <PaginationLink
//             href='#'
//             onClick={(e) => {
//               e.preventDefault()
//               handlePageChange(totalPages)
//             }}
//             isActive={currentPage === totalPages}
//           >
//             {totalPages}
//           </PaginationLink>
//         </PaginationItem>
//       )
//     }

//     return items
//   }

//   if (!categoryId) {
//     return (
//       <div className='max-w-7xl mx-auto px-4 py-8'>
//         <div className='text-center py-12'>
//           <p className='text-gray-500 text-lg'>Category not found.</p>
//         </div>
//       </div>
//     )
//   }

//   // Show full page loading for initial load
//   if (initialLoading) {
//     return (
//       <div className='max-w-7xl mx-auto px-4 py-8'>
//         <div className='animate-pulse'>
//           {/* Category header skeleton */}
//           <div className='mb-8'>
//             <div className='h-8 bg-gray-200 rounded w-1/4 mb-2'></div>
//             <div className='h-4 bg-gray-200 rounded w-1/2'></div>
//           </div>

//           {/* Featured products skeleton */}
//           <section className='mb-12'>
//             <div className='h-6 bg-gray-200 rounded w-1/6 mb-6'></div>
//             <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className='bg-gray-200 rounded-lg h-64'></div>
//               ))}
//             </div>
//           </section>

//           {/* Main content skeleton */}
//           <div className='flex flex-col lg:flex-row gap-8'>
//             {/* Sidebar skeleton */}
//             <aside className='lg:w-64'>
//               <div className='space-y-4'>
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className='h-20 bg-gray-200 rounded'></div>
//                 ))}
//               </div>
//             </aside>

//             {/* Main content skeleton */}
//             <main className='flex-1'>
//               <div className='flex justify-between items-center mb-6'>
//                 <div className='h-10 bg-gray-200 rounded w-1/3'></div>
//                 <div className='h-10 bg-gray-200 rounded w-20'></div>
//               </div>

//               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//                 {[...Array(9)].map((_, i) => (
//                   <div key={i} className='bg-gray-200 rounded-lg h-80'></div>
//                 ))}
//               </div>
//             </main>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className='max-w-7xl border-2  mt-10  bg-white mx-auto px-4 py-8'>
//       <div className='mb-8'>
//         <h1 className='text-3xl font-bold text-gray-900'>
//           {categoryInfo.name || 'Category'}
//         </h1>
//         <p className='text-gray-600 mt-2'>
//           {categoryInfo.description || 'No description available.'}
//         </p>
//       </div>

//       {featuredProducts.length > 0 && (
//         <section className='mb-12'>
//           <h2 className='text-2xl font-semibold mb-6'>Featured Products</h2>
//           <FeaturedProducts products={featuredProducts} />
//         </section>
//       )}

//       <div className='flex flex-col lg:flex-row gap-8'>
//         <aside
//           className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
//         >
//           <FilterSidebar
//             filters={filters}
//             onChange={setFilters}
//             onClose={() => setShowFilters(false)}
//           />
//         </aside>

//         <main className='flex-1'>
//           <div className='flex justify-between items-center mb-6'>
//             <ViewControls
//               viewMode={viewMode}
//               setViewMode={setViewMode}
//               sortBy={filters.sortBy}
//               setSortBy={(sort) =>
//                 setFilters((prev) => ({ ...prev, sortBy: sort }))
//               }
//             />
//             <button
//               className='lg:hidden flex items-center gap-2 text-gray-600'
//               onClick={() => setShowFilters(true)}
//             >
//               <Filter className='w-5 h-5 ' />
//               Filters
//             </button>
//           </div>

//           {filterLoading ? (
//             <div className='w-full h-64 flex items-center justify-center'>
//               <div className='flex flex-col items-center gap-4'>
//                 <div className='loader'></div>
//                 <p className='text-gray-500'>Filtering products...</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               {products.length > 0 ? (
//                 <ProductsList
//                   products={products}
//                   categoryName={categoryInfo.name}
//                   showCartBtn
//                   viewMode={viewMode}
//                 />
//               ) : (
//                 <div className='text-center py-12'>
//                   <p className='text-gray-500 text-lg'>
//                     No products found in this category.
//                   </p>
//                   <button
//                     className='mt-4 px-4 py-2 bg-[#3bb77e] text-white rounded-md hover:bg-[#2a9d68]'
//                     onClick={() =>
//                       setFilters({
//                         sortBy: 'newest',
//                         priceRange: [],
//                         brands: [],
//                         colors: [],
//                         shipsFrom: [],
//                         ratings: [],
//                         features: [],
//                       })
//                     }
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               )}

//               {/* Pagination component */}
//               {totalPages > 1 && (
//                 <div className='mt-8'>
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious
//                           href='#'
//                           onClick={(e) => {
//                             e.preventDefault()
//                             if (currentPage > 1) {
//                               handlePageChange(currentPage - 1)
//                             }
//                           }}
//                           className={
//                             currentPage === 1
//                               ? 'pointer-events-none opacity-50'
//                               : ''
//                           }
//                           size='default'
//                         />
//                       </PaginationItem>

//                       {renderPaginationItems()}

//                       <PaginationItem>
//                         <PaginationNext
//                           href='#'
//                           onClick={(e) => {
//                             e.preventDefault()
//                             if (currentPage < totalPages) {
//                               handlePageChange(currentPage + 1)
//                             }
//                           }}
//                           className={
//                             currentPage === totalPages
//                               ? 'pointer-events-none opacity-50'
//                               : ''
//                           }
//                           size='default'
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               )}
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }

// export default SingleCategoryPage

import React from 'react'
import { getProductsByCategory } from '@/lib/server-actions/product'
import { Product } from '@/lib/types'
import SingleCategoryClient from '@/components/CategoryPage/SingleCategory'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Category',
  description: 'Single Category Page',
}

interface PageProps {
  params: { categoryId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const SingleCategoryPage = async ({ params, searchParams }: PageProps) => {
  const { categoryId } = params
  const pageParam = searchParams.page
  const currentPage = pageParam
    ? parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam)
    : 1
  const itemsPerPage = 99 // 25 + 25 + 12 + 25 + 12 = 99 per page

  // Early return if no categoryId
  if (!categoryId) {
    return (
      <SingleCategoryClient
        categoryId=''
        initialAllProducts={[]}
        initialProducts={[]}
        initialTotalProducts={0}
        initialCurrentPage={1}
        totalPages={0}
        itemsPerPage={itemsPerPage}
        categoryInfo={{ name: '', description: '' }}
        error='Category not found.'
      />
    )
  }

  try {
    const response = await getProductsByCategory(categoryId)
    // console.log(response, 'response for category')

    // Define the expected type for category data
    type CategoryData = {
      products: Product[]
      name?: string
      description?: string
    }

    // Ensure response.data is always an object with a products property
    const categoryData: CategoryData = Array.isArray(response.data)
      ? { products: response.data }
      : response.data &&
        typeof response.data === 'object' &&
        'products' in response.data
      ? response.data
      : { products: [] }

    const categoryProducts = categoryData.products || []

    // Ensure categoryProducts is an array
    const productsArray = Array.isArray(categoryProducts)
      ? categoryProducts
      : []

    // Sort products newest to oldest
    const sortedProducts = productsArray.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA // Newest first
    })

    const totalProducts = sortedProducts.length
    const totalPages = Math.ceil(totalProducts / itemsPerPage)

    // Apply pagination to get current page products
    const start = (currentPage - 1) * itemsPerPage
    const end = currentPage * itemsPerPage
    const currentPageProducts = sortedProducts.slice(start, end)

    // Set category info from the response data
    const categoryInfo = {
      name: categoryData.name || '',
      description: categoryData.description || 'No description available.',
    }

    return (
      <SingleCategoryClient
        categoryId={categoryId}
        initialAllProducts={sortedProducts}
        initialProducts={currentPageProducts}
        initialTotalProducts={totalProducts}
        initialCurrentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        categoryInfo={categoryInfo}
      />
    )
  } catch (error) {
    console.error('Error fetching category products:', error)

    // Return client component with error state
    return (
      <SingleCategoryClient
        categoryId={categoryId}
        initialAllProducts={[]}
        initialProducts={[]}
        initialTotalProducts={0}
        initialCurrentPage={1}
        totalPages={0}
        itemsPerPage={itemsPerPage}
        categoryInfo={{ name: '', description: '' }}
        error='Failed to load category products'
      />
    )
  }
}

export default SingleCategoryPage
