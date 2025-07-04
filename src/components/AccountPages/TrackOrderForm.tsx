'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { trackOrderSchema } from '@/lib/schemas'
import { Button, Input } from '@nextui-org/react'
import { OrderData, OrdersResponse } from '@/lib/types'
import { getOrders } from '@/lib/server-actions/order'

type FormType = z.infer<typeof trackOrderSchema>

type PropsType = {
  orderId?: string
}

const TrackOrderForm = ({ orderId }: PropsType) => {
  const [orders, setOrders] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormType>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: {
      orderId: orderId || '',
    },
    mode: 'onTouched',
  })

  const searchParams = useSearchParams()
  const router = useRouter()

  const fetchOrders = async (orderId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response: OrdersResponse = await getOrders({ orderId })
      if (response.data) {
        setOrders(response.data)
      } else {
        setError('No order found with the given ID.')
      }
    } catch (err) {
      setError('Failed to fetch orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (data: FormType) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      keys: ['orderId'],
      values: [data.orderId],
    })

    form.reset()
    router.push(newUrl, { scroll: false })
    fetchOrders(data.orderId)
  }

  const statusMapping: Record<string, string> = {
    shipped: 'Shipped',
    pending: 'Pending',
    processing: 'Processing',
    collected: 'Picked Up by Driver',
    pickupCenter: 'At Pickup Center',
    completed: 'Completed',
    returned: 'Returned',
  }

  const renderPipeline = (tracking: Record<string, boolean>) => {
    const steps = Object.keys(tracking) //  the steps in the exact order they appear in the data

    // the last true status dynamically
    const lastTrueIndex = steps.reduce((lastIndex, key, index) => {
      return tracking[key] ? index : lastIndex
    }, -1)

    return (
      <div className='mt-6'>
        <div className='relative flex flex-col gap-12'>
          {steps.map((key, index) => {
            const isCurrent = index === lastTrueIndex // Current step (most recent `true`)
            const isCompleted = index < lastTrueIndex // Previous true steps

            return (
              <div key={key} className='relative flex items-center gap-6'>
                {/* Vertical line */}
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-[22px] top-10 h-[calc(100%+16px)] w-[2px] ${
                      isCurrent
                        ? 'bg-green-500'
                        : isCompleted
                        ? 'bg-green-200'
                        : 'bg-gray-400'
                    }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrent
                      ? 'bg-green-500 text-white'
                      : isCompleted
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isCurrent
                      ? 'bg-green-500 text-white'
                      : isCompleted
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {statusMapping[key] || key}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          placeholder='Enter Tracking Number'
          variant='bordered'
          size='lg'
          radius='sm'
          {...form.register('orderId')}
          isInvalid={!!form.formState.errors.orderId}
          errorMessage={form.formState.errors.orderId?.message}
          endContent={
            <Button
              type='submit'
              size='lg'
              className='bg-green-500 text-white font-medium'
              radius='sm'
            >
              Track Order
            </Button>
          }
          classNames={{
            inputWrapper:
              'p-2 h-full rounded-md border border-[#908B8B] overflow-hidden ',
            input: 'w-full p-2 py-3 placeholder:text-[#6F7472] font-medium',
          }}
        />
      </form>
      {loading && <p className='mt-4 text-gray-600'>Loading...</p>}
      {error && <p className='mt-4 text-red-500'>{error}</p>}
      {orders && renderPipeline(orders.tracking)}
    </>
  )
}

export default TrackOrderForm
