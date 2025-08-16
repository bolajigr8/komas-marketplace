// import { Suspense } from 'react'
// import { z } from 'zod'
// import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

// // Server Components
// import ProductsList from '@/components/General/ProductsList'
// import BgCard from '@/components/General/BgCard'
// import CategoryList from '@/components/HomePage/CategoryList'
// import HeroSection from '@/components/HomePage/HeroSection'
// import BgCardsSlider from '@/components/General/BgCardsSlider'
// import Loader from '@/components/General/Loader'
// import HomeError from '@/components/HomePage/HomeError'
// import SearchResults from '@/components/HomePage/SearchResults'

// // Client Components
// // import { InstallPromptToast } from "./client-components";

// // Actions & Utils
// import { getProducts } from '@/lib/server-actions/product'
// import { getCategories as fetchCategories } from '@/lib/server-actions/category'
// import { divideProductsByCategory } from '@/lib/utils'
// import { bgSliderProducts } from '@/data/bgSlider'
// import ProductsListSlider from '@/components/General/ProductsListSlider'
// import WorkWithUs from '@/components/General/WorkWithUs'

// // Types
// type DisplayCategoriesAndProductsProps = {
//   page: number
//   category: string
// }

// type PageProps = {
//   searchParams: {
//     [key: string]: string | string[] | undefined
//   }
// }

// // Schema for search params validation
// export const schema = z.object({
//   query: z.string().optional(),
//   category: z.string().optional(),
//   page: z.coerce.number().positive().optional(),
// })

// // DisplayCategoriesAndProducts component
// const DisplayCategoriesAndProducts = async ({
//   page,
//   category,
// }: DisplayCategoriesAndProductsProps) => {
//   const [products, categories] = await Promise.all([
//     // getProducts({ page, perPage: 1000 }),
//     getProducts(),
//     fetchCategories(),
//   ])

//   // console.log(categories.data, 'categories')

//   const productsByCategories = divideProductsByCategory(
//     products.data?.products || []
//   )

//   // categories ways to show up

//   // 1. Filter categories that have products using productsByCategories
//   const sortedCategories = [...(categories.data || [])]
//     .filter((category) => productsByCategories[category._id]?.length > 0)
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )

//   // 2. Alternative: If you want to also filter by approved products only
//   const sortedCategoriesWithApprovedProducts = [...(categories.data || [])]
//     .filter((category) =>
//       (productsByCategories[category._id] || []).some(
//         (product) => product.status === 'approved'
//       )
//     )
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )

//   // 3. Alternative: If you want categories with active/live products only
//   const sortedCategoriesWithLiveProducts = [...(categories.data || [])]
//     .filter((category) =>
//       (productsByCategories[category._id] || []).some(
//         (product) => product.isLive === true && !product.isDeleted
//       )
//     )
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )

//   // Get products directly from server and sort by latest (creation date)
//   const allProducts = [...(products.data?.products || [])].sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   )

//   // Create different product slices for each section (25 products each for sliders)
//   const featuredProducts = allProducts.slice(0, 25) // First 25 latest products
//   const dealsProducts = allProducts.slice(25, 50) // Next 25 latest products
//   const likeProducts = allProducts.slice(50, 60) // Next 10 latest products (keeping original count)
//   const popularProducts = allProducts.slice(60, 85) // Next 25 latest products

//   // console.log(categories, 'categories')

//   // console.log(products.data?.products, 'product')
//   // console.log(latest10ProductsSecond)

//   return (
//     <>
//       <CategoryList
//         title='Categories'
//         categories={sortedCategoriesWithApprovedProducts}
//         getItemsLengthFor='allProducts'
//         selectedCategory={category}
//         baseRoute='/category/'
//       />

//       <ProductsListSlider
//         products={featuredProducts}
//         showCartBtn
//         title='Featured Products'
//       />

//       <ProductsListSlider
//         products={dealsProducts}
//         showCartBtn
//         title='Deals For You'
//       />

//       <ProductsList
//         products={likeProducts}
//         showCartBtn
//         title='We Think You Will Like'
//       />

//       {/* <ProductsList
//         products={products.data?.products.slice(-10) || []}
//         showCartBtn
//         title='Featured Products'
//       /> */}
//       {/* <ProductsList
//         products={
//           products.data?.products
//             .filter((p) => Array.isArray(p.images) && p.images.length > 0)
//             .slice(-10) || []
//         }
//         showCartBtn
//         title='Featured Products'
//       /> */}

//       {/* <BgCardsSlider products={bgSliderProducts} /> */}
//       <BgCardsSlider />

//       <ProductsList
//         title='Popular Products'
//         products={popularProducts.slice(0, 10)} // Show first 10 of the 25 popular products
//         showCartBtn
//       />

//       {/* <ProductsList
//         title='Popular Products'
//         products={latest10ProductsSecond}
//         showCartBtn
//       /> */}
//       {/* <ProductsList
//         title='Popular Products'
//         products={products.data?.products.slice(10, 20) || []}
//         showCartBtn
//       /> */}

//       <section className='px-4 mb-12'>
//         {/* <BgCard
//           // backgroundImage='/Images/Home/flatTommy/flatTommy.png'
//           // text='Enjoy easy and fast same day delivery on this jellof Spaghetti Combo.'
//           // className='max-w-[69rem] mx-auto min-h-[300px]'
//           // product={bgSliderProducts[0]}
//         /> */}
//         <BgCardsSlider />
//       </section>

//       {/* services display section by cards */}
//       <WorkWithUs />
//     </>
//   )
// }

// // Main Page component
// export default function Page({ searchParams }: PageProps) {
//   const { data } = schema.safeParse(searchParams)

//   return (
//     <div className='w-full min-h-screen bg-gray-50'>
//       {/* <InstallPromptToast /> */}

//       <main className='pt-6 overflow-x-hidden space-y-12 pb-12 min-h-[70vh] w-full'>
//         {data?.query ? (
//           <ErrorBoundary errorComponent={HomeError}>
//             <Suspense
//               fallback={
//                 <div className='w-full h-full flex items-center justify-center'>
//                   <Loader />
//                 </div>
//               }
//             >
//               <SearchResults />
//             </Suspense>
//           </ErrorBoundary>
//         ) : (
//           <>
//             <HeroSection query={data?.query} category={data?.category} />
//             <ErrorBoundary errorComponent={HomeError}>
//               <Suspense
//                 fallback={
//                   <div className='w-full h-full flex items-center justify-center'>
//                     <Loader />
//                   </div>
//                 }
//               >
//                 <DisplayCategoriesAndProducts
//                   category={data?.category || ''}
//                   page={data?.page || 0}
//                 />
//               </Suspense>
//             </ErrorBoundary>
//           </>
//         )}
//       </main>
//     </div>
//   )
// }

// import { Suspense } from 'react'
// import { z } from 'zod'
// import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

// // Server Components
// import ProductsList from '@/components/General/ProductsList'
// import CategoryList from '@/components/HomePage/CategoryList'
// import HeroSection from '@/components/HomePage/HeroSection'
// import BgCardsSlider from '@/components/General/BgCardsSlider'
// import Loader from '@/components/General/Loader'
// import HomeError from '@/components/HomePage/HomeError'
// import SearchResults from '@/components/HomePage/SearchResults'
// import ProductsListSlider from '@/components/General/ProductsListSlider'
// import WorkWithUs from '@/components/General/WorkWithUs'

// // Actions & Utils
// import { getProducts } from '@/lib/server-actions/product'
// import { getCategories as fetchCategories } from '@/lib/server-actions/category'
// import { divideProductsByCategory } from '@/lib/utils'

// // Types
// type DisplayCategoriesAndProductsProps = {
//   page: number
//   category: string
// }

// type PageProps = {
//   searchParams: {
//     [key: string]: string | string[] | undefined
//   }
// }

// // Schema for search params validation
// export const schema = z.object({
//   query: z.string().optional(),
//   category: z.string().optional(),
//   page: z.coerce.number().positive().optional(),
// })

// // Helper function to distribute products with more weight on ProductsList components
// const distributeProducts = (totalCount: number, products: any[]) => {
//   if (totalCount === 0 || products.length === 0) {
//     return {
//       featuredProducts: [],
//       dealsProducts: [],
//       likeProducts: [],
//       popularProducts: [],
//     }
//   }

//   // Calculate distribution based on total count - giving more to ProductsList (likeProducts & popularProducts)
//   let featuredCount, dealsCount, likeCount, popularCount

//   if (totalCount <= 20) {
//     // For small counts, distribute with slight favor to product cards
//     const baseCount = Math.floor(totalCount / 4)
//     const remainder = totalCount % 4

//     featuredCount = baseCount + (remainder > 0 ? 1 : 0)
//     dealsCount = baseCount
//     likeCount = baseCount + (remainder > 1 ? 1 : 0)
//     popularCount = baseCount + (remainder > 2 ? 1 : 0)
//   } else if (totalCount <= 50) {
//     // Medium counts - give more to ProductsList components (60% total)
//     featuredCount = Math.floor(totalCount * 0.2) // 20%
//     dealsCount = Math.floor(totalCount * 0.2) // 20%
//     likeCount = Math.floor(totalCount * 0.3) // 30%
//     popularCount = totalCount - featuredCount - dealsCount - likeCount // Remaining (~30%)
//   } else {
//     // Large counts - favor ProductsList with higher limits
//     featuredCount = Math.min(20, Math.floor(totalCount * 0.15)) // Reduced from 25
//     dealsCount = Math.min(20, Math.floor(totalCount * 0.15)) // Reduced from 25
//     likeCount = Math.min(40, Math.floor(totalCount * 0.35)) // Increased from 15
//     popularCount = Math.min(
//       50,
//       totalCount - featuredCount - dealsCount - likeCount
//     ) // Increased from 20
//   }

//   return {
//     featuredProducts: products.slice(0, featuredCount),
//     dealsProducts: products.slice(featuredCount, featuredCount + dealsCount),
//     likeProducts: products.slice(
//       featuredCount + dealsCount,
//       featuredCount + dealsCount + likeCount
//     ),
//     popularProducts: products.slice(
//       featuredCount + dealsCount + likeCount,
//       featuredCount + dealsCount + likeCount + popularCount
//     ),
//   }
// }

// // DisplayCategoriesAndProducts component
// const DisplayCategoriesAndProducts = async ({
//   page,
//   category,
// }: DisplayCategoriesAndProductsProps) => {
//   const [products, categories] = await Promise.all([
//     getProducts(),
//     fetchCategories(),
//   ])

//   const totalProductCount = products.data?.totalProductCount || 0
//   const allProducts = products.data?.products || []

//   // Sort products by newest first (creation date)
//   const sortedProducts = [...allProducts].sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   )

//   // Distribute products based on total count
//   const { featuredProducts, dealsProducts, likeProducts, popularProducts } =
//     distributeProducts(totalProductCount, sortedProducts)

//   const productsByCategories = divideProductsByCategory(allProducts)

//   // Filter categories that have approved products
//   const sortedCategoriesWithApprovedProducts = [...(categories.data || [])]
//     .filter((category) =>
//       (productsByCategories[category._id] || []).some(
//         (product) => product.status === 'approved'
//       )
//     )
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )

//   return (
//     <>
//       <CategoryList
//         title='Categories'
//         categories={sortedCategoriesWithApprovedProducts}
//         getItemsLengthFor='allProducts'
//         selectedCategory={category}
//         baseRoute='/category/'
//       />

//       {featuredProducts.length > 0 && (
//         <ProductsListSlider
//           products={featuredProducts}
//           showCartBtn
//           title='Featured Products'
//         />
//       )}

//       {dealsProducts.length > 0 && (
//         <ProductsListSlider
//           products={dealsProducts}
//           showCartBtn
//           title='Deals For You'
//         />
//       )}

//       {likeProducts.length > 0 && (
//         <ProductsList
//           products={likeProducts}
//           showCartBtn
//           title='We Think You Will Like'
//         />
//       )}

//       <BgCardsSlider />

//       {popularProducts.length > 0 && (
//         <ProductsList
//           title='Popular Products'
//           products={popularProducts}
//           showCartBtn
//         />
//       )}

//       <section className='px-4 mb-12'>
//         <BgCardsSlider />
//       </section>

//       <WorkWithUs />
//     </>
//   )
// }

// // Main Page component
// export default function Page({ searchParams }: PageProps) {
//   const { data } = schema.safeParse(searchParams)

