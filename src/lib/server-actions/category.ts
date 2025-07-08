'use server'

import { customFetch } from '.'
import { Category, FetchResult } from '../types'

export const getCategories = async (
  query?: string
): Promise<FetchResult<Category[] | null>> => {
  try {
    const res = await customFetch(`/product/category`, {
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
      message: 'Failed to fetch categories',
      data: null,
    }
  }
}

export const getCategoryById = async (
  categoryId: string
): Promise<FetchResult<Category | null>> => {
  try {
    const res = await customFetch(`/product/category/${categoryId}`, {
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
      message: 'Failed to fetch category',
      data: null,
    }
  }
}

export const getCategoriesByVendor = async (
  vendorId: string
): Promise<FetchResult<Category[]>> => {
  try {
    const res = await customFetch(`/vendor/categories/${vendorId}`, {
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
      message: 'Failed to fetch categories',
      data: [],
    }
  }
}
