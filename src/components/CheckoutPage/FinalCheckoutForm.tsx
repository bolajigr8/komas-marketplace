// 'use client'

// import React, { useEffect, useMemo, useState } from 'react'
// import ConfirmationModal from './ConfirmationModal'
// import { usePaystackPayment } from 'react-paystack'
// import { PaystackProps } from 'react-paystack/dist/types'
// import { formatNumber } from '@/lib/utils'
// import { Button } from '@nextui-org/react'
// import {
//   checkoutOrder,
//   checkoutShopmateOrder,
//   getDeliveryMethod,
// } from '@/lib/server-actions/order'
// import { useSession } from 'next-auth/react'
// import { generatePaystackRef } from '@/lib/utils/paystackUtils'
// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { ApiDeliveryMethod, CartItem } from '@/lib/types'
// import { deliveryActions } from '@/redux-store/store-slices/DeliverySlice'
// import Retry from './Retry'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'

// type Props = {
//   email: string
//   phone: string
//   subtotal: number
//   taxFee: number
// }

// type SuccessData = {
//   message: string
//   reference: string
//   status: 'success' | 'failure'
//   trans: string
//   transaction: string
//   trxref: string
// }

// const safeFormatNumber = (num: number | undefined | null): string => {
//   if (num === undefined || num === null) return '0'
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
// }

// const FinalCheckoutForm = ({
//   subtotal = 0,
//   taxFee = 0,
//   email = '',
//   phone = '',
// }: Props) => {
//   const dispatch = useAppDispatch()
//   const deliveryDetails = useAppSelector(
//     (state) => state.delivery.deliveryDetails
//   )
//   const cartProducts = useAppSelector((state) => state.cart.products)
//   const { data: session } = useSession()
//   const paymentRef = generatePaystackRef(session?.user?.id || 'guest')

//   const [methodDetails, setMethodDetails] = useState<ApiDeliveryMethod | null>(
//     null
//   )

//   const [loadingMethod, setLoadingMethod] = useState(false)
//   const [methodError, setMethodError] = useState(false)
//   // const [totalAmount, setTotalAmount] = useState(subtotal + taxFee)
//   const [totalAmount, setTotalAmount] = useState(subtotal)
//   const [status, setStatus] = useState({
//     success: false,
//     error: false,
//     processing: false,
//     created: false,
//   })
//   const [isOpen, setIsOpen] = useState(false)

//   const mapDeliveryType = (type: string): string => {
//     switch (type) {
//       case 'express':
//         return 'Home Delivery Express'
//       case 'batch':
//         return 'Home Delivery Batch'
//       case 'storePickup':
//         return 'Shopmate method'
//       case 'fulfillmentCenterPickup':
//         return 'Pickup Station'
//       default:
//         return 'Home Delivery Express'
//     }
//   }

//   const fetchMethods = async () => {
//     setLoadingMethod(true)
//     try {
//       const res = await getDeliveryMethod()
//       const filtered =
//         res.data?.find(
//           (item) =>
//             item.deliveryType ===
//             mapDeliveryType(deliveryDetails?.deliveryMethod?.type ?? '')
//         ) ?? null

//       setMethodDetails(filtered)
//       const fee = filtered?.fee ?? 0
//       // setTotalAmount(subtotal + taxFee + fee)
//       setTotalAmount(subtotal)
//     } catch (error) {
//       setMethodError(true)
//     } finally {
//       setLoadingMethod(false)
//     }
//   }

//   useEffect(() => {
//     fetchMethods()
//   }, [])

//   //delivery place based on category
//   const deliveryPlace =
//     deliveryDetails?.deliveryMethod.category === 'pickup'
//       ? 'fulfillment_center'
//       : 'home'

//   // Get pickup station ID
//   const pickupStation =
//     deliveryDetails?.deliveryMethod.pickupLocation?.id ||
//     '66f99da3f5ca7c8b1cd82b88'

//   // Testing email and phone props when component initializes
//   useEffect(() => {
//     console.log('FinalCheckoutForm initialized with:')
//     console.log('Email prop:', email)
//     console.log('Phone prop:', phone)
//     console.log('Subtotal:', subtotal)
//     console.log('Tax Fee:', taxFee)
//     console.log('cartProducts:', cartProducts)
//     console.log('deliveryPlace:', deliveryPlace)
//     console.log('pickupStation:', pickupStation)
//     console.log('delivery details:', deliveryDetails)
//   }, [])

//   //  included vendorID
//   const mappedProducts = cartProducts.map((item) => ({
//     productID: item.product._id,
//     quantity: item.quantity,
//     price: item.product.price,
//     ...(item.product.length && { length: item.product.length }),
//     ...(item.product.width && { breadth: item.product.width }),
//     vendorID:
//       typeof item.product.vendor === 'object'
//         ? item.product.vendor._id
//         : item.product.vendor || session?.user?._id || '',
//   }))

//   const config: PaystackProps = useMemo(() => {
//     const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
//     if (!publicKey) {
//       console.warn('Paystack public key is missing')
//     }

//     console.log('Creating Paystack config with email:', email)

//     const paystackConfig = {
//       reference: paymentRef,
//       email,
//       phone,
//       amount: (totalAmount || 0) * 100,
//       currency: 'NGN',
//       publicKey,
//       metadata: {
//         custom_fields: [
//           {
//             display_name: 'Customer ID',
//             value: session?.user?._id || 'guest',
//             variable_name: 'customer_id',
//           },
//           {
//             display_name: 'Email',
//             value: email || 'customer@example.com',
//             variable_name: 'email',
//           },
//           {
//             display_name: 'Phone Number',
//             value: phone || '00000000000',
//             variable_name: 'phone_number',
//           },
//         ],
//       },
//     }

//     console.log('Paystack config:', JSON.stringify(paystackConfig, null, 2))
//     return paystackConfig
//   }, [paymentRef, email, phone, totalAmount, session?.user?._id])

//   const initializePayment = usePaystackPayment(config)

//   const createOrder = async (verifiedRef: string) => {
//     const isShopmate = session?.user?.userRoleType?.includes('shopmate')

//     console.log('Creating order...')
//     console.log('Is Shopmate:', isShopmate)
//     console.log('Verified Ref:', verifiedRef)
//     console.log('Email being used:', email)
//     console.log('deliveryPlace:', deliveryPlace)
//     console.log('pickupStation:', pickupStation)

//     if (!email) {
//       console.error('ERROR: Email is empty or undefined!')
//     }

//     const deliveryGeo = [
//       deliveryDetails?.deliveryMethod.pickupLocation?.geolocation.latitude ?? 0,
//       deliveryDetails?.deliveryMethod.pickupLocation?.geolocation.longitude ??
//         0,
//     ]

//     const orderData = {
//       emailAddress: email,
//       products: mappedProducts,
//       paymentRef: { reference: verifiedRef },
//       deliveryMethod: methodDetails?._id ?? '',
//       paymentMethod: 'paystack' as 'paystack',
//       deliveryAddress: {
//         addressString: deliveryDetails?.deliveryAddress?.addressString ?? '',
//         geoLocation: deliveryGeo,
//         postCode: deliveryDetails?.deliveryAddress?.postCode ?? '',
//       },
//       deliveryFee: methodDetails?.fee ?? 0,
//       taxFee: taxFee || 0,
//       totalAmount: totalAmount || 0,
//       orderType: 'customer' as 'Testing' | 'shopmate' | 'customer',
//       orderNotes: deliveryDetails?.orderDetails?.orderNote,
//       deliveryPlace,
//       pickupStation: '66f99da3f5ca7c8b1cd82b88',
//     }

//     console.log('Complete order data:', JSON.stringify(orderData, null, 2))

//     try {
//       const response = isShopmate
//         ? await checkoutShopmateOrder({
//             ...orderData,
//             deliveryPlace,
//             pickupStation,
//             owner: deliveryDetails?.orderDetails?.owner?.name ?? '',
//           })
//         : await checkoutOrder({
//             ...orderData,
//             orderType: 'customer',
//             deliveryPlace,
//             pickupStation,
//           })

//       console.log('Order API response:', JSON.stringify(response, null, 2))

//       if (response.hasError) {
//         console.error('API returned error:', response.message)
//       }

//       dispatch(deliveryActions.clearOrderDetails())
//       // dispatch(cartActions.clearCart())

//       return response
//     } catch (error) {
//       console.error('Exception during order creation:', error)
//       throw error
//     }
//   }

//   const onSuccess = async (data: SuccessData) => {
//     console.log('Paystack payment successful:', JSON.stringify(data, null, 2))
//     console.log('User email:', email)
//     console.log('User phone:', phone)
//     console.log('deliveryPlace:', deliveryPlace)
//     console.log('pickupStation:', pickupStation)

//     setStatus({
//       success: false,
//       error: false,
//       processing: true,
//       created: false,
//     })

