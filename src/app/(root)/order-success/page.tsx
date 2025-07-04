// app/order-success/page.tsx
'use client'

import React from 'react'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

const OrderSuccessPage = () => {
  const router = useRouter()

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center'>
        <div className='rounded-full h-16 w-16 bg-green-500 flex items-center justify-center mx-auto mb-6'>
          <svg
            className='w-8 h-8 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>

        <h1 className='text-2xl font-bold text-green-600 mb-4'>
          Order Placed Successfully!
        </h1>

        <p className='text-gray-600 mb-6'>
          Thank you for your purchase! Your order has been confirmed and is
          being processed. You will receive an email confirmation shortly with
          your order details and tracking information.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            onClick={() => router.push('/orders')}
            className='bg-green-500 text-white px-6 py-2'
          >
            View My Orders
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant='bordered'
            className='border-gray-300 px-6 py-2'
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
