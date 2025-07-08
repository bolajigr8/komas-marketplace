'use client'

import React, { useEffect, useState, Suspense, useRef } from 'react'
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
  [key: string]: any // Allow dynamic string indexing
}

type VerificationStatus = 'verifying' | 'creating-order' | 'success' | 'error'

const VerifyPaymentContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const hasProcessedRef = useRef(false)

  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [orderData, setOrderData] = useState<StoredOrderData | null>(null)

  // Enhanced safeGet function with better error handling
  const safeGet = (obj: any, path: string, defaultValue: any = null) => {
    try {
      if (!obj || typeof obj !== 'object') return defaultValue

      const keys = path.split('.')
      let current = obj

      for (const key of keys) {
        if (
          current === null ||
          current === undefined ||
          typeof current !== 'object'
        ) {
          return defaultValue
        }
        current = current[key]
      }

      return current !== undefined && current !== null ? current : defaultValue
    } catch (error) {
      console.warn(`SafeGet error for path "${path}":`, error)
      return defaultValue
    }
  }

  // Enhanced function to safely extract pickup station ID
  const getPickupStationId = (orderData: StoredOrderData): string => {
    const fallbackId = '66f99da3f5ca7c8b1cd82b88'

    // Try multiple paths to find pickup station ID
    const possiblePaths = [
      'deliveryDetails.deliveryMethod.pickupLocation._id',
      'deliveryDetails.deliveryMethod.pickupLocation.id',
      'methodDetails.pickupLocation._id',
      'methodDetails.pickupLocation.id',
      'deliveryDetails.pickupLocation._id',
      'deliveryDetails.pickupLocation.id',
      'methodDetails._id',
      'methodDetails.id',
      'deliveryDetails.deliveryMethod._id',
      'deliveryDetails.deliveryMethod.id',
    ]

    for (const path of possiblePaths) {
      const value = safeGet(orderData, path)
      if (value && typeof value === 'string' && value.trim()) {
        console.log(`Found pickup station ID from path "${path}":`, value)
        return value.trim()
      }
    }

    console.warn('No pickup station ID found, using fallback:', fallbackId)
    return fallbackId
  }

  // Enhanced function to safely extract delivery method ID
  const getDeliveryMethodId = (orderData: StoredOrderData): string => {
    const possiblePaths = [
      'methodDetails._id',
      'methodDetails.id',
      'deliveryDetails.deliveryMethod._id',
      'deliveryDetails.deliveryMethod.id',
      'deliveryDetails.method._id',
      'deliveryDetails.method.id',
    ]

    for (const path of possiblePaths) {
      const value = safeGet(orderData, path)
      if (value && typeof value === 'string' && value.trim()) {
        console.log(`Found delivery method ID from path "${path}":`, value)
        return value.trim()
      }
    }

    throw new Error('Delivery method ID not found in order data')
  }

  // Enhanced function to safely extract vendor ID
  const getVendorId = (
    item: any,
    product: any,
    orderData: StoredOrderData
  ): string => {
    const fallbackId = '66f99da3f5ca7c8b1cd82b88'

    const possibleSources = [
      () => safeGet(product, 'vendor._id'),
      () => safeGet(product, 'vendor.id'),
      () => safeGet(product, 'vendor'),
      () => safeGet(product, 'vendorId'),
      () => safeGet(product, 'vendorID'),
      () => safeGet(item, 'vendorId'),
      () => safeGet(item, 'vendorID'),
      () => safeGet(item, 'vendor._id'),
      () => safeGet(item, 'vendor.id'),
      () => safeGet(item, 'vendor'),
      () => safeGet(orderData, 'session.userId'),
    ]

    for (const getSource of possibleSources) {
      try {
        const value = getSource()
        if (value && typeof value === 'string' && value.trim()) {
          return value.trim()
        }
      } catch (error) {
        console.warn('Error getting vendor ID from source:', error)
      }
    }

    console.warn('No vendor ID found, using fallback:', fallbackId)
    return fallbackId
  }

  // Updated createOrder function with better error handling
  // Debug function to log all possible ID paths
  const debugLogAllIds = (orderData: StoredOrderData) => {
    console.log('=== DEBUG: LOGGING ALL POSSIBLE IDS ===')

    // Log the entire order data structure first
    console.log('Full orderData keys:', Object.keys(orderData || {}))

    // Check session data
    console.log('--- SESSION DATA ---')
    console.log('session:', orderData?.session)
    console.log('session.userId:', orderData?.session?.userId)
    console.log('session.userRoleType:', orderData?.session?.userRoleType)

    // Check delivery details
    console.log('--- DELIVERY DETAILS ---')
    console.log('deliveryDetails:', orderData?.deliveryDetails)
    console.log(
      'deliveryDetails keys:',
      Object.keys(orderData?.deliveryDetails || {})
    )

    // Check delivery method
    console.log('--- DELIVERY METHOD ---')
    console.log(
      'deliveryDetails.deliveryMethod:',
      orderData?.deliveryDetails?.deliveryMethod
    )
    console.log(
      'deliveryDetails.deliveryMethod keys:',
      Object.keys(orderData?.deliveryDetails?.deliveryMethod || {})
    )
    console.log(
      'deliveryDetails.deliveryMethod._id:',
      orderData?.deliveryDetails?.deliveryMethod?._id
    )
    console.log(
      'deliveryDetails.deliveryMethod.id:',
      orderData?.deliveryDetails?.deliveryMethod?.id
    )
    console.log(
      'deliveryDetails.deliveryMethod.category:',
      orderData?.deliveryDetails?.deliveryMethod?.category
    )

    // Check pickup location
    console.log('--- PICKUP LOCATION ---')
    console.log(
      'deliveryDetails.deliveryMethod.pickupLocation:',
      orderData?.deliveryDetails?.deliveryMethod?.pickupLocation
    )
    console.log(
      'deliveryDetails.deliveryMethod.pickupLocation keys:',
      Object.keys(
        orderData?.deliveryDetails?.deliveryMethod?.pickupLocation || {}
      )
    )
    console.log(
      'deliveryDetails.deliveryMethod.pickupLocation._id:',
      orderData?.deliveryDetails?.deliveryMethod?.pickupLocation?._id
    )
    console.log(
      'deliveryDetails.deliveryMethod.pickupLocation.id:',
      orderData?.deliveryDetails?.deliveryMethod?.pickupLocation?.id
    )

    // Check method details
    console.log('--- METHOD DETAILS ---')
    console.log('methodDetails:', orderData?.methodDetails)
    console.log(
      'methodDetails keys:',
      Object.keys(orderData?.methodDetails || {})
    )
    console.log('methodDetails._id:', orderData?.methodDetails?._id)
    console.log('methodDetails.id:', orderData?.methodDetails?.id)
    console.log('methodDetails.fee:', orderData?.methodDetails?.fee)

    // Check method details pickup location
    console.log('--- METHOD DETAILS PICKUP LOCATION ---')
    console.log(
      'methodDetails.pickupLocation:',
      orderData?.methodDetails?.pickupLocation
    )
    console.log(
      'methodDetails.pickupLocation keys:',
      Object.keys(orderData?.methodDetails?.pickupLocation || {})
    )
    console.log(
      'methodDetails.pickupLocation._id:',
      orderData?.methodDetails?.pickupLocation?._id
    )
    console.log(
      'methodDetails.pickupLocation.id:',
      orderData?.methodDetails?.pickupLocation?.id
    )

    // Check delivery address
    console.log('--- DELIVERY ADDRESS ---')
    console.log(
      'deliveryDetails.deliveryAddress:',
      orderData?.deliveryDetails?.deliveryAddress
    )
    console.log(
      'deliveryDetails.deliveryAddress keys:',
      Object.keys(orderData?.deliveryDetails?.deliveryAddress || {})
    )
    console.log(
      'deliveryDetails.deliveryAddress.addressString:',
      orderData?.deliveryDetails?.deliveryAddress?.addressString
    )
    console.log(
      'deliveryDetails.deliveryAddress.postCode:',
      orderData?.deliveryDetails?.deliveryAddress?.postCode
    )
    console.log(
      'deliveryDetails.deliveryAddress.geolocation:',
      orderData?.deliveryDetails?.deliveryAddress?.geolocation
    )

    // Check cart products
    console.log('--- CART PRODUCTS ---')
    console.log('cartProducts:', orderData?.cartProducts)
    console.log('cartProducts length:', orderData?.cartProducts?.length)

    if (orderData?.cartProducts && Array.isArray(orderData.cartProducts)) {
      orderData.cartProducts.forEach((item, index) => {
        console.log(`--- PRODUCT ${index + 1} ---`)
        console.log(`cartProducts[${index}]:`, item)
        console.log(`cartProducts[${index}] keys:`, Object.keys(item || {}))
        console.log(`cartProducts[${index}].product:`, item?.product)
        console.log(
          `cartProducts[${index}].product keys:`,
          Object.keys(item?.product || {})
        )

        // Product IDs
        console.log(`cartProducts[${index}].product._id:`, item?.product?._id)
        console.log(`cartProducts[${index}].product.id:`, item?.product?.id)
        console.log(
          `cartProducts[${index}].product.productId:`,
          item?.product?.productId
        )
        console.log(
          `cartProducts[${index}].product.productID:`,
          item?.product?.productID
        )
        console.log(`cartProducts[${index}].productId:`, item?.productId)
        console.log(`cartProducts[${index}].productID:`, item?.productID)
        console.log(`cartProducts[${index}].id:`, item?.id)
        console.log(`cartProducts[${index}]._id:`, item?._id)

        // Vendor IDs
        console.log(
          `cartProducts[${index}].product.vendor:`,
          item?.product?.vendor
        )
        console.log(
          `cartProducts[${index}].product.vendor keys:`,
          Object.keys(item?.product?.vendor || {})
        )
        console.log(
          `cartProducts[${index}].product.vendor._id:`,
          item?.product?.vendor?._id
        )
        console.log(
          `cartProducts[${index}].product.vendor.id:`,
          item?.product?.vendor?.id
        )
        console.log(
          `cartProducts[${index}].product.vendorId:`,
          item?.product?.vendorId
        )
        console.log(
          `cartProducts[${index}].product.vendorID:`,
          item?.product?.vendorID
        )
        console.log(`cartProducts[${index}].vendorId:`, item?.vendorId)
        console.log(`cartProducts[${index}].vendorID:`, item?.vendorID)
        console.log(`cartProducts[${index}].vendor:`, item?.vendor)
        console.log(
          `cartProducts[${index}].vendor keys:`,
          Object.keys(item?.vendor || {})
        )
        console.log(`cartProducts[${index}].vendor._id:`, item?.vendor?._id)
        console.log(`cartProducts[${index}].vendor.id:`, item?.vendor?.id)

        // Other product details
        console.log(`cartProducts[${index}].quantity:`, item?.quantity)
        console.log(
          `cartProducts[${index}].product.price:`,
          item?.product?.price
        )
        console.log(`cartProducts[${index}].price:`, item?.price)
        console.log(
          `cartProducts[${index}].product.length:`,
          item?.product?.length
        )
        console.log(
          `cartProducts[${index}].product.width:`,
          item?.product?.width
        )
      })
    }

    // Check order details
    console.log('--- ORDER DETAILS ---')
    console.log(
      'deliveryDetails.orderDetails:',
      orderData?.deliveryDetails?.orderDetails
    )
    console.log(
      'deliveryDetails.orderDetails keys:',
      Object.keys(orderData?.deliveryDetails?.orderDetails || {})
    )
    console.log(
      'deliveryDetails.orderDetails.orderNote:',
      orderData?.deliveryDetails?.orderDetails?.orderNote
    )
    console.log(
      'deliveryDetails.orderDetails.owner:',
      orderData?.deliveryDetails?.orderDetails?.owner
    )
    console.log(
      'deliveryDetails.orderDetails.owner keys:',
      Object.keys(orderData?.deliveryDetails?.orderDetails?.owner || {})
    )
    console.log(
      'deliveryDetails.orderDetails.owner.name:',
      orderData?.deliveryDetails?.orderDetails?.owner?.name
    )

    // Check other fields
    console.log('--- OTHER FIELDS ---')
    console.log('email:', orderData?.email)
    console.log('totalAmount:', orderData?.totalAmount)
    console.log('taxFee:', orderData?.taxFee)

    console.log('=== END DEBUG LOG ===')
  }

  // Enhanced createOrder function with comprehensive debugging
  const createOrder = async (
    verifiedRef: string,
    orderData: StoredOrderData
  ) => {
    console.log('Creating order with reference:', verifiedRef)

    // Debug log all IDs
    debugLogAllIds(orderData)

    try {
      // Validate orderData structure
      if (!orderData || typeof orderData !== 'object') {
        throw new Error('Invalid order data structure')
      }

      // Check if it's a shopmate order
      const userRoleType = orderData?.session?.userRoleType || []
      const isShopmate =
        Array.isArray(userRoleType) && userRoleType.includes('shopmate')
      console.log('Is shopmate order:', isShopmate)

      // Determine delivery place
      const deliveryCategory =
        orderData?.deliveryDetails?.deliveryMethod?.category || ''
      const deliveryPlace =
        deliveryCategory === 'pickup' ? 'fulfillment_center' : 'home'
      console.log('Delivery place:', deliveryPlace)

      // Try to get pickup station ID with debugging
      console.log('=== TRYING TO GET PICKUP STATION ID ===')
      let pickupStation = null

      // Try all possible paths and log each attempt
      const pickupPaths = [
        'deliveryDetails.deliveryMethod.pickupLocation._id',
        'deliveryDetails.deliveryMethod.pickupLocation.id',
        'methodDetails.pickupLocation._id',
        'methodDetails.pickupLocation.id',
        'deliveryDetails.pickupLocation._id',
        'deliveryDetails.pickupLocation.id',
      ]

      for (const path of pickupPaths) {
        const keys = path.split('.')
        let current = orderData
        let isValid = true

        console.log(`Trying path: ${path}`)

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          console.log(
            `  Step ${i + 1}: current[${key}] =`,
            (current as any)?.[key]
          )

          if (
            current === null ||
            current === undefined ||
            typeof current !== 'object'
          ) {
            console.log(
              `  Path failed at step ${i + 1}: current is not an object`
            )
            isValid = false
            break
          }

          current = current[key]

          if (current === null || current === undefined) {
            console.log(
              `  Path failed at step ${i + 1}: ${key} is null/undefined`
            )
            isValid = false
            break
          }
        }

        if (
          isValid &&
          current &&
          typeof current === 'string' &&
          (current as string).trim()
        ) {
          console.log(`  SUCCESS: Found pickup station ID: ${current}`)
          pickupStation = (current as string).trim()
          break
        } else {
          console.log(`  FAILED: Path ${path} did not yield a valid ID`)
        }
      }

      // If still no pickup station, try methodDetails._id and deliveryMethod._id
      if (!pickupStation) {
        console.log('Trying methodDetails._id for pickup station...')
        const methodId =
          orderData?.methodDetails?._id || orderData?.methodDetails?.id
        if (methodId) {
          console.log('Using methodDetails._id as pickup station:', methodId)
          pickupStation = methodId
        } else {
          console.log('No methodDetails._id found')
        }
      }

      if (!pickupStation) {
        console.log('Trying deliveryMethod._id for pickup station...')
        const deliveryMethodId =
          orderData?.deliveryDetails?.deliveryMethod?._id ||
          orderData?.deliveryDetails?.deliveryMethod?.id
        if (deliveryMethodId) {
          console.log(
            'Using deliveryMethod._id as pickup station:',
            deliveryMethodId
          )
          pickupStation = deliveryMethodId
        } else {
          console.log('No deliveryMethod._id found')
        }
      }

      // Final fallback
      if (!pickupStation) {
        console.log('Using fallback pickup station ID')
        pickupStation = '66f99da3f5ca7c8b1cd82b88'
      }

      console.log('Final pickup station:', pickupStation)

      // Get delivery method ID with debugging
      console.log('=== TRYING TO GET DELIVERY METHOD ID ===')
      let deliveryMethodId = null

      const deliveryMethodPaths = [
        'methodDetails._id',
        'methodDetails.id',
        'deliveryDetails.deliveryMethod._id',
        'deliveryDetails.deliveryMethod.id',
        'deliveryDetails.method._id',
        'deliveryDetails.method.id',
      ]

      for (const path of deliveryMethodPaths) {
        const keys = path.split('.')
        let current = orderData
        let isValid = true

        console.log(`Trying delivery method path: ${path}`)

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          console.log(`  Step ${i + 1}: current[${key}] =`, current?.[key])

          if (
            current === null ||
            current === undefined ||
            typeof current !== 'object'
          ) {
            console.log(
              `  Path failed at step ${i + 1}: current is not an object`
            )
            isValid = false
            break
          }

          current = current[key]

          if (current === null || current === undefined) {
            console.log(
              `  Path failed at step ${i + 1}: ${key} is null/undefined`
            )
            isValid = false
            break
          }
        }

        if (
          isValid &&
          current &&
          typeof current === 'string' &&
          (current as string).trim()
        ) {
          console.log(`  SUCCESS: Foundsdelivery method ID: ${current}`)
          deliveryMethodId = (current as string).trim()
          break
        } else {
          console.log(`  FAILED: Path ${path} did not yield a valid ID`)
        }
      }

      if (!deliveryMethodId) {
        throw new Error('Delivery method ID not found in order data')
      }

      console.log('Final delivery method ID:', deliveryMethodId)

      // Map products with debugging
      const cartProducts = orderData?.cartProducts || []
      console.log('=== PROCESSING CART PRODUCTS ===')
      console.log('Cart products count:', cartProducts.length)

      if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
        throw new Error('No products found in cart')
      }

      const mappedProducts = cartProducts.map((item: any, index: number) => {
        console.log(`=== PROCESSING PRODUCT ${index + 1} ===`)

        if (!item || typeof item !== 'object') {
          throw new Error(`Invalid product at index ${index}`)
        }

        const product = item?.product || item || {}
        console.log(`Product ${index + 1} structure:`, {
          hasItem: !!item,
          hasProduct: !!item?.product,
          itemKeys: Object.keys(item || {}),
          productKeys: Object.keys(product || {}),
        })

        // Get vendor ID with debugging
        console.log(`=== GETTING VENDOR ID FOR PRODUCT ${index + 1} ===`)
        let vendorId = null

        const vendorSources = [
          () => product?.vendor?._id,
          () => product?.vendor?.id,
          () => product?.vendor,
          () => product?.vendorId,
          () => product?.vendorID,
          () => item?.vendorId,
          () => item?.vendorID,
          () => item?.vendor?._id,
          () => item?.vendor?.id,
          () => item?.vendor,
          () => orderData?.session?.userId,
        ]

        const vendorSourceNames = [
          'product.vendor._id',
          'product.vendor.id',
          'product.vendor',
          'product.vendorId',
          'product.vendorID',
          'item.vendorId',
          'item.vendorID',
          'item.vendor._id',
          'item.vendor.id',
          'item.vendor',
          'session.userId',
        ]

        for (let i = 0; i < vendorSources.length; i++) {
          try {
            const value = vendorSources[i]()
            console.log(`Vendor source ${vendorSourceNames[i]}:`, value)
            if (value && typeof value === 'string' && value.trim()) {
              vendorId = value.trim()
              console.log(
                `SUCCESS: Using vendor ID from ${vendorSourceNames[i]}:`,
                vendorId
              )
              break
            }
          } catch (error) {
            console.log(
              `Error getting vendor from ${vendorSourceNames[i]}:`,
              error
            )
          }
        }

        if (!vendorId) {
          console.log('Using fallback vendor ID')
          vendorId = '66f99da3f5ca7c8b1cd82b88'
        }

        // Get product ID with debugging
        console.log(`=== GETTING PRODUCT ID FOR PRODUCT ${index + 1} ===`)
        let productId = null

        const productIdSources = [
          () => product?._id,
          () => product?.id,
          () => product?.productId,
          () => product?.productID,
          () => item?.productId,
          () => item?.productID,
          () => item?.id,
          () => item?._id,
        ]

        const productIdSourceNames = [
          'product._id',
          'product.id',
          'product.productId',
          'product.productID',
          'item.productId',
          'item.productID',
          'item.id',
          'item._id',
        ]

        for (let i = 0; i < productIdSources.length; i++) {
          try {
            const value = productIdSources[i]()
            console.log(`Product ID source ${productIdSourceNames[i]}:`, value)
            if (
              value &&
              (typeof value === 'string' || typeof value === 'number')
            ) {
              productId = String(value).trim()
              console.log(
                `SUCCESS: Using product ID from ${productIdSourceNames[i]}:`,
                productId
              )
              break
            }
          } catch (error) {
            console.log(
              `Error getting product ID from ${productIdSourceNames[i]}:`,
              error
            )
          }
        }

        if (!productId) {
          throw new Error(`Product ID not found for product at index ${index}`)
        }

        const mappedProduct = {
          productID: productId,
          quantity: Number(item?.quantity || 1),
          price: Number(product?.price || item?.price || 0),
          vendorID: vendorId,
          ...(product?.length && { length: Number(product.length) }),
          ...(product?.width && { breadth: Number(product.width) }),
        }

        console.log(`Final mapped product ${index + 1}:`, mappedProduct)
        return mappedProduct
      })

      console.log('=== ALL PRODUCTS MAPPED ===')
      console.log('Total mapped products:', mappedProducts.length)

      // Build delivery address
      const addressString =
        orderData?.deliveryDetails?.deliveryAddress?.addressString || ''
      const latitude =
        orderData?.deliveryDetails?.deliveryAddress?.geolocation?.latitude || 0
      const longitude =
        orderData?.deliveryDetails?.deliveryAddress?.geolocation?.longitude || 0
      const postCode =
        orderData?.deliveryDetails?.deliveryAddress?.postCode || '00000'

      if (!addressString) {
        throw new Error('Delivery address is required')
      }

      const deliveryAddress = {
        addressString: String(addressString),
        geoLocation: [Number(latitude), Number(longitude)],
        postCode: String(postCode),
      }

      // Build order payload
      const email = orderData?.email || ''
      if (!email) {
        throw new Error('Email address is required')
      }

      const totalAmount = Number(orderData?.totalAmount || 0)
      if (totalAmount <= 0) {
        throw new Error('Total amount must be greater than 0')
      }

      const orderPayload = {
        emailAddress: String(email),
        products: mappedProducts,
        paymentRef: { reference: String(verifiedRef) },
        deliveryMethod: String(deliveryMethodId),
        paymentMethod: 'paystack' as const,
        deliveryAddress,
        deliveryFee: Number(orderData?.methodDetails?.fee || 0),
        taxFee: Number(orderData?.taxFee || 0),
        totalAmount,
        orderType: 'customer' as const,
        orderNotes: String(
          orderData?.deliveryDetails?.orderDetails?.orderNote || ''
        ),
        deliveryPlace: deliveryPlace as 'home' | 'fulfillment_center',
        pickupStation: String(pickupStation),
      }

      console.log('=== FINAL ORDER PAYLOAD ===')
      console.log('Order payload:', JSON.stringify(orderPayload, null, 2))

      // Create order
      const response = isShopmate
        ? await checkoutShopmateOrder({
            ...orderPayload,
            owner: String(
              orderData?.deliveryDetails?.orderDetails?.owner?.name || ''
            ),
          })
        : await checkoutOrder(orderPayload)

      console.log('Order creation response:', {
        hasError: response?.hasError,
        message: response?.message?.substring(0, 100),
      })

      if (response?.hasError) {
        throw new Error(response.message || 'Failed to create order')
      }

      return response
    } catch (error) {
      console.error('Order creation failed:', error)
      throw error
    }
  }

  const handlePaymentVerification = async () => {
    if (hasProcessedRef.current) {
      console.log('Payment verification already in progress')
      return
    }

    hasProcessedRef.current = true
    console.log('Starting payment verification')

    try {
      const reference = searchParams.get('reference')
      if (!reference) {
        throw new Error('No payment reference found in URL')
      }

      console.log('Payment reference:', reference)

      // Get stored order data
      const storedData = sessionStorage.getItem('pendingOrderData')
      if (!storedData) {
        throw new Error(
          'Order data not found. Please start the checkout process again.'
        )
      }

      const parsedOrderData: StoredOrderData = JSON.parse(storedData)
      console.log('Order data loaded successfully')
      setOrderData(parsedOrderData)

      // Verify payment
      console.log('Verifying payment...')
      setStatus('verifying')
      const verificationResponse = await verifyPayment(reference)
      console.log(
        'Payment verification completed:',
        verificationResponse?.data?.status
      )

      if (
        verificationResponse?.hasError ||
        verificationResponse?.data?.status !== 'success'
      ) {
        const errorMsg =
          verificationResponse?.message ||
          `Payment verification failed. Status: ${
            verificationResponse?.data?.status || 'unknown'
          }`
        throw new Error(errorMsg)
      }

      // Create order
      console.log('Creating order...')
      setStatus('creating-order')
      const orderResponse = await createOrder(reference, parsedOrderData)

      if (!orderResponse?.hasError) {
        console.log('Order created successfully')
        setStatus('success')
        setTimeout(() => {
          router.push('/order-success')
        }, 2000)
      } else {
        throw new Error(orderResponse?.message || 'Order creation failed')
      }
    } catch (error) {
      console.error('Payment verification/order creation failed:', error)
      const message = error instanceof Error ? error.message : 'Process failed'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handlePaymentVerification()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    console.log('Retrying payment verification')
    hasProcessedRef.current = false
    setStatus('verifying')
    setErrorMessage('')
    handlePaymentVerification()
  }

  const handleBackToCheckout = () => {
    console.log('Returning to checkout')
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
