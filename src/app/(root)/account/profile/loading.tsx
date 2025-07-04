import Loader from '@/components/General/Loader'
import React from 'react'

const ProfileLoading = () => {
  return (
    <main className='flex-1 w-full h-[80vh] md:h-full flex items-center justify-center pt-8 md:pt-0'>
      <Loader />
    </main>
  )
}

export default ProfileLoading