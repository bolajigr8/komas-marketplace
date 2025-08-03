// import React from 'react'
// import CartControls from './CartControls'
// import { CartItem } from '@/lib/types'
// import ServerImageRender from '../General/ServerImageRender'

// const CartProductCard = ({ cartItem }: { cartItem: CartItem }) => {
//   return (
//     <div className=' bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md'>
//       <div className='flex items-center gap-4'>
//         <ServerImageRender
//           folderName='products'
//           src={cartItem.product?.images?.[0]}
//           alt={cartItem.product?.name}
//           width={100}
//           height={100}
//           className='
//             w-16 h-full min-h-16 md:w-20 md:h-20
//             object-cover rounded-xl
//             bg-gray-100
//           '
//         />
//         <div className='flex items-center justify-between py-4 pr-4 w-full max-sm:items-start max-sm:flex-col max-sm:gap-3 max-sm:py-2 max-sm:pr-2'>
//           <div>
//             <h3 className='text-base md:text-lg font-semibold text-gray-800'>
//               {cartItem.product.name}
//             </h3>
//             <p className='text-sm text-gray-500 line-clamp-1'>
//               {cartItem.product.description}
//             </p>
//           </div>
//           <CartControls
//             productId={cartItem.product._id}
//             quantity={cartItem.quantity}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CartProductCard
import React from 'react'
import CartCounter from './CartCounter'
import { CartItem } from '@/lib/types'
import ServerImageRender from '../General/ServerImageRender'

const CartProductCard = ({ cartItem }: { cartItem: CartItem }) => {
  // Check if variant exists and extract variant data
  const hasVariant = !!cartItem.variant
  const displayImage = hasVariant
    ? cartItem.variant?.images?.[0]
    : cartItem.product?.images?.[0]

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200'>
      <div className='flex items-start gap-4 p-4'>
        {/* Product Image */}
        <div className='flex-shrink-0'>
          <ServerImageRender
            folderName='products'
            src={displayImage || cartItem.product?.images?.[0]}
            alt={cartItem.product?.name}
            width={100}
            height={100}
            className='
              w-20 h-20 md:w-24 md:h-24 
              object-cover rounded-xl 
              bg-gray-100 border border-gray-100
            '
          />
        </div>

        {/* Product Details */}
        <div className='flex-1 min-w-0'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3'>
            {/* Product Info */}
            <div className='flex-1 min-w-0'>
              <h3 className='text-base md:text-lg font-semibold text-gray-800 truncate'>
                {cartItem.product.name}
              </h3>
              <p className='text-sm text-gray-500 line-clamp-2 mt-1'>
                {cartItem.product.description}
              </p>

              {/* Variant Details */}
              {hasVariant && cartItem.variant && (
                <div className='flex flex-wrap items-center gap-3 mt-3'>
                  {/* Color */}
                  {cartItem.variant.color && (
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-medium text-gray-600'>
                        Color:
                      </span>
                      <div className='flex items-center gap-1'>
                        <div
                          className='w-4 h-4 rounded-full border border-gray-300'
                          style={{
                            backgroundColor:
                              cartItem.variant.color.toLowerCase() === 'white'
                                ? '#ffffff'
                                : cartItem.variant.color.toLowerCase() ===
                                  'black'
                                ? '#000000'
                                : cartItem.variant.color.toLowerCase(),
                          }}
                        />
                        <span className='text-xs text-gray-700 font-medium'>
                          {cartItem.variant.color}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Size */}
                  {cartItem.variant.size && (
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-medium text-gray-600'>
                        Size:
                      </span>
                      <span className='text-xs bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-700'>
                        {cartItem.variant.size}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Counter */}
            <div className='flex-shrink-0 lg:ml-4'>
              <CartCounter
                productId={cartItem.product._id}
                variantId={
                  hasVariant && cartItem.variant
                    ? cartItem.variant._id
                    : undefined
                }
                initialQuantity={cartItem.quantity}
                maxQuantity={
                  hasVariant && cartItem.variant
                    ? cartItem.variant.quantity
                    : cartItem.product.quantity
                }
                size='md'
                showQuickEdit={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartProductCard
