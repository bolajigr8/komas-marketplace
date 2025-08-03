'use client'

import React from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import Image from 'next/image'

interface ContactOptionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  ariaLabel: string
}

const ContactOption: React.FC<ContactOptionProps> = ({
  icon,
  label,
  onClick,
  ariaLabel,
}) => (
  <button
    className='group relative flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-200 active:scale-[0.98] w-48'
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow duration-300'>
      {icon}
    </div>
    <span className='font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300'>
      {label}
    </span>
  </button>
)

const OperatingHours: React.FC<{ title: string }> = ({ title }) => (
  <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
    <h3 className='font-semibold text-gray-800 mb-3'>{title}</h3>
    <div className='space-y-2 text-sm text-gray-600'>
      <div className='flex justify-between'>
        <span>Monday - Sunday:</span>
        <span className='font-medium'>8:00 AM - 7:00 PM</span>
      </div>
      <div className='flex justify-between'>
        <span>Public Holidays:</span>
        <span className='font-medium'>9:00 AM - 5:00 PM</span>
      </div>
    </div>
  </div>
)

const CustomerCare: React.FC = () => (
  <div className='relative overflow-hidden rounded-3xl shadow-2xl'>
    <Image
      src='/Images/Contact/customer-care.jpg'
      alt='Professional customer care team ready to assist customers with inquiries and support'
      className='w-full h-80 object-cover transition-transform duration-500 hover:scale-105'
      width={600}
      height={400}
      priority
    />
    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
  </div>
)

export const ContactPage: React.FC = () => {
  const handleChatClick = () => {
    // Replace with actual chat implementation
    console.log('Opening chat...')
    // Example: window.open('chat-url', '_blank')
  }

  const handleCallClick = () => {
    // Replace with actual call implementation
    window.location.href = 'tel:+2348181106'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-green-600 to-green-500' />
        <div className='relative px-4 py-16 mx-auto max-w-7xl'>
          <h1 className='text-4xl md:text-6xl font-bold text-white text-center tracking-tight'>
            Need Help?
          </h1>
          <p className='mt-4 text-xl text-green-100 text-center max-w-2xl mx-auto'>
            We're here to assist you every step of the way
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='px-4 py-16 mx-auto max-w-7xl'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Contact Information */}
          <div className='space-y-8'>
            <div className='text-center lg:text-left'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Get in Touch
              </h2>
              <p className='text-gray-600 leading-relaxed'>
                If you have inquiries or need assistance, don't hesitate to
                reach out. We're available to help you with any questions or
                concerns.
              </p>
            </div>

            {/* Contact Options */}
            <div className='space-y-4'>
              <ContactOption
                icon={<MessageCircle size={24} />}
                label='Chat with Us'
                onClick={handleChatClick}
                ariaLabel='Start a live chat conversation with our support team'
              />
              <ContactOption
                icon={<Phone size={24} />}
                label='Call Us'
                onClick={handleCallClick}
                ariaLabel='Call our customer service team at 02018881106'
              />
            </div>

            {/* Operating Hours */}
            <OperatingHours title='Support Hours' />

            {/* Phone Number */}
            <div className='bg-green-50 border border-green-200 rounded-xl p-6'>
              <h3 className='font-semibold text-gray-800 mb-2'>Direct Line</h3>
              <a
                href='tel:+2348181106'
                className='text-2xl font-bold text-green-600 hover:text-green-700 transition-colors duration-200'
                aria-label='Call customer service at 02018881106'
              >
                02018881106
              </a>
            </div>
          </div>

          {/* Customer Care Image */}
          <div className='order-first lg:order-last'>
            <CustomerCare />
          </div>
        </div>
      </div>
    </div>
  )
}
