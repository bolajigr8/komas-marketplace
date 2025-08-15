// 'use server'

// import { customFetch } from '.'
// import { PickupStationsResponse } from '../types'

// export const fetchPickupStations = async (params?: {
//   state?: string
//   perPage?: number
// }): Promise<PickupStationsResponse> => {
//   try {
//     let url = '/pickup-station/'

//     // Check if state is provided and append it to the URL as a query parameter
//     if (params?.state) {
//       url = `${url}?state=${encodeURIComponent(params.state)}`
//     }

//     // Optionally handle pagination with perPage
//     if (params?.perPage) {
//       url = `${url}&perPage=${params.perPage}`
//     }

//     const res = await customFetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     return await res.json()
//   } catch (error: any) {
//     return {
//       statusCode: error.code,
//       hasError: true,
//       message: 'Failed to fetch pickup stations',
//       data: null,
//     }
//   }
// }

'use server'

import { customFetch } from '.'
import { PickupStationsResponse } from '../types'

export const fetchPickupStations = async (params?: {
  region?: string
  perPage?: number
}): Promise<PickupStationsResponse> => {
  try {
    let url = '/pickup-station/'

    // Check if region is provided and append it to the URL as a query parameter
    if (params?.region) {
      url = `${url}?region=${encodeURIComponent(params.region)}`
    }

    // Optionally handle pagination with perPage
    if (params?.perPage) {
      url = `${url}&region=${params.region}&perPage=${params.perPage}`
    }

    const res = await customFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await res.json()
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: 'Failed to fetch pickup stations',
      data: null,
    }
  }
}
