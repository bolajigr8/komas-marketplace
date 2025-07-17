'use server'

import { fetchWithAuth } from '.'
// import { fetchWithAuth } from '.'
import {
  DeliveryMethodResponse,
  FetchResult,
  OrdersResponse,
  PromoCodeResponse,
} from '../types'

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

// promo code
export const applyPromoCode = async (params: {
  code: string
  orderAmount: number
}): Promise<PromoCodeResponse> => {
  try {
    const res = await fetchWithAuth('/promo-code/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: params.code,
        orderAmount: params.orderAmount,
      }),
    })

    return await res.json()
  } catch (error: any) {
    return {
      statusCode: error.code || 500,
      hasError: true,
      message: 'Failed to apply promo code',
      data: null,
    }
  }
}

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
