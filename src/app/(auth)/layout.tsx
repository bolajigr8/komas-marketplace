import Image from 'next/image'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='w-full min-h-screen flex'>
      <div className='relative w-[250px] hidden lg:block bg-green-500 p-4 py-8'>
        <h1 className='text-white text-3xl text-center font-bold'>KOMAS500</h1>
        {/* <div className='absolute bottom-4 -right-28'>
          <Image
            src={'/Images/auth-img.png'}
            alt='auth image'
            width={400}
            height={400}
            className='object-contain size-[250px]'
          />
        </div> */}
      </div>
      {children}
    </main>
  )
}

export default AuthLayout