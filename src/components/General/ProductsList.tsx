'use client'
import React from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/lib/types'
import { EmblaOptionsType } from 'embla-carousel'

type PropsType = {
  title?: string
  products: Product[]
  showCartBtn?: boolean
  className?: string
  // cardClass?: string;
  viewMode?: 'grid' | 'list'
}

const settings: EmblaOptionsType = {
  loop: true,
  align: 'start',
  slidesToScroll: 1,
  skipSnaps: true,
  breakpoints: {
    '(min-width: 640px)': {
      slidesToScroll: 1,
    },
    '(min-width: 1024px)': {
      slidesToScroll: 2,
    },
    '(min-width: 1280px)': {
      slidesToScroll: 3,
    },
  },
}

const ProductsList = ({
  products,
  showCartBtn,
  className,
  title = '',
  // cardClass = "",
  viewMode = 'grid',
}: PropsType) => {
  const gridClasses =
    viewMode === 'grid'
      ? 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6'
      : 'space-y-6'

  return (
    <section className={`w-full px-4 ${className}`}>
      <div className='w-full'>
        <h2 className='text-xl font-semibold ml-2 mb-4'>{title}</h2>
        {products.length ? (
          <div className={gridClasses}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                showCartBtn={showCartBtn}
                viewMode={viewMode}
                className={`${
                  viewMode === 'list'
                    ? 'flex flex-col md:flex-row gap-4'
                    : 'flex flex-col'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className='w-[calc(100%-16px)] h-[200px] mx-auto flex items-center justify-center rounded-md bg-gray-100'>
            <p className='font-medium text-center'>No products here</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsList

// 'use client'
// import React from 'react'
// import ProductCard from './ProductCard'
// import { Product } from '@/lib/types'
// import { EmblaOptionsType } from 'embla-carousel'

// type PropsType = {
//   title?: string
//   products: Product[]
//   showCartBtn?: boolean
//   className?: string
//   // cardClass?: string;
//   viewMode?: 'grid' | 'list'
// }

// const settings: EmblaOptionsType = {
//   loop: true,
//   align: 'start',
//   slidesToScroll: 1,
//   skipSnaps: true,
//   breakpoints: {
//     '(min-width: 640px)': {
//       slidesToScroll: 1,
//     },
//     '(min-width: 1024px)': {
//       slidesToScroll: 2,
//     },
//     '(min-width: 1280px)': {
//       slidesToScroll: 3,
//     },
//   },
// }

// const ProductsList = ({
//   products,
//   showCartBtn,
//   className,
//   title = '',
//   // cardClass = "",
//   viewMode = 'grid',
// }: PropsType) => {
//   const gridClasses =
//     viewMode === 'grid'
//       ? 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6'
//       : 'space-y-6'

//   // console.log(products, 'product list')

//   return (
//     <section className={`w-full px-4 ${className}`}>
//       <div className='w-full'>
//         <h2 className='text-xl font-semibold ml-2 mb-4'>{title}</h2>
//         {products.length ? (
//           <div className={gridClasses}>
//             {products.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 showCartBtn={showCartBtn}
//                 viewMode={viewMode}
//                 className={`${
//                   viewMode === 'list'
//                     ? 'flex flex-col md:flex-row gap-4'
//                     : 'flex flex-col'
//                 }`}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className='w-[calc(100%-16px)] h-[200px] mx-auto flex items-center justify-center rounded-md bg-gray-100'>
//             <p className='font-medium text-center'>No products here</p>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }

// export default ProductsList
