import React, { useEffect, useMemo, useState } from 'react'
import CartGroup from './CartGroup'
import TotalSummary from './TotalSummary'
import { CartItem, Vendor } from '@/lib/types'

type CartGroupsProps = {
  cart: Record<string, CartItem[]>
}

const CartGroups = ({ cart }: CartGroupsProps) => {
  const { processedCart, allItems } = useMemo(() => {
    const processed: Record<string, CartItem[]> = {}
    Object.values(cart).forEach((items) =>
      items.forEach((item) => {
        const vendorId =
          typeof item.product?.vendor === 'string'
            ? item.product?.vendor
            : item.product?.vendor?._id
        if (vendorId)
          (processed[vendorId] = processed[vendorId] || []).push(item)
      })
    )
    return {
      processedCart: processed,
      allItems: Object.values(processed).flat(),
    }
  }, [cart])

  // console.log('processed cart from cart groups', processedCart)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 relative '>
      <div className='lg:col-span-3 space-y-6 pb-32 lg:pb-0'>
        {Object.entries(processedCart).map(([vendorId, items], index) => (
          <CartGroup
            key={vendorId}
            cartItems={items}
            vendor={items[0]?.product?.vendor as Vendor}
            // totalItems={allItems}
            isFirstGroup={index === 0}
          />
        ))}
      </div>
      <div className='lg:col-span-2 sticky bottom-4 lg:static lg:bottom-auto z-[49] lg:z-auto '>
        <div className='bg-white rounded-xl shadow-md p-6  lg:p-8 lg:px-4 lg:w-full lg:max-w-none '>
          <TotalSummary cartItems={allItems} />
        </div>
      </div>
    </div>
  )
}

export default CartGroups
