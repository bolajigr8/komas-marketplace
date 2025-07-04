import DeliveryAddressForm from '@/components/AccountPages/DeliveryAddressForm'
import { Metadata } from 'next'
import React from 'react'

type PropsType = {
  params: {
    addressId: string
  }
}

export const metadata: Metadata = {
  title: 'Edit Delivery Address',
  description: 'Edit Delivery Address',
}

const DeliveryAddressEdit = ({ params: { addressId } }: PropsType) => {
  console.log('DeliveryAddressEdit page loaded with addressId:', addressId)

  return (
    <main className='bg-white w-full overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]'>
      <div className='flex flex-col gap-4 py-4'>
        <h2 className='text-lg font-semibold'>Edit Shipping Info</h2>
        <DeliveryAddressForm action='edit' addressId={addressId} />
      </div>
    </main>
  )
}

export default DeliveryAddressEdit