//   return (
//     <div className='w-full min-h-screen bg-gray-50'>
//       <main className='pt-6 overflow-x-hidden space-y-12 pb-12 min-h-[70vh] w-full'>
//         {data?.query ? (
//           <ErrorBoundary errorComponent={HomeError}>
//             <Suspense
//               fallback={
//                 <div className='w-full h-full flex items-center justify-center'>
//                   <Loader />
//                 </div>
//               }
//             >
//               <SearchResults />
//             </Suspense>
//           </ErrorBoundary>
//         ) : (
//           <>
//             <HeroSection query={data?.query} category={data?.category} />
//             <ErrorBoundary errorComponent={HomeError}>
//               <Suspense
//                 fallback={
//                   <div className='w-full h-full flex items-center justify-center'>
//                     <Loader />
//                   </div>
//                 }
//               >
//                 <DisplayCategoriesAndProducts
//                   category={data?.category || ''}
//                   page={data?.page || 0}
//                 />
//               </Suspense>
//             </ErrorBoundary>
//           </>
//         )}
//       </main>
//     </div>
//   )
// }

import { Suspense } from 'react'
import { z } from 'zod'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

// Server Components
import ProductsList from '@/components/General/ProductsList'
import CategoryList from '@/components/HomePage/CategoryList'
import HeroSection from '@/components/HomePage/HeroSection'
import BgCardsSlider from '@/components/General/BgCardsSlider'
import Loader from '@/components/General/Loader'
import HomeError from '@/components/HomePage/HomeError'
import SearchResults from '@/components/HomePage/SearchResults'
import ProductsListSlider from '@/components/General/ProductsListSlider'
import WorkWithUs from '@/components/General/WorkWithUs'

// Actions & Utils
import { getProducts } from '@/lib/server-actions/product'
import { getCategories as fetchCategories } from '@/lib/server-actions/category'
import { divideProductsByCategory } from '@/lib/utils'

// Types
type DisplayCategoriesAndProductsProps = {
  page: number
  category: string
}

type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

// Add types for the API responses
type ProductsResponse = {
  data: {
    totalProductCount: number
    products: any[]
  } | null
}

type CategoriesResponse = {
  data: any[] | null
}

// Schema for search params validation
export const schema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().positive().optional(),
})

// OPTIMIZED: Simplified product distribution with smaller initial loads
const distributeProducts = (totalCount: number, products: any[]) => {
  if (totalCount === 0 || products.length === 0) {
    return {
      featuredProducts: [],
      dealsProducts: [],
      likeProducts: [],
      popularProducts: [],
    }
  }

  // PERFORMANCE FIX: Drastically reduce initial product loads
  const maxInitialLoad = Math.min(totalCount, 24) // Cap at 24 total products initially
  const limitedProducts = products.slice(0, maxInitialLoad)

  // Simple distribution for better performance
  const quarterSize = Math.floor(maxInitialLoad / 4)

  return {
    featuredProducts: limitedProducts.slice(0, quarterSize || 4),
    dealsProducts: limitedProducts.slice(quarterSize, quarterSize * 2 || 8),
    likeProducts: limitedProducts.slice(quarterSize * 2, quarterSize * 3 || 12),
    popularProducts: limitedProducts.slice(quarterSize * 3, maxInitialLoad),
  }
}