//     const wait = () =>
//       new Promise<boolean>((resolve) => {
//         setTimeout(() => {
//           resolve(data.status === 'success')
//         }, 3000)
//       })

//     const result = await wait()

//     if (result) {
//       try {
//         const verifiedRef = data.reference
//         console.log('⏳ Processing payment with reference:', verifiedRef)
//         const response = await createOrder(verifiedRef)

//         if (!response.hasError) {
//           console.log('Order created successfully!')
//           setStatus({
//             success: true,
//             error: false,
//             processing: false,
//             created: true,
//           })
//           setIsOpen(true)
//         } else {
//           console.error(
//             'Order creation failed with API error:',
//             response.message
//           )
//           setStatus({
//             success: true,
//             error: true,
//             processing: false,
//             created: false,
//           })
//         }
//       } catch (err) {
//         console.error('Exception during order creation process:', err)
//         setStatus({
//           success: true,
//           error: true,
//           processing: false,
//           created: false,
//         })
//       }
//     } else {
//       console.error('Payment verification failed')
//       setStatus({
//         success: false,
//         error: true,
//         processing: false,
//         created: false,
//       })
//     }
//   }

//   const onClose = () => {
//     console.log('Payment modal closed.')
//   }

//   // logging to component props
//   const handlePayment = () => {
//     console.log('Starting payment process')
//     console.log('With email:', email)
//     console.log('With phone:', phone)
//     console.log('Total amount:', totalAmount)
//     console.log('deliveryPlace:', deliveryPlace)
//     console.log('pickupStation:', pickupStation)

//     if (!email) {
//       console.error('WARNING: Attempting payment with empty email!')
//     }

//     initializePayment({
//       onSuccess,
//       onClose: () => {
//         console.log('Payment modal closed')
//         onClose()
//       },
//     })
//   }

//   return (
//     <>
//       <div className='flex flex-col gap-4'>
//         <div className='flex flex-col gap-4 p-6 pt-4 rounded-2xl shadow-sm bg-white'>
//           <p className='font-medium text-sm md:text-base'>Payment Details</p>

//           <div className='flex flex-col gap-1'>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Subtotal</p>
//               <p className='text-sm font-medium'>
//                 ₦{safeFormatNumber(subtotal)}
//               </p>
//             </div>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Delivery Fee</p>
//               <p className='text-sm font-medium'>
//                 ₦{safeFormatNumber(methodDetails?.fee)}
//               </p>
//             </div>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Tax</p>
//               <p className='text-sm font-medium'>₦{safeFormatNumber(taxFee)}</p>
//             </div>
//             <div className='flex justify-between pt-3 border-t mt-2'>
//               <p className='text-xl md:text-2xl font-semibold'>Total Amount</p>
//               <p className='text-xl md:text-2xl font-semibold text-green-500'>
//                 ₦{safeFormatNumber(totalAmount)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Button
//         disabled={status.processing}
//         isLoading={status.processing}
//         size='lg'
//         className='h-full text-xl font-medium bg-green-500 text-white p-4 rounded-xl mx-8 md:mx-20'
//         onPress={handlePayment}
//       >
//         {status.processing
//           ? 'Processing...'
//           : `Pay Now ₦${safeFormatNumber(totalAmount)}`}
//       </Button>

//       {status.success && status.created && (
//         <ConfirmationModal
//           status={status}
//           isOpen={isOpen}
//           onOpenChange={setIsOpen}
//         />
//       )}
//       {status.success && !status.created && (
//         <Retry
//           status={status}
//           isOpen={isOpen}
//           onOpenChange={setIsOpen}
//           onClick={() => {
//             // Use the last paymentRef or a fallback
//             createOrder(paymentRef)
//           }}
//         />
//       )}
//     </>
//   )
// }

// export default FinalCheckoutForm

// components/CheckoutPage/FinalCheckoutForm.tsx

// 'use client'

// import React, { useEffect, useState } from 'react'
// import ConfirmationModal from './ConfirmationModal'
// import { formatNumber } from '@/lib/utils'
// import { Button } from '@nextui-org/react'
// import {
//   checkoutOrder,
//   checkoutShopmateOrder,
//   getDeliveryMethod,
// } from '@/lib/server-actions/order'
// import { useSession } from 'next-auth/react'
// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { ApiDeliveryMethod } from '@/lib/types'
// import { deliveryActions } from '@/redux-store/store-slices/DeliverySlice'
// import Retry from './Retry'
// import { initiatePayment } from '@/lib/server-actions/payment/paymentService'

// type Props = {
//   email: string
//   phone: string
//   subtotal: number
//   taxFee: number
// }

