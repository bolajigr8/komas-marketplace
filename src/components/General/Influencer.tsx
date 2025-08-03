'use client'

import StaggeredText from '@/components/General/StaggeredTextNew'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import React from 'react'

const InfluencerClient = () => {
  const handleJoinNow = () => {
    window.location.href = 'https://forms.gle/oQ17ybHF7LGMtPzi7'
  }

  const handleRegisterNow = () => {
    window.location.href = 'https://forms.gle/oQ17ybHF7LGMtPzi7'
  }

  return (
    <div className='min-h-screen bg-neutral-950'>
      {/* Hero Section */}
      <main className='min-h-screen mt-[-2rem] flex flex-col relative justify-center pt-[10rem] md:pt-[11rem] pb-12 overflow-x-clip bg-neutral-950'>
        {/* Gradient Background */}
        <div
          className='absolute inset-0 opacity-10'
          style={{
            background: `
              radial-gradient(circle at 25% 25%, #2a7a5a 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #1f5d42 0%, transparent 50%),
              linear-gradient(135deg, #245c44 0%, transparent 70%)
            `,
          }}
        />

        {/* Subtle overlay pattern */}
        <div
          className='absolute inset-0 opacity-3'
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #2a7a5a 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full'>
          {/* Split Layout for Large Screens */}
          <div className='h-full flex items-center'>
            {/* Content Section - Left side on large screens, full width on smaller */}
            <div className='w-full lg:w-1/2 lg:pr-12'>
              {/* Launch Badge */}
              <section className='flex lg:hidden justify-center lg:justify-start mb-8'>
                <div
                  className='inline-flex items-center px-6 py-2 rounded-full text-white text-sm sm:text-base font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200'
                  style={{
                    backgroundColor: '#2a7a5a',
                    boxShadow: '0 0 20px rgba(42, 122, 90, 0.25)',
                  }}
                >
                  <span className='mr-2'>💰</span>
                  <span>Exclusive Opportunity</span>
                </div>
              </section>

              {/* Content Layout */}
              <div className='text-center lg:text-left'>
                {/* Main Heading */}
                <div className='mb-8'>
                  <StaggeredText
                    text='Make Money by Creating Content'
                    el='h1'
                    className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-white'
                  />

                  <StaggeredText
                    text='KOMAS500 WHOLESALE FASHION'
                    el='h2'
                    className='text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-white/90 tracking-wider'
                  />
                </div>

                {/* Subtitle */}
                <div className='mb-10 lg:mb-6'>
                  <p className='text-lg sm:text-xl lg:text-xl text-white/80 leading-relaxed'>
                    Join our exclusive influencer program and start earning by
                    promoting premium fashion content
                  </p>
                </div>

                {/* CTA Button */}
                <div className='mb-8 lg:mb-4'>
                  <Button
                    size='lg'
                    className='font-bold px-10 lg:py-1 text-xl hover:scale-105 transition-all duration-300 shadow-xl'
                    style={{
                      background:
                        'linear-gradient(135deg, #2a7a5a 0%, #1f5d42 100%)',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 10px 30px rgba(42, 122, 90, 0.4)',
                    }}
                    onClick={handleJoinNow}
                  >
                    Join Now
                  </Button>
                </div>

                {/* Call to action hint */}
                <div>
                  <p className='text-white/30 text-sm animate-pulse'>
                    Limited spots available - First 300 influencers only!
                  </p>
                </div>
              </div>
            </div>

            {/* Image Section - Right side on large screens, hidden on smaller */}
            <div
              className='hidden lg:block lg:w-1/2'
              style={{ height: '65vh' }}
            >
              <div className='h-full flex items-center justify-center relative'>
                {/* Image Container */}
                <div
                  className='w-full h-full rounded-2xl shadow-2xl relative overflow-hidden'
                  style={{
                    background: `
                      linear-gradient(135deg, rgba(42, 122, 90, 0.1) 0%, rgba(31, 93, 66, 0.1) 100%),
                      radial-gradient(circle at center, rgba(42, 122, 90, 0.2) 0%, transparent 70%)
                    `,
                    border: '1px solid rgba(42, 122, 90, 0.2)',
                  }}
                >
                  {/* Placeholder for influencer/content creator image */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='relative w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center'>
                      {/* You can replace this with an actual image */}
                      <div className='text-center z-[999] text-white/60'>
                        {/* <div className='text-6xl mb-4'>📱</div> */}
                        <img
                          alt='A girl holding a PDA'
                          src='/Images/influencer1.jpg'
                          className='w-[40rem] z-[999] h-[30rem] object-cover object-center rounded-2xl'
                          style={{
                            filter: 'brightness(0.9) contrast(1.1)',
                          }}
                        />
                        {/* <p className='text-sm'>Earning with KOMAS500</p> */}
                      </div>

                      {/* Optional overlay for better contrast */}
                      <div
                        className='absolute inset-0 rounded-2xl'
                        style={{
                          background:
                            'linear-gradient(45deg, rgba(42, 122, 90, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Subtle pattern overlay */}
                  <div
                    className='absolute inset-0 opacity-3 rounded-2xl'
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, #2a7a5a 1px, transparent 0)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className='py-16 lg:py-24 bg-neutral-950 relative'>
        {/* Background Elements */}
        <div
          className='absolute inset-0 opacity-5'
          style={{
            background: `
              radial-gradient(circle at 75% 25%, #2a7a5a 0%, transparent 50%),
              radial-gradient(circle at 25% 75%, #1f5d42 0%, transparent 50%)
            `,
          }}
        />

        <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6'>
              Program Features
            </h2>
            <p className='text-lg sm:text-xl text-white/70 max-w-2xl mx-auto'>
              Everything you need to succeed as a KOMAS500 content creator
            </p>
          </div>

          {/* Features Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
            {/* Feature Card 1 */}
            <div
              className='p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border'
              style={{
                background:
                  'linear-gradient(135deg, rgba(42, 122, 90, 0.1) 0%, rgba(31, 93, 66, 0.05) 100%)',
                border: '1px solid rgba(42, 122, 90, 0.2)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className='mb-6'>
                <div
                  className='w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4'
                  style={{ backgroundColor: '#2a7a5a' }}
                >
                  <span>
                    <CheckCircle />
                  </span>
                </div>
                <h3 className='text-xl sm:text-2xl font-bold text-white mb-4'>
                  Exclusive Access
                </h3>
                <p className='text-white/70 leading-relaxed'>
                  <strong className='text-white'>
                    Offer Only to the First 300 Influencers
                  </strong>
                  <br />
                  With at Least 5k Followers in TikTok, Instagram, Facebook and
                  YouTube
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div
              className='p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border'
              style={{
                background:
                  'linear-gradient(135deg, rgba(42, 122, 90, 0.1) 0%, rgba(31, 93, 66, 0.05) 100%)',
                border: '1px solid rgba(42, 122, 90, 0.2)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className='mb-6'>
                <div
                  className='w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4'
                  style={{ backgroundColor: '#2a7a5a' }}
                >
                  💸
                </div>
                <h3 className='text-xl sm:text-2xl font-bold text-white mb-4'>
                  Earn by Creating
                </h3>
                <p className='text-white/70 leading-relaxed'>
                  <strong className='text-white'>
                    Earn by Sharing Your Unique Discount Promocode
                  </strong>
                  <br />
                  Also you earn commisions on every purchase made with your code
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div
              className='p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border md:col-span-2 lg:col-span-1'
              style={{
                background:
                  'linear-gradient(135deg, rgba(42, 122, 90, 0.1) 0%, rgba(31, 93, 66, 0.05) 100%)',
                border: '1px solid rgba(42, 122, 90, 0.2)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className='mb-6'>
                <div
                  className='w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4'
                  style={{ backgroundColor: '#2a7a5a' }}
                >
                  📊
                </div>
                <h3 className='text-xl sm:text-2xl font-bold text-white mb-4'>
                  Track Your Success
                </h3>
                <p className='text-white/70 leading-relaxed'>
                  <strong className='text-white'>
                    Dashboard to Track and Withdraw Earnings
                  </strong>
                  <br />
                  Monitor your performance, track orders, earnings and withdraw
                  your commissions every 10 days
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className='text-center mt-16'>
            <div className='mb-8'>
              <h3 className='text-2xl sm:text-3xl font-bold text-white mb-4'>
                Ready to Start Earning?
              </h3>
              <p className='text-white/70 text-lg mb-8 max-w-2xl mx-auto'>
                Join hundreds of successful content creators who are already
                making money with KOMAS500
              </p>
            </div>

            <Button
              size='lg'
              className='font-bold px-10 py-4 text-xl hover:scale-105 transition-all duration-300 shadow-xl'
              style={{
                background: 'linear-gradient(135deg, #2a7a5a 0%, #1f5d42 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 10px 30px rgba(42, 122, 90, 0.4)',
              }}
              onClick={handleRegisterNow}
            >
              Register Now - Limited Spots
            </Button>

            <p className='text-white/40 text-sm mt-4'>
              * Terms and conditions apply
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InfluencerClient
