// 'use client'
// import React, { useState, useEffect } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { Product } from '@/lib/types'
// import { getProducts } from '@/lib/server-actions/product'
// import { FeaturedProducts } from '@/components/CategoryPage/FeaturedProducts'
// import BgCardsSlider from '@/components/General/BgCardsSlider'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import ProductsList from '@/components/General/ProductsList'
// import ProductsListSlider from '@/components/General/ProductsListSlider'
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination'

// interface AllCategoriesClientProps {
//   initialProducts: Product[]
//   initialTotalProducts: number
//   initialCurrentPage: number
//   totalPages: number
//   itemsPerPage: number
//   error?: string
// }

// // Enhanced Loader Component
// const ProductsLoader = () => (
//   <div className='w-full h-64 flex items-center justify-center'>
//     <div className='text-center'>
//       <div className='loader mx-auto mb-4'></div>
//       <p className='text-gray-500 animate-pulse'>Loading products...</p>
//     </div>
//   </div>
// )

// // Featured Products Skeleton
// const FeaturedProductsSkeleton = () => (
//   <section className='mb-12'>
//     <div className='h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse'></div>
//     <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
//       {[...Array(5)].map((_, i) => (
//         <div key={i} className='bg-gray-100 rounded-lg p-4 animate-pulse'>
//           <div className='h-48 bg-gray-200 rounded mb-4'></div>
//           <div className='h-4 bg-gray-200 rounded mb-2'></div>
//           <div className='h-4 bg-gray-200 rounded w-3/4'></div>
//         </div>
//       ))}
//     </div>
//   </section>
// )

// // Product Slider Component (using ProductsListSlider)
// const ProductSlider = ({
//   products,
//   title,
// }: {
//   products: Product[]
//   title: string
// }) => {
//   if (products.length === 0) return null

//   return (
//     <div className='mb-12'>
//       <ProductsListSlider
//         products={products}
//         title={title}
//         showCartBtn={true}
//         viewMode='grid'
//         className='px-0' // Remove extra padding since parent already has padding
//       />
//     </div>
//   )
// }

// // Product Grid Component (using ProductsList)
// const ProductGrid = ({
//   products,
//   title,
// }: {
//   products: Product[]
//   title: string
// }) => {
//   if (products.length === 0) return null

//   return (
//     <div className='mb-12'>
//       <ProductsList
//         products={products}
//         title={title}
//         showCartBtn={true}
//         viewMode='grid'
//         className='px-0' // Remove extra padding since parent already has padding
//       />
//     </div>
//   )
// }

// const AllCategoriesClient = ({
//   initialProducts,
//   initialTotalProducts,
//   initialCurrentPage,
//   totalPages: propTotalPages,
//   itemsPerPage,
//   error,
// }: AllCategoriesClientProps) => {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const [products, setProducts] = useState<Product[]>(initialProducts)
//   const [paginationLoading, setPaginationLoading] = useState(false)
//   const [totalProducts, setTotalProducts] = useState(initialTotalProducts)
//   const [currentPage, setCurrentPage] = useState(initialCurrentPage)
//   const [totalPages, setTotalPages] = useState(propTotalPages)

//   // Update state when props change (for navigation)
//   useEffect(() => {
//     setProducts(initialProducts)
//     setTotalProducts(initialTotalProducts)
//     setCurrentPage(initialCurrentPage)
//     setTotalPages(propTotalPages)
//   }, [
//     initialProducts,
//     initialTotalProducts,
//     initialCurrentPage,
//     propTotalPages,
//   ])

//   // Handle page change
//   const handlePageChange = async (page: number) => {
//     if (page === currentPage) return

//     setPaginationLoading(true)

//     try {
//       // Update URL
//       const params = new URLSearchParams(searchParams.toString())
//       params.set('page', page.toString())
//       router.push(`?${params.toString()}`)

//       // Fetch new products
//       const response = await getProducts({
//         page: page,
//         perPage: itemsPerPage,
//       })
//       const fetchedProducts = response.data?.products || []

//       // Sort by newest first
//       const sortedProducts = fetchedProducts.sort((a, b) => {
//         const dateA = new Date(a.createdAt || 0).getTime()
//         const dateB = new Date(b.createdAt || 0).getTime()
//         return dateB - dateA // Newest first
//       })

