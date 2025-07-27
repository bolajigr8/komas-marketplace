import { Suspense } from 'react'
import { z } from 'zod'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

// Server Components
import ProductsList from '@/components/General/ProductsList'
import BgCard from '@/components/General/BgCard'
import CategoryList from '@/components/HomePage/CategoryList'
import HeroSection from '@/components/HomePage/HeroSection'
import BgCardsSlider from '@/components/General/BgCardsSlider'
import Loader from '@/components/General/Loader'
import HomeError from '@/components/HomePage/HomeError'
import SearchResults from '@/components/HomePage/SearchResults'

// Client Components
// import { InstallPromptToast } from "./client-components";

// Actions & Utils

import { getProducts } from '@/lib/server-actions/product'
import { getCategories as fetchCategories } from '@/lib/server-actions/category'
import { divideProductsByCategory } from '@/lib/utils'
import { bgSliderProducts } from '@/data/bgSlider'
import ProductsListSlider from '@/components/General/ProductsListSlider'
import WorkWithUs from '@/components/General/WorkWithUs'

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

// Schema for search params validation
export const schema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().positive().optional(),
})

// DisplayCategoriesAndProducts component
const DisplayCategoriesAndProducts = async ({
  page,
  category,
}: DisplayCategoriesAndProductsProps) => {
  const [products, categories] = await Promise.all([
    getProducts({ page, perPage: 1000 }),
    fetchCategories(),
  ])

  // console.log(categories.data, 'categories')

  const productsByCategories = divideProductsByCategory(
    products.data?.products || []
  )

  // categories ways to show up

  // 1. Filter categories that have products using productsByCategories
  const sortedCategories = [...(categories.data || [])]
    .filter((category) => productsByCategories[category._id]?.length > 0)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  // 2. Alternative: If you want to also filter by approved products only
  const sortedCategoriesWithApprovedProducts = [...(categories.data || [])]
    .filter((category) =>
      (productsByCategories[category._id] || []).some(
        (product) => product.status === 'approved'
      )
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  // 3. Alternative: If you want categories with active/live products only
  const sortedCategoriesWithLiveProducts = [...(categories.data || [])]
    .filter((category) =>
      (productsByCategories[category._id] || []).some(
        (product) => product.isLive === true && !product.isDeleted
      )
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const filteredProducts = (products.data?.products || []).filter(
    (product) => product.isApproved && !product.isDeleted && product.isLive
  )

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const latest10ProductsFirst = sortedProducts.slice(0, 10)
  const latest10ProductsSecond = sortedProducts.slice(10, 20)

  // console.log(categories, 'categories')

  // console.log(products.data?.products, 'product')
  // console.log(latest10ProductsSecond)

  return (
    <>
      <CategoryList
        title='Categories'
        categories={sortedCategoriesWithApprovedProducts}
        getItemsLengthFor='allProducts'
        selectedCategory={category}
        baseRoute='/category/'
      />

      <ProductsListSlider
        products={latest10ProductsFirst}
        showCartBtn
        title='Featured Products'
      />
      <ProductsListSlider
        products={latest10ProductsFirst}
        showCartBtn
        title='Deals For You'
      />

      <ProductsList
        products={latest10ProductsFirst}
        showCartBtn
        title='We Think You Will Like'
      />

      {/* <ProductsList
        products={products.data?.products.slice(-10) || []}
        showCartBtn
        title='Featured Products'
      /> */}
      {/* <ProductsList
        products={
          products.data?.products
            .filter((p) => Array.isArray(p.images) && p.images.length > 0)
            .slice(-10) || []
        }
        showCartBtn
        title='Featured Products'
      /> */}

      {/* <BgCardsSlider products={bgSliderProducts} /> */}
      <BgCardsSlider />

      <ProductsList
        title='Popular Products'
        products={latest10ProductsFirst}
        showCartBtn
      />

      {/* <ProductsList
        title='Popular Products'
        products={latest10ProductsSecond}
        showCartBtn
      /> */}
      {/* <ProductsList
        title='Popular Products'
        products={products.data?.products.slice(10, 20) || []}
        showCartBtn
      /> */}

      <section className='px-4 mb-12'>
        {/* <BgCard
          // backgroundImage='/Images/Home/flatTommy/flatTommy.png'
          // text='Enjoy easy and fast same day delivery on this jellof Spaghetti Combo.'
          // className='max-w-[69rem] mx-auto min-h-[300px]'
          // product={bgSliderProducts[0]}
        /> */}
        <BgCardsSlider />
      </section>

      {/* services display section by cards */}
      <WorkWithUs />
    </>
  )
}

// Main Page component
export default function Page({ searchParams }: PageProps) {
  const { data } = schema.safeParse(searchParams)

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      {/* <InstallPromptToast /> */}

      <main className='pt-6 overflow-x-hidden space-y-12 pb-12 min-h-[70vh] w-full'>
        {data?.query ? (
          <ErrorBoundary errorComponent={HomeError}>
            <Suspense
              fallback={
                <div className='w-full h-full flex items-center justify-center'>
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
            <ErrorBoundary errorComponent={HomeError}>
              <Suspense
                fallback={
                  <div className='w-full h-full flex items-center justify-center'>
                    <Loader />
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
