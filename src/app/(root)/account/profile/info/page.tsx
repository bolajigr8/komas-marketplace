import AccountInfoDisplay from '@/components/AccountPages/AccountInfoDisplay'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Account Info',
}

const AccountInfo = () => {
  return (
    <main className='flex-1 bg-white'>
      <AccountInfoDisplay />
    </main>
  )
}

export default AccountInfo