//       setProducts(sortedProducts)
//       setCurrentPage(page)
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     } finally {
//       setPaginationLoading(false)
//     }
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

//   // Show error state
//   if (error) {
//     return (
//       <div className='max-w-7xl mx-auto mt-10 px-4 py-8'>
//         <div className='mb-8'>
//           <h1 className='text-3xl font-bold text-gray-900'>All Products</h1>
//           <p className='text-gray-600 mt-2'>
//             Browse through all available products across categories.
//           </p>
//         </div>
//         <div className='text-center py-12'>
//           <p className='text-red-500 text-lg'>{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Split products into sections following the new pattern
//   const featuredProducts = products
//     .filter((p) => p.tags?.includes('featured') || false)
//     .slice(0, 25)
//   const firstSliderProducts = products.slice(0, 25) // First Slider: 25 products
//   const secondSliderProducts = products.slice(25, 50) // Second Slider: 25 products
//   const firstGridProducts = products.slice(50, 62) // First Grid: 12 products
//   const thirdSliderProducts = products.slice(62, 87) // Third Slider: 25 products
//   const secondGridProducts = products.slice(87, 99) // Second Grid: 12 products

//   return (
//     <div className='max-w-7xl mx-auto mt-10 px-4 py-8'>
//       <div className='mb-8'>
//         <h1 className='text-3xl font-bold text-gray-900'>All Products</h1>
//         <p className='text-gray-600 mt-2'>
//           Browse through all available products across categories.
//         </p>
//       </div>

//       {/* Featured Products Section */}
//       {featuredProducts.length > 0 && (
//         <section className='mb-12'>
//           <h2 className='text-2xl font-semibold mb-6'>Featured Products</h2>
//           <FeaturedProducts products={featuredProducts} />
//         </section>
//       )}

//       {/* Main Content Area */}
//       <div className='relative'>
//         {/* Pagination Loading Overlay */}
//         {paginationLoading && (
//           <div className='absolute inset-0 bg-white/70 z-10 flex items-center justify-center'>
//             <div className='text-center'>
//               <div className='loader mx-auto mb-2'></div>
//               <p className='text-gray-500 text-sm'>Loading page...</p>
//             </div>
//           </div>
//         )}

//         {/* Products Content */}
//         <div
//           className={`transition-opacity duration-200 ${
//             paginationLoading ? 'opacity-30' : 'opacity-100'
//           }`}
//         >
//           {/* First Slider - 25 products */}
//           <ProductSlider
//             products={firstSliderProducts}
//             title='Latest Products'
//           />

//           {/* First BgCardsSlider - Positioned after the first slider */}
//           <div className='mb-12'>
//             <BgCardsSlider />
//           </div>

//           {/* Second Slider - 25 products */}
//           <ProductSlider products={secondSliderProducts} title='Trending Now' />

//           {/* First Grid Block - 12 products */}
//           <ProductGrid
//             products={firstGridProducts}
//             title='Featured Collection'
//           />

//           {/* Second BgCardsSlider - Positioned after the first grid */}
//           <div className='mb-12'>
//             <BgCardsSlider />
//           </div>

//           {/* Third Slider - 25 products */}
//           <ProductSlider
//             products={thirdSliderProducts}
//             title='You Might Like'
//           />

//           {/* Second Grid Block - 12 products */}
//           <ProductGrid products={secondGridProducts} title='More Products' />

//           {/* No products message */}
//           {products.length === 0 && !paginationLoading && (
//             <div className='text-center py-12'>
//               <p className='text-gray-500 text-lg'>No products available.</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div
//             className={`mt-8 transition-opacity duration-200 ${
//               paginationLoading
//                 ? 'opacity-50 pointer-events-none'
//                 : 'opacity-100'
//             }`}
//           >
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href='#'
//                     onClick={(e) => {
//                       e.preventDefault()
//                       if (currentPage > 1) {
//                         handlePageChange(currentPage - 1)
//                       }
//                     }}
//                     className={
//                       currentPage === 1 ? 'pointer-events-none opacity-50' : ''
//                     }
//                     size='default'
//                   />
//                 </PaginationItem>

//                 {renderPaginationItems()}

//                 <PaginationItem>
//                   <PaginationNext
//                     href='#'
//                     onClick={(e) => {
//                       e.preventDefault()
//                       if (currentPage < totalPages) {
//                         handlePageChange(currentPage + 1)
//                       }
//                     }}
//                     className={
//                       currentPage === totalPages
//                         ? 'pointer-events-none opacity-50'
//                         : ''
//                     }
//                     size='default'
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AllCategoriesClient

'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { getProducts } from '@/lib/server-actions/product'
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

interface AllCategoriesClientProps {
  initialProducts: Product[]
  initialTotalProducts: number
  initialCurrentPage: number
  totalPages: number
  itemsPerPage: number
  error?: string
}

interface ProductDistribution {
  featuredProducts: Product[]
  firstSliderProducts: Product[]
  secondSliderProducts: Product[]
  firstGridProducts: Product[]
  thirdSliderProducts: Product[]
  secondGridProducts: Product[]
}

// Product distribution percentages
const DISTRIBUTION_CONFIG = {
  FEATURED_PERCENTAGE: 0.25, // 25% for featured products (max)
  FIRST_SLIDER_PERCENTAGE: 0.25, // 25% for first slider
  SECOND_SLIDER_PERCENTAGE: 0.25, // 25% for second slider
  FIRST_GRID_PERCENTAGE: 0.12, // 12% for first grid
  THIRD_SLIDER_PERCENTAGE: 0.25, // 25% for third slider
  SECOND_GRID_PERCENTAGE: 0.13, // 13% for second grid (remaining)

  // Minimum counts to ensure sections have content
  MIN_FEATURED: 5,
  MIN_SLIDER: 8,
  MIN_GRID: 4,

  // Maximum counts to prevent sections from being too large
  MAX_FEATURED: 30,
  MAX_SLIDER: 30,
  MAX_GRID: 15,
} as const

// Enhanced Loader Component
const ProductsLoader: React.FC = () => (
  <div className='w-full h-64 flex items-center justify-center'>
    <div className='text-center'>
      <div className='loader mx-auto mb-4'></div>
      <p className='text-gray-500 animate-pulse'>Loading products...</p>
    </div>
  </div>
)

// Featured Products Skeleton
const FeaturedProductsSkeleton: React.FC = () => (
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
const ProductSlider: React.FC<{
  products: Product[]
  title: string
}> = ({ products, title }) => {
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
const ProductGrid: React.FC<{
  products: Product[]
  title: string
}> = ({ products, title }) => {
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

// Function to calculate product distribution based on total count
const calculateProductDistribution = (
  products: Product[]
): ProductDistribution => {
  const totalCount = products.length

  if (totalCount === 0) {
    return {
      featuredProducts: [],
      firstSliderProducts: [],
      secondSliderProducts: [],
      firstGridProducts: [],
      thirdSliderProducts: [],
      secondGridProducts: [],
    }
  }

  // Calculate counts based on percentages with min/max constraints
  const calculateCount = (
    percentage: number,
    min: number,
    max: number
  ): number => {
    const calculated = Math.floor(totalCount * percentage)
    return Math.max(min, Math.min(max, calculated))
  }

  // Get featured products first (products with 'featured' tag)
  const featuredCandidates = products.filter(
    (p) => p.tags?.includes('featured') || false
  )
  const featuredCount = Math.min(
    calculateCount(
      DISTRIBUTION_CONFIG.FEATURED_PERCENTAGE,
      DISTRIBUTION_CONFIG.MIN_FEATURED,
      DISTRIBUTION_CONFIG.MAX_FEATURED
    ),
    featuredCandidates.length > 0
      ? Math.max(featuredCandidates.length, DISTRIBUTION_CONFIG.MIN_FEATURED)
      : 0
  )

  // Calculate other section counts
  const firstSliderCount = calculateCount(
    DISTRIBUTION_CONFIG.FIRST_SLIDER_PERCENTAGE,
    DISTRIBUTION_CONFIG.MIN_SLIDER,
    DISTRIBUTION_CONFIG.MAX_SLIDER
  )

  const secondSliderCount = calculateCount(
    DISTRIBUTION_CONFIG.SECOND_SLIDER_PERCENTAGE,
    DISTRIBUTION_CONFIG.MIN_SLIDER,
    DISTRIBUTION_CONFIG.MAX_SLIDER
  )

  const firstGridCount = calculateCount(
    DISTRIBUTION_CONFIG.FIRST_GRID_PERCENTAGE,
    DISTRIBUTION_CONFIG.MIN_GRID,
    DISTRIBUTION_CONFIG.MAX_GRID
  )

  const thirdSliderCount = calculateCount(
    DISTRIBUTION_CONFIG.THIRD_SLIDER_PERCENTAGE,
    DISTRIBUTION_CONFIG.MIN_SLIDER,
    DISTRIBUTION_CONFIG.MAX_SLIDER
  )

  const secondGridCount = calculateCount(
    DISTRIBUTION_CONFIG.SECOND_GRID_PERCENTAGE,
    DISTRIBUTION_CONFIG.MIN_GRID,
    DISTRIBUTION_CONFIG.MAX_GRID
  )

  // Distribute products ensuring we don't exceed total count
  let currentIndex = 0

  // Featured products
  const featuredProducts =
    featuredCandidates.length > 0
      ? featuredCandidates.slice(0, featuredCount)
      : products.slice(0, Math.min(featuredCount, totalCount))

  // Calculate remaining products for other sections
  const remainingProducts = products.filter(
    (p) => !featuredProducts.some((fp) => fp.id === p.id)
  )

  currentIndex = 0

  // First slider products
  const firstSliderProducts = remainingProducts.slice(
    currentIndex,
    currentIndex +
      Math.min(firstSliderCount, remainingProducts.length - currentIndex)
  )
  currentIndex += firstSliderProducts.length

  // Second slider products
  const secondSliderProducts = remainingProducts.slice(
    currentIndex,
    currentIndex +
      Math.min(secondSliderCount, remainingProducts.length - currentIndex)
  )
  currentIndex += secondSliderProducts.length

  // First grid products
  const firstGridProducts = remainingProducts.slice(
    currentIndex,
    currentIndex +
      Math.min(firstGridCount, remainingProducts.length - currentIndex)
  )
  currentIndex += firstGridProducts.length

  // Third slider products
  const thirdSliderProducts = remainingProducts.slice(
    currentIndex,
    currentIndex +
      Math.min(thirdSliderCount, remainingProducts.length - currentIndex)
  )
  currentIndex += thirdSliderProducts.length

  // Second grid products (remaining)
  const secondGridProducts = remainingProducts.slice(
    currentIndex,
    currentIndex +
      Math.min(secondGridCount, remainingProducts.length - currentIndex)
  )

  return {
    featuredProducts,
    firstSliderProducts,
    secondSliderProducts,
    firstGridProducts,
    thirdSliderProducts,
    secondGridProducts,
  }
}

const AllCategoriesClient: React.FC<AllCategoriesClientProps> = ({
  initialProducts,
  initialTotalProducts,
  initialCurrentPage,
  totalPages: propTotalPages,
  itemsPerPage,
  error,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false)
  const [totalProducts, setTotalProducts] =
    useState<number>(initialTotalProducts)
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage)
  const [totalPages, setTotalPages] = useState<number>(propTotalPages)

  // Calculate product distribution
  const productDistribution = React.useMemo<ProductDistribution>(() => {
    return calculateProductDistribution(products)
  }, [products])

  // Update state when props change (for navigation)
  useEffect(() => {
    setProducts(initialProducts)
    setTotalProducts(initialTotalProducts)
    setCurrentPage(initialCurrentPage)
    setTotalPages(propTotalPages)
  }, [
    initialProducts,
    initialTotalProducts,
    initialCurrentPage,
    propTotalPages,
  ])

  // Handle page change
  const handlePageChange = async (page: number): Promise<void> => {
    if (page === currentPage) return

    setPaginationLoading(true)

    try {
      // Update URL
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      router.push(`?${params.toString()}`)

      // Fetch new products
      const response = await getProducts({
        page: page,
        perPage: itemsPerPage,
      })
      const fetchedProducts: Product[] = response.data?.products || []

      // Sort by newest first
      const sortedProducts = fetchedProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA // Newest first
      })

      setProducts(sortedProducts)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setPaginationLoading(false)
    }
  }

  // Generate pagination items
  const renderPaginationItems = (): React.ReactNode[] => {
    const items: React.ReactNode[] = []
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
  if (error) {
    return (
      <div className='max-w-7xl mx-auto mt-10 px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>All Products</h1>
          <p className='text-gray-600 mt-2'>
            Browse through all available products across categories.
          </p>
        </div>
        <div className='text-center py-12'>
          <p className='text-red-500 text-lg'>{error}</p>
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

  const {
    featuredProducts,
    firstSliderProducts,
    secondSliderProducts,
    firstGridProducts,
    thirdSliderProducts,
    secondGridProducts,
  } = productDistribution

  return (
    <div className='max-w-7xl mx-auto mt-10 px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>All Products</h1>
        <p className='text-gray-600 mt-2'>
          Browse through all available products across categories.
        </p>

        {/* Debug info for development */}
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
          {/* First Slider - Dynamic percentage of products */}
          <ProductSlider
            products={firstSliderProducts}
            title='Latest Products'
          />

          {/* First BgCardsSlider - Positioned after the first slider */}
          <div className='mb-12'>
            <BgCardsSlider />
          </div>

          {/* Second Slider - Dynamic percentage of products */}
          <ProductSlider products={secondSliderProducts} title='Trending Now' />

          {/* First Grid Block - Dynamic percentage of products */}
          <ProductGrid
            products={firstGridProducts}
            title='Featured Collection'
          />

          {/* Second BgCardsSlider - Positioned after the first grid */}
          <div className='mb-12'>
            <BgCardsSlider />
          </div>

          {/* Third Slider - Dynamic percentage of products */}
          <ProductSlider
            products={thirdSliderProducts}
            title='You Might Like'
          />

          {/* Second Grid Block - Dynamic percentage of products */}
          <ProductGrid products={secondGridProducts} title='More Products' />

          {/* No products message */}
          {products.length === 0 && !paginationLoading && (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No products available.</p>
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

export default AllCategoriesClient
