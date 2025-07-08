import DeleteAccountCard from '@/components/AccountPages/DeleteAccountCard';
import SignoutCard from '@/components/AccountPages/SignoutCard';
import { Metadata } from 'next'
import React, { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Sign Out',
  description: 'Sign Out',
}

const SignOut = () => {
  return (
    <main className="flex-1 bg-white py-8 px-4 md:px-6">
      <div className="flex h-full flex-col gap-6 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]">
        <SignoutCard />
        <DeleteAccountCard />
      </div>
    </main>
  );
}

export default SignOut