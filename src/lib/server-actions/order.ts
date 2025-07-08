'use server'

import { fetchWithAuth } from '.'
// import { fetchWithAuth } from '.'
import { DeliveryMethodResponse, FetchResult, OrdersResponse } from '../types'

export const getOrders = async (params?: {
  orderId?: string
}): Promise<OrdersResponse> => {
  try {
    let url = '/order'

    // Append orderId as part of the path if provided
    if (params?.orderId) {
      url = `/order/${encodeURIComponent(params.orderId)}`
    }

    const res = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await res.json()
  } catch (error: any) {
    return {
      statusCode: error.code || 500,
      hasError: true,
      message: 'Failed to fetch order data',
      data: null,
    }
  }
}

export const getAllOrders = async (): Promise<OrdersResponse> => {
  try {
    const url = '/order/orders'

    const res = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await res.json()
  } catch (error: any) {
    return {
      statusCode: error.code || 500,
      hasError: true,
      message: 'Failed to fetch orders data',
      data: null,
    }
  }
}

// export const getAllOrders = async (): Promise<OrdersResponse> => {
//   try {
//     const url = '/order/orders'

//     const res = await fetchWithAuth(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     const data = await res.json()

//     // Log the data to verify
//     console.log('Fetched order data:', data)

//     // If hasError is true but data is still valid, trust the data
//     if (Array.isArray(data?.data)) {
//       return {
//         ...data,
//         hasError: false, // override faulty backend flag
//       }
//     }

//     return data
//   } catch (error: any) {
//     return {
//       statusCode: error.code || 500,
//       hasError: true,
//       message: 'Failed to fetch orders data',
//       data: null,
//     }
//   }
// }

