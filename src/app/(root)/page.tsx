// // "use client";
// import ProductsList from "@/components/General/ProductsList";
// import BgCard from "@/components/General/BgCard";
// import CategoryList from "@/components/HomePage/CategoryList";
// import HeroSection from "@/components/HomePage/HeroSection";
// // import Stores from "@/components/HomePage/Stores";
// import BgCardsSlider from "@/components/General/BgCardsSlider";
// import { bgSliderProducts } from "@/data/bgSlider";
// import { z } from "zod";
// import { ErrorBoundary } from "next/dist/client/components/error-boundary";
// import { Suspense } from "react";
// import Loader from "@/components/General/Loader";
// import {
//   getProducts,
//   // getProductsByCategory,
//   // getProductsByName,
// } from "@/lib/server-actions/product";
// import { getCategories, getCategoryById } from "@/lib/server-actions/category";
// import { getVendors } from "@/lib/server-actions/vendor";
// import { divideProductsByCategory } from "@/lib/utils";
// import HomeError from "@/components/HomePage/HomeError";
// // import VendorProductsSearchResults from "@/components/StoresPage/VendorProductsSearchResults";
// import SearchResults from "@/components/HomePage/SearchResults";

// type PropsType = {
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// };

// export const schema = z.object({
//   query: z.string().optional(),
//   category: z.string().optional(),
//   page: z.coerce.number().positive().optional(),
// });

// export default async function Home({ searchParams }: PropsType) {
//   const { data } = schema.safeParse(searchParams);

//   return (
//     <main className="overflow-x-hidden space-y-12 pb-12 min-h-[70vh]">
//       {data?.query ? (
//         <ErrorBoundary errorComponent={HomeError}>
//           <Suspense
//             fallback={
//               <div className="w-full h-full flex items-center justify-center">
//                 <Loader />
//               </div>
//             }
//           >
//             <SearchResults />
//           </Suspense>
//         </ErrorBoundary>
//       ) : (
//         <>
//           <HeroSection
//             query={data?.query}
//             category={data?.category}
//             // products={products?.data?.products || []}
//           />
//           <ErrorBoundary errorComponent={HomeError}>
//             <Suspense
//               fallback={
//                 <div className="w-full h-full flex items-center justify-center">
//                   <Loader />
//                 </div>
//               }
//             >
//               <DisplayCategoriesAndProducts
//                 // query={data?.query || ""}
//                 category={data?.category || ""}
//                 page={data?.page || 0}
//               />
//             </Suspense>
//           </ErrorBoundary>
//         </>
//       )}
//     </main>
//   );
// }

// const DisplayCategoriesAndProducts = async ({
//   page,
//   category,
// }: // query,
// {
//   page: number;
//   category: string;
//   // query: string;
// }) => {
//   const [products, categories] = await Promise.all([
//     getProducts({ page, perPage: 1000 }),
//     getCategories(),
//     // getCategoryById(category),
//     // getVendors(),
//   ]);

//   // if (products.hasError && ![404, 500].includes(products.statusCode)) throw Error(products.message)

//   const productsByCategories = divideProductsByCategory(
//     products.data?.products || []
//   );

//   console.error("product", products.data?.products);

//   // console.log(products)
//   // console.log(searchedProducts)
//   // console.log(categories.data);
//   // console.log(categoryRes)
//   // console.log(vendors)

//   return (
//     <>
//       <CategoryList
//         title="Categories"
//         categories={categories.data || []}
//         getItemsLengthFor="allProducts"
//         selectedCategory={category}
//         baseRoute="/category/?query="
//       />
//       {/* {query ? (
//         <VendorProductsSearchResults
//           products={searchedProducts.data || []}
//           query={query}
//           category={categoryRes.data?.name}
//           page={page}
//         />
//         <SearchResults />
//       ) : ( */}
//       <>
//         {/* {Object.entries(productsByCategories)
//             .slice(0, 1)
//             .map(([categoryId, products]) => (
//               <ProductsList
//                 key={categoryId}
//                 title={
//                   categories.data?.find(
//                     (category) => category._id === categoryId
//                   )?.name || ""
//                 }
//                 products={products}
//                 showCartBtn
//               />
//             ))} */}

