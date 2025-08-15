'use client'

import React, { useEffect, useState } from 'react'
import ConfirmationModal from './ConfirmationModal'
import { Button } from '@nextui-org/react'
import { getDeliveryMethod, applyPromoCode } from '@/lib/server-actions/order'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { ApiDeliveryMethod } from '@/lib/types'
import { initiatePayment } from '@/lib/server-actions/payment/paymentService'
import { toast } from '@/hooks/use-toast'

type Props = {
  email: string
  phone: string
  subtotal: number
  taxFee: number
}

type PaymentStatus = {
  success: boolean
  error: boolean
  processing: boolean
  created: boolean
  initiating: boolean
}

type PromoCodeState = {
  code: string
  isApplied: boolean
  isApplying: boolean
  discountedPrice: number | null
  originalPrice: number | null
}

const safeFormatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0'
  const rounded = Math.round(num) // always round up
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const FinalCheckoutForm = ({
  subtotal = 0,
  taxFee = 0,
  email = '',
  phone = '',
}: Props) => {
  const dispatch = useAppDispatch()
  const deliveryDetails = useAppSelector(
    (state) => state.delivery.deliveryDetails
  )
  const cartProducts = useAppSelector((state) => state.cart.products)
  const { data: session } = useSession()

  const [methodDetails, setMethodDetails] = useState<ApiDeliveryMethod | null>(
    null
  )
  const [loadingMethod, setLoadingMethod] = useState(false)
  const [methodError, setMethodError] = useState(false)
  const [totalAmount, setTotalAmount] = useState(subtotal)
  const [status, setStatus] = useState<PaymentStatus>({
    success: false,
    error: false,
    processing: false,
    created: false,
    initiating: false,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [promoCode, setPromoCode] = useState<PromoCodeState>({
    code: '',
    isApplied: false,
    isApplying: false,
    discountedPrice: null,
    originalPrice: null,
  })

  const mapDeliveryType = (type: string): string => {
    switch (type) {
      case 'express':
        return 'Home Delivery Express'
      case 'batch':
        return 'Home Delivery Batch'
      case 'storePickup':
        return 'Shopmate method'
      case 'fulfillmentCenterPickup':
        return 'Pickup Station'
      default:
        return 'Home Delivery Express'
    }
  }

  const fetchMethods = async () => {
    setLoadingMethod(true)
    setMethodError(false)

    try {
      const res = await getDeliveryMethod()

      if (res.hasError || !res.data) {
        throw new Error(res.message || 'Failed to fetch delivery methods')
      }

      const filtered =
        res.data.find(
          (item) =>
            item.deliveryType ===
            mapDeliveryType(deliveryDetails?.deliveryMethod?.type ?? '')
        ) ?? null

      setMethodDetails(filtered)
      const fee = filtered?.fee ?? 0
      const baseTotal = subtotal + fee + taxFee

      // If promo code is applied, keep the discounted price, otherwise use base total
      if (!promoCode.isApplied) {
        setTotalAmount(baseTotal)
      }
    } catch (error) {
      console.error('Error fetching delivery methods:', error)
      setMethodError(true)
      setErrorMessage('Failed to load delivery options. Please try again.')
    } finally {
      setLoadingMethod(false)
    }
  }

  useEffect(() => {
    fetchMethods()
  }, [subtotal, taxFee])

  const handleApplyPromoCode = async () => {
    if (!promoCode.code.trim()) {
      toast({
        description: 'Please enter a promo code',
        variant: 'destructive',
      })
      return
    }

    const baseTotal = subtotal + (methodDetails?.fee || 0) + taxFee

    setPromoCode((prev) => ({ ...prev, isApplying: true }))

    try {
      const response = await applyPromoCode({
        code: promoCode.code.trim(),
        orderAmount: baseTotal,
      })

      if (response.hasError || !response.data) {
        throw new Error(response.message || 'Invalid promo code')
      }

      const discountedAmount = response.data.orderAmount

      setPromoCode((prev) => ({
        ...prev,
        isApplied: true,
        isApplying: false,
        discountedPrice: discountedAmount ?? null,
        originalPrice: baseTotal,
      }))

      setTotalAmount(discountedAmount ?? 0)
      toast({ description: 'Promo code applied successfully!' })
    } catch (error) {
      console.error('Error applying promo code:', error)
      const message =
        error instanceof Error ? error.message : 'Failed to apply promo code'
      toast({ description: message, variant: 'destructive' })
      setPromoCode((prev) => ({ ...prev, isApplying: false }))
    }
  }

  const handleRemovePromoCode = () => {
    const baseTotal = subtotal + (methodDetails?.fee || 0) + taxFee
    setPromoCode({
      code: '',
      isApplied: false,
      isApplying: false,
      discountedPrice: null,
      originalPrice: null,
    })
    setTotalAmount(baseTotal)
  }

  const handlePayment = async () => {
    if (!email || !email.trim()) {
      setErrorMessage('Email is required for payment')
      setStatus((prev) => ({ ...prev, error: true }))
      return
    }

    if (totalAmount <= 0) {
      setErrorMessage('Invalid payment amount')
      setStatus((prev) => ({ ...prev, error: true }))
      return
    }

    setStatus((prev) => ({ ...prev, initiating: true, error: false }))
    setErrorMessage('')

    try {
      // Round amount to nearest whole number in Naira
      const amountAsInteger = Math.round(totalAmount)

      const paymentData = {
        amount: amountAsInteger.toString(), // Now it's an integer as a string
        email: email.trim(),
        currency: 'NGN' as const,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify-payment/`,
      }

      // console.log('Payment Data:', paymentData)
      // console.log('redirect url:', process.env.NEXT_PUBLIC_APP_URL)

      const response = await initiatePayment(paymentData)

      if (response.hasError || !response.data.authorization_url) {
        throw new Error(response.message || 'Failed to initiate payment')
      }

      // Calculate original total amount (before promo code)
      const originalTotalAmount = subtotal + (methodDetails?.fee || 0) + taxFee

      // Store order data in sessionStorage before redirecting
      const orderData = {
        cartProducts,
        deliveryDetails,
        methodDetails,
        totalAmount: originalTotalAmount, // Original price before promo code
        taxFee,
        email,
        session: {
          userId: session?.user?._id,
          userRoleType: session?.user?.userRoleType,
        },
        // Include promo code data if applied
        discountedPrice: promoCode.isApplied ? promoCode.discountedPrice : null,
        promoCode: promoCode.isApplied ? promoCode.code : null,
      }

      sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData))

      // Redirect to Paystack
      window.location.href = response.data.authorization_url
    } catch (error) {
      console.error('Payment initiation failed:', error)
      const message =
        error instanceof Error ? error.message : 'Payment initiation failed'
      setErrorMessage(message)
      setStatus({
        success: false,
        error: true,
        processing: false,
        created: false,
        initiating: false,
      })
    }
  }

  const handleRetryPayment = () => {
    setStatus({
      success: false,
      error: false,
      processing: false,
      created: false,
      initiating: false,
    })
    setErrorMessage('')
  }

  if (methodError) {
    return (
      <div className='flex flex-col gap-4 p-6 bg-red-50 rounded-xl'>
        <p className='text-red-600 font-medium'>
          Failed to load delivery options
        </p>
        <Button
          onPress={fetchMethods}
          className='bg-red-500 text-white'
          disabled={loadingMethod}
          isLoading={loadingMethod}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        {/* Promo Code Section */}
        <div className='flex flex-col gap-4 p-6 pt-4 rounded-2xl shadow-sm bg-white'>
          <p className='font-medium text-sm md:text-base'>Promo Code</p>

          {!promoCode.isApplied ? (
            <div className='flex gap-2'>
              <input
                type='text'
                value={promoCode.code}
                onChange={(e) =>
                  setPromoCode((prev) => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder='Enter promo code'
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                disabled={promoCode.isApplying}
              />
              <Button
                onPress={handleApplyPromoCode}
                disabled={promoCode.isApplying || !promoCode.code.trim()}
                isLoading={promoCode.isApplying}
                className='bg-green-500 text-white px-4 py-2 text-sm'
              >
                Apply
              </Button>
            </div>
          ) : (
            <div className='flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3'>
              <div className='flex items-center gap-2'>
                <span className='text-green-600 font-medium text-sm'>
                  Code: {promoCode.code}
                </span>
                <span className='text-green-600 text-sm'>✓ Applied</span>
              </div>
              <Button
                onPress={handleRemovePromoCode}
                size='sm'
                variant='light'
                className='text-red-500 text-sm'
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Payment Details Section */}
        <div className='flex flex-col gap-4 p-6 pt-4 rounded-2xl shadow-sm bg-white'>
          <p className='font-medium text-sm md:text-base'>Payment Details</p>

          <div className='flex flex-col gap-1'>
            <div className='flex justify-between'>
              <p className='text-sm'>Subtotal</p>
              <p className='text-sm font-medium'>
                ₦{safeFormatNumber(subtotal)}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-sm'>Delivery Fee</p>
              <p className='text-sm font-medium'>
                ₦{safeFormatNumber(methodDetails?.fee || 0)}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-sm'>Service Fee</p>
              <p className='text-sm font-medium'>₦{safeFormatNumber(taxFee)}</p>
            </div>

            {promoCode.isApplied && (
              <>
                <div className='flex justify-between'>
                  <p className='text-sm'>Original Total</p>
                  <p className='text-sm font-medium line-through text-gray-500'>
                    ₦{safeFormatNumber(promoCode.originalPrice || 0)}
                  </p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-sm text-green-600'>Promo Discount</p>
                  <p className='text-sm font-medium text-green-600'>
                    -₦
                    {safeFormatNumber(
                      (promoCode.originalPrice || 0) -
                        (promoCode.discountedPrice || 0)
                    )}
                  </p>
                </div>
              </>
            )}

            <div className='flex justify-between pt-3 border-t mt-2'>
              <p className='text-xl md:text-2xl font-semibold'>Total Amount</p>
              <p className='text-xl md:text-2xl font-semibold text-green-500'>
                ₦{safeFormatNumber(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {(status.error || errorMessage) && (
          <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
            <p className='text-red-600 text-sm mb-2'>
              {errorMessage || 'An error occurred'}
            </p>
            <Button
              size='sm'
              onPress={handleRetryPayment}
              className='bg-red-500 text-white'
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      <Button
        disabled={
          status.processing ||
          status.initiating ||
          loadingMethod ||
          !methodDetails
        }
        isLoading={status.processing || status.initiating || loadingMethod}
        size='lg'
        className='h-full text-xl font-medium bg-green-500 text-white p-4 rounded-xl mx-8 md:mx-20'
        onPress={handlePayment}
      >
        {status.initiating
          ? 'Initiating Payment...'
          : status.processing
          ? 'Processing...'
          : `Pay Now ₦${safeFormatNumber(totalAmount)}`}
      </Button>

      {status.success && status.created && (
        <ConfirmationModal
          status={status}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  )
}

export default FinalCheckoutForm
