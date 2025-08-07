import React from 'react'

export const RefundPage: React.FC = () => {
  return (
    <div className='   min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-4xl mx-auto px-6 py-12'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Refund & Return Policy
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              We're committed to ensuring a positive shopping experience for
              both buyers and sellers
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
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='bg-white rounded-lg shadow-sm border'>
          <div className='p-8 md:p-12'>
            {/* Introduction */}
            <div className='mb-12'>
              <div className='flex items-center mb-6'>
                <div className='w-1 h-8 bg-[#3BB77E] rounded-full mr-4'></div>
                <h2 className='text-2xl font-bold text-gray-900'>Overview</h2>
              </div>
              <p className='text-gray-700 leading-relaxed text-lg'>
                This Refund and Return Policy explains the terms and conditions
                for returning products purchased on our Platform. Please read it
                carefully, as certain restrictions may apply based on product
                categories.
              </p>
            </div>

            {/* General Policy Section */}
            <div className='mb-12'>
              <h3 className='text-2xl font-bold text-gray-900 mb-8'>
                General Return Policy
              </h3>

              <div className='grid lg:grid-cols-2 gap-8'>
                <div className='bg-[#3BB77E]/5 rounded-lg p-6 border border-[#3BB77E]/20'>
                  <div className='flex items-center mb-4'>
                    <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                      1
                    </span>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      Return Window
                    </h4>
                  </div>
                  <div className='ml-11'>
                    <p className='text-gray-700 leading-relaxed'>
                      Customers can request a return for most products within{' '}
                      <strong className='text-[#3BB77E]'>14 days</strong>
                      of receiving their order, provided the products are in
                      their original condition and packaging.
                    </p>
                    <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                      <p className='text-sm text-yellow-800'>
                        <strong>Note:</strong> Each seller may have specific
                        terms, so review individual seller policies before
                        purchasing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-6 border'>
                  <div className='flex items-center mb-4'>
                    <span className='bg-[#3BB77E] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3'>
                      2
                    </span>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      Eligible Conditions
                    </h4>
                  </div>
                  <div className='ml-11'>
                    <p className='text-gray-700 mb-4'>
                      For a product to qualify for return and refund:
                    </p>
                    <ul className='space-y-2 text-gray-700'>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>✓</span>
                        <span>
                          Returned within <strong>14 days</strong> from delivery
                          date
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>✓</span>
                        <span>
                          Unused, undamaged, and in original packaging
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-[#3BB77E] mr-3 mt-1'>✓</span>
                        <span>
                          Include proof of purchase (order number or receipt)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Guidelines */}
            <div className='mb-12'>
              <h3 className='text-2xl font-bold text-gray-900 mb-8'>
                Category-Specific Guidelines
              </h3>

              <div className='grid lg:grid-cols-3 gap-6'>
                {/* Fashion */}
                <div className='border border-gray-200 rounded-lg overflow-hidden'>
                  <div className='bg-[#3BB77E] text-white p-4'>
                    <h4 className='font-semibold text-lg'>
                      Fashion & Accessories
                    </h4>
                    <p className='text-sm opacity-90'>
                      Clothing, Footwear & Accessories
                    </p>
                  </div>
                  <div className='p-4'>
                    <ul className='space-y-3 text-sm text-gray-700'>
                      <li className='flex items-start'>
                        <span className='text-green-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Returnable within 14 days</strong> if unworn,
                          unwashed with original tags
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-red-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Exceptions:</strong> Personalized items are
                          non-returnable unless faulty
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-blue-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Inspection:</strong> Items showing wear or
                          damage may not qualify
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Electronics */}
                <div className='border border-gray-200 rounded-lg overflow-hidden'>
                  <div className='bg-[#3BB77E] text-white p-4'>
                    <h4 className='font-semibold text-lg'>
                      Electronics & Gadgets
                    </h4>
                    <p className='text-sm opacity-90'>
                      Mobile phones, Appliances & Accessories
                    </p>
                  </div>
                  <div className='p-4'>
                    <ul className='space-y-3 text-sm text-gray-700'>
                      <li className='flex items-start'>
                        <span className='text-green-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Returnable within 14 days</strong> in original
                          condition and packaging
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-blue-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Warranty:</strong> Manufacturing defects may
                          qualify for replacement
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-red-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Non-returnable:</strong> Modified or tampered
                          items
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Cosmetics */}
                <div className='border border-gray-200 rounded-lg overflow-hidden'>
                  <div className='bg-[#3BB77E] text-white p-4'>
                    <h4 className='font-semibold text-lg'>
                      Beauty & Cosmetics
                    </h4>
                    <p className='text-sm opacity-90'>
                      Makeup, Skincare & Personal Care
                    </p>
                  </div>
                  <div className='p-4'>
                    <ul className='space-y-3 text-sm text-gray-700'>
                      <li className='flex items-start'>
                        <span className='text-red-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Non-returnable once opened</strong> due to
                          health and safety
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-green-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Returnable if sealed</strong> and unopened
                          within 14 days
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='text-blue-500 mr-2 mt-1'>•</span>
                        <span>
                          <strong>Exception:</strong> Damaged, defective, or
                          incorrect items
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Process */}
            <div className='mb-12'>
              <h3 className='text-2xl font-bold text-gray-900 mb-8'>
                Return Process
              </h3>

              <div className='mb-6'>
                <p className='text-gray-700 text-lg'>
                  Follow these simple steps to initiate a return:
                </p>
              </div>

              <div className='grid md:grid-cols-5 gap-4'>
                {[
                  {
                    step: 1,
                    title: 'Contact Support',
                    description:
                      'Reach out to our customer service team with your order details and reason for return.',
                  },
                  {
                    step: 2,
                    title: 'Prepare Item',
                    description:
                      'Pack the product securely in original packaging with all accessories and documentation.',
                  },
                  {
                    step: 3,
                    title: 'Ship Item',
                    description:
                      "We'll provide return address or guide you to nearest Komas500 pick-up station.",
                  },
                  {
                    step: 4,
                    title: 'Inspection',
                    description:
                      'Once received, item will be inspected for return requirements compliance.',
                  },
                  {
                    step: 5,
                    title: 'Refund',
                    description:
                      'Refund processed within 5-10 business days to original payment method or store credit.',
                  },
                ].map((item) => (
                  <div key={item.step} className='text-center'>
                    <div className='bg-[#3BB77E] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4'>
                      {item.step}
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-2'>
                      {item.title}
                    </h4>
                    <p className='text-sm text-gray-600'>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className='grid lg:grid-cols-2 gap-8 mb-12'>
              <div className='space-y-8'>
                <div className='border-l-4 border-[#3BB77E] pl-6'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-3'>
                    Refund Methods
                  </h4>
                  <p className='text-gray-700 text-sm'>
                    Refunds will be issued to the original payment method used
                    during checkout or as store credit to your user virtual
                    wallet, based on customer preference and payment method
                    availability.
                  </p>
                </div>

                <div className='border-l-4 border-[#3BB77E] pl-6'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-3'>
                    Refund Timeframe
                  </h4>
                  <ul className='space-y-2 text-gray-700 text-sm'>
                    <li className='flex items-start'>
                      <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                      <span>
                        <strong>Original Payment Method:</strong> 5-10 business
                        days (depends on bank policies)
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <span className='text-[#3BB77E] mr-3 mt-1'>•</span>
                      <span>
                        <strong>Store Credit:</strong> Available immediately
                        upon return approval
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='space-y-8'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                  <h4 className='text-lg font-semibold text-red-800 mb-3'>
                    Damaged or Defective Items
                  </h4>
                  <p className='text-red-700 text-sm'>
                    If your item arrives damaged or defective, notify Komas500
                    within
                    <strong> 48 hours</strong> of receiving your order. We may
                    request photo evidence to facilitate the return and
                    replacement process.
                  </p>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
                  <h4 className='text-lg font-semibold text-blue-800 mb-3'>
                    Exchange Policy
                  </h4>
                  <p className='text-blue-700 text-sm'>
                    Currently, we do not offer direct exchanges. To exchange an
                    item, please request a return and place a new order for the
                    desired product.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className='bg-[#3BB77E]/5 rounded-lg p-8 border border-[#3BB77E]/20'>
              <div className='flex items-center mb-6'>
                <div className='w-1 h-8 bg-[#3BB77E] rounded-full mr-4'></div>
                <h3 className='text-2xl font-bold text-gray-900'>Need Help?</h3>
              </div>
              <p className='text-gray-700 mb-6'>
                For questions regarding returns or refunds, our support team is
                here to help:
              </p>
              <div className='bg-white rounded-lg p-6 border'>
                <div className='grid md:grid-cols-3 gap-6'>
                  <div className='text-center'>
                    <div className='bg-[#3BB77E]/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3'>
                      <span className='text-[#3BB77E] font-bold'>✉</span>
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      Email Support
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      support@komas500.com
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-[#3BB77E]/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3'>
                      <span className='text-[#3BB77E] font-bold'>📞</span>
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      Phone Support
                    </h4>
                    <p className='text-gray-600 text-sm'>Available soon</p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-[#3BB77E]/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3'>
                      <span className='text-[#3BB77E] font-bold'>🏢</span>
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      Support Team
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Komas500 Customer Care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
