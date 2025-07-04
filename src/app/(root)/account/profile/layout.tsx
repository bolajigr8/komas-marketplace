import ProfileNav from '@/components/AccountPages/ProfileNav';
import UserTopCard from '@/components/AccountPages/UserTopCard';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Profile',
    template: '%s - Profile'
  },
  description: 'Your KOMAS500 profile',
}

const ProfileLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col gap-2 md:gap-3 flex-1 bg-white py-8 px-4 md:px-6">
      <ProfileNav />
      <UserTopCard />
      {children}
    </div>
  );
}

export default ProfileLayout