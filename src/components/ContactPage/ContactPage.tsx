'use client'

import React from 'react'
import { PiChatsBold } from 'react-icons/pi'
import Image from 'next/image'

interface ContactOptionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

const ContactOption: React.FC<ContactOptionProps> = ({
  icon,
  label,
  onClick,
}) => (
  <div
    className='relative flex items-center cursor-pointer mb-5 hover:scale-105 transition-transform shadow-lg'
    onClick={onClick}
  >
    {icon}
    <p className='bg-[#3BB77E] text-white p-1 pl-4 rounded-md shadow-md'>
      {label}
    </p>
  </div>
)

const CustomerCare: React.FC = () => (
  <div>
    <Image
      src='/Images/Contact/customer-care.jpg'
      alt='Customer care team assisting customers'
      className='h-80 object-cover w-full rounded-tr-[100px] rounded-bl-[100px]'
      width={500}
      height={500}
    />
  </div>
)

export const ContactPage: React.FC = () => {
  return (
    <div className='bg-[#F5F5F5] py-7'>
      <h1
        className='bg-[#3BB77E] text-center text-white text-[30px] lg:text-6xl font-bold py-4 mx-0 lg:mx-24'
        aria-label='Need help?'
      >
        NEED HELP?
      </h1>

      <section className='flex flex-col lg:flex-row items-center mx-4 lg:mx-24 gap-6 lg:gap-12 bg-none lg:bg-white mt-5 px-6 py-5'>
        <div className='flex-1 pl-5'>
          <div className='text-gray-700 text-sm mb-6 text-center'>
            <span className='block'>
              {' '}
              If you have inquiries or need assistance, do not hesitate to chat
              or call us. We are available
            </span>
            <ul className='list-disc list-inside mb-6 text-gray-700'>
              <li>Monday to Sunday: 8am to 7pm</li>
              <li>Public Holidays: 9am to 5pm</li>
            </ul>
          </div>

          <div className='flex justify-center gap-20 items-center'>
            <ContactOption
              icon={
                <PiChatsBold
                  className='absolute left-0 text-4xl bg-white text-black rounded-full p-2 -translate-x-6 z-10 shadow-lg'
                  aria-label='Chat icon'
                />
              }
              label='CHAT WITH US'
              onClick={() => alert('Chat with us clicked!')}
            />
            <ContactOption
              icon={
                <PiChatsBold
                  className='absolute left-0 text-4xl bg-white text-black rounded-full p-2 -translate-x-6 z-10 shadow-lg'
                  aria-label='Call icon'
                />
              }
              label='CALL US'
              onClick={() => alert('Call us clicked!')}
            />
          </div>

          <div className='text-gray-700 text-sm mb-6 text-center'>
            <span className='block'>
              You can also reach us on 02018881106 from
            </span>
            <ul className='list-disc list-inside mb-6 text-gray-700'>
              <li>Monday to Sunday: 8am to 7pm</li>
              <li>Public Holidays: 9am to 5pm</li>
            </ul>
          </div>
        </div>

        <div className='flex-1'>
          <CustomerCare />
        </div>
      </section>
    </div>
  )
}
