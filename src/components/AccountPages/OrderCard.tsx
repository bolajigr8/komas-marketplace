import Image from 'next/image'
import React from 'react'
import OrderCardControls from './OrderCardControls'
import ServerImageRender from '../General/ServerImageRender'
import ClientImageRender from '../General/ClientImageRender'

type PropsType = {
  className?: string
  status: string
  price: number
  name: string
  description: string
  quantity: number
  createdAt: string
  id: string
  images: string[]
}

const OrderCard = ({
  className,
  status,
  price,
  name,
  description,
  quantity,
  createdAt,
  id,
  images,
}: PropsType) => {
  // Use the first image from the array, or a fallback image if none exist.
  const imageUrl = (images && images.length > 0 && images[0]) || ''

  return (
    <div
      className={`flex gap-4 p-2 pr-6 rounded-2xl border shadow-md ${className}`}
    >
      {/* <Image
        src={'/Images/card.jpg'}
        alt='product name'
        height={100}
        width={100}
        className='w-16 md:w-20 object-cover rounded-3xl bg-gray-200'
      /> */}

      <ClientImageRender
        folderName='orders'
        src={imageUrl}
        alt={name}
        width={200}
        height={200}
        className='object-contain rounded-lg shadow-sm border border-gray-300'
      />

      <div className='flex flex-col gap-1 w-full'>
        <div className='flex items-center justify-between gap-4'>
          <h3 className='md:text-lg font-semibold'>{name}</h3>
          <OrderCardControls id={id} />
        </div>
        <p className='text-xs md:text-sm'>{description}</p>
        <div className='flex items-center justify-between gap-8 text-xs md:text-sm font-medium'>
          <p>Qty: {quantity}</p>
          <p>
            <span className='line-through'>N</span>
            {price}
          </p>
        </div>
        <div className='flex items-center justify-between text-xs mt-2 font-medium'>
          <p className='p-1 rounded bg-green-500/20 text-green-500 uppercase'>
            {status}
          </p>
          <p>On: {createdAt}</p>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
