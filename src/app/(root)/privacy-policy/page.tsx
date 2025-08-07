import { PrivacyPolicyPage } from '@/components/PrivacyPage/privacyPolicyPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy',
}

const PrivacyPolicy: React.FC = () => {
  return (
    <div className='mt-[4.5rem]'>
      <PrivacyPolicyPage />
    </div>
  )
}

export default PrivacyPolicy
