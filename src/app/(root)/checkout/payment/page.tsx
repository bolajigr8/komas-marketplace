import FinalCheckoutForm from '@/components/CheckoutPage/FinalCheckoutForm'
import { getCartProducts } from '@/lib/server-actions/product'
import { CartItem, FetchResult } from '@/lib/types'
import { Metadata } from 'next'
import React from 'react'
import { z } from 'zod'

export const metadata: Metadata = {
  title: 'Payment - Checkout',
  description: 'Confirm payment',
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const schema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  vendor: z.string().optional(),
})

// Safe formatNumber function to avoid toString error
const safeFormatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const Payment = async ({ searchParams }: Props) => {
  const result = schema.safeParse(searchParams)
  const data = result.success ? result.data : {}

  let cartItems: CartItem[] = []
  let subtotal = 0
  let error = null

  try {
    const cart = await getCartProducts()
    console.log('Cart data:', cart)

    if (cart.hasError) {
      error = 'Failed to fetch cart products'
    } else {
      cartItems = data?.vendor
        ? cart.data?.filter((item) =>
            typeof item.product.vendor === 'string'
              ? item.product.vendor === data.vendor
              : item.product.vendor._id === data.vendor
          ) || []
        : cart.data || []

      subtotal = cartItems.reduce(
        (acc, item) =>
          acc +
          (item.product.priceWithMarkup ?? (item.product.price || 0)) *
            (item.quantity || 1),
        0
      )
    }
  } catch (err) {
    error = 'An error occurred while fetching cart data'
    console.error(err)
  }

  // Fixed tax fee
  const taxFee = 100

  console.log('Cart Items:', cartItems)

  if (error) {
    return (
      <div className='p-6 bg-red-50 rounded-lg text-center'>
        <h2 className='text-xl font-semibold text-red-600 mb-2'>Error</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg'
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className='max-w-6xl w-full mx-auto flex flex-col gap-6 mt-[4rem]  p-4 md:p-6'>
      <div className='bg-white rounded-2xl shadow-sm p-6'>
        <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

        <div className='max-h-80 overflow-y-auto mb-4'>
          {cartItems && cartItems.length > 0 ? (
            <div className='space-y-4'>
              {cartItems.map((item, index) => (
                <div key={index} className='flex justify-between py-2 border-b'>
                  <div className='flex-1'>
                    <p className='font-medium'>
                      {item.product.name || 'Product'}
                    </p>
                    <p className='text-sm text-gray-600'>
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <p className='font-medium text-green-500'>
                    <span className='line-through'>N</span>
                    {safeFormatNumber(
                      (item.product.price || 0) * (item.quantity || 1)
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in cart</p>
          )}
        </div>

        <div className='space-y-3 border-t pt-4'>
          <div className='flex justify-between'>
            <p>Subtotal:</p>
            <p>
              <span className='line-through'>N</span>
              {safeFormatNumber(subtotal)}
            </p>
          </div>

          <div className='flex justify-between'>
            <p>Tax:</p>
            <p>
              <span className='line-through'>N</span>
              {safeFormatNumber(taxFee)}
            </p>
          </div>

          <div className='flex justify-between pt-2'>
            <p className='text-sm font-medium'>Total Items:</p>
            <p className='text-sm font-medium'>
              {cartItems?.reduce(
                (acc, item) => acc + (item.quantity || 1),
                0
              ) || 0}
            </p>
          </div>
        </div>
      </div>

      <FinalCheckoutForm
        subtotal={subtotal}
        taxFee={taxFee}
        email={(data?.email as string) || ''}
        phone={(data?.phone as string) || ''}
      />

      <div className='text-center text-sm text-gray-600 space-y-4 mt-4'>
        <p>
          By tapping "PAY NOW" I accept Payment Terms & Conditions, General
          Terms and Conditions, and Privacy and Cookie Notice
        </p>
        <p>
          Please note: Komas500 will never ask you for your password, PIN, CVV
          or full card details over the phone or via email. Need help? Contact
          us
        </p>
      </div>
    </div>
  )
}

export default Payment
