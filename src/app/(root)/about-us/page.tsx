'use client'

import React from 'react'

export default function AboutUs() {
  return (
    <div className='min-h-screen mt-[4.5rem] bg-white'>
      {/* Header Section */}

      <header className='bg-gray-100 mt-[5rem] py-[8rem] px-4 relative overflow-hidden'>
        <div className='absolute top-10 left-10 w-40 h-40 border-l-8 border-t-8 border-[#3BB77E] opacity-20'></div>
        <div className='absolute bottom-10 right-10 w-32 h-32 border-r-8 border-b-8 border-[#3BB77E] opacity-20'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-[#3BB77E] rounded-full opacity-5'></div>

        <div className='max-w-3xl bg-white py-12 px-8 mx-auto text-center relative rounded-2xl shadow-lg border-r-4 border-b-4 border-[#3BB77E] hover:shadow-xl transition-shadow duration-300'>
          <div className='absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-[#3BB77E] opacity-30'></div>
          <div className='absolute bottom-4 left-4 w-12 h-12 bg-[#3BB77E] rounded-tr-[30px] opacity-10'></div>

          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight relative z-10'>
            About Komas500 Global
          </h1>
          <p className='text-base md:text-lg text-black max-w-3xl mx-auto font-semibold leading-relaxed relative z-10'>
            We believe shopping should be more than a routine — it should be
            exciting, affordable, and accessible to everyone. That's why we
            created Komas500: a one-stop destination for high-quality cosmetics
            and beauty products at unbeatable wholesale prices.
          </p>
        </div>
      </header>

      {/* Main About Section */}
      <section className='py-20 px-4 bg-gray-50 relative'>
        <div className='absolute top-0 left-0 w-48 h-48 border-l-8 border-t-8 border-[#3BB77E] opacity-20'></div>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16'>
            The Beauty of Affordability & Access
          </h2>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div className='space-y-6'>
              <p className='text-base text-gray-700 leading-relaxed'>
                Komas500 is built on a clear vision — to transform how beauty is
                experienced across Nigeria and beyond. Whether you're a final
                consumer or a retailer, we make it possible to shop premium
                beauty products without breaking the bank.
              </p>
              <p className='text-lg text-gray-700 leading-relaxed'>
                We're redefining the beauty shopping experience by offering:
              </p>
              <div className='space-y-4'>
                {[
                  'Access to verified vendors and manufacturers only, ensuring quality and trust',
                  'Same-week delivery through our expanding pickup stations across cities and campuses',
                  'Seamless home delivery, making convenience an everyday part of beauty shopping',
                  'The lowest shipping rates you can find on the market',
                ].map((feature, index) => (
                  <div key={index} className='flex items-start space-x-4'>
                    <div className='w-2 h-2 bg-[#3BB77E] rounded-full mt-3 flex-shrink-0'></div>
                    <p className='text-base text-gray-700'>{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='bg-white p-8 rounded-2xl shadow-lg border-r-4 border-b-4 border-[#3BB77E] relative'>
              <div className='absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-[#3BB77E] opacity-30'></div>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                Transforming Beauty Shopping
              </h3>
              <p className='text-case text-gray-700 leading-relaxed'>
                From makeup to skincare to accessories, we're creating an
                ecosystem where premium beauty meets unbeatable affordability —
                making quality accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className='py-20 px-4 bg-white relative'>
        <div className='absolute bottom-0 right-0 w-32 h-32 border-r-8 border-b-8 border-[#3BB77E] opacity-20'></div>
        <div className='max-w-6xl mx-auto'>
          <div className='grid md:grid-cols-2 gap-12'>
            <div className='bg-white p-10 rounded-2xl shadow-lg border-l-4 border-[#3BB77E] hover:shadow-xl transition-shadow duration-300'>
              <h3 className='text-3xl font-bold text-[#3BB77E] mb-6'>Vision</h3>
              <p className='text-base text-gray-700 leading-relaxed'>
                To become Africa's most trusted and accessible beauty
                marketplace — where affordability, convenience, and quality
                meet.
              </p>
            </div>
            <div className='bg-white p-10 rounded-2xl shadow-lg border-l-4 border-[#3BB77E] hover:shadow-xl transition-shadow duration-300'>
              <h3 className='text-3xl font-bold text-[#3BB77E] mb-6'>
                Mission
              </h3>
              <p className='text-base text-gray-700 leading-relaxed'>
                We exist to make beauty shopping not just easy, but fun —
                combining unbeatable prices with an engaging and reliable
                experience that excites our customers every time they shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-20 px-4 bg-gray-50 relative'>
        <div className='absolute top-0 left-0 w-64 h-24 bg-[#3BB77E] rounded-br-[50px] opacity-10'></div>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16'>
            Our Values
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                title: 'Trust & Transparency',
                description:
                  'We partner only with verified vendors and manufacturers to ensure our customers get authentic products every time.',
              },
              {
                title: 'Affordability',
                description:
                  'Everyone deserves access to quality beauty products, regardless of their budget.',
              },
              {
                title: 'Community Empowerment',
                description:
                  'Our innovative business model and technology are designed to create 5,000+ job opportunities across Nigeria.',
              },
              {
                title: 'Speed & Convenience',
                description:
                  "From same-week pickups to smooth home delivery, we're focused on getting beauty products to you — faster and easier.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className='bg-white p-8 rounded-xl shadow-md border-b-4 border-[#3BB77E] hover:shadow-lg transition-shadow duration-300'
              >
                <h4 className='text-xl font-bold text-[#3BB77E] mb-4'>
                  {value.title}
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Love Shopping Section */}
      <section className='py-20 px-4 bg-white relative'>
        <div className='absolute top-0 right-0 w-48 h-48 border-r-8 border-t-8 border-[#3BB77E] opacity-15'></div>
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-[#3BB77E] rounded-tr-[60px] opacity-10'></div>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16'>
            Why You'll Love Shopping With Us
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                title: 'One-stop beauty hub',
                description:
                  'From makeup to skincare to accessories, Komas500 offers a growing catalog of trusted beauty brands.',
              },
              {
                title: 'Wholesale pricing for all',
                description:
                  "Whether you're buying for yourself or your store, you get unbeatable value.",
              },
              {
                title: 'Campus & city delivery',
                description:
                  'Our logistics system ensures fast, flexible delivery to pickup stations near you.',
              },
              {
                title: 'Customer-first technology',
                description:
                  'Our platform is built to be smooth, mobile-friendly, and personal.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='bg-gray-50 p-8 rounded-xl border-r-4 border-b-4 border-[#3BB77E] hover:bg-white hover:shadow-lg transition-all duration-300'
              >
                <h4 className='text-xl font-bold text-gray-900 mb-4'>
                  {item.title}
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Love Working Section */}
      <section className='py-20 px-4 bg-gray-50 relative'>
        <div className='absolute bottom-0 right-0 w-96 h-20 bg-[#3BB77E] rounded-tl-[80px] opacity-15'></div>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16'>
            Why You'll Love Working With Us
          </h2>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div className='bg-white p-10 rounded-2xl shadow-lg border-l-8 border-[#3BB77E] relative'>
              <div className='absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-[#3BB77E] opacity-40'></div>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                Building an Ecosystem of Opportunity
              </h3>
              <p className='text-lg text-gray-700 leading-relaxed'>
                At Komas500, we're not just building a marketplace — we're
                building an ecosystem of opportunity. From logistics partners to
                digital marketers to vendors, we're creating thousands of jobs
                and empowering young people, especially across Nigerian campuses
                and cities.
              </p>
            </div>
            <div className='space-y-6'>
              <p className='text-lg text-gray-700 leading-relaxed'>
                Our vision extends beyond just selling beauty products. We're
                committed to creating meaningful employment opportunities and
                fostering entrepreneurship across Nigeria.
              </p>
              <p className='text-lg text-gray-700 leading-relaxed'>
                Whether you're a logistics partner, digital marketer, vendor, or
                looking to start your own beauty business, Komas500 provides the
                platform and support system to help you succeed.
              </p>
              <p className='text-lg text-gray-700 leading-relaxed'>
                Join us in revolutionizing the beauty industry while building a
                career that makes a difference in communities across Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 bg-[#3BB77E] relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-48 h-48 border-r-8 border-t-8 border-white opacity-20'></div>
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-white rounded-tr-[60px] opacity-10'></div>
        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
            Ready to Experience Beauty Shopping Differently?
          </h2>
          <p className='text-xl text-white opacity-95 leading-relaxed mb-10'>
            Join thousands of customers who have discovered the joy of
            affordable, accessible, and authentic beauty products at Komas500
            Global.
          </p>

          {/* Beautiful CTA Button */}
          <div className='flex justify-center'>
            <button
              onClick={() => (window.location.href = '/category')}
              className='group relative bg-white text-[#3BB77E] font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out border-2 border-white hover:bg-[#3BB77E] hover:text-white overflow-hidden'
            >
              <span className='relative z-10 flex items-center justify-center space-x-3'>
                <span>Shop Now</span>
                <svg
                  className='w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </span>
              <div className='absolute inset-0 bg-gradient-to-r from-[#3BB77E] to-[#2a9b5f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full'></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
