'use server'

import { ApiResponse, FetchResult, LoginResponse } from '../types'
import { JWT } from 'next-auth/jwt'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export const refreshAccessToken = async (token: JWT): Promise<JWT | null> => {
  try {
    const res = await customFetch('/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.refreshToken}`,
      },
    })

    const { hasError, data } = (await res.json()) as LoginResponse

    if (hasError || !data) return null

    const { accessToken, refreshToken } = data

    return {
      ...token,
      accessToken,
      refreshToken,
    }
  } catch (error) {
    return null
  }
}

// use customFetch instead of fetch for interacting with the backend
// export const customFetch = async (
//   input: RequestInfo | URL,
//   init?: RequestInit
// ): Promise<Response> => {
//   return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, {
//     cache: "no-store",
//     next: { revalidate: 0 },
//     ...init,
//   })
// }
// !init?.method || init.method === 'GET' ? 'force-cache' : 'default'

// export const customFetch = async (
//   input: RequestInfo | URL,
//   init?: RequestInit
// ): Promise<Response> => {
//   return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, {
//     cache: !init?.method || init.method === 'GET' ? 'force-cache' : 'default',
//     ...init,
//   })
// }

// export const fetchWithAuth = async (
//   input: RequestInfo | URL,
//   init?: RequestInit
// ): Promise<Response> => {
//   const session = await auth()
// // console.log(session?.accessToken, input, init)
//   const headers = {
//     ...init?.headers,
//     Authorization: `Bearer ${session?.accessToken}`,
//   }

//   return await customFetch(input, { ...init, headers })
// }

// export const fetchWithAuth = async (
//   input: RequestInfo | URL,
//   init?: RequestInit
// ): Promise<Response> => {
//   const session = await auth()

//   const headers = {
//     ...init?.headers,
//     Authorization: `Bearer ${session?.accessToken}`,
//   }

//   return await customFetch(input, {
//     ...init,
//     headers,
//   })
// }

// export const getImageSrc = async ({
//   fileName,
//   folderName,
// }: {
//   fileName: string
//   folderName: string
// }): Promise<FetchResult<string | null>> => {
//   try {
//     const res = await customFetch(`/file/get/${folderName}/${fileName}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
// console.log("dd", res)
//     return await res.json()
//   } catch (error: any) {
//     console.log("dd")
//     return {
//       statusCode: error.code,
//       hasError: true,
//       message: 'Failed to fetch image',
//       data: null,
//     }
//   }
// }
// export const getImageSrc = async ({
//   fileName,
//   folderName,
// }: {
//   fileName: string;
//   folderName: string;
// }): Promise<string | null> => {
//   try {
//     const res = await customFetch(`/file/get/${folderName}/${fileName}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const jsonResponse = await res.json();

//     if (!jsonResponse || !jsonResponse.data) {
//       throw new Error("Invalid API response");
//     }

//     return jsonResponse.data;
//   } catch (error) {
//     console.error("Failed to fetch image:", error);
//     return null;
//   }
// };

// interface ApiResponse<T> {
//   data: T;
// }

export const getImageSrc = async ({
  fileName,
  folderName,
}: {
  fileName: string
  folderName: string
}): Promise<string> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AWS_URL}/${folderName}/${fileName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const jsonResponse = await res.json()
    // as ApiResponse<string>;
    if (!jsonResponse.data) {
      throw new Error('Invalid API response')
    }

    return jsonResponse.data
  } catch (error) {
    console.error('Failed to fetch image:', error)
    throw error
  }
}

// export const getImageSrc = async ({
//   fileName,
//   folderName,
// }: {
//   fileName: string;
//   folderName: string;
// }): Promise<string> => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_AWS_URL}/${folderName}/${fileName}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const jsonResponse = await res.json() as ApiResponse<string>;

//     if (!jsonResponse.data) {
//       throw new Error("Invalid API response");
//     }

//     return jsonResponse.data;
//   } catch (error) {
//     console.error("Failed to fetch image:", error);
//     throw error;
//   }
// };

export const handleRevalidatePath = (
  path: string,
  type?: 'layout' | 'page'
) => {
  revalidatePath(path, type)
}

// export const customFetch = async (
//   input: RequestInfo | URL,
//   init?: RequestInit
// ): Promise<Response> => {
//   const url = typeof input === 'string' ? input : input.toString()

//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
//       cache: !init?.method || init.method === 'GET' ? 'force-cache' : 'default',
//       ...init,
//     })

//     return response
//   } catch (error) {
//     console.error('Fetch error:', error)
//     throw error
//   }
// }

// lib/utils/fetchWithAuth.ts

export const customFetch = async (
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

// For server-side authentication (server actions, API routes)
export const fetchWithAuth = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  try {
    const session = await auth()

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

    // Log the request details (without sensitive data)
    console.log('Making authenticated request:', {
      url: input.toString(),
      method: init?.method || 'GET',
      hasAuth: headers.Authorization?.startsWith('Bearer '),
    })

    const response = await customFetch(input, {
      ...init,
      headers,
    })

    // Log response status
    console.log('Request completed:', {
      status: response.status,
      statusText: response.statusText,
      url: input.toString(),
    })

    return response
  } catch (error) {
    console.error('fetchWithAuth error:', error)
    throw error
  }
}
