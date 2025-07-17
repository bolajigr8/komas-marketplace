'use server'

import { revalidatePath } from 'next/cache'
import {
  customFetch,
  fetchCartWithAuth,
  fetchWithAuth,
  fetchWithAuthGeneral,
} from '.'
import { CartItem, FetchResult, Product, ProductsResponse } from '../types'

export const getProducts = async (params?: {
  page?: number
  perPage?: number
}): Promise<ProductsResponse> => {
  try {
    let res

    if (params) {
      res = await customFetch(
        `/product?page=${params.page}&perPage=${params.perPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } else {
      res = await customFetch(`/product`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    return await res.json()
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: 'Failed to fetch products',
      data: null,
    }
  }
}

export const getProductById = async (
  productId: string
): Promise<FetchResult<Product | null>> => {
  try {
    const res = await customFetch(`/product/${productId}`, {
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
      message: 'Failed to fetch product',
      data: null,
    }
  }
}

export const getProductsByName = async ({
  query,
  categoryId,
}: {
  query: string
  categoryId?: string
}): Promise<FetchResult<Product[] | null>> => {
  try {
    const res = await customFetch(`/product?name=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const products = (await res.json()) as FetchResult<Product[] | null>

    return categoryId
      ? {
          ...products,
          data:
            products.data?.filter((product) =>
              typeof product.category === 'string'
                ? product.category === categoryId
                : product.category._id === categoryId
            ) || null,
        }
      : products
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: 'Failed to fetch products',
      data: null,
    }
  }
}

export const getProductsByCategory = async (
  categoryId: string
): Promise<FetchResult<Product[] | null>> => {
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
      message: 'Failed to fetch products',
      data: null,
    }
  }
}

export const getProductsByVendor = async (
  vendorId: string
): Promise<FetchResult<Product[]>> => {
  try {
    const res = await customFetch(`/vendor/products/${vendorId}`, {
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
      message: 'Failed to fetch products',
      data: [],
    }
  }
}

export const getProductsByVendorCategory = async ({
  categoryId,
  vendorId,
}: {
  categoryId: string
  vendorId: string
}): Promise<FetchResult<Product[] | null>> => {
  try {
    const res = await getProductsByCategory(categoryId)

    return {
      ...res,
      data:
        res.data?.filter((product) =>
          typeof product.vendor === 'string'
            ? product.vendor === vendorId
            : product.vendor._id === vendorId
        ) || null,
    }
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: 'Failed to fetch products',
      data: null,
    }
  }
}

export const getVendorProductsByName = async ({
  vendorId,
  query,
  categoryId,
}: {
  vendorId: string
  query: string
  categoryId?: string
}): Promise<FetchResult<Product[] | null>> => {
  try {
    const res = categoryId
      ? await getProductsByVendorCategory({ categoryId, vendorId })
      : await getProductsByVendor(vendorId)

    return {
      ...res,
      data:
        res.data?.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        ) || null,
    }
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: error.message,
      data: null,
    }
  }
}

// export const addProductToCart = async ({
//   productId,
//   quantity,
// }: {
//   productId: string
//   quantity: number
// }): Promise<FetchResult<null>> => {
//   try {
//     const res = await fetchWithAuth(`/cart/add`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ productId, quantity }),
//     })

//     revalidatePath('/cart')

//     return await res.json()
//   } catch (error: any) {
//     return {
//       statusCode: error.code,
//       hasError: true,
//       message: 'Failed to add product to cart',
//       data: null,
//     }
//   }
// }

// export const removeProductFromCart = async ({
//   productId,
//   quantity,
// }: {
//   productId: string
//   quantity: number
// }): Promise<FetchResult<null>> => {
//   try {
//     const res = await fetchWithAuth(`/cart/remove`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ productId, quantity }),
//     })

//     revalidatePath('/cart')

//     return await res.json()
//   } catch (error: any) {
//     return {
//       statusCode: error.code,
//       hasError: true,
//       message: 'Failed to remove product from cart',
//       data: null,
//     }
//   }
// }

// export const getCartProducts = async (): Promise<
//   FetchResult<CartItem[] | null>
// > => {
//   try {
//     const res = await fetchWithAuth(`/cart`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     if (!res.ok) {
//       const errorText = await res.text()
//       return {
//         statusCode: res.status,
//         hasError: true,
//         message: `Failed to get cart products: ${res.statusText}`,
//         data: null,
//       }
//     }

