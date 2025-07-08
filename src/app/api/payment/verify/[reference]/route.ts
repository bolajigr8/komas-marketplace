// app/api/payment/verify/[reference]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// Types
interface PaystackVerificationResponse {
  status: boolean
  message: string
  data: {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: string | null
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: any
    log: any
    fees: number
    fees_split: any
    authorization: any
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: string
      metadata: any
      risk_action: string
      international_format_phone: string | null
    }
    plan: any
    subaccount: any
    split: any
    order_id: any
    paidAt: string
    requested_amount: number
    pos_transaction_data: any
    source: any
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    // Check authentication
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authentication required',
          hasError: true,
          data: {
            reference: '',
            status: 'unauthorized',
            amount: 0,
          },
        },
        { status: 401 }
      )
    }

    const { reference } = params

    // Validate reference
    if (!reference || reference.trim() === '') {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'Payment reference is required',
          hasError: true,
          data: {
            reference: '',
            status: 'invalid',
            amount: 0,
          },
        },
        { status: 400 }
      )
    }

    const cleanReference = reference.trim()

    // Get Paystack secret key from environment
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not found in environment variables')
      return NextResponse.json(
        {
          statusCode: 500,
          message: 'Payment service configuration error',
          hasError: true,
          data: {
            reference: cleanReference,
            status: 'config_error',
            amount: 0,
          },
        },
        { status: 500 }
      )
    }

    console.log('Verifying payment with Paystack:', {
      reference: cleanReference,
      userEmail: session.user?.email,
    })

    // Call Paystack API to verify payment
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        cleanReference
      )}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    console.log('Paystack API response:', {
      status: paystackResponse.status,
      statusText: paystackResponse.statusText,
      ok: paystackResponse.ok,
    })

    if (!paystackResponse.ok) {
      let errorMessage = 'Payment verification failed'
      let errorData = null

      try {
        errorData = await paystackResponse.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        console.error('Could not parse Paystack error response:', e)
      }

      // Handle specific Paystack errors
      switch (paystackResponse.status) {
        case 400:
          return NextResponse.json(
            {
              statusCode: 400,
              message: `Bad Request: ${errorMessage}`,
              hasError: true,
              data: {
                reference: cleanReference,
                status: 'invalid',
                amount: 0,
              },
            },
            { status: 400 }
          )
        case 404:
          return NextResponse.json(
            {
              statusCode: 404,
              message: `Payment reference "${cleanReference}" not found`,
              hasError: true,
              data: {
                reference: cleanReference,
                status: 'not_found',
                amount: 0,
              },
            },
            { status: 404 }
          )
        default:
          return NextResponse.json(
            {
              statusCode: paystackResponse.status,
              message: errorMessage,
              hasError: true,
              data: {
                reference: cleanReference,
                status: 'error',
                amount: 0,
              },
            },
            { status: paystackResponse.status }
          )
      }
    }

    const paystackData: PaystackVerificationResponse =
      await paystackResponse.json()

    console.log('Paystack verification successful:', {
      reference: paystackData.data.reference,
      status: paystackData.data.status,
      amount: paystackData.data.amount,
    })

    // Check if payment was successful
    const paymentStatus = paystackData.data.status.toLowerCase()
    const isSuccessful =
      paymentStatus === 'success' || paymentStatus === 'successful'

    if (!isSuccessful) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: `Payment verification failed. Status: ${paystackData.data.status}`,
          hasError: true,
          data: {
            reference: paystackData.data.reference,
            status: paystackData.data.status,
            amount: paystackData.data.amount / 100, // Convert from kobo to naira
          },
        },
        { status: 400 }
      )
    }

    // Payment successful - return success response
    return NextResponse.json(
      {
        statusCode: 200,
        message: 'Payment verified successfully',
        hasError: false,
        data: {
          reference: paystackData.data.reference,
          status: paystackData.data.status,
          amount: paystackData.data.amount / 100, // Convert from kobo to naira
          // Optional: include additional fields if needed
          customer: paystackData.data.customer,
          gateway_response: paystackData.data.gateway_response,
          paid_at: paystackData.data.paid_at,
          currency: paystackData.data.currency,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Payment verification error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to verify payment'

    return NextResponse.json(
      {
        statusCode: 500,
        message: `Internal server error: ${errorMessage}`,
        hasError: true,
        data: {
          reference: params.reference || '',
          status: 'error',
          amount: 0,
        },
      },
      { status: 500 }
    )
  }
}
