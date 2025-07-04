import AccountNav from '@/components/AccountPages/AccountNav';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Account',
    template: '%s - Account | KOMAS500'
  },
  description: 'Your KOMAS500 account',
}

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full md:h-min md:px-4 md:py-6 md:bg-gray-100'>
      <div className='max-w-6xl h-full flex md:rounded-2xl overflow-hidden md:shadow-lg mx-auto md:max-h-[700px]'>
        <AccountNav />
        {children}
      </div>
    </div>
  );
}

export default AccountLayout