// type PaymentStatus = {
//   success: boolean
//   error: boolean
//   processing: boolean
//   created: boolean
//   initiating: boolean
// }

// const safeFormatNumber = (num: number | undefined | null): string => {
//   if (num === undefined || num === null) return '0'
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
// }

// const FinalCheckoutForm = ({
//   subtotal = 0,
//   taxFee = 0,
//   email = '',
//   phone = '',
// }: Props) => {
//   const dispatch = useAppDispatch()
//   const deliveryDetails = useAppSelector(
//     (state) => state.delivery.deliveryDetails
//   )
//   const cartProducts = useAppSelector((state) => state.cart.products)
//   const { data: session } = useSession()

//   const [methodDetails, setMethodDetails] = useState<ApiDeliveryMethod | null>(
//     null
//   )
//   const [loadingMethod, setLoadingMethod] = useState(false)
//   const [methodError, setMethodError] = useState(false)
//   const [totalAmount, setTotalAmount] = useState(subtotal)
//   const [status, setStatus] = useState<PaymentStatus>({
//     success: false,
//     error: false,
//     processing: false,
//     created: false,
//     initiating: false,
//   })
//   const [isOpen, setIsOpen] = useState(false)
//   // payment Reference
//   const [paymentReference, setPaymentReference] = useState<string>('')

//   const mapDeliveryType = (type: string): string => {
//     switch (type) {
//       case 'express':
//         return 'Home Delivery Express'
//       case 'batch':
//         return 'Home Delivery Batch'
//       case 'storePickup':
//         return 'Shopmate method'
//       case 'fulfillmentCenterPickup':
//         return 'Pickup Station'
//       default:
//         return 'Home Delivery Express'
//     }
//   }

//   // delivery Method

//   const fetchMethods = async () => {
//     setLoadingMethod(true)
//     try {
//       const res = await getDeliveryMethod()
//       const filtered =
//         res.data?.find(
//           (item) =>
//             item.deliveryType ===
//             mapDeliveryType(deliveryDetails?.deliveryMethod?.type ?? '')
//         ) ?? null

//       setMethodDetails(filtered)
//       const fee = filtered?.fee ?? 0
//       setTotalAmount(subtotal + fee) // Include delivery fee in total
//     } catch (error) {
//       setMethodError(true)
//     } finally {
//       setLoadingMethod(false)
//     }
//   }

//   useEffect(() => {
//     fetchMethods()
//   }, [])

//   // Delivery place based on category
//   const deliveryPlace =
//     deliveryDetails?.deliveryMethod.category === 'pickup'
//       ? 'fulfillment_center'
//       : 'home'

//   // Get pickup station ID
//   const pickupStation =
//     deliveryDetails?.deliveryMethod.pickupLocation?.id ||
//     '66f99da3f5ca7c8b1cd82b88'

//   // Map products with vendor ID
//   const mappedProducts = cartProducts.map((item) => ({
//     productID: item.product._id,
//     quantity: item.quantity,
//     price: item.product.price,
//     ...(item.product.length && { length: item.product.length }),
//     ...(item.product.width && { breadth: item.product.width }),
//     vendorID:
//       typeof item.product.vendor === 'object'
//         ? item.product.vendor._id
//         : item.product.vendor || session?.user?._id || '',
//   }))

//   const createOrder = async (verifiedRef: string) => {
//     const isShopmate = session?.user?.userRoleType?.includes('shopmate')

//     console.log('Creating order with reference:', verifiedRef)

//     if (!email) {
//       console.error('ERROR: Email is empty or undefined!')
//       throw new Error('Email is required for order creation')
//     }

//     const deliveryGeo = [
//       deliveryDetails?.deliveryMethod.pickupLocation?.geolocation.latitude ?? 0,
//       deliveryDetails?.deliveryMethod.pickupLocation?.geolocation.longitude ??
//         0,
//     ]

//     const orderData = {
//       emailAddress: email,
//       products: mappedProducts,
//       paymentRef: { reference: verifiedRef },
//       deliveryMethod: methodDetails?._id ?? '',
//       paymentMethod: 'paystack' as 'paystack',
//       deliveryAddress: {
//         addressString: deliveryDetails?.deliveryAddress?.addressString ?? '',
//         geoLocation: deliveryGeo,
//         postCode: deliveryDetails?.deliveryAddress?.postCode ?? '',
//       },
//       deliveryFee: methodDetails?.fee ?? 0,
//       taxFee: taxFee || 0,
//       totalAmount: totalAmount || 0,
//       orderType: 'customer' as 'Testing' | 'shopmate' | 'customer',
//       orderNotes: deliveryDetails?.orderDetails?.orderNote,
//       deliveryPlace,
//       pickupStation: '66f99da3f5ca7c8b1cd82b88',
//     }

