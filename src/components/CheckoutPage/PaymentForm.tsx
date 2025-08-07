'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioProps, Button } from '@nextui-org/react'
import CustomRadio from '../General/CustomRadio'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema } from '@/lib/schemas'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'

type FormData = z.infer<typeof paymentSchema>

type PropsType = {
  shopmateId: string
  vendorId: string
  phoneNumber: string
  address: string
  emailAddress: string
}

const PaymentForm = ({
  shopmateId,
  vendorId,
  phoneNumber,
  address,
  emailAddress,
}: PropsType) => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart.products)
  const deliveryAddresses = useAppSelector(
    (state) => state.delivery.addressList
  )
  const deliveryDetails = useAppSelector(
    (state) => state.delivery.deliveryDetails
  )

  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      user: {
        fullName: user?.fullName || '',
        address: user?.address || '',
        phoneNumber: user?.phoneNumber || '',
      },
      delivery: {
        type: '',
        address: '',
      },
    },
    mode: 'all',
  })

  const watchedValues = form.watch()

  // Helper functions to check missing fields
  const getMissingUserFields = () => {
    const missing = []
    if (!watchedValues.user.fullName) missing.push('Name')
    if (!watchedValues.user.address) missing.push('Address')
    if (!watchedValues.user.phoneNumber) missing.push('Phone number')
    return missing
  }

  const getMissingDeliveryFields = () => {
    const missing = []
    if (!watchedValues.delivery.type) missing.push('Delivery type')
    if (!watchedValues.delivery.address) missing.push('Delivery address')
    return missing
  }

  const isUserInfoComplete = () => {
    return !!(
      watchedValues.user.fullName &&
      watchedValues.user.address &&
      watchedValues.user.phoneNumber
    )
  }

  const isDeliveryInfoComplete = () => {
    return !!(watchedValues.delivery.type && watchedValues.delivery.address)
  }

  useEffect(() => {
    if (user) {
      form.setValue(
        'user',
        {
          fullName: user.fullName || '',
          address: user.address || '',
          phoneNumber: user.phoneNumber || '',
        },
        { shouldValidate: true }
      )
    }
  }, [user, form])

  useEffect(() => {
    if (deliveryDetails) {
      try {
        form.setValue(
          'delivery',
          {
            type: deliveryDetails.deliveryMethod.type,
            address: deliveryDetails.deliveryAddress.addressString,
          },
          {
            shouldValidate: true,
          }
        )
      } catch (error) {
        console.error('Error loading delivery details:', error)
        toast({
          description: 'Failed to load delivery details',
          variant: 'destructive',
        })
      }
    }
  }, [form, toast, deliveryDetails])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      // Check for missing user information
      const missingUserFields = getMissingUserFields()
      const missingDeliveryFields = getMissingDeliveryFields()
      const allMissingFields = [...missingUserFields, ...missingDeliveryFields]

      if (allMissingFields.length > 0) {
        toast({
          title: 'Missing Required Information',
          description: `Please provide: ${allMissingFields.join(', ')}`,
          variant: 'destructive',
        })
        return
      }

      const searchParams = new URLSearchParams({
        shopmateId,
        vendor: vendorId,
        phone: data.user.phoneNumber,
        address: data.user.address,
        email: emailAddress || user?.emailAddress || '',
      })

      router.push(`/checkout/payment?${searchParams.toString()}`)
    } catch (error) {
      console.error('Error during payment processing:', error)
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormComplete = () => {
    return isUserInfoComplete() && isDeliveryInfoComplete()
  }

  const radioClassNames: RadioProps['classNames'] = {
    base: 'w-full max-w-full flex-row justify-start items-start data-[selected=true]:border-transparent hover:bg-gray-50 transition-all',
    label: 'font-semibold -mt-1',
    description: 'flex-1 flex justify-between gap-4 text-black',
    labelWrapper: 'gap-2 flex-1',
  }

  // Dynamic radio class names based on completion status
  const getUserInfoRadioClasses = () => {
    const baseClasses = { ...radioClassNames }
    if (!isUserInfoComplete()) {
      baseClasses.base += ' border-red-200 bg-red-50/30'
    }
    return baseClasses
  }

  const getDeliveryInfoRadioClasses = () => {
    const baseClasses = { ...radioClassNames }
    if (!isDeliveryInfoComplete()) {
      baseClasses.base += ' border-red-200 bg-red-50/30'
    }
    return baseClasses
  }

  return (
    <form
      className='max-w-6xl w-full flex flex-col gap-6 mx-auto p-4 animate-fadeIn'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className='flex flex-col gap-6 bg-white rounded-2xl p-6 shadow-sm'>
        {/* Customer Information Section */}
        <RadioGroup
          value='true'
          color={isUserInfoComplete() ? 'success' : 'danger'}
          aria-label='Customer details'
        >
          <CustomRadio
            value='true'
            description={
              <>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-medium text-sm text-gray-500'>
                      Customer Details
                    </h3>
                    {!isUserInfoComplete() && (
                      <div className='flex items-center gap-1'>
                        <svg
                          className='w-4 h-4 text-red-500'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='text-xs text-red-500 font-medium'>
                          Incomplete
                        </span>
                      </div>
                    )}
                  </div>
                  <div className='text-sm space-y-1'>
                    <p
                      className={
                        watchedValues.user.fullName
                          ? 'text-gray-700'
                          : 'text-red-500 font-medium'
                      }
                    >
                      {watchedValues.user.fullName ||
                        'Name not provided - Required'}
                    </p>
                    <p
                      className={
                        watchedValues.user.address
                          ? 'text-gray-700'
                          : 'text-red-500 font-medium'
                      }
                    >
                      {watchedValues.user.address ||
                        'Address not provided - Required'}
                    </p>
                    <p
                      className={
                        watchedValues.user.phoneNumber
                          ? 'text-gray-700'
                          : 'text-red-500 font-medium'
                      }
                    >
                      {watchedValues.user.phoneNumber ||
                        'Phone number not provided - Required'}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                  <Link
                    href={'/account/profile/edit/me'}
                    className='text-green-500 hover:text-green-600 hover:bg-green-50 font-semibold transition-colors flex-shrink-0 px-3 py-1 rounded-lg text-sm'
                  >
                    Edit
                  </Link>
                </div>
              </>
            }
            classNames={{
              ...getUserInfoRadioClasses(),
              description:
                'flex-1 flex justify-between items-start gap-4 text-black',
            }}
          >
            Customer Information
          </CustomRadio>
        </RadioGroup>

        {/* Delivery Information Section */}
        <RadioGroup
          value='true'
          color={isDeliveryInfoComplete() ? 'success' : 'danger'}
          aria-label='Delivery option'
        >
          <CustomRadio
            value='true'
            description={
              <>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-medium text-sm text-gray-500'>
                      Delivery Details
                    </h3>
                    {!isDeliveryInfoComplete() && (
                      <div className='flex items-center gap-1'>
                        <svg
                          className='w-4 h-4 text-red-500'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='text-xs text-red-500 font-medium'>
                          Incomplete
                        </span>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      watchedValues.delivery.type
                        ? 'text-gray-700'
                        : 'text-red-500 font-medium'
                    }`}
                  >
                    {watchedValues.delivery.type ||
                      'Delivery type not selected - Required'}
                  </p>
                  <div className='text-sm mt-2'>
                    <span className='font-medium text-gray-600'>Address</span>
                    <span className='mx-2'>|</span>
                    <span
                      className={
                        watchedValues.delivery.address
                          ? 'text-gray-700'
                          : 'text-red-500 font-medium'
                      }
                    >
                      {watchedValues.delivery.address ||
                        'Not selected - Required'}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                  <Link
                    href={'/checkout?step=1'}
                    className='text-green-500 hover:text-green-600 hover:bg-green-50 font-semibold transition-colors flex-shrink-0 px-3 py-1 rounded-lg text-sm'
                  >
                    Edit
                  </Link>
                </div>
              </>
            }
            classNames={{
              ...getDeliveryInfoRadioClasses(),
              description:
                'flex-1 flex justify-between items-start gap-4 text-black',
            }}
          >
            Delivery Option
          </CustomRadio>
        </RadioGroup>
      </div>

      <div className='bg-white rounded-2xl p-6 shadow-sm'>
        <h2 className='font-semibold mb-4 text-lg'>Payment Method</h2>
        <RadioGroup
          defaultValue='card'
          color='success'
          aria-label='Payment methods'
          classNames={{
            base: 'gap-4',
          }}
        >
          <CustomRadio
            value='card'
            description='You will be directed to our secure payment gateway'
            classNames={{
              ...radioClassNames,
              base: 'w-full max-w-full flex-row justify-start items-start border border-gray-200 rounded-xl p-4 data-[selected=true]:border-green-500 hover:bg-gray-50 transition-all',
            }}
          >
            Credit/Debit Card | Bank Transfer
          </CustomRadio>
        </RadioGroup>

        <Button
          type='submit'
          size='lg'
          isLoading={isSubmitting}
          isDisabled={!isFormComplete()}
          className={`w-full py-3 mt-6 text-base font-medium transition-colors rounded-xl ${
            isFormComplete()
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to payment'}
        </Button>

        {!isFormComplete() && (
          <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <div className='flex items-start gap-2'>
              <svg
                className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <p className='text-sm font-medium text-red-800'>
                  Please complete all required information before proceeding
                </p>
                <p className='text-xs text-red-600 mt-1'>
                  Missing:{' '}
                  {[
                    ...getMissingUserFields(),
                    ...getMissingDeliveryFields(),
                  ].join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='mt-6 text-sm text-gray-500 flex items-center justify-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path
              fillRule='evenodd'
              d='M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z'
              clipRule='evenodd'
            />
          </svg>
          Secure payment processing
        </div>
      </div>

      <Link
        href='/'
        className='flex items-center gap-2 text-gray-600 hover:text-black transition-colors mt-2 mx-auto'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
          />
        </svg>
        Continue shopping
      </Link>
    </form>
  )
}

export default PaymentForm
