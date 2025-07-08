import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Hot Deals',
  description: 'Browse hot and latest deals'
}

export default function HotDeals() {
  return (
    <div className='text-2xl font-semibold w-fill text-center mt-10 min-h-[70vh]'>HotDeals</div>
  )
}