//     console.log('Complete order data:', JSON.stringify(orderData, null, 2))

//     try {
//       const response = isShopmate
//         ? await checkoutShopmateOrder({
//             ...orderData,
//             deliveryPlace,
//             pickupStation,
//             owner: deliveryDetails?.orderDetails?.owner?.name ?? '',
//           })
//         : await checkoutOrder({
//             ...orderData,
//             orderType: 'customer',
//             deliveryPlace,
//             pickupStation,
//           })

//       console.log('Order API response:', JSON.stringify(response, null, 2))

//       if (response.hasError) {
//         console.error('API returned error:', response.message)
//         throw new Error(response.message)
//       }

//       dispatch(deliveryActions.clearOrderDetails())
//       return response
//     } catch (error) {
//       console.error('Exception during order creation:', error)
//       throw error
//     }
//   }

//   const handlePayment = async () => {
//     if (!email) {
//       console.error('WARNING: Email is required for payment!')
//       return
//     }

//     setStatus((prev) => ({ ...prev, initiating: true }))

//     try {
//       // Step 1: Initiate payment with backend
//       const paymentData = {
//         amount: totalAmount.toString(),
//         email: email,
//         currency: 'NGN' as const,
//       }

//       console.log('Initiating payment with:', paymentData)
//       const response = await initiatePayment(paymentData)

//       if (response.hasError) {
//         throw new Error(response.message)
//       }

//       // Step 2: Store reference for later use
//       setPaymentReference(response.data.reference)

//       // Step 3: Redirect to Paystack checkout
//       window.location.href = response.data.authorization_url
//     } catch (error) {
//       console.error('Payment initiation failed:', error)
//       setStatus({
//         success: false,
//         error: true,
//         processing: false,
//         created: false,
//         initiating: false,
//       })
//     }
//   }

//   const handleRetryOrder = async () => {
//     if (!paymentReference) {
//       console.error('No payment reference available for retry')
//       return
//     }

//     setStatus((prev) => ({ ...prev, processing: true, error: false }))

//     try {
//       const response = await createOrder(paymentReference)

//       if (!response.hasError) {
//         setStatus({
//           success: true,
//           error: false,
//           processing: false,
//           created: true,
//           initiating: false,
//         })
//         setIsOpen(true)
//       } else {
//         throw new Error(response.message)
//       }
//     } catch (error) {
//       console.error('Order creation retry failed:', error)
//       setStatus((prev) => ({ ...prev, processing: false, error: true }))
//     }
//   }

//   return (
//     <>
//       <div className='flex flex-col gap-4'>
//         <div className='flex flex-col gap-4 p-6 pt-4 rounded-2xl shadow-sm bg-white'>
//           <p className='font-medium text-sm md:text-base'>Payment Details</p>

//           <div className='flex flex-col gap-1'>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Subtotal</p>
//               <p className='text-sm font-medium'>
//                 ₦{safeFormatNumber(subtotal)}
//               </p>
//             </div>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Delivery Fee</p>
//               <p className='text-sm font-medium'>
//                 ₦{safeFormatNumber(methodDetails?.fee)}
//               </p>
//             </div>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Tax</p>
//               <p className='text-sm font-medium'>₦{safeFormatNumber(taxFee)}</p>
//             </div>
//             <div className='flex justify-between pt-3 border-t mt-2'>
//               <p className='text-xl md:text-2xl font-semibold'>Total Amount</p>
//               <p className='text-xl md:text-2xl font-semibold text-green-500'>
//                 ₦{safeFormatNumber(totalAmount)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Button
//         disabled={status.processing || status.initiating || loadingMethod}
//         isLoading={status.processing || status.initiating}
//         size='lg'
//         className='h-full text-xl font-medium bg-green-500 text-white p-4 rounded-xl mx-8 md:mx-20'
//         onPress={handlePayment}
//       >
//         {status.initiating
//           ? 'Initiating Payment...'
//           : status.processing
//           ? 'Processing...'
//           : `Pay Now ₦${safeFormatNumber(totalAmount)}`}
//       </Button>

//       {status.success && status.created && (
//         <ConfirmationModal
//           status={status}
//           isOpen={isOpen}
//           onOpenChange={setIsOpen}
//         />
//       )}

