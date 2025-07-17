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

  // Sort orders by createdAt date in descending order (most recent first)
  const sortedOrders = allOrders.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA // Descending order (newest first)
  })

  console.log('allOrders', sortedOrders)

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
          {sortedOrders &&
            sortedOrders.map((order, index) => {
              // Convert createdAt to a readable date
              const createdAtDate = new Date(
                order.createdAt
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })

              // Calculate total quantity from all products in the order
              const totalQuantity =
                order.products?.reduce(
                  (sum, product) => sum + (product.quantity || 0),
                  0
                ) || 0

              // Get all product names
              const productNames =
                order.products
                  ?.map((product) => (product.productID as any)?.name || '')
                  .filter((name) => name)
                  .join(', ') || ''

              // Get all product descriptions (or use the first one)
              const productDescriptions = order.products
                ?.map(
                  (product) => (product.productID as any)?.description || ''
                )
                .filter((desc) => desc)

              const combinedDescription =
                productDescriptions?.length > 1
                  ? `${productDescriptions.length} different products`
                  : productDescriptions?.[0] || ''

              // Get all images from all products
              const allImages =
                order.products?.flatMap((product) => {
                  if (
                    product.productID &&
                    typeof product.productID === 'object' &&
                    'images' in product.productID &&
                    Array.isArray(
                      (product.productID as { images?: unknown }).images
                    )
                  ) {
                    return (
                      (product.productID as { images: string[] }).images || []
                    )
                  }
                  return []
                }) || []

              // Use discountedPrice if it exists and is not zero, otherwise use totalAmount
              const finalPrice =
                order.discountedPrice && order.discountedPrice !== 0
                  ? order.discountedPrice
                  : order.totalAmount || 0

              return (
                <OrderCard
                  key={index}
                  status={order.status}
                  price={finalPrice}
                  name={productNames}
                  description={combinedDescription}
                  quantity={totalQuantity}
                  createdAt={createdAtDate}
                  id={order._id}
                  images={allImages}
                  products={order.products} // Pass all products for detailed display
                />
              )
            })}
        </div>
      </div>
    </main>
  )
}

export default OrderHistory
