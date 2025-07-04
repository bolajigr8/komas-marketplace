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

  // Simplified logging without storing in state
  const addDebugLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage, data || '')
  }

  // Enhanced serialization to handle complex objects
  const sanitizeObject = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return obj
    }

    if (
      typeof obj === 'string' ||
      typeof obj === 'number' ||
      typeof obj === 'boolean'
    ) {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeObject(item))
    }

    if (typeof obj === 'object') {
      // Handle Date objects
      if (obj instanceof Date) {
        return obj.toISOString()
      }

      // Handle plain objects only
      if (obj.constructor === Object || obj.constructor === undefined) {
        const sanitized: any = {}
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            try {
              sanitized[key] = sanitizeObject(obj[key])
            } catch (error) {
              // Skip properties that can't be serialized
              addDebugLog(`Skipping non-serializable property: ${key}`)
            }
          }
        }
        return sanitized
      }

      // For other object types, try to extract plain properties
      try {
        return JSON.parse(JSON.stringify(obj))
      } catch (error) {
        addDebugLog('Failed to serialize object, returning empty object')
        return {}
      }
    }

    return obj
  }

  // Helper function to safely serialize data
  const serializeOrderData = (orderData: StoredOrderData) => {
    try {
      // First sanitize the object to remove non-serializable parts
      const sanitized = sanitizeObject(orderData)
      // Then parse and stringify to ensure it's completely clean
      return JSON.parse(JSON.stringify(sanitized))
    } catch (error) {
      addDebugLog('Serialization error:', error)
      return null
    }
  }

  const createOrder = async (
    verifiedRef: string,
    orderData: StoredOrderData
  ) => {
    addDebugLog('=== STARTING ORDER CREATION ===')
    addDebugLog('Verified Reference:', verifiedRef)

    // Serialize order data to ensure it's clean
    const serializedOrderData = serializeOrderData(orderData)
    if (!serializedOrderData) {
      throw new Error('Failed to serialize order data')
    }

    addDebugLog('Order data serialized successfully')

    const isShopmate =
      serializedOrderData.session?.userRoleType?.includes('shopmate')
    addDebugLog('Is Shopmate Order:', isShopmate)

    const deliveryPlace =
      serializedOrderData.deliveryDetails?.deliveryMethod?.category === 'pickup'
        ? 'fulfillment_center'
        : 'home'
    addDebugLog('Delivery Place Determined:', deliveryPlace)

    const pickupStation =
      serializedOrderData.deliveryDetails?.deliveryMethod?.pickupLocation?.id ||
      '66f99da3f5ca7c8b1cd82b88'
    addDebugLog('Pickup Station:', pickupStation)

    // Clean product mapping with better null/undefined handling
    const mappedProducts =
      serializedOrderData.cartProducts?.map((item: any, index: number) => {
        const product = item?.product || item || {}
        const mappedProduct = {
          productID: String(product._id || product.id || ''),
          quantity: Number(item?.quantity || 1),
          price: Number(product.price || 0),
          ...(product.length && { length: Number(product.length) }),
          ...(product.width && { breadth: Number(product.width) }),
          vendorID: String(
            typeof product.vendor === 'object'
              ? product.vendor?._id || product.vendor?.id || ''
              : product.vendor || serializedOrderData.session?.userId || ''
          ),
        }

        addDebugLog(`Mapped Product ${index + 1}:`, mappedProduct)
        return mappedProduct
      }) || []

    // Clean delivery geo location with validation
    const getDeliveryGeo = (): number[] => {
      const latitude = Number(
        serializedOrderData.deliveryDetails?.deliveryMethod?.pickupLocation
          ?.geolocation?.latitude || 0
      )
      const longitude = Number(
        serializedOrderData.deliveryDetails?.deliveryMethod?.pickupLocation
          ?.geolocation?.longitude || 0
      )

      return [isNaN(latitude) ? 0 : latitude, isNaN(longitude) ? 0 : longitude]
    }

    // Ensure postCode has a proper default value
    const getPostCode = (): string => {
      const postCode =
        serializedOrderData.deliveryDetails?.deliveryAddress?.postCode
      if (!postCode || typeof postCode !== 'string' || postCode.trim() === '') {
        return '00000'
      }
      return postCode.trim()
    }

    // Build clean order payload with proper type conversion
    const orderPayload = {
      emailAddress: String(serializedOrderData.email || ''),
      products: mappedProducts,
      paymentRef: { reference: String(verifiedRef) },
      deliveryMethod: String(
        serializedOrderData.methodDetails?._id ||
          serializedOrderData.methodDetails?.id ||
          ''
      ),
      paymentMethod: 'paystack' as const,
      deliveryAddress: {
        addressString: String(
          serializedOrderData.deliveryDetails?.deliveryAddress?.addressString ||
            ''
        ),
        geoLocation: getDeliveryGeo(),
        postCode: getPostCode(),
      },
      deliveryFee: Number(serializedOrderData.methodDetails?.fee || 0),
      taxFee: Number(serializedOrderData.taxFee || 0),
      totalAmount: Number(serializedOrderData.totalAmount || 0),
      orderType: 'customer' as const,
      orderNotes: String(
        serializedOrderData.deliveryDetails?.orderDetails?.orderNote || ''
      ),
      deliveryPlace: deliveryPlace as 'home' | 'fulfillment_center',
      pickupStation: String(pickupStation),
    }

    addDebugLog('=== FINAL ORDER PAYLOAD ===')

    // Validate required fields
    const requiredFields = {
      emailAddress: !!orderPayload.emailAddress,
      products: orderPayload.products?.length > 0,
      paymentRef: !!orderPayload.paymentRef?.reference,
      deliveryMethod: !!orderPayload.deliveryMethod,
      totalAmount: orderPayload.totalAmount > 0,
    }

    addDebugLog('Required Fields Validation:', requiredFields)

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      addDebugLog('VALIDATION ERROR - Missing Required Fields:', missingFields)
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    try {
      addDebugLog('Attempting to create order...', { isShopmate })

      const response = isShopmate
        ? await checkoutShopmateOrder({
            ...orderPayload,
            owner: String(
              serializedOrderData.deliveryDetails?.orderDetails?.owner?.name ||
                ''
            ),
          })
        : await checkoutOrder(orderPayload)

      addDebugLog('Order creation response received')

      if (response.hasError) {
        addDebugLog('ORDER CREATION ERROR:', response.message)
        throw new Error(response.message || 'Failed to create order')
      }

      addDebugLog('Order Created Successfully')

      // Clear stored data and Redux state
      try {
        sessionStorage.removeItem('pendingOrderData')
        dispatch(deliveryActions.clearOrderDetails())
        dispatch(cartActions.clearCart())
        addDebugLog('Cleared session storage and Redux state')
      } catch (clearError) {
        addDebugLog('Error clearing storage/state:', clearError)
        // Don't throw error for cleanup issues
      }

      return response
    } catch (error) {
      addDebugLog('ORDER CREATION EXCEPTION:', {
        error: error instanceof Error ? error.message : String(error),
      })
      console.error('Order creation failed:', error)
      throw error
    }
  }

  const handlePaymentVerification = async () => {
    addDebugLog('=== STARTING PAYMENT VERIFICATION ===')

    const reference = searchParams.get('reference')
    addDebugLog('Payment Reference from URL:', reference)

    if (!reference) {
      const errorMsg = 'No payment reference found in URL'
      addDebugLog('ERROR:', errorMsg)
      setErrorMessage(errorMsg)
      setStatus('error')
      return
    }

    // Get stored order data
    let storedData: string | null = null
    try {
      storedData = sessionStorage.getItem('pendingOrderData')
    } catch (error) {
      addDebugLog('Error accessing sessionStorage:', error)
    }

    addDebugLog('Raw Stored Data Length:', storedData?.length || 0)

    if (!storedData) {
      const errorMsg =
        'Order data not found. Please start the checkout process again.'
      addDebugLog('ERROR:', errorMsg)
      setErrorMessage(errorMsg)
      setStatus('error')
      return
    }

    try {
      const parsedOrderData: StoredOrderData = JSON.parse(storedData)
      addDebugLog('Order data parsed successfully')
      setOrderData(parsedOrderData)

      // Verify payment
      addDebugLog('Starting payment verification...')
      setStatus('verifying')
      const verificationResponse = await verifyPayment(reference)
      addDebugLog('Payment verification completed')

      if (
        verificationResponse.hasError ||
        verificationResponse.data?.status !== 'success'
      ) {
        const errorMsg =
          verificationResponse.message ||
          `Payment verification failed. Status: ${
            verificationResponse.data?.status || 'unknown'
          }`
        addDebugLog('PAYMENT VERIFICATION FAILED:', errorMsg)
        throw new Error(errorMsg)
      }

      addDebugLog('Payment verification successful, creating order...')

      // Create order with verified reference
      setStatus('creating-order')
      const orderResponse = await createOrder(reference, parsedOrderData)

      if (!orderResponse.hasError) {
        addDebugLog('Order creation completed successfully')
        setStatus('success')
        // Redirect to success page after a short delay
        setTimeout(() => {
          addDebugLog('Redirecting to order success page')
          router.push('/order-success')
        }, 2000)
      } else {
        addDebugLog('Order Response Has Error:', orderResponse.message)
        throw new Error(orderResponse.message || 'Order creation failed')
      }
    } catch (error) {
      addDebugLog('PROCESS EXCEPTION:', {
        error: error instanceof Error ? error.message : String(error),
      })
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
    addDebugLog('User initiated retry')
    setStatus('verifying')
    setErrorMessage('')
    handlePaymentVerification()
  }

  const handleBackToCheckout = () => {
    addDebugLog('User going back to checkout')
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

            <div className='flex gap-4 justify-center mt-4'>
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
      <div className='max-w-2xl w-full bg-white rounded-lg shadow-lg p-8'>
        {renderContent()}
      </div>
    </div>
  )
}

const VerifyPaymentPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      }
    >
      <VerifyPaymentContent />
    </Suspense>
  )
}

export default VerifyPaymentPage
