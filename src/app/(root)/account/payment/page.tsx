import CardInfoDisplay from '@/components/AccountPages/CardInfoDisplay';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: 'Payment Info',
  description: 'Payment Info',
}

const PaymentInfo = () => {
  return (
    <main className="flex-1 bg-white py-8 px-4 md:px-6">
      <div className="flex h-full flex-col gap-6 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]"
      >
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <div className="flex flex-col gap-3 p-4 lg:p-6 rounded-xl bg-[#f8f8f8] lg:px-20 !pb-10">
          <CardInfoDisplay />
        </div>
      </div>
    </main>
  );
}

export default PaymentInfo