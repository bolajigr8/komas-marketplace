import React, { Suspense } from 'react'
import CategoryList from '@/components/HomePage/CategoryList'
import { Metadata } from 'next'
import { schema } from '../../page'
import { notFound } from 'next/navigation'
import { Category, Product } from '@/lib/types'
import VendorDetailsHero from '@/components/StoresPage/VendorDetailsHero'
import VendorProductsSearchResults from '@/components/StoresPage/VendorProductsSearchResults'
import VendorProductsDivided from '@/components/StoresPage/VendorProductsDivided'
import { getVendorById, getVendors } from '@/lib/server-actions/vendor'
import { getVendorProductsByName } from '@/lib/server-actions/product'
import { getCategoryById } from '@/lib/server-actions/category'
import BgCardsSlider from '@/components/General/BgCardsSlider'
import { bgSliderProducts } from '@/data/bgSlider'

type PropsType = {
  params: {
    vendorId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export const revalidate = 1800

export default async function StorePage({
  params: { vendorId },
  searchParams,
}: PropsType) {
  const { data } = schema.safeParse(searchParams)
  // console.log(data?.page, data?.query);

  const [vendorRes, searchRes, categoryRes] = await Promise.all([
    getVendorById(vendorId),
    getVendorProductsByName({
      query: data?.query || '',
      vendorId,
      categoryId: data?.category,
    }),
    getCategoryById(data?.category || ''),
  ])

  if (vendorRes.hasError && ![404, 500].includes(vendorRes.statusCode))
    throw new Error(vendorRes.message)

  if (!vendorRes.data) notFound()

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 min-h-[80vh]'>
      <VendorDetailsHero
        query={data?.query}
        category={data?.category}
        logo={vendorRes.data.logo}
        name={vendorRes.data.name}
        description={vendorRes.data.description}
      />

      <div className='sticky top-0 z-10 bg-white/90 backdrop-blur-sm pt-4 pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
        <CategoryList
          categories={vendorRes.data.productCategories as Category[]}
          getItemsLengthFor='vendorProducts'
          vendorId={vendorId}
          selectedCategory={data?.category || ''}
          baseRoute={`/store/${vendorId}?${
            data?.query ? `query=${data.query}&` : ''
          }category=`}
          stopNavigateScroll
        />
      </div>

      {data?.query ? (
        <VendorProductsSearchResults
          products={searchRes.data || []}
          query={data?.query}
          category={categoryRes.data?.name}
          page={data.page || 0}
        />
      ) : vendorRes.data.products.length ? (
        <Suspense
          fallback={
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse'>
              {[...Array(8)].map((_, i) => (
                <div key={i} className='h-80 bg-gray-100 rounded-lg'></div>
              ))}
            </div>
          }
        >
          <VendorProductsDivided
            products={vendorRes.data.products as Product[]}
            categories={vendorRes.data.productCategories as Category[]}
            category={data?.category}
          />
        </Suspense>
      ) : (
        <div className='w-full rounded-xl bg-gray-50 p-12 text-center shadow-sm'>
          <h3 className='text-lg font-medium text-gray-800 mb-2'>
            No products available
          </h3>
          <p className='text-gray-500'>
            This store hasn't added any products yet.
          </p>
        </div>
      )}

      {!data?.query && vendorRes.data.products.length > 0 && <BgCardsSlider />}
    </main>
  )
}

export const generateStaticParams = async () => {
  const { data } = await getVendors()
  return (
    data?.map((vendor) => ({
      vendorId: vendor._id,
    })) || []
  )
}

export const generateMetadata = async ({
  params: { vendorId },
  searchParams,
}: PropsType): Promise<Metadata | undefined> => {
  const { data } = schema.safeParse(searchParams)
  const vendorRes = await getVendorById(vendorId)
  if (vendorRes.hasError) return

  return data?.query && data.category
    ? {
        title: `${vendorRes.data?.name} - ${data.query} in ${vendorRes.data?.productCategories}`,
        description: `Search results for ${data.query} in ${vendorRes.data?.name}'s ${vendorRes.data?.productCategories} collection`,
      }
    : data?.query
    ? {
        title: `${vendorRes.data?.name} - ${data.query} Results`,
        description: `Search results for ${data.query} at ${vendorRes.data?.name}`,
      }
    : data?.category
    ? {
        title: `${vendorRes.data?.name} - ${vendorRes.data?.productCategories}`,
        description: `Explore ${vendorRes.data?.name}'s ${vendorRes.data?.productCategories} collection`,
      }
    : {
        title: vendorRes.data?.name,
        description:
          vendorRes.data?.description ||
          `Shop the complete collection of products from ${vendorRes.data?.name}`,
      }
}
