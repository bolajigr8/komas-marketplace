'use server'

import { customFetch } from '.'
import { ShopmatesResponse } from '../types'

export const fetchShopmateAgents = async (): Promise<ShopmatesResponse> => {
  try {
    const url = '/shopmate/'

    const res = await customFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await res.json()
  } catch (error: any) {
    return {
      statusCode: error.code || 500, // Default to 500 if no error code is available
      hasError: true,
      message: 'Failed to fetch Shopmate Agents',
      data: null,
    }
  }
}
