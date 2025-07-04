import DeliveryList from '@/components/AccountPages/DeliveryList';
import { Metadata } from 'next';
import React, { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Delivery Details',
  description: 'Delivery Details',
}

const Delivery = () => {
  return (
    <main className="flex-1 bg-white grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]">
      <DeliveryList />
    </main>
  );
}

export default Delivery