//       {status.success && !status.created && (
//         <Retry
//           status={status}
//           isOpen={isOpen}
//           onOpenChange={setIsOpen}
//           onClick={handleRetryOrder}
//         />
//       )}
//     </>
//   )
// }

// export default FinalCheckoutForm

// 'use client'

// import React, { useEffect, useState } from 'react'
// import ConfirmationModal from './ConfirmationModal'
// import { formatNumber } from '@/lib/utils'
// import { Button } from '@nextui-org/react'
// import {
//   checkoutOrder,
//   checkoutShopmateOrder,
//   getDeliveryMethod,
// } from '@/lib/server-actions/order'
// import { useSession } from 'next-auth/react'
// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { ApiDeliveryMethod } from '@/lib/types'
// import { deliveryActions } from '@/redux-store/store-slices/DeliverySlice'
// import Retry from './Retry'
// import { initiatePayment } from '@/lib/server-actions/payment/paymentService'

// type Props = {
//   email: string
//   phone: string
//   subtotal: number
//   taxFee: number
// }

// type PaymentStatus = {
//   success: boolean
//   error: boolean
//   processing: boolean
//   created: boolean
//   initiating: boolean
// }

// const safeFormatNumber = (num: number | undefined | null): string => {
//   if (num === undefined || num === null) return '0'
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
// }

// const FinalCheckoutForm = ({
//   subtotal = 0,
//   taxFee = 0,
//   email = '',
//   phone = '',
// }: Props) => {
//   const dispatch = useAppDispatch()
//   const deliveryDetails = useAppSelector(
//     (state) => state.delivery.deliveryDetails
//   )
//   const cartProducts = useAppSelector((state) => state.cart.products)
//   const { data: session } = useSession()

//   const [methodDetails, setMethodDetails] = useState<ApiDeliveryMethod | null>(
//     null
//   )
//   const [loadingMethod, setLoadingMethod] = useState(false)
//   const [methodError, setMethodError] = useState(false)
//   const [totalAmount, setTotalAmount] = useState(subtotal)
//   const [status, setStatus] = useState<PaymentStatus>({
//     success: false,
//     error: false,
//     processing: false,
//     created: false,
//     initiating: false,
//   })
//   const [isOpen, setIsOpen] = useState(false)
//   const [paymentReference, setPaymentReference] = useState<string>('')
//   const [errorMessage, setErrorMessage] = useState<string>('')

//   const mapDeliveryType = (type: string): string => {
//     switch (type) {
//       case 'express':
//         return 'Home Delivery Express'
//       case 'batch':
//         return 'Home Delivery Batch'
//       case 'storePickup':
//         return 'Shopmate method'
//       case 'fulfillmentCenterPickup':
//         return 'Pickup Station'
//       default:
//         return 'Home Delivery Express'
//     }
//   }

//   const fetchMethods = async () => {
//     setLoadingMethod(true)
//     setMethodError(false)

//     try {
//       const res = await getDeliveryMethod()

//       if (res.hasError || !res.data) {
//         throw new Error(res.message || 'Failed to fetch delivery methods')
//       }

//       const filtered =
//         res.data.find(
//           (item) =>
//             item.deliveryType ===
//             mapDeliveryType(deliveryDetails?.deliveryMethod?.type ?? '')
//         ) ?? null

//       setMethodDetails(filtered)
//       const fee = filtered?.fee ?? 0
//       setTotalAmount(subtotal + fee + taxFee)
//     } catch (error) {
//       console.error('Error fetching delivery methods:', error)
//       setMethodError(true)
//       setErrorMessage('Failed to load delivery options. Please try again.')
//     } finally {
//       setLoadingMethod(false)
//     }
//   }

//   useEffect(() => {
//     fetchMethods()
//   }, [subtotal, taxFee])

//   const createOrder = async (verifiedRef: string) => {
//     const isShopmate = session?.user?.userRoleType?.includes('shopmate')

//     if (!email || !email.trim()) {
//       throw new Error('Email is required for order creation')
//     }

//     if (!verifiedRef || !verifiedRef.trim()) {
//       throw new Error('Payment reference is required')
//     }

//     const deliveryPlace =
//       deliveryDetails?.deliveryMethod.category === 'pickup'
//         ? 'fulfillment_center'
//         : 'home'

//     const pickupStation =
//       deliveryDetails?.deliveryMethod.pickupLocation?.id ||
//       '66f99da3f5ca7c8b1cd82b88'

