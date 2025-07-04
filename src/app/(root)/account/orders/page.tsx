import FilterSelect from '@/components/AccountPages/FilterSelect'
import OrderCard from '@/components/AccountPages/OrderCard'
import { getAllOrders } from '@/lib/server-actions/order'
import { OrderData, OrdersResponse } from '@/lib/types'
import { Metadata } from 'next'
import React from 'react'
import { VscSettings } from 'react-icons/vsc'

export const metadata: Metadata = {
  title: 'Order History',
  description: 'Order History',
}

const OrderHistory = async () => {
  const res: OrdersResponse = await getAllOrders()
  const allOrders: OrderData[] = Array.isArray(res.data) ? res.data : []

  // console.log('allOrders', allOrders)

  return (
    <main className='flex-1 bg-white py-8 px-4 md:px-6'>
      <div className='flex h-full flex-col gap-6 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]'>
        <div className='flex flex-col'>
          <div className='flex flex-wrap md:items-center justify-between gap-2'>
            <div className='flex flex-col'>
              <h2 className='text-xl font-semibold'>Order History</h2>
              <p className='text-sm font-semibold md:hidden'>
                List of previously purchased products
              </p>
            </div>
            <div className='ml-auto'>
              <FilterSelect />
            </div>
          </div>
          <p aria-hidden className='text-sm font-semibold hidden md:block'>
            List of previously purchased products
          </p>
        </div>
        <div className='flex flex-col gap-3 pb-2 lg:p-6 rounded-xl lg:border'>
          {allOrders &&
            allOrders.map((order, index) => {
              // Convert createdAt to a readable date
              const createdAtDate = new Date(
                order.createdAt
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              return (
                <OrderCard
                  key={index}
                  status={order.status}
                  price={order.products?.[0]?.price || 0}
                  name={(order.products?.[0]?.productID as any)?.name || ''}
                  description={
                    (order.products?.[0]?.productID as any)?.description || ''
                  }
                  quantity={
                    (order.products?.[0]?.productID as any)?.quantity || 1
                  }
                  createdAt={createdAtDate}
                  id={order._id}
                  images={
                    order.products?.[0]?.productID &&
                    typeof order.products[0].productID === 'object' &&
                    'images' in order.products[0].productID &&
                    Array.isArray(
                      (order.products[0].productID as { images?: unknown })
                        .images
                    )
                      ? (order.products[0].productID as { images: string[] })
                          .images
                      : []
                  }
                />
              )
            })}
        </div>
      </div>
    </main>
  )
}

export default OrderHistory
