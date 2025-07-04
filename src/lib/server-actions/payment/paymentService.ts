import { fetchWithAuthClient } from '.'

export interface PaymentInitiateData {
  amount: string
  email: string
  currency: 'NGN'
}

export interface PaymentInitiateResponse {
  statusCode: number
  message: string
  hasError: boolean
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaymentVerifyResponse {
  statusCode: number
  message: string
  hasError: boolean
  data: {
    reference: string
    status: string
    amount: number
    customer?: any
    gateway_response?: string
    paid_at?: string
    currency?: string
  }
}

// Client-side payment initiation
export const initiatePayment = async (
  paymentData: PaymentInitiateData
): Promise<PaymentInitiateResponse> => {
  try {
    console.log('Initiating payment with data:', {
      amount: paymentData.amount,
      email: paymentData.email,
      currency: paymentData.currency,
    })

    const response = await fetchWithAuthClient('/payment/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    // Check if response is ok before parsing
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Payment initiation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })

      let errorMessage = 'Failed to initiate payment'
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }

      return {
        statusCode: response.status,
        message: errorMessage,
        hasError: true,
        data: {
          authorization_url: '',
          access_code: '',
          reference: '',
        },
      }
    }

    const result = await response.json()

    console.log('Payment initiation response:', {
      status: response.status,
      hasError: result.hasError,
      message: result.message,
    })

    return {
      statusCode: response.status,
      message: result.message || 'Payment initiated successfully',
      hasError: result.hasError || false,
      data: result.data || {
        authorization_url: '',
        access_code: '',
        reference: '',
      },
    }
  } catch (error) {
    console.error('Payment initiation error:', error)

    // Handle different types of errors
    let errorMessage = 'Payment initiation failed'

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    return {
      statusCode: 500,
      message: errorMessage,
      hasError: true,
      data: {
        authorization_url: '',
        access_code: '',
        reference: '',
      },
    }
  }
}

// Client-side payment verification
// export const verifyPayment = async (
//   reference: string
// ): Promise<PaymentVerifyResponse> => {
//   try {
//     if (!reference || reference.trim() === '') {
//       return {
//         statusCode: 400,
//         message: 'Payment reference is required',
//         hasError: true,
//         data: {
//           reference: '',
//           status: 'invalid',
//           amount: 0,
//         },
//       }
//     }

//     const cleanReference = reference.trim()

//     console.log('Verifying payment with reference:', cleanReference)

//     const response = await fetchWithAuthClient(
//       `/payment/verify/${encodeURIComponent(cleanReference)}`,
//       {
//         method: 'GET',
//       }
//     )

//     // Check if response is ok before parsing
//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error('Payment verification failed:', {
//         status: response.status,
//         statusText: response.statusText,
//         error: errorText,
//       })

//       let errorMessage = 'Payment verification failed'
//       let verificationData = {
//         reference: cleanReference,
//         status: 'error',
//         amount: 0,
//       }

//       try {
//         const errorJson = JSON.parse(errorText)
//         errorMessage = errorJson.message || errorMessage
//         if (errorJson.data) {
//           verificationData = {
//             ...verificationData,
//             ...errorJson.data,
//           }
//         }
//       } catch {
//         // If parsing fails, use default values
//       }

//       return {
//         statusCode: response.status,
//         message: errorMessage,
//         hasError: true,
//         data: verificationData,
//       }
//     }

//     const result = await response.json()

//     console.log('Payment verification response:', {
//       status: response.status,
//       hasError: result.hasError,
//       message: result.message,
//       paymentStatus: result.data?.status,
//     })

//     return {
//       statusCode: response.status,
//       message: result.message || 'Payment verified successfully',
//       hasError: result.hasError || false,
//       data: result.data || {
//         reference: cleanReference,
//         status: 'error',
//         amount: 0,
//       },
//     }
//   } catch (error) {
//     console.error('Payment verification error:', error)

//     let errorMessage = 'Payment verification failed'

//     if (error instanceof Error) {
//       errorMessage = error.message
//     } else if (typeof error === 'string') {
//       errorMessage = error
//     }

//     return {
//       statusCode: 500,
//       message: errorMessage,
//       hasError: true,
//       data: {
//         reference: reference || '',
//         status: 'error',
//         amount: 0,
//       },
//     }
//   }
// }

// Updated verifyPayment function with better debugging
export const verifyPayment = async (
  reference: string
): Promise<PaymentVerifyResponse> => {
  try {
    if (!reference || reference.trim() === '') {
      return {
        statusCode: 400,
        message: 'Payment reference is required',
        hasError: true,
        data: {
          reference: '',
          status: 'invalid',
          amount: 0,
        },
      }
    }

    const cleanReference = reference.trim()

    console.log('Verifying payment with reference:', cleanReference)

    // Debug: Log the full URL being constructed
    const endpoint = `/payment/verify/${encodeURIComponent(cleanReference)}`
    console.log('API endpoint:', endpoint)
    console.log('Base URL:', process.env.NEXT_PUBLIC_API_URL)
    console.log(
      'Full URL will be:',
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
    )

    const response = await fetchWithAuthClient(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // If your backend expects the reference in the request body instead of URL params
      // body: JSON.stringify({ reference: cleanReference }),
    })

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url, // This will show the actual URL that was called
    })

    // Check if response is ok before parsing
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Payment verification failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        actualURL: response.url, // Log the actual URL that failed
      })

      let errorMessage = 'Payment verification failed'
      let verificationData = {
        reference: cleanReference,
        status: 'error',
        amount: 0,
      }

      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorMessage
        if (errorJson.data) {
          verificationData = {
            ...verificationData,
            ...errorJson.data,
          }
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError)
        // If parsing fails, use the raw error text
        errorMessage = errorText || errorMessage
      }

      return {
        statusCode: response.status,
        message: errorMessage,
        hasError: true,
        data: verificationData,
      }
    }

    const result = await response.json()

    console.log('Payment verification response:', {
      status: response.status,
      hasError: result.hasError,
      message: result.message,
      paymentStatus: result.data?.status,
    })

    return {
      statusCode: response.status,
      message: result.message || 'Payment verified successfully',
      hasError: result.hasError || false,
      data: result.data || {
        reference: cleanReference,
        status: 'error',
        amount: 0,
      },
    }
  } catch (error) {
    console.error('Payment verification error:', error)

    let errorMessage = 'Payment verification failed'

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    return {
      statusCode: 500,
      message: errorMessage,
      hasError: true,
      data: {
        reference: reference || '',
        status: 'error',
        amount: 0,
      },
    }
  }
}
