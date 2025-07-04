'use client'

import { getSession } from 'next-auth/react'

// Client-side custom fetch function
const customFetchClient = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString()

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      cache: !init?.method || init.method === 'GET' ? 'force-cache' : 'default',
      ...init,
    })

    return response
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// Also update your fetchWithAuthClient to add more debugging
export const fetchWithAuthClient = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  try {
    // Use getSession for client-side components
    const session = await getSession()

    // Debug logging
    console.log('Session check:', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      tokenPreview: session?.accessToken
        ? `${session.accessToken.substring(0, 10)}...`
        : 'none',
    })

    // Check if session exists and has access token
    if (!session) {
      console.error('No session found')
      throw new Error('Authentication required: No session found')
    }

    if (!session.accessToken) {
      console.error('No access token in session')
      throw new Error('Authentication required: No access token')
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init?.headers,
      Authorization: `Bearer ${session.accessToken}`,
    }

    // Debug: Log the full URL being constructed
    const url = typeof input === 'string' ? input : input.toString()
    const fullURL = `${process.env.NEXT_PUBLIC_API_URL}${url}`

    console.log('Making authenticated request:', {
      endpoint: url,
      fullURL: fullURL,
      method: init?.method || 'GET',
      hasAuth: headers.Authorization?.startsWith('Bearer '),
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    })

    const response = await customFetchClient(input, {
      ...init,
      headers,
    })

    // Log response status
    console.log('Request completed:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      ok: response.ok,
    })

    return response
  } catch (error) {
    console.error('fetchWithAuth error:', error)
    throw error
  }
}
