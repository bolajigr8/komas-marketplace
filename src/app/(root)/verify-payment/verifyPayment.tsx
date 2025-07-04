'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { verifyPayment } from '@/lib/server-actions/payment/paymentService'
import {
  checkoutOrder,
  checkoutShopmateOrder,
} from '@/lib/server-actions/order'
import { useAppDispatch } from '@/redux-store/hooks'
import { deliveryActions } from '@/redux-store/store-slices/DeliverySlice'
import { cartActions } from '@/redux-store/store-slices/CartSlice'

interface StoredOrderData {
  cartProducts: any[]
  deliveryDetails: any
  methodDetails: any
  totalAmount: number
  taxFee: number
  email: string
  session: {
    userId?: string
    userRoleType?: string[]
  }
}

type VerificationStatus = 'verifying' | 'creating-order' | 'success' | 'error'

const VerifyPaymentContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [orderData, setOrderData] = useState<StoredOrderData | null>(null)

  const createOrder = async (
    verifiedRef: string,
    orderData: StoredOrderData
  ) => {
    const isShopmate = orderData.session?.userRoleType?.includes('shopmate')

    const deliveryPlace =
      orderData.deliveryDetails?.deliveryMethod.category === 'pickup'
        ? 'fulfillment_center'
        : 'home'

    const pickupStation =
      orderData.deliveryDetails?.deliveryMethod.pickupLocation?.id ||
      '66f99da3f5ca7c8b1cd82b88'

    const mappedProducts = orderData.cartProducts.map((item) => ({
      productID: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      ...(item.product.length && { length: item.product.length }),
      ...(item.product.width && { breadth: item.product.width }),
      vendorID:
        typeof item.product.vendor === 'object'
          ? item.product.vendor._id
          : item.product.vendor || orderData.session?.userId || '',
    }))

    const deliveryGeo = [
      orderData.deliveryDetails?.deliveryMethod.pickupLocation?.geolocation
        .latitude ?? 0,
      orderData.deliveryDetails?.deliveryMethod.pickupLocation?.geolocation
        .longitude ?? 0,
    ]

    const orderPayload = {
      emailAddress: orderData.email,
      products: mappedProducts,
      paymentRef: { reference: verifiedRef },
      deliveryMethod: orderData.methodDetails?._id ?? '',
      paymentMethod: 'paystack' as const,
      deliveryAddress: {
        addressString:
          orderData.deliveryDetails?.deliveryAddress?.addressString ?? '',
        geoLocation: deliveryGeo,
        postCode: orderData.deliveryDetails?.deliveryAddress?.postCode ?? '',
      },
      deliveryFee: orderData.methodDetails?.fee ?? 0,
      taxFee: orderData.taxFee || 0,
      totalAmount: orderData.totalAmount || 0,
      orderType: 'customer' as const,
      orderNotes: orderData.deliveryDetails?.orderDetails?.orderNote,
      deliveryPlace: deliveryPlace as 'home' | 'fulfillment_center',
      pickupStation,
    }

    try {
      const response = isShopmate
        ? await checkoutShopmateOrder({
            ...orderPayload,
            owner: orderData.deliveryDetails?.orderDetails?.owner?.name ?? '',
          })
        : await checkoutOrder(orderPayload)

      if (response.hasError) {
        throw new Error(response.message || 'Failed to create order')
      }

      // Clear stored data and Redux state
      sessionStorage.removeItem('pendingOrderData')
      dispatch(deliveryActions.clearOrderDetails())
      dispatch(cartActions.clearCart())

      return response
    } catch (error) {
      console.error('Order creation failed:', error)
      throw error
    }
  }

  const handlePaymentVerification = async () => {
    const reference = searchParams.get('reference')

    if (!reference) {
      setErrorMessage('No payment reference found in URL')
      setStatus('error')
      return
    }

    // Get stored order data
    const storedData = sessionStorage.getItem('pendingOrderData')
    if (!storedData) {
      setErrorMessage(
        'Order data not found. Please start the checkout process again.'
      )
      setStatus('error')
      return
    }

    try {
      const parsedOrderData: StoredOrderData = JSON.parse(storedData)
      setOrderData(parsedOrderData)

      // Verify payment
      setStatus('verifying')
      const verificationResponse = await verifyPayment(reference)

      if (
        verificationResponse.hasError ||
        verificationResponse.data.status !== 'success'
      ) {
        throw new Error(
          verificationResponse.message ||
            `Payment verification failed. Status: ${verificationResponse.data.status}`
        )
      }

      // Create order with verified reference
      setStatus('creating-order')
      const orderResponse = await createOrder(reference, parsedOrderData)

      if (!orderResponse.hasError) {
        setStatus('success')
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push('/order-success')
        }, 2000)
      } else {
        throw new Error(orderResponse.message || 'Order creation failed')
      }
    } catch (error) {
      console.error('Payment verification/order creation failed:', error)
      const message = error instanceof Error ? error.message : 'Process failed'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  useEffect(() => {
    handlePaymentVerification()
  }, [])

  const handleRetry = () => {
    setStatus('verifying')
    setErrorMessage('')
    handlePaymentVerification()
  }

  const handleBackToCheckout = () => {
    router.push('/checkout')
  }

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold mb-2'>Verifying Payment</h2>
            <p className='text-gray-600'>
              Please wait while we verify your payment...
            </p>
          </div>
        )

      case 'creating-order':
        return (
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold mb-2'>Creating Your Order</h2>
            <p className='text-gray-600'>
              Payment verified! Creating your order...
            </p>
          </div>
        )

      case 'success':
        return (
          <div className='text-center'>
            <div className='rounded-full h-12 w-12 bg-green-500 flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold mb-2 text-green-600'>
              Order Created Successfully!
            </h2>
            <p className='text-gray-600 mb-4'>
              Your payment has been verified and your order has been created.
              Redirecting to order confirmation...
            </p>
          </div>
        )

      case 'error':
        return (
          <div className='text-center'>
            <div className='rounded-full h-12 w-12 bg-red-500 flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold mb-2 text-red-600'>
              Payment Verification Failed
            </h2>
            <p className='text-gray-600 mb-4'>{errorMessage}</p>
            <div className='flex gap-4 justify-center'>
              <Button onClick={handleRetry} className='bg-blue-500 text-white'>
                Retry Verification
              </Button>
              <Button
                onClick={handleBackToCheckout}
                variant='bordered'
                className='border-gray-300'
              >
                Back to Checkout
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
        {renderContent()}
      </div>
    </div>
  )
}
