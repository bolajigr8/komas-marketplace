// 'use client'

// import React, { useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { Filter } from 'lucide-react'
// import { Product } from '@/lib/types'
// import { CategoryFilters } from '@/types/category'
// import { FeaturedProducts } from '@/components/CategoryPage/FeaturedProducts'
// import { FilterSidebar } from '@/components/CategoryPage/FilterSidebar'
// import { ViewControls } from '@/components/CategoryPage/ViewControls'
// import ProductsList from '@/components/General/ProductsList'
// import Loader from '@/components/General/Loader'

// type Props = {
//   initialProducts: Product[]
// }

// export const CategoryClient = ({ initialProducts }: Props) => {
//   const searchParams = useSearchParams()
//   const categoryId = searchParams.get('query')

//   const [products, setProducts] = useState<Product[]>(initialProducts)
//   const [loading, setLoading] = useState(false)
//   const [filters, setFilters] = useState<CategoryFilters>({
//     sortBy: 'featured',
//     priceRange: [],
//     brands: [],
//     colors: [],
//     shipsFrom: [],
//     ratings: [],
//     features: [],
//   })
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [showFilters, setShowFilters] = useState(false)

//   const category = products[0]?.category

//   return (
//     <div className='max-w-7xl mx-auto px-4 py-8'>
//       <div className='mb-8'>
//         <h1 className='text-3xl font-bold text-gray-900'>
//           {typeof category === 'string' ? category : category?.name}
//         </h1>
//         <p className='text-gray-600 mt-2'>
//           {typeof category === 'string' ? category : category?.description}
//         </p>
//       </div>

//       <section className='mb-12'>
//         <h2 className='text-2xl font-semibold mb-6'>Featured Products</h2>
//         <FeaturedProducts
//           products={products.filter((p) => p.tags.includes('featured'))}
//         />
//       </section>

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
//           {loading ? (
//             <div className='w-full h-full flex items-center justify-center'>
//               <Loader />
//             </div>
//           ) : (
//             <ProductsList products={products} showCartBtn viewMode={viewMode} />
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }

'use client'

import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import { Product } from '@/lib/types'
import { CategoryFilters } from '@/types/category'
import { FeaturedProducts } from '@/components/CategoryPage/FeaturedProducts'
import { FilterSidebar } from '@/components/CategoryPage/FilterSidebar'
import { ViewControls } from '@/components/CategoryPage/ViewControls'
import ProductsList from '@/components/General/ProductsList'
import Loader from '@/components/General/Loader'

type Props = {
  initialProducts: Product[]
}

export const CategoryClient = ({ initialProducts }: Props) => {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('query')

  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<CategoryFilters>({
    sortBy: 'featured',
    priceRange: [],
    brands: [],
    colors: [],
    shipsFrom: [],
    ratings: [],
    features: [],
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Safely derive category from first product (if any)
  const category = useMemo(() => {
    if (!products.length) return null
    return products[0]?.category ?? null
  }, [products])

  const featuredProducts = useMemo(() => {
    return products.filter(
      (p) => Array.isArray(p.tags) && p.tags.includes('featured')
    )
  }, [products])

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          {typeof category === 'string'
            ? category
            : category?.name ?? 'Category'}
        </h1>
        <p className='text-gray-600 mt-2'>
          {typeof category === 'string' ? '' : category?.description ?? ''}
        </p>
      </div>

      <section className='mb-12'>
        <h2 className='text-2xl font-semibold mb-6'>Featured Products</h2>
        <FeaturedProducts products={featuredProducts} />
      </section>

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
              <Filter className='w-5 h-5' />
              Filters
            </button>
          </div>

          {loading ? (
            <div className='w-full h-full flex items-center justify-center'>
              <Loader />
            </div>
          ) : (
            <ProductsList products={products} showCartBtn viewMode={viewMode} />
          )}
        </main>
      </div>
    </div>
  )
}