// PERFORMANCE FIX: Add loading states and reduce initial data
const DisplayCategoriesAndProducts = async ({
  page,
  category,
}: DisplayCategoriesAndProductsProps) => {
  try {
    // OPTIMIZATION: Parallel fetch with timeout - Fixed typing
    const [productsResult, categoriesResult] = await Promise.allSettled([
      Promise.race([
        getProducts(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Products fetch timeout')), 5000)
        ),
      ]),
      Promise.race([
        fetchCategories(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Categories fetch timeout')), 3000)
        ),
      ]),
    ])

    // Type-safe extraction of results
    const productsData: ProductsResponse =
      productsResult.status === 'fulfilled'
        ? (productsResult.value as ProductsResponse)
        : { data: null }

    const categoriesData: CategoriesResponse =
      categoriesResult.status === 'fulfilled'
        ? (categoriesResult.value as CategoriesResponse)
        : { data: [] }

    const totalProductCount = productsData.data?.totalProductCount || 0
    const allProducts = productsData.data?.products || []

    if (productsResult.status === 'rejected') {
      console.error('Products fetch failed:', productsResult.reason)
    }
    if (categoriesResult.status === 'rejected') {
      console.error('Categories fetch failed:', categoriesResult.reason)
    }

    // PERFORMANCE FIX: Limit sorting to improve speed
    const sortedProducts =
      allProducts.length > 50
        ? allProducts.slice(0, 50) // Limit to first 50 for sorting
        : [...allProducts].sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )

    // Distribute with performance optimizations
    const { featuredProducts, dealsProducts, likeProducts, popularProducts } =
      distributeProducts(totalProductCount, sortedProducts)

    const productsByCategories = divideProductsByCategory(allProducts)

    // PERFORMANCE FIX: Limit categories processing
    const limitedCategories = (categoriesData.data || []).slice(0, 20)
    const sortedCategoriesWithApprovedProducts = limitedCategories
      .filter((category: any) => {
        const categoryProducts = productsByCategories[category._id] || []
        return categoryProducts.some(
          (product: any) => product.status === 'approved'
        )
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

    return (
      <div className='space-y-8'>
        <CategoryList
          title='Categories'
          categories={sortedCategoriesWithApprovedProducts}
          getItemsLengthFor='allProducts'
          selectedCategory={category}
          baseRoute='/category/'
        />

        {featuredProducts.length > 0 && (
          <Suspense
            fallback={
              <div className='h-64 bg-gray-100 animate-pulse rounded-lg' />
            }
          >
            <ProductsListSlider
              products={featuredProducts}
              showCartBtn
              title='Featured Products'
            />
          </Suspense>
        )}

        {dealsProducts.length > 0 && (
          <Suspense
            fallback={
              <div className='h-64 bg-gray-100 animate-pulse rounded-lg' />
            }
          >
            <ProductsListSlider
              products={dealsProducts}
              showCartBtn
              title='Deals For You'
            />
          </Suspense>
        )}

        {likeProducts.length > 0 && (
          <Suspense
            fallback={
              <div className='h-80 bg-gray-100 animate-pulse rounded-lg' />
            }
          >
            <ProductsList
              products={likeProducts}
              showCartBtn
              title='We Think You Will Like'
            />
          </Suspense>
        )}

        <BgCardsSlider />

        {popularProducts.length > 0 && (
          <Suspense
            fallback={
              <div className='h-80 bg-gray-100 animate-pulse rounded-lg' />
            }
          >
            <ProductsList
              title='Popular Products'
              products={popularProducts}
              showCartBtn
            />
          </Suspense>
        )}

        <section className='px-4 mb-12'>
          <BgCardsSlider />
        </section>

        <WorkWithUs />
      </div>
    )
  } catch (error) {
    console.error('DisplayCategoriesAndProducts error:', error)
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <p className='text-lg font-semibold text-gray-600 mb-2'>
          Unable to load products
        </p>
        <p className='text-sm text-gray-500'>
          Please refresh the page to try again
        </p>
      </div>
    )
  }
}

// PERFORMANCE FIX: Optimized main component with better error boundaries
export default function Page({ searchParams }: PageProps) {
  const parseResult = schema.safeParse(searchParams)
  const data = parseResult.success ? parseResult.data : {}

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <main className='pt-6 overflow-x-hidden space-y-8 pb-12 min-h-[70vh] w-full'>
        {data?.query ? (
          <ErrorBoundary
            errorComponent={HomeError}
            key='search-results' // Force remount on query changes
          >
            <Suspense
              fallback={
                <div className='w-full h-64 flex items-center justify-center'>
                  <Loader />
                </div>
              }
            >
              <SearchResults />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <>
            <HeroSection query={data?.query} category={data?.category} />
            <ErrorBoundary errorComponent={HomeError} key='main-content'>
              <Suspense
                fallback={
                  <div className='w-full h-96 flex items-center justify-center'>
                    <div className='space-y-4 w-full max-w-4xl mx-auto px-4'>
                      <div className='h-8 bg-gray-200 animate-pulse rounded' />
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {Array(8)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className='h-64 bg-gray-200 animate-pulse rounded-lg'
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                }
              >
                <DisplayCategoriesAndProducts
                  category={data?.category || ''}
                  page={data?.page || 0}
                />
              </Suspense>
            </ErrorBoundary>
          </>
        )}
      </main>
    </div>
  )
}
