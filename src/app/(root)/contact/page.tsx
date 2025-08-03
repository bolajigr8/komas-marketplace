import { ContactPage } from '@/components/ContactPage/ContactPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Contact Komas',
  description: 'Contact Page',
}

const Contact: React.FC = () => {
  return (
    <>
      <main className='mt-[4rem]'>
        <ContactPage />
      </main>
    </>
  )
}

export default Contact
