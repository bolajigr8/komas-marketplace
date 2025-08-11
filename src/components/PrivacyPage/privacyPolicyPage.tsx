import React from 'react'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className='min-h-screen  bg-gray-50'>
      {/* Hero Section */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-4xl mx-auto px-6 py-12'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Terms of Service
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Please read these terms carefully before using the Komas500
              platform
            </p>
            <div className='mt-6 inline-flex items-center px-4 py-2 bg-[#3BB77E]/10 rounded-full'>
              <span className='text-sm font-medium text-[#3BB77E]'>
                Last updated:{' '}
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-6 py-12'>
        <div className='bg-white rounded-lg shadow-sm border'>
          <div className='p-8 md:p-12'>
            {/* Introduction */}
            <div className='mb-12'>
              <div className='flex items-center mb-6'>
                <div className='w-1 h-8 bg-[#3BB77E] rounded-full mr-4'></div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Welcome to Komas500
                </h2>
              </div>
              <p className='text-gray-700 leading-relaxed text-lg'>
                By accessing or using our website, mobile app, and services
                (collectively, the "Platform"), you agree to be bound by these
                Terms of Service ("Terms"). Please read them carefully before
                proceeding. If you do not agree with these Terms, do not use our
                Platform.
              </p>
            </div>

            {/* Terms Sections */}
            <div className='space-y-10'>
              {/* Section 1 */}
              <section>
                <h3 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    1
                  </span>
                  Agreement to Terms
                </h3>
                <p className='text-gray-700 leading-relaxed ml-11'>
                  By accessing our Platform or using any services, you agree to
                  abide by these Terms, our Privacy Policy, and any other
                  policies or guidelines provided. If you represent a business,
                  you confirm that you have the authority to bind that entity to
                  these Terms.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h3 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    2
                  </span>
                  Eligibility
                </h3>
                <p className='text-gray-700 leading-relaxed ml-11'>
                  To use Komas500, you must be at least 18 years of age or have
                  obtained parental consent. By using our Platform, you
                  represent and warrant that you meet these eligibility
                  requirements.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h3 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    3
                  </span>
                  Account Registration
                </h3>
                <p className='text-gray-700 leading-relaxed ml-11'>
                  To access certain features, such as buying and selling
                  products, you may be required to register for an account. You
                  agree to provide accurate and current information, maintain
                  the security of your password, and accept responsibility for
                  all activities under your account. Any unauthorized use must
                  be reported immediately to Komas500.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h3 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    4
                  </span>
                  Marketplace Overview
                </h3>
                <p className='text-gray-700 leading-relaxed ml-11'>
                  Komas500 is a marketplace where sellers list products for
                  sale, and buyers purchase products directly from these
                  sellers. Komas500 facilitates the transaction process but is
                  not directly involved in the sale of products listed by
                  sellers. As a marketplace, we provide a platform for sellers
                  and buyers to connect, and each party is responsible for
                  ensuring the fulfillment of their respective obligations.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h3 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    5
                  </span>
                  Buyer and Seller Responsibilities
                </h3>

                <div className='ml-11 space-y-6'>
                  <div className='bg-gray-50 rounded-lg p-6'>
                    <h4 className='text-lg font-semibold  mb-4 text-[#3BB77E]'>
                      Buyer Responsibilities
                    </h4>
                    <ul className='space-y-3 text-gray-700'>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                        <span>
                          <strong>Accuracy:</strong> Review product details,
                          pricing, and other information before purchasing.
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                        <span>
                          <strong>Payments:</strong> Complete payments using
                          authorized methods and agree to follow our refund and
                          return policy.
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                        <span>
                          <strong>Pick-Up and Delivery:</strong> Follow all
                          instructions provided regarding pick-up stations or
                          delivery arrangements.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className='bg-gray-50 rounded-lg p-6'>
                    <h4 className='text-lg font-semibold  mb-4 text-[#3BB77E]'>
                      Seller Responsibilities
                    </h4>
                    <ul className='space-y-3 text-gray-700'>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                        <span>
                          <strong>Listings:</strong> Ensure product listings are
                          accurate, complete, and in compliance with Komas500
                          policies.
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                        <span>
                          <strong>Fulfillment:</strong> Fulfill orders promptly
                          and maintain inventory records to avoid cancellations.
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                        <span>
                          <strong>Compliance:</strong> Adhere to all applicable
                          laws and Komas500's policies.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h3 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    6
                  </span>
                  Orders, Payments, and Fees
                </h3>

                <div className='ml-11 space-y-6'>
                  <p className='text-gray-700 leading-relaxed'>
                    Komas500 supports various payment methods, including
                    credit/debit cards and online payment gateways. By providing
                    payment information, you authorize us to process payments
                    according to the agreed method.
                  </p>

                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='border border-gray-200 rounded-lg p-4'>
                      <h4 className='font-semibold  mb-3 text-[#3BB77E]'>
                        Order Acceptance
                      </h4>
                      <p className='text-gray-700 text-sm'>
                        We reserve the right to refuse or cancel any order for
                        reasons including pricing errors, suspected fraud, or
                        out-of-stock items.
                      </p>
                    </div>
                    <div className='border border-gray-200 rounded-lg p-4'>
                      <h4 className='font-semibold  mb-3 text-[#3BB77E]'>
                        Refunds and Returns
                      </h4>
                      <p className='text-gray-700 text-sm'>
                        Buyers are encouraged to review the refund and return
                        policies of individual sellers before making a purchase.
                      </p>
                    </div>
                  </div>

                  <div className='bg-[#3BB77E]/5 border border-[#3BB77E]/20 rounded-lg p-4'>
                    <h4 className='font-semibold  mb-3 text-[#3BB77E]'>
                      Platform Fees
                    </h4>
                    <p className='text-gray-700 text-sm'>
                      Komas500 may charge fees for certain services, including
                      listing, transaction, and service fees. Any applicable
                      fees will be disclosed in advance.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h3 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    7
                  </span>
                  Delivery and Pick-Up
                </h3>

                <div className='ml-11 space-y-6'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='border-l-4 border-[#3BB77E] pl-4'>
                      <h4 className='font-semibold text-gray-900 mb-3'>
                        Pick-Up Station
                      </h4>
                      <p className='text-gray-700 text-sm'>
                        Komas500 operates pick-up stations across various
                        locations for customer convenience. Orders not picked up
                        within the timeframe may be canceled.
                      </p>
                    </div>
                    <div className='border-l-4 border-[#3BB77E] pl-4'>
                      <h4 className='font-semibold text-gray-900 mb-3'>
                        Delivery Services
                      </h4>
                      <p className='text-gray-700 text-sm'>
                        Komas500 works with independent drivers for delivery
                        services. Delivery timelines may vary based on location
                        and availability.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Remaining sections with consistent styling */}
              {[
                {
                  number: 8,
                  title: 'User-Generated Content',
                  content:
                    'Komas500 allows users to submit reviews, ratings, and other content related to products and services. By posting User Content, you grant Komas500 a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content for any lawful purpose related to the Platform.',
                },
                {
                  number: 9,
                  title: 'Intellectual Property',
                  content:
                    'All content on the Komas500 Platform, including trademarks, logos, and text, is owned by or licensed to Komas500. You may not use our intellectual property without our prior written permission.',
                },
                {
                  number: 10,
                  title: 'Limitation of Liability',
                  content:
                    'To the fullest extent permitted by law, Komas500 shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.',
                },
                {
                  number: 11,
                  title: 'Indemnity',
                  content:
                    'You agree to indemnify and hold Komas500, its directors, employees, and agents harmless from any claim or demand arising out of your use of the Platform, your violation of these Terms, or your infringement of any rights of a third party.',
                },
                {
                  number: 12,
                  title: 'Termination',
                  content:
                    'Komas500 reserves the right to suspend or terminate your account and access to the Platform at any time, for any reason, without notice. Upon termination, any rights granted to you under these Terms will cease immediately.',
                },
                {
                  number: 13,
                  title: 'Governing Law',
                  content:
                    'These Terms shall be governed by and construed in accordance with the laws of Nigeria. Any disputes arising out of or relating to these Terms or the Platform shall be subject to the exclusive jurisdiction of the courts in Nigeria.',
                },
                {
                  number: 14,
                  title: 'Modifications to Terms',
                  content:
                    'We reserve the right to modify these Terms at any time. Changes will be posted on this page, and your continued use of the Platform after changes are posted constitutes acceptance of the updated Terms.',
                },
              ].map((section) => (
                <section key={section.number}>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                      {section.number}
                    </span>
                    {section.title}
                  </h3>
                  <p className='text-gray-700 leading-relaxed ml-11'>
                    {section.content}
                  </p>
                </section>
              ))}

              {/* Contact Section */}
              <section className='bg-[#3BB77E]/5 rounded-lg p-8 border border-[#3BB77E]/20'>
                <h3 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                  <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                    15
                  </span>
                  Contact Information
                </h3>
                <div className='ml-11'>
                  <p className='text-gray-700 mb-4'>
                    For questions or concerns about these Terms, please contact
                    us at:
                  </p>
                  <div className='bg-white rounded-lg p-4 border'>
                    <div className='space-y-2 text-gray-700'>
                      <p className='font-medium'>Komas500 Support Team</p>
                      <p>Email: support@komas500.com</p>
                      <p>Phone: (+234) 8029636616</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
