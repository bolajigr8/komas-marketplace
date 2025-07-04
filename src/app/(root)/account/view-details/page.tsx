import OrderDetails from '@/components/AccountPages/ViewDetails'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { z } from 'zod'

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const schema = z.object({
  orderId: z.string().optional(),
})

export const metadata: Metadata = {
  title: 'View Details',
  description: 'View Product Details',
}

const OrderDetailsPage = async ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)

  return (
    <main className='flex-1 bg-white py-8 px-4 md:px-6'>
      <div className='flex h-full flex-col gap-6 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]'>
        {/* Back Arrow Button */}
        <div className='flex items-center mb-4'>
          <Link
            href='/account/orders'
            className='flex items-center text-green-500 hover:text-green-700'
          >
            {/* SVG Back Arrow Icon */}
            <svg
              className='w-6 h-6 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 19l-7-7 7-7'
              ></path>
            </svg>
            <h1 className='text-lg'>Product Details</h1>
          </Link>
        </div>

        {/* <h2 className='text-xl font-semibold'>Track Your Order</h2> */}
        <OrderDetails orderId={data?.orderId} />
      </div>
    </main>
  )
}

export default OrderDetailsPage