//     const mappedProducts = cartProducts.map((item) => ({
//       productID: item.product._id,
//       quantity: item.quantity,
//       price: item.product.price,
//       ...(item.product.length && { length: item.product.length }),
//       ...(item.product.width && { breadth: item.product.width }),
//       vendorID:
//         typeof item.product.vendor === 'object'
//           ? item.product.vendor._id
//           : item.product.vendor || session?.user?._id || '',
//     }))

//     const deliveryGeo = [
//       deliveryDetails?.deliveryMethod.pickupLocation?.geolocation.latitude ?? 0,
//       deliveryDetails?.deliveryMethod.pickupLocation?.geolocation.longitude ??
//         0,
//     ]

//     const orderData = {
//       emailAddress: email,
//       products: mappedProducts,
//       paymentRef: { reference: verifiedRef },
//       deliveryMethod: methodDetails?._id ?? '',
//       paymentMethod: 'paystack' as const,
//       deliveryAddress: {
//         addressString: deliveryDetails?.deliveryAddress?.addressString ?? '',
//         geoLocation: deliveryGeo,
//         postCode: deliveryDetails?.deliveryAddress?.postCode ?? '',
//       },
//       deliveryFee: methodDetails?.fee ?? 0,
//       taxFee: taxFee || 0,
//       totalAmount: totalAmount || 0,
//       orderType: 'customer' as const,
//       orderNotes: deliveryDetails?.orderDetails?.orderNote,
//       deliveryPlace,
//       pickupStation,
//     }

//     try {
//       const response = isShopmate
//         ? await checkoutShopmateOrder({
//             ...orderData,
//             deliveryPlace: deliveryPlace as 'home' | 'fulfillment_center',
//             owner: deliveryDetails?.orderDetails?.owner?.name ?? '',
//           })
//         : await checkoutOrder({
//             ...orderData,
//             deliveryPlace: deliveryPlace as 'home' | 'fulfillment_center',
//           })

//       if (response.hasError) {
//         throw new Error(response.message || 'Failed to create order')
//       }

//       dispatch(deliveryActions.clearOrderDetails())
//       return response
//     } catch (error) {
//       console.error('Order creation failed:', error)
//       throw error
//     }
//   }

//   const handlePayment = async () => {
//     if (!email || !email.trim()) {
//       setErrorMessage('Email is required for payment')
//       setStatus((prev) => ({ ...prev, error: true }))
//       return
//     }

//     if (totalAmount <= 0) {
//       setErrorMessage('Invalid payment amount')
//       setStatus((prev) => ({ ...prev, error: true }))
//       return
//     }

//     setStatus((prev) => ({ ...prev, initiating: true, error: false }))
//     setErrorMessage('')

//     try {
//       const paymentData = {
//         amount: totalAmount.toString(),
//         email: email.trim(),
//         currency: 'NGN' as const,
//       }

//       const response = await initiatePayment(paymentData)

//       if (response.hasError || !response.data.authorization_url) {
//         throw new Error(response.message || 'Failed to initiate payment')
//       }

//       setPaymentReference(response.data.reference)

//       // Redirect to Paystack
//       window.location.href = response.data.authorization_url
//     } catch (error) {
//       console.error('Payment initiation failed:', error)
//       const message =
//         error instanceof Error ? error.message : 'Payment initiation failed'
//       setErrorMessage(message)
//       setStatus({
//         success: false,
//         error: true,
//         processing: false,
//         created: false,
//         initiating: false,
//       })
//     }
//   }

//   const handleRetryOrder = async () => {
//     if (!paymentReference) {
//       setErrorMessage('No payment reference available for retry')
//       return
//     }

//     setStatus((prev) => ({
//       ...prev,
//       processing: true,
//       error: false,
//     }))
//     setErrorMessage('')

//     try {
//       const response = await createOrder(paymentReference)

//       if (!response.hasError) {
//         setStatus({
//           success: true,
//           error: false,
//           processing: false,
//           created: true,
//           initiating: false,
//         })
//         setIsOpen(true)
//       } else {
//         throw new Error(response.message || 'Order creation failed')
//       }
//     } catch (error) {
//       console.error('Order retry failed:', error)
//       const message =
//         error instanceof Error ? error.message : 'Order creation failed'
//       setErrorMessage(message)
//       setStatus((prev) => ({
//         ...prev,
//         processing: false,
//         error: true,
//       }))
//     }
//   }

//   const handleRetryPayment = () => {
//     setStatus({
//       success: false,
//       error: false,
//       processing: false,
//       created: false,
//       initiating: false,
//     })
//     setErrorMessage('')
//     setPaymentReference('')
//   }

