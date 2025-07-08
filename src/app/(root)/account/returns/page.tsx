import OrderCard from '@/components/AccountPages/OrderCard'
import RefundsSelect from '@/components/AccountPages/RefundsSelect'
import { Metadata } from 'next'
import React from 'react'
import { VscSettings } from 'react-icons/vsc'
import { z } from 'zod'

export const metadata: Metadata = {
  title: 'Returns and Refunds',
  description: 'Returns and Refunds',
}

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const schema = z.object({
  status: z.string().optional(),
})

const Returns = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  return (
    <main className='flex-1 bg-white py-8 px-4 md:px-6'>
      <div className='flex h-full flex-col gap-6 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]'>
        <div className='flex flex-col'>
          <div className='flex flex-wrap items-start md:items-center justify-between gap-2'>
            <div className='flex flex-col'>
              <h2 className='text-xl font-semibold'>Returns and Refunds</h2>
              <p className='text-sm font-semibold md:hidden'>
                List of returned or refunded products
              </p>
            </div>
            <RefundsSelect status={data?.status} />
          </div>
          <p
            aria-hidden
            className='text-sm font-semibold hidden md:block -mt-2'
          >
            List of previously purchased products
          </p>
        </div>
        <div className='flex flex-col gap-3 pb-2 lg:p-6 rounded-xl lg:border'>
          {Array.from({ length: 4 }).map((_, index) => (
            <OrderCard
              key={index}
              status='refunded'
              price={0}
              name={''}
              description={''}
              quantity={0}
              createdAt={''}
              id={''}
              images={[]}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Returns
