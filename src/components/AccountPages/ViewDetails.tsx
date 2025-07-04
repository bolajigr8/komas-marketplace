import React from 'react'
import { OrderData, OrdersResponse } from '@/lib/types'
import { getAllOrders } from '@/lib/server-actions/order'
import ClientImageRender from '../General/ClientImageRender'

type PropsType = {
  orderId?: string
}

const ViewDetails: React.FC<PropsType> = async ({ orderId }) => {
  const res: OrdersResponse = await getAllOrders()
  const allOrders: OrderData[] = Array.isArray(res.data) ? res.data : []
  const order = allOrders.find((o) => o._id === orderId)
  if (!order)
    return <div className='text-center text-gray-600'>Order not found</div>

  const product = order.products[0].productID as any // TODO: Replace 'any' with the correct Product type if available
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <main className='flex-1 bg-white py-8 px-4 md:px-6 space-y-12'>
      {/* Product Details */}
      <section className='p-6 bg-white text-green-800 border border-green-500 rounded-xl shadow-md'>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-1/3'>
            <ClientImageRender
              folderName='products'
              src={product.images?.[0] || '/Images/card.jpg'}
              alt={product.name}
              width={250}
              height={250}
              className='object-contain rounded-lg shadow-sm border border-gray-300'
            />
          </div>
          <div className='w-full md:w-2/3 space-y-2'>
            <h3 className='text-xl font-bold'>{product.name}</h3>
            <p>{product.description}</p>
            <p>
              <strong>Price:</strong> ₦{product.price}
            </p>
            {product.category && (
              <p>
                <strong>Category:</strong> {product.category.name}
              </p>
            )}
            {product.brand && (
              <p>
                <strong>Brand:</strong> {product.brand.name}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Order Summary */}
      <section className='p-6 bg-white text-green-800 border border-green-500 rounded-xl shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Order Summary</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Order Date:</strong> {formatDate(order.createdAt)}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Total Amount:</strong> ₦{order.totalAmount}
            </p>
          </div>
          <div className='space-y-2'>
            <p>
              <strong>Delivery Fee:</strong> ₦{order.deliveryFee}
            </p>
            <p>
              <strong>Tax Fee:</strong> ₦{order.taxFee}
            </p>
            <p>
              <strong>Delivery Address:</strong>{' '}
              {order.deliveryAddress.addressString}
            </p>
            <p>
              <strong>Post Code:</strong> {order.deliveryAddress.postCode}
            </p>
          </div>
        </div>
      </section>

      {/* Buyer Information Section */}
      <section className='p-6 bg-white text-green-800 border border-green-500 rounded-xl shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Buyer Information</h2>
        <div className='space-y-2'>
          <p>
            <strong>Name:</strong> {order.buyer.fullName}
          </p>
          <p>
            <strong>Email Address:</strong> {order.buyer.emailAddress}
          </p>
          {order.buyer.phoneNumber && (
            <p>
              <strong>Phone Number:</strong> {order.buyer.phoneNumber}
            </p>
          )}
        </div>
      </section>

      {/* Rider Information Section */}
      {order.rider && (
        <section className='p-6 bg-white text-green-800 border border-green-500 rounded-xl shadow-md'>
          <h2 className='text-2xl font-semibold mb-4'>Delivery Rider</h2>
          <div className='space-y-2'>
            <p>
              <strong>Name:</strong> {order.rider.fullName}
            </p>
            <p>
              <strong>Phone Number:</strong> {order.rider.phoneNumber}
            </p>
            <p>
              <strong>Email Address:</strong> {order.rider.emailAddress}
            </p>
            <p>
              <strong>Address:</strong> {order.rider.address}
            </p>
          </div>
        </section>
      )}

      {/* Pickup Station Information Section */}
      {order.pickupStation && (
        <section className='p-6 bg-white text-green-800 border border-green-500 rounded-xl shadow-md'>
          <h2 className='text-2xl font-semibold mb-4'>Pickup Station</h2>
          <div className='space-y-2'>
            <p>
              <strong>Station Name:</strong> {order.pickupStation.name}
            </p>
            <p>
              <strong>Station Address:</strong> {order.pickupStation.address}
            </p>
          </div>
        </section>
      )}

      {/* Delivery Method Information Section */}
      {order.deliveryMethod && (
        <section className='p-6 bg-white text-green-800 border border-green-500 rounded-xl shadow-md'>
          <h2 className='text-2xl font-semibold mb-4'>Delivery Method</h2>
          <div className='space-y-2'>
            <p>
              <strong>Delivery Type:</strong>{' '}
              {order.deliveryMethod.deliveryType}
            </p>
            <p>
              <strong>Fee:</strong> ₦{order.deliveryMethod.fee}
            </p>
          </div>
        </section>
      )}
    </main>
  )
}

export default ViewDetails