//   if (methodError) {
//     return (
//       <div className='flex flex-col gap-4 p-6 bg-red-50 rounded-xl'>
//         <p className='text-red-600 font-medium'>
//           Failed to load delivery options
//         </p>
//         <Button
//           onClick={fetchMethods}
//           className='bg-red-500 text-white'
//           disabled={loadingMethod}
//           isLoading={loadingMethod}
//         >
//           Retry
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className='flex flex-col gap-4'>
//         <div className='flex flex-col gap-4 p-6 pt-4 rounded-2xl shadow-sm bg-white'>
//           <p className='font-medium text-sm md:text-base'>Payment Details</p>

//           <div className='flex flex-col gap-1'>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Subtotal</p>
//               <p className='text-sm font-medium'>
//                 ₦{safeFormatNumber(subtotal)}
//               </p>
//             </div>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Delivery Fee</p>
//               <p className='text-sm font-medium'>
//                 ₦{safeFormatNumber(methodDetails?.fee || 0)}
//               </p>
//             </div>
//             <div className='flex justify-between'>
//               <p className='text-sm'>Tax</p>
//               <p className='text-sm font-medium'>₦{safeFormatNumber(taxFee)}</p>
//             </div>
//             <div className='flex justify-between pt-3 border-t mt-2'>
//               <p className='text-xl md:text-2xl font-semibold'>Total Amount</p>
//               <p className='text-xl md:text-2xl font-semibold text-green-500'>
//                 ₦{safeFormatNumber(totalAmount)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {(status.error || errorMessage) && (
//           <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
//             <p className='text-red-600 text-sm mb-2'>
//               {errorMessage || 'An error occurred'}
//             </p>
//             <Button
//               size='sm'
//               onClick={handleRetryPayment}
//               className='bg-red-500 text-white'
//             >
//               Try Again
//             </Button>
//           </div>
//         )}
//       </div>

//       <Button
//         disabled={
//           status.processing ||
//           status.initiating ||
//           loadingMethod ||
//           !methodDetails
//         }
//         isLoading={status.processing || status.initiating || loadingMethod}
//         size='lg'
//         className='h-full text-xl font-medium bg-green-500 text-white p-4 rounded-xl mx-8 md:mx-20'
//         onPress={handlePayment}
//       >
//         {status.initiating
//           ? 'Initiating Payment...'
//           : status.processing
//           ? 'Processing...'
//           : `Pay Now ₦${safeFormatNumber(totalAmount)}`}
//       </Button>

//       {status.success && status.created && (
//         <ConfirmationModal
//           status={status}
//           isOpen={isOpen}
//           onOpenChange={setIsOpen}
//         />
//       )}

//       {status.success && !status.created && (
//         <Retry
//           status={status}
//           isOpen={isOpen}
//           onOpenChange={setIsOpen}
//           onClick={handleRetryOrder}
//         />
//       )}
//     </>
//   )
// }

// export default FinalCheckoutForm

// Updated FinalCheckoutForm.tsx

'use client'

import React, { useEffect, useState } from 'react'
import ConfirmationModal from './ConfirmationModal'
import { formatNumber } from '@/lib/utils'
import { Button } from '@nextui-org/react'
import {
  checkoutOrder,
  checkoutShopmateOrder,
  getDeliveryMethod,
} from '@/lib/server-actions/order'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { ApiDeliveryMethod } from '@/lib/types'
import { deliveryActions } from '@/redux-store/store-slices/DeliverySlice'
import { initiatePayment } from '@/lib/server-actions/payment/paymentService'

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

const safeFormatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
      setTotalAmount(subtotal + fee + taxFee)
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
      const paymentData = {
        amount: totalAmount.toString(),
        email: email.trim(),
        currency: 'NGN' as const,
      }

      const response = await initiatePayment(paymentData)

      if (response.hasError || !response.data.authorization_url) {
        throw new Error(response.message || 'Failed to initiate payment')
      }

      // Store order data in sessionStorage before redirecting
      const orderData = {
        cartProducts,
        deliveryDetails,
        methodDetails,
        totalAmount,
        taxFee,
        email,
        session: {
          userId: session?.user?._id,
          userRoleType: session?.user?.userRoleType,
        },
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
          onClick={fetchMethods}
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
              <p className='text-sm'>Tax</p>
              <p className='text-sm font-medium'>₦{safeFormatNumber(taxFee)}</p>
            </div>
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
              onClick={handleRetryPayment}
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
