import { customFetch } from '../server-actions'

// lib/utils/fetchWithAuth.ts
export const fetchWithAuth = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  token?: string
): Promise<Response> => {
  const headers = {
    ...init?.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  return customFetch(input, {
    ...init,
    headers,
  })
}
