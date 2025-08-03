'use client'

import React from 'react'
import CartProductCard from './CartProductCard'

import { CartItem, Vendor } from '@/lib/types'
// import { useAppSelector } from "@/redux-store/hooks";
import { Avatar } from '@nextui-org/react'

export const CartGroup = ({
  isFirstGroup,
  cartItems,
  vendor,
}: {
  isFirstGroup: boolean
  cartItems: CartItem[]
  vendor: Vendor
}) => {
  // console.log('cart items from cart group', cartItems)

  return (
    <div className='bg-white rounded-xl shadow-md p-6 space-y-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-800'>{vendor.name}</h2>
          <p className='text-gray-500 text-sm'>{cartItems.length} item(s)</p>
        </div>
        <Avatar src={vendor.logo} alt={vendor.name} name={vendor.name} />
      </div>

      <div className='space-y-4'>
        {cartItems.map((item) => (
          <CartProductCard key={item.product._id} cartItem={item} />
        ))}
      </div>

      {/* <CartGroupSummary cartItems={cartItems} vendor={vendor} /> */}
    </div>
  )
}

export default CartGroup
