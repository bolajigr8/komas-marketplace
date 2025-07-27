'use client'
import React from 'react'

const WorkWithUsCards = () => {
  const roles = [
    {
      id: 1,
      title: 'Driver',
      url: '/careers/delivery-driver',
      description:
        'Join our delivery team and earn flexible income while serving your community. Set your own schedule and be part of our logistics network.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9tTKQUylrc3daesbPKdmZvaksiRtCZhchgQ&s',
      alt: 'Professional delivery driver',
    },
    {
      id: 2,
      title: 'Vendor',
      url: '/careers/small-business-vendor',
      description:
        'Partner with us to showcase your products to thousands of customers. Grow your business with our platform and reach new markets.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi73YquPf2sCBY3sD7Wk47osbRQKpdnkGJRw&s',
      alt: 'Small business vendor',
    },
    {
      id: 3,
      title: 'Shopmate',
      url: '/careers/customer-service-representative',
      description:
        'Help customers find exactly what they need. Provide excellent service as a shopping assistant and earn competitive compensation.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRvMclgafXny3x9kVOPTX8B4zuF5Qeb5qoJg&s',
      alt: 'Customer service representative',
    },
    {
      id: 4,
      title: 'Pickup Agent',
      url: '/careers/warehouse-pickup-agent',
      description:
        'Be the bridge between our warehouse and delivery network. Handle order fulfillment and ensure smooth pickup operations.',
      image:
        'data:image/png;base64,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',
      alt: 'Warehouse pickup agent',
    },
  ]

  return (
    <div className='bg-white py-16 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='text-left mb-8 sm:mb-10 lg:mb-12'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4'>
            Work With Us
          </h2>
          {/* <p className='text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4'>
            Join our growing team and be part of the future of ecommerce. We
            offer flexible opportunities for everyone.
          </p> */}
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {roles.map((role) => (
            <a
              key={role.id}
              href={role.url}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group block'
            >
              {/* Image Container */}
              <div className='relative h-32 sm:h-40 lg:h-48 overflow-hidden'>
                <img
                  src={role.image}
                  alt={role.alt}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300'></div>
              </div>

              {/* Content */}
              <div className='p-3 sm:p-4 lg:p-6'>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3 group-hover:text-[#3BB77E] transition-colors duration-300'>
                  {role.title}
                </h3>
                <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
                  {role.description}
                </p>
              </div>

              {/* Decorative Element */}
              <div className='absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-[#3BB77E] group-hover:bg-opacity-20 transition-colors duration-300'>
                <svg
                  className='w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-[#3BB77E]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Section */}
        {/* <div className='text-center mt-8 sm:mt-10 lg:mt-12'>
          <p className='text-gray-600 text-xs sm:text-sm px-4'>
            Ready to start your journey with us? Choose the role that fits your
            skills and schedule.
          </p>
          <div className='mt-4 sm:mt-5 lg:mt-6'>
            <a
              href='#'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block bg-[#3BB77E] text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-[#32a06b] transition-colors duration-200 text-sm sm:text-base'
            >
              View All Opportunities
            </a>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default WorkWithUsCards