export const getDeliveryMethod = async (): Promise<DeliveryMethodResponse> => {
  try {
    const res = await fetchWithAuth('/delivery_method/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await res.json()
  } catch (error: any) {
    return {
      statusCode: error.code || 500,
      hasError: true,
      message: 'Failed to fetch delivery method data',
      data: null,
    }
  }
}

// export const checkoutOrder = async ({
//   emailAddress,
//   products,
//   paymentRef,
//   paymentMethod,
//   deliveryAddress,
//   deliveryFee,
//   taxFee,
//   totalAmount,
//   orderType,
//   orderNotes,
//   deliveryMethod,
// }: {
//   emailAddress: string
//   products: {
//     breadth?: number
//     length?: number
//     productID: string
//     quantity: number
//     price: number
//   }[]
//   paymentRef: { reference: string }
//   paymentMethod: 'paystack' | 'flutter' | 'wallet' | 'cod'
//   deliveryAddress: {
//     addressString: string
//     geoLocation?: number[]
//     postCode: string
//   }
//   deliveryFee: number
//   taxFee: number
//   totalAmount: number
//   orderType: 'Testing' | 'shopmate' | 'customer'
//   orderNotes?: string
//   deliveryMethod: string
// }): Promise<FetchResult<null>> => {
//   try {
//     const res = await fetchWithAuth(
//       `/order/create?emailAddress=${emailAddress}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           products,
//           paymentRef,
//           paymentMethod,
//           deliveryAddress,
//           deliveryMethod,
//           deliveryFee,
//           taxFee,
//           totalAmount,
//           orderType,
//           orderNotes,
//         }),
//       }
//     )

//     const json = await res.json()
//     console.log('done', json)
//     return json
//   } catch (error: any) {
//     console.log('ERROR IN CHECKOUT ORDER', error)
//     return {
//       statusCode: error.code,
//       hasError: true,
//       message: 'Failed to checkout cart',
//       data: null,
//     }
//   }
// }

// export const checkoutShopmateOrder = async ({
//   products,
//   paymentRef,
//   paymentMethod,
//   deliveryAddress,
//   owner,
//   deliveryFee,
//   taxFee,
//   totalAmount,
//   orderNotes,
//   deliveryPlace,
//   pickupStation,
// }: {
//   products: {
//     breadth?: number
//     length?: number
//     productID: string
//     quantity: number
//     price: number
//     // vendorID: string;
//   }[]
//   // paymentRef: string
//   paymentRef: { reference: string }

//   paymentMethod: 'paystack' | 'flutter' | 'wallet' | 'cod'
//   deliveryAddress: {
//     addressString: string
//     geoLocation?: number[]
//     postCode: string
//   }
//   deliveryFee: number
//   taxFee: number
//   totalAmount: number
//   owner: string
//   deliveryPlace: 'fulfillment_center' | 'home'
//   orderNotes?: string
//   pickupStation?: string
// }): Promise<FetchResult<null>> => {
//   try {
//     const res = await fetchWithAuth(`/order/shopmate`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         products,
//         paymentRef,
//         paymentMethod,
//         deliveryAddress,
//         deliveryFee,
//         taxFee,
//         totalAmount,
//         orderNotes,
//         deliveryPlace,
//         owner,
//         pickupStation,
//       }),
//     })

//     // revalidatePath('/cart')

//     const json = await res.json()
//     console.log('Order Response:', json)
//     return json
//   } catch (error: any) {
//     return {
//       statusCode: error.code,
//       hasError: true,
//       message: 'Failed to checkout cart',
//       data: null,
//     }
//   }
// }

// Enhanced checkoutOrder function with improved logging
// export const checkoutOrder = async ({
//   emailAddress,
//   products,
//   paymentRef,
//   paymentMethod,
//   deliveryAddress,
//   deliveryFee,
//   taxFee,
//   totalAmount,
//   orderType,
//   orderNotes,
//   deliveryMethod,
// }: {
//   emailAddress: string
//   products: {
//     breadth?: number
//     length?: number
//     productID: string
//     quantity: number
//     price: number
//   }[]
//   paymentRef: { reference: string }
//   paymentMethod: 'paystack' | 'flutter' | 'wallet' | 'cod'
//   deliveryAddress: {
//     addressString: string
//     geoLocation?: number[]
//     postCode: string
//   }
//   deliveryFee: number
//   taxFee: number
//   totalAmount: number
//   orderType: 'Testing' | 'shopmate' | 'customer'
//   orderNotes?: string
//   deliveryMethod: string
// }): Promise<FetchResult<null>> => {
//   try {
//     console.log(
//       '🚀 Sending order to API:',
//       `/order/create?emailAddress=${emailAddress}`
//     )
//     console.log('📧 Email Address in URL:', emailAddress)

//     // Create a copy of the order data for logging, without JSON.stringify causing issues
//     const orderData = {
//       products,
//       paymentRef,
//       paymentMethod,
//       deliveryAddress,
//       deliveryMethod,
//       deliveryFee,
//       taxFee,
//       totalAmount,
//       orderType,
//       orderNotes,
//       emailAddress, // Include email in the body too (may help if query param fails)
//     }

//     console.log('📦 Order Payload:', JSON.stringify(orderData, null, 2))

//     const res = await fetchWithAuth(
//       `/order/create?emailAddress=${encodeURIComponent(emailAddress)}`, // URL encode the email
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           products,
//           paymentRef,
//           paymentMethod,
//           deliveryAddress,
//           deliveryMethod,
//           deliveryFee,
//           taxFee,
//           totalAmount,
//           orderType,
//           orderNotes,
//           emailAddress, // Include email in the body too (might help if query param fails)
//         }),
//       }
//     )

//     console.log('📡 API Response Status:', res.status)
//     const json = await res.json()
//     console.log('✅ API Response:', JSON.stringify(json, null, 2))

//     return json
//   } catch (error: any) {
//     console.error('❌ ERROR IN CHECKOUT ORDER', error)
//     console.error('Error details:', JSON.stringify(error, null, 2))
//     return {
//       statusCode: error.code || 500,
//       hasError: true,
//       message: `Failed to checkout cart: ${error.message || 'Unknown error'}`,
//       data: null,
//     }
//   }
// }

// Enhanced checkoutOrder function with improved logging
// export const checkoutOrder = async ({
//   emailAddress,
//   products,
//   paymentRef,
//   paymentMethod,
//   deliveryAddress,
//   deliveryFee,
//   taxFee,
//   totalAmount,
//   orderType,
//   orderNotes,
//   deliveryMethod,
// }: {
//   emailAddress: string
//   products: {
//     breadth?: number
//     length?: number
//     productID: string
//     quantity: number
//     price: number
//   }[]
//   paymentRef: { reference: string }
//   paymentMethod: 'paystack' | 'flutter' | 'wallet' | 'cod'
//   deliveryAddress: {
//     addressString: string
//     geoLocation?: number[]
//     postCode: string
//   }
//   deliveryFee: number
//   taxFee: number
//   totalAmount: number
//   orderType: 'Testing' | 'shopmate' | 'customer'
//   orderNotes?: string
//   deliveryMethod: string
// }): Promise<FetchResult<null>> => {
//   try {
//     console.log(
//       '🚀 Sending order to API:',
//       `/order/create?emailAddress=${emailAddress}`
//     )
//     console.log('📧 Email Address in URL:', emailAddress)

//     // Create a copy of the order data for logging, without JSON.stringify causing issues
//     const orderData = {
//       products,
//       paymentRef,
//       paymentMethod,
//       deliveryAddress,
//       deliveryMethod,
//       deliveryFee,
//       taxFee,
//       totalAmount,
//       orderType,
//       orderNotes,
//       emailAddress, // Include email in the body too (may help if query param fails)
//     }

//     console.log('📦 Order Payload:', JSON.stringify(orderData, null, 2))

//     const res = await fetchWithAuth(
//       `/order/create?emailAddress=${encodeURIComponent(emailAddress)}`, // URL encode the email
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           products,
//           paymentRef,
//           paymentMethod,
//           deliveryAddress,
//           deliveryMethod,
//           deliveryFee,
//           taxFee,
//           totalAmount,
//           orderType,
//           orderNotes,
//           emailAddress, // Include email in the body too (might help if query param fails)
//         }),
//       }
//     )

//     console.log('📡 API Response Status:', res.status)
//     const json = await res.json()
//     console.log('✅ API Response:', JSON.stringify(json, null, 2))

//     return json
//   } catch (error: any) {
//     console.error('❌ ERROR IN CHECKOUT ORDER', error)
//     console.error('Error details:', JSON.stringify(error, null, 2))
//     return {
//       statusCode: error.code || 500,
//       hasError: true,
//       message: `Failed to checkout cart: ${error.message || 'Unknown error'}`,
//       data: null,
//     }
//   }
// }

// export const checkoutOrder = async ({
//   emailAddress,
//   products,
//   paymentRef,
//   paymentMethod,
//   deliveryAddress,
//   deliveryFee,
//   taxFee,
//   totalAmount,
//   orderType,
//   orderNotes,
//   deliveryMethod,
//   deliveryPlace, // Add the new field
//   pickupStation, // Add the new field
// }: {
//   emailAddress: string
//   products: {
//     breadth?: number
//     length?: number
//     productID: string
//     quantity: number
//     price: number
//     vendorID?: string // Add vendorID to type definition for clarity
//   }[]
//   paymentRef: { reference: string }
//   paymentMethod: 'paystack' | 'flutter' | 'wallet' | 'cod'
//   deliveryAddress: {
//     addressString: string
//     geoLocation?: number[]
//     postCode: string
//   }
//   deliveryFee: number
//   taxFee: number
//   totalAmount: number
//   orderType: 'Testing' | 'shopmate' | 'customer'
//   orderNotes?: string
//   deliveryMethod: string
//   deliveryPlace: string // Add type definition
//   pickupStation: string // Add type definition
// }): Promise<FetchResult<null>> => {
//   try {
//     console.log(
//       '🚀 Sending order to API:',
//       `/order/create?emailAddress=${emailAddress}`
//     )
//     console.log('📧 Email Address in URL:', emailAddress)
//     console.log('🏠 Delivery Place:', deliveryPlace)
//     console.log('📍 Pickup Station:', pickupStation)

//     // Create a copy of the order data for logging, without JSON.stringify causing issues
//     const orderData = {
//       products,
//       paymentRef,
//       paymentMethod,
//       deliveryAddress,
//       deliveryMethod,
//       deliveryFee,
//       taxFee,
//       totalAmount,
//       orderType,
//       orderNotes,
//       emailAddress, // Include email in the body too (may help if query param fails)
//       deliveryPlace, // Include new field in log object
//       pickupStation, // Include new field in log object
//     }

//     console.log('📦 Order Payload:', JSON.stringify(orderData, null, 2))

//     const res = await fetchWithAuth(
//       `/order/create?emailAddress=${encodeURIComponent(emailAddress)}`, // URL encode the email
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           products,
//           paymentRef,
//           paymentMethod,
//           deliveryAddress,
//           deliveryMethod,
//           deliveryFee,
//           taxFee,
//           totalAmount,
//           orderType,
//           orderNotes,
//           emailAddress, // Include email in the body too (might help if query param fails)
//           deliveryPlace, // Include new field in request body
//           pickupStation, // Include new field in request body
//         }),
//       }
//     )

//     console.log('📡 API Response Status:', res.status)
//     const json = await res.json()
//     console.log('✅ API Response:', JSON.stringify(json, null, 2))

//     return json
//   } catch (error: any) {
//     console.error('❌ ERROR IN CHECKOUT ORDER', error)
//     console.error('Error details:', JSON.stringify(error, null, 2))
//     return {
//       statusCode: error.code || 500,
//       hasError: true,
//       message: `Failed to checkout cart: ${error.message || 'Unknown error'}`,
//       data: null,
//     }
//   }
// }

// lib/server-actions/order.ts (Updated order creation functions - example structure)
// Note: This would be your existing server actions, just showing the structure

// export interface OrderCreateData {
//   emailAddress: string
//   products: Array<{
//     productID: string
//     quantity: number
//     price: number
//     length?: number
//     breadth?: number
//     vendorID: string
//   }>
//   paymentRef: { reference: string }
//   deliveryMethod: string
//   paymentMethod: 'paystack'
//   deliveryAddress: {
//     addressString: string
//     geoLocation: number[]
//     postCode: string
//   }
//   deliveryFee: number
//   taxFee: number
//   totalAmount: number
//   orderType: 'Testing' | 'shopmate' | 'customer'
//   orderNotes?: string
//   deliveryPlace: 'home' | 'fulfillment_center'
//   pickupStation: string
// }

// export interface ShopmateOrderData extends OrderCreateData {
//   owner: string
// }

// // These would use your existing fetchWithAuth function
// export const checkoutOrder = async (orderData: OrderCreateData) => {
//   try {
//     const response = await fetchWithAuth('/order/create', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(orderData),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to create order')
//     }

//     return await response.json()
//   } catch (error) {
//     console.error('Order creation error:', error)
//     return {
//       hasError: true,
//       message: error instanceof Error ? error.message : 'Order creation failed',
//     }
//   }
// }

// export const checkoutShopmateOrder = async (orderData: ShopmateOrderData) => {
//   try {
//     const response = await fetchWithAuth('/order/shopmate/create', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(orderData),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to create shopmate order')
//     }

//     return await response.json()
//   } catch (error) {
//     console.error('Shopmate order creation error:', error)
//     return {
//       hasError: true,
//       message:
//         error instanceof Error
//           ? error.message
//           : 'Shopmate order creation failed',
//     }
//   }
// // }
// export interface OrderCreateData {
//   emailAddress: string
//   products: Array<{
//     productID: string
//     quantity: number
//     price: number
//     length?: number
//     breadth?: number
//     vendorID: string
//   }>
//   paymentRef: { reference: string }
//   deliveryMethod: string
//   paymentMethod: 'paystack'
//   deliveryAddress: {
//     addressString: string
//     geoLocation: number[]
//     postCode: string
//   }
//   deliveryFee: number
//   taxFee: number
//   totalAmount: number
//   orderType: 'Testing' | 'shopmate' | 'customer'
//   orderNotes?: string
//   deliveryPlace: 'home' | 'fulfillment_center'
//   pickupStation: string
// }

// export interface ShopmateOrderData extends OrderCreateData {
//   owner: string
// }

// // Simplified logging function that only logs to console
// const logOrderDetails = (stage: string, data: any) => {
//   const timestamp = new Date().toISOString()
//   console.log(`[${timestamp}] ORDER ${stage}:`)

//   // Only log essential fields to avoid serialization issues
//   if (typeof data === 'object' && data !== null) {
//     try {
//       // Create a simplified version for logging
//       const logData = {
//         action: data.action,
//         orderType: data.orderType,
//         emailAddress: data.emailAddress,
//         productsCount: data.productsCount || data.products?.length,
//         totalAmount: data.totalAmount,
//         hasError: data.hasError,
//         status: data.status,
//         message: data.message?.substring(0, 200), // Truncate long messages
//       }
//       console.log(JSON.stringify(logData, null, 2))
//     } catch (error) {
//       console.log('Logging data (simple):', String(data))
//     }
//   } else {
//     console.log(data)
//   }
// }

// // Enhanced validation function
// const validateOrderData = (
//   orderData: OrderCreateData
// ): { isValid: boolean; errors: string[] } => {
//   const errors: string[] = []

//   // Required field validations
//   if (!orderData.emailAddress || !orderData.emailAddress.trim()) {
//     errors.push('emailAddress is required and cannot be empty')
//   }

//   if (!orderData.products || orderData.products.length === 0) {
//     errors.push('products array is required and cannot be empty')
//   } else {
//     // Validate each product
//     orderData.products.forEach((product, index) => {
//       if (!product.productID)
//         errors.push(`products[${index}].productID is required`)
//       if (!product.quantity || product.quantity <= 0)
//         errors.push(`products[${index}].quantity must be greater than 0`)
//       if (!product.price || product.price <= 0)
//         errors.push(`products[${index}].price must be greater than 0`)
//       if (!product.vendorID)
//         errors.push(`products[${index}].vendorID is required`)
//     })
//   }

//   if (!orderData.paymentRef?.reference) {
//     errors.push('paymentRef.reference is required')
//   }

//   if (!orderData.deliveryMethod) {
//     errors.push('deliveryMethod is required')
//   }

//   if (!orderData.paymentMethod) {
//     errors.push('paymentMethod is required')
//   }

//   if (!orderData.deliveryAddress) {
//     errors.push('deliveryAddress is required')
//   } else {
//     if (!orderData.deliveryAddress.addressString) {
//       errors.push('deliveryAddress.addressString is required')
//     }
//     if (
//       !Array.isArray(orderData.deliveryAddress.geoLocation) ||
//       orderData.deliveryAddress.geoLocation.length !== 2
//     ) {
//       errors.push(
//         'deliveryAddress.geoLocation must be an array of 2 numbers [lat, lng]'
//       )
//     }
//     if (!orderData.deliveryAddress.postCode) {
//       errors.push('deliveryAddress.postCode is required')
//     }
//   }

//   if (orderData.deliveryFee === undefined || orderData.deliveryFee < 0) {
//     errors.push('deliveryFee must be a non-negative number')
//   }

//   if (orderData.taxFee === undefined || orderData.taxFee < 0) {
//     errors.push('taxFee must be a non-negative number')
//   }

//   if (!orderData.totalAmount || orderData.totalAmount <= 0) {
//     errors.push('totalAmount must be greater than 0')
//   }

//   if (!orderData.orderType) {
//     errors.push('orderType is required')
//   }

//   if (!orderData.deliveryPlace) {
//     errors.push('deliveryPlace is required')
//   }

//   if (!orderData.pickupStation) {
//     errors.push('pickupStation is required')
//   }

//   return {
//     isValid: errors.length === 0,
//     errors,
//   }
// }

// // Sanitize response data to ensure it's serializable
// const sanitizeResponse = (data: any) => {
//   if (data === null || data === undefined) {
//     return data
//   }

//   try {
//     // Use JSON.parse(JSON.stringify()) to remove non-serializable properties
//     return JSON.parse(JSON.stringify(data))
//   } catch (error) {
//     console.error('Failed to sanitize response:', error)
//     // Return a safe fallback
//     return {
//       hasError: true,
//       message: 'Response data could not be serialized',
//       timestamp: new Date().toISOString(),
//     }
//   }
// }

// export const checkoutOrder = async (orderData: OrderCreateData) => {
//   try {
//     logOrderDetails('CREATION_START', {
//       action: 'checkoutOrder',
//       orderType: orderData.orderType,
//       emailAddress: orderData.emailAddress,
//       productsCount: orderData.products?.length,
//       totalAmount: orderData.totalAmount,
//       deliveryMethod: orderData.deliveryMethod,
//       paymentRef: orderData.paymentRef?.reference,
//     })

//     // Validate order data
//     const validation = validateOrderData(orderData)
//     logOrderDetails('VALIDATION', validation)

//     if (!validation.isValid) {
//       const errorMessage = `Validation failed: ${validation.errors.join(', ')}`
//       logOrderDetails('VALIDATION_ERROR', { errors: validation.errors })

//       return sanitizeResponse({
//         hasError: true,
//         message: errorMessage,
//         validationErrors: validation.errors,
//       })
//     }

//     logOrderDetails('PAYLOAD_BEFORE_REQUEST', {
//       emailAddress: orderData.emailAddress,
//       productsCount: orderData.products.length,
//       totalAmount: orderData.totalAmount,
//     })

//     const response = await fetchWithAuth('/order/create', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(orderData),
//     })

//     logOrderDetails('HTTP_RESPONSE_STATUS', {
//       status: response.status,
//       statusText: response.statusText,
//       ok: response.ok,
//     })

//     // Get response text
//     const responseText = await response.text()
//     logOrderDetails('RAW_RESPONSE_LENGTH', { length: responseText.length })

//     if (!response.ok) {
//       logOrderDetails('HTTP_ERROR', {
//         status: response.status,
//         statusText: response.statusText,
//       })

//       // Try to parse error response
//       try {
//         const errorData = JSON.parse(responseText)
//         logOrderDetails('PARSED_ERROR_RESPONSE', {
//           message: errorData.message,
//           hasError: true,
//         })

//         return sanitizeResponse({
//           hasError: true,
//           message:
//             errorData.message ||
//             `HTTP ${response.status}: ${response.statusText}`,
//           status: response.status,
//         })
//       } catch (parseError) {
//         logOrderDetails('ERROR_PARSE_FAILED', {
//           parseError: 'Failed to parse error response',
//         })

//         return sanitizeResponse({
//           hasError: true,
//           message: `Failed to create order. Status: ${response.status}`,
//           status: response.status,
//         })
//       }
//     }

//     // Try to parse successful response
//     let responseData
//     try {
//       responseData = JSON.parse(responseText)
//       logOrderDetails('PARSED_SUCCESS_RESPONSE', { hasError: false })
//     } catch (parseError) {
//       logOrderDetails('SUCCESS_PARSE_ERROR', {
//         parseError: 'Failed to parse success response',
//       })

//       return sanitizeResponse({
//         hasError: true,
//         message: 'Failed to parse server response',
//       })
//     }

//     logOrderDetails('ORDER_CREATION_SUCCESS', {
//       hasError: false,
//     })

//     // Sanitize the response before returning
//     return sanitizeResponse(responseData)
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : 'Order creation failed'

//     logOrderDetails('ORDER_CREATION_EXCEPTION', {
//       error: errorMessage,
//       errorType: error?.constructor?.name || 'Unknown',
//     })

//     console.error('Order creation error:', error)

//     return sanitizeResponse({
//       hasError: true,
//       message: errorMessage,
//       timestamp: new Date().toISOString(),
//     })
//   }
// }

// export const checkoutShopmateOrder = async (orderData: ShopmateOrderData) => {
//   try {
//     logOrderDetails('SHOPMATE_CREATION_START', {
//       action: 'checkoutShopmateOrder',
//       orderType: orderData.orderType,
//       emailAddress: orderData.emailAddress,
//       owner: orderData.owner,
//       productsCount: orderData.products?.length,
//       totalAmount: orderData.totalAmount,
//       deliveryMethod: orderData.deliveryMethod,
//       paymentRef: orderData.paymentRef?.reference,
//     })

//     // Validate base order data
//     const validation = validateOrderData(orderData)

//     // Additional shopmate validation
//     if (!orderData.owner || !orderData.owner.trim()) {
//       validation.errors.push('owner is required for shopmate orders')
//       validation.isValid = false
//     }

//     logOrderDetails('SHOPMATE_VALIDATION', validation)

//     if (!validation.isValid) {
//       const errorMessage = `Shopmate validation failed: ${validation.errors.join(
//         ', '
//       )}`
//       logOrderDetails('SHOPMATE_VALIDATION_ERROR', {
//         errors: validation.errors,
//       })

//       return sanitizeResponse({
//         hasError: true,
//         message: errorMessage,
//         validationErrors: validation.errors,
//       })
//     }

//     logOrderDetails('SHOPMATE_PAYLOAD_BEFORE_REQUEST', {
//       emailAddress: orderData.emailAddress,
//       owner: orderData.owner,
//       productsCount: orderData.products.length,
//       totalAmount: orderData.totalAmount,
//     })

//     const response = await fetchWithAuth('/order/shopmate/create', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(orderData),
//     })

//     logOrderDetails('SHOPMATE_HTTP_RESPONSE_STATUS', {
//       status: response.status,
//       statusText: response.statusText,
//       ok: response.ok,
//     })

//     // Get response text
//     const responseText = await response.text()
//     logOrderDetails('SHOPMATE_RAW_RESPONSE_LENGTH', {
//       length: responseText.length,
//     })

//     if (!response.ok) {
//       logOrderDetails('SHOPMATE_HTTP_ERROR', {
//         status: response.status,
//         statusText: response.statusText,
//       })

//       // Try to parse error response
//       try {
//         const errorData = JSON.parse(responseText)
//         logOrderDetails('SHOPMATE_PARSED_ERROR_RESPONSE', {
//           message: errorData.message,
//           hasError: true,
//         })

//         return sanitizeResponse({
//           hasError: true,
//           message:
//             errorData.message ||
//             `HTTP ${response.status}: ${response.statusText}`,
//           status: response.status,
//         })
//       } catch (parseError) {
//         logOrderDetails('SHOPMATE_ERROR_PARSE_FAILED', {
//           parseError: 'Failed to parse error response',
//         })

//         return sanitizeResponse({
//           hasError: true,
//           message: `Failed to create shopmate order. Status: ${response.status}`,
//           status: response.status,
//         })
//       }
//     }

//     // Try to parse successful response
//     let responseData
//     try {
//       responseData = JSON.parse(responseText)
//       logOrderDetails('SHOPMATE_PARSED_SUCCESS_RESPONSE', { hasError: false })
//     } catch (parseError) {
//       logOrderDetails('SHOPMATE_SUCCESS_PARSE_ERROR', {
//         parseError: 'Failed to parse success response',
//       })

//       return sanitizeResponse({
//         hasError: true,
//         message: 'Failed to parse server response',
//       })
//     }

//     logOrderDetails('SHOPMATE_ORDER_CREATION_SUCCESS', {
//       hasError: false,
//     })

//     // Sanitize the response before returning
//     return sanitizeResponse(responseData)
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : 'Shopmate order creation failed'

//     logOrderDetails('SHOPMATE_ORDER_CREATION_EXCEPTION', {
//       error: errorMessage,
//       errorType: error?.constructor?.name || 'Unknown',
//     })

//     console.error('Shopmate order creation error:', error)

//     return sanitizeResponse({
//       hasError: true,
//       message: errorMessage,
//       timestamp: new Date().toISOString(),
//     })
//   }
// }

export interface OrderCreateData {
  emailAddress: string
  products: Array<{
    productID: string
    quantity: number
    price: number
    length?: number
    breadth?: number
    vendorID: string
  }>
  paymentRef: { reference: string }
  deliveryMethod: string
  paymentMethod: 'paystack'
  deliveryAddress: {
    addressString: string
    geoLocation: number[]
    postCode: string
  }
  deliveryFee: number
  taxFee: number
  totalAmount: number
  orderType: 'Testing' | 'shopmate' | 'customer'
  orderNotes?: string
  deliveryPlace: 'home' | 'fulfillment_center'
  pickupStation: string
}

export interface ShopmateOrderData extends OrderCreateData {
  owner: string
}

// Simple validation function
const validateOrderData = (
  orderData: OrderCreateData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check required fields
  if (!orderData.emailAddress?.trim()) errors.push('emailAddress is required')
  if (!orderData.products?.length) errors.push('products array is required')
  if (!orderData.paymentRef?.reference)
    errors.push('paymentRef.reference is required')
  if (!orderData.deliveryMethod) errors.push('deliveryMethod is required')
  if (!orderData.deliveryAddress?.addressString)
    errors.push('deliveryAddress.addressString is required')
  if (!orderData.deliveryAddress?.postCode)
    errors.push('deliveryAddress.postCode is required')
  if (
    !Array.isArray(orderData.deliveryAddress?.geoLocation) ||
    orderData.deliveryAddress.geoLocation.length !== 2
  ) {
    errors.push('deliveryAddress.geoLocation must be an array of 2 numbers')
  }
  if (orderData.totalAmount <= 0)
    errors.push('totalAmount must be greater than 0')
  if (!orderData.orderType) errors.push('orderType is required')
  if (!orderData.deliveryPlace) errors.push('deliveryPlace is required')
  if (!orderData.pickupStation) errors.push('pickupStation is required')

  // Validate products
  if (orderData.products) {
    orderData.products.forEach((product, index) => {
      if (!product.productID)
        errors.push(`products[${index}].productID is required`)
      if (!product.vendorID)
        errors.push(`products[${index}].vendorID is required`)
      if (!product.quantity || product.quantity <= 0)
        errors.push(`products[${index}].quantity must be greater than 0`)
      if (!product.price || product.price <= 0)
        errors.push(`products[${index}].price must be greater than 0`)
    })
  }

  return { isValid: errors.length === 0, errors }
}

// Safe response handler
const handleResponse = async (response: Response) => {
  console.log('Response status:', response.status, response.statusText)

  const responseText = await response.text()
  console.log('Response text length:', responseText.length)

  if (!response.ok) {
    console.error('HTTP error:', response.status, response.statusText)

    try {
      const errorData = JSON.parse(responseText)
      return {
        hasError: true,
        message:
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      }
    } catch (parseError) {
      return {
        hasError: true,
        message: `Failed to create order. Status: ${response.status}`,
        status: response.status,
      }
    }
  }

  try {
    const responseData = JSON.parse(responseText)
    console.log('Order creation successful')
    return responseData
  } catch (parseError) {
    console.error('Failed to parse success response:', parseError)
    return {
      hasError: true,
      message: 'Failed to parse server response',
    }
  }
}

export const checkoutOrder = async (orderData: OrderCreateData) => {
  console.log('Starting order creation')
  console.log('Order details:', {
    emailAddress: orderData.emailAddress,
    productsCount: orderData.products?.length,
    totalAmount: orderData.totalAmount,
    deliveryMethod: orderData.deliveryMethod,
    hasPaymentRef: !!orderData.paymentRef?.reference,
  })

  try {
    // Validate order data
    const validation = validateOrderData(orderData)
    if (!validation.isValid) {
      console.error('Validation failed:', validation.errors)
      return {
        hasError: true,
        message: `Validation failed: ${validation.errors.join(', ')}`,
        validationErrors: validation.errors,
      }
    }

    console.log('Validation passed, sending request...')

    const response = await fetchWithAuth('/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    return await handleResponse(response)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Order creation failed'
    console.error('Order creation exception:', errorMessage)

    return {
      hasError: true,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    }
  }
}

export const checkoutShopmateOrder = async (orderData: ShopmateOrderData) => {
  console.log('Starting shopmate order creation')
  console.log('Shopmate order details:', {
    emailAddress: orderData.emailAddress,
    owner: orderData.owner,
    productsCount: orderData.products?.length,
    totalAmount: orderData.totalAmount,
    deliveryMethod: orderData.deliveryMethod,
    hasPaymentRef: !!orderData.paymentRef?.reference,
  })

  try {
    // Validate base order data
    const validation = validateOrderData(orderData)

    // Additional shopmate validation
    if (!orderData.owner?.trim()) {
      validation.errors.push('owner is required for shopmate orders')
      validation.isValid = false
    }

    if (!validation.isValid) {
      console.error('Shopmate validation failed:', validation.errors)
      return {
        hasError: true,
        message: `Shopmate validation failed: ${validation.errors.join(', ')}`,
        validationErrors: validation.errors,
      }
    }

    console.log('Shopmate validation passed, sending request...')

    const response = await fetchWithAuth('/order/shopmate/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    return await handleResponse(response)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Shopmate order creation failed'
    console.error('Shopmate order creation exception:', errorMessage)

    return {
      hasError: true,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    }
  }
}