//     const result = await res.json()
//     return result
//   } catch (error: any) {
//     console.error('Get cart products error:', error.message)
//     return {
//       statusCode: error.status || 500,
//       hasError: true,
//       message: error.message || 'Failed to get cart products',
//       data: null,
//     }
//   }
// }

// this get cart products uses the fetchwith auth that uses normal fetch instead of custom fetch

export const getCartProducts = async (): Promise<
  FetchResult<CartItem[] | null>
> => {
  try {
    const res = await fetchCartWithAuth(`/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Cart API Error Response:', {
        status: res.status,
        statusText: res.statusText,
        errorText,
      })
      return {
        statusCode: res.status,
        hasError: true,
        message: `Failed to get cart products: ${res.statusText}`,
        data: null,
      }
    }

    const result = await res.json()

    // Debug logging for successful response
    console.log('Cart API Success Response:', {
      dataLength: Array.isArray(result.data) ? result.data.length : 'not array',
      result,
    })

    return result
  } catch (error: any) {
    console.error('Get cart products error:', error.message)
    return {
      statusCode: error.status || 500,
      hasError: true,
      message: error.message || 'Failed to get cart products',
      data: null,
    }
  }
}

export const addProductToCart = async ({
  productId,
  quantity,
}: {
  productId: string
  quantity: number
}): Promise<FetchResult<null>> => {
  try {
    console.log('Adding product to cart:', { productId, quantity })

    const res = await fetchWithAuth(`/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })

    console.log('Add to cart response status:', res.status)

    // Check if the response is ok before parsing JSON
    if (!res.ok) {
      const errorText = await res.text()
      console.error('Add to cart failed:', errorText)
      return {
        statusCode: res.status,
        hasError: true,
        message: `Failed to add product to cart: ${res.statusText}`,
        data: null,
      }
    }

    const result = await res.json()
    console.log('Add to cart successful:', result)

    // Revalidate the cart path to refresh the UI
    revalidatePath('/cart')

    return result
  } catch (error: any) {
    console.error('Add to cart error:', error)
    return {
      statusCode: error.status || 500,
      hasError: true,
      message: error.message || 'Failed to add product to cart',
      data: null,
    }
  }
}

export const removeProductFromCart = async ({
  productId,
  quantity,
}: {
  productId: string
  quantity: number
}): Promise<FetchResult<null>> => {
  try {
    console.log('Removing product from cart:', { productId, quantity })

    const res = await fetchWithAuth(`/cart/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })

    console.log('Remove from cart response status:', res.status)

    // Check if the response is ok before parsing JSON
    if (!res.ok) {
      const errorText = await res.text()
      console.error('Remove from cart failed:', errorText)
      return {
        statusCode: res.status,
        hasError: true,
        message: `Failed to remove product from cart: ${res.statusText}`,
        data: null,
      }
    }

    const result = await res.json()
    console.log('Remove from cart successful:', result)

    // Revalidate the cart path to refresh the UI
    revalidatePath('/cart')

    return result
  } catch (error: any) {
    console.error('Remove from cart error:', error)
    return {
      statusCode: error.status || 500,
      hasError: true,
      message: error.message || 'Failed to remove product from cart',
      data: null,
    }
  }
}

// // Clear Cart
// export const clearCart = async (): Promise<{
//   statusCode: number
//   hasError: boolean
//   message: string
//   data: any
// }> => {
//   try {
//     const res = await fetchWithAuth('/cart/clear', {
//       method: 'GET',
//     })

//     return await res.json()
//   } catch (error: any) {
//     return {
//       statusCode: error.code || 500,
//       hasError: true,
//       message: 'Failed to clear cart',
//       data: null,
//     }
//   }
// }

export const clearCart = async (
  retryCount = 3
): Promise<{
  statusCode: number
  hasError: boolean
  message: string
  data: any
}> => {
  let lastError: any = null

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      console.log(
        `Attempting to clear server cart (attempt ${attempt}/${retryCount})`
      )

      const res = await fetchWithAuthGeneral('/cart/clear', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const result = await res.json()

      if (result.hasError) {
        throw new Error(result.message || 'Server returned error')
      }

      console.log('Server cart cleared successfully:', result)
      return result
    } catch (error: any) {
      lastError = error
      console.error(`Cart clear attempt ${attempt} failed:`, error)

      // If it's the last attempt, don't retry
      if (attempt === retryCount) {
        break
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  console.error('All cart clear attempts failed:', lastError)
  return {
    statusCode: lastError?.code || 500,
    hasError: true,
    message: `Failed to clear cart after ${retryCount} attempts: ${
      lastError?.message || 'Unknown error'
    }`,
    data: null,
  }
}
