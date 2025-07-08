import React from 'react'
import CartControls from './CartControls'
// import Image from "next/image";
import { CartItem } from '@/lib/types'
import ServerImageRender from '../General/ServerImageRender'
// import { useAppSelector } from "@/redux-store/hooks";

const CartProductCard = ({ cartItem }: { cartItem: CartItem }) => {
  return (
    <div className=' bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md'>
      <div className='flex items-center gap-4'>
        {/* <img
          src={cartItem.product.images[0]}
          alt={cartItem.product.name}
          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl bg-gray-100"
        /> */}
        <ServerImageRender
          folderName='products'
          src={cartItem.product?.images?.[0]}
          alt={cartItem.product?.name}
          width={100}
          height={100}
          className='
            w-16 h-full min-h-16 md:w-20 md:h-20 
            object-cover rounded-xl 
            bg-gray-100
          '
        />
        <div className='flex items-center justify-between py-4 pr-4 w-full max-sm:items-start max-sm:flex-col max-sm:gap-3 max-sm:py-2 max-sm:pr-2'>
          <div>
            <h3 className='text-base md:text-lg font-semibold text-gray-800'>
              {cartItem.product.name}
            </h3>
            <p className='text-sm text-gray-500 line-clamp-1'>
              {cartItem.product.description}
            </p>
          </div>
          <CartControls
            productId={cartItem.product._id}
            quantity={cartItem.quantity}
          />
        </div>
      </div>
    </div>
  )
}

export default CartProductCard
