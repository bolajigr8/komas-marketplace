import TrackOrderForm from '@/components/AccountPages/TrackOrderForm'
import { getOrders } from '@/lib/server-actions/order'
import { Metadata } from 'next'
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
  title: 'Track Order',
  description: 'Track your order',
}

const TrackOrder = async ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)

  return (
    <main className='flex-1 bg-white py-8 px-4 md:px-6'>
      <div className='flex h-full flex-col gap-6 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]'>
        <h2 className='text-xl font-semibold'>Track Your Order</h2>
        <TrackOrderForm orderId={data?.orderId} />
      </div>
    </main>
  )
}

export default TrackOrder