//         <ProductsList
//           products={products.data?.products.slice(0, 10) || []}
//           // className="pb-12"
//           // cardClass="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6"
//           showCartBtn
//           title="Featured Products"
//         />
//         {/* <Stores stores={vendors.data?.slice(0, 7) || []} /> */}

//         {/* {Object.entries(productsByCategories)
//             .slice(1, 2)
//             .map(([categoryId, products]) => (
//               <ProductsList
//                 key={categoryId}
//                 title={
//                   categories.data?.find(
//                     (category) => category._id === categoryId
//                   )?.name || ""
//                 }
//                 products={products}
//                 showCartBtn
//               />
//             ))} */}
//         <BgCardsSlider products={bgSliderProducts} />
//         <ProductsList
//           title="Popular Products"
//           products={products.data?.products.slice(10, 20) || []}
//           // className="pb-12"
//           // cardClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6"
//           showCartBtn
//         />
//         {/* {Object.entries(productsByCategories)
//             .slice(2, 4)
//             .map(([categoryId, products]) => (
//               <ProductsList
//                 key={categoryId}
//                 title={
//                   categories.data?.find(
//                     (category) => category._id === categoryId
//                   )?.name || ""
//                 }
//                 products={products}
//                 showCartBtn
//               />
//             ))} */}
//         <section className="px-4">
//           <BgCard
//             backgroundImage="/Images/Home/flatTommy/flatTommy.png"
//             text="Enjoy easy and fast same day delivery on this jellof Spaghetti Combo."
//             className="max-w-[69rem] mx-auto min-h-[300px]"
//             product={bgSliderProducts[0]}
//           />
//         </section>
//         {/* {Object.entries(productsByCategories)
//             .slice(4, 5)
//             .map(([categoryId, products]) => (
//               <ProductsList
//                 key={categoryId}
//                 title={
//                   categories.data?.find(
//                     (category) => category._id === categoryId
//                   )?.name || ""
//                 }
//                 products={products}
//                 showCartBtn
//               />
//             ))} */}
//       </>
//       {/* )} */}
//     </>
//   );
// };

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

  const sortedCategories = [...(categories.data || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const filteredProducts = (products.data?.products || []).filter(
    (product) => product.isApproved && !product.isDeleted && product.isLive
  )

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const latest10ProductsFirst = sortedProducts.slice(0, 10)
  const latest10ProductsSecond = sortedProducts.slice(10, 20)

  // console.log(products.data?.products, 'product')
  // console.log(latest10ProductsSecond)

  return (
    <>
      <CategoryList
        title='Categories'
        categories={sortedCategories}
        getItemsLengthFor='allProducts'
        selectedCategory={category}
        baseRoute='/category/?query='
      />

      <ProductsList
        products={latest10ProductsFirst}
        showCartBtn
        title='Featured Products'
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

      <BgCardsSlider products={bgSliderProducts} />

      <ProductsList
        title='Popular Products'
        products={latest10ProductsSecond}
        showCartBtn
      />
      {/* <ProductsList
        title='Popular Products'
        products={products.data?.products.slice(10, 20) || []}
        showCartBtn
      /> */}

      <section className='px-4 mb-12'>
        <BgCard
          backgroundImage='/Images/Home/flatTommy/flatTommy.png'
          text='Enjoy easy and fast same day delivery on this jellof Spaghetti Combo.'
          className='max-w-[69rem] mx-auto min-h-[300px]'
          product={bgSliderProducts[0]}
        />
      </section>
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

// import { Suspense } from "react";
// import { z } from "zod";
// import { ErrorBoundary } from "next/dist/client/components/error-boundary";

// // Server Components
// import ProductsList from "@/components/General/ProductsList";
// import BgCard from "@/components/General/BgCard";
// import CategoryList from "@/components/HomePage/CategoryList";
// import HeroSection from "@/components/HomePage/HeroSection";
// import BgCardsSlider from "@/components/General/BgCardsSlider";
// import Loader from "@/components/General/Loader";
// import HomeError from "@/components/HomePage/HomeError";
// import SearchResults from "@/components/HomePage/SearchResults";

// // Client Components
// import {
//   InstallPrompt,
//   PromoCodeSection,
//   PushNotificationManagerWrapper,
// } from "./client-components";
// import { ShoppingBag, Bell, Search } from "lucide-react";

// // Actions & Utils
// import { getProducts } from "@/lib/server-actions/product";
// import { getCategories as fetchCategories } from "@/lib/server-actions/category";
// import { divideProductsByCategory } from "@/lib/utils";
// import { bgSliderProducts } from "@/data/bgSlider";

// // Types
// type DisplayCategoriesAndProductsProps = {
//   page: number;
//   category: string;
// };

// type PageProps = {
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// };

// // Schema for search params validation
// export const schema = z.object({
//   query: z.string().optional(),
//   category: z.string().optional(),
//   page: z.coerce.number().positive().optional(),
// });

// // DisplayCategoriesAndProducts component
// const DisplayCategoriesAndProducts = async ({
//   page,
//   category,
// }: DisplayCategoriesAndProductsProps) => {
//   const [products, categories] = await Promise.all([
//     getProducts({ page, perPage: 1000 }),
//     fetchCategories(),
//   ]);

//   const productsByCategories = divideProductsByCategory(
//     products.data?.products || []
//   );

//   return (
//     <>
//       <CategoryList
//         title="Categories"
//         categories={categories.data || []}
//         getItemsLengthFor="allProducts"
//         selectedCategory={category}
//         baseRoute="/category/?query="
//       />

//       <ProductsList
//         products={products.data?.products.slice(0, 10) || []}
//         showCartBtn
//         title="Featured Products"
//       />

//       <BgCardsSlider products={bgSliderProducts} />

//       <ProductsList
//         title="Popular Products"
//         products={products.data?.products.slice(10, 20) || []}
//         showCartBtn
//       />

//       <section className="px-4">
//         <BgCard
//           backgroundImage="/Images/Home/flatTommy/flatTommy.png"
//           text="Enjoy easy and fast same day delivery on this jellof Spaghetti Combo."
//           className="max-w-[69rem] mx-auto min-h-[300px]"
//           product={bgSliderProducts[0]}
//         />
//       </section>
//     </>
//   );
// };

// // Main Page component
// export default function Page({ searchParams }: PageProps) {
//   const { data } = schema.safeParse(searchParams);

//   return (
//     <div className="w-full min-h-screen bg-gray-50">
//       {/* Modern header with full width */}
//       <header className="w-full bg-white shadow-sm sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="text-2xl font-bold text-indigo-600">Komas</div>
//           </div>

//           <div className="hidden md:flex items-center relative w-1/3">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
//             />
//             <Search className="absolute right-3 text-gray-400 w-5 h-5" />
//           </div>

//           <div className="flex items-center space-x-4">
//             <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//               <Bell className="w-5 h-5 text-gray-700" />
//             </button>
//             <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
//               <ShoppingBag className="w-5 h-5 text-gray-700" />
//               <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 3
//               </span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Utility bar - subtle but accessible */}
//       <div className="bg-white border-b border-gray-100 mb-6">
//         <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between">
//           <div className="w-full md:w-auto lg:flex-1">
//             <PushNotificationManagerWrapper />
//           </div>

//           <div className="w-full md:w-auto lg:flex-1 mt-2 md:mt-0 flex justify-start md:justify-end">
//             <InstallPrompt />
//           </div>
//         </div>
//       </div>

//       {/* Promo section - subtle but noticeable */}
//       <div className="container mx-auto px-4 mb-8">
//         <div className="max-w-md mx-auto">
//           <PromoCodeSection />
//         </div>
//       </div>

//       <main className="overflow-x-hidden space-y-12 pb-12 min-h-[70vh] w-full">
//         {data?.query ? (
//           <ErrorBoundary errorComponent={HomeError}>
//             <Suspense
//               fallback={
//                 <div className="w-full h-full flex items-center justify-center">
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
//                   <div className="w-full h-full flex items-center justify-center">
//                     <Loader />
//                   </div>
//                 }
//               >
//                 <DisplayCategoriesAndProducts
//                   category={data?.category || ""}
//                   page={data?.page || 0}
//                 />
//               </Suspense>
//             </ErrorBoundary>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }
