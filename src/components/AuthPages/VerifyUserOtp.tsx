'use client'

import React, { useEffect, useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@nextui-org/react'
import { signIn, useSession } from 'next-auth/react'
import { addProductToCart, getCartProducts } from '@/lib/server-actions/product'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { CartItem } from '@/lib/types'

const formSchema = z.object({
  code: z.string().min(4).max(4),
  username: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type PropsType = {
  username?: string
  callbackUrl?: string
  replaceHistory?: boolean
  onClose?: () => void
  onSuccess?: () => void
}

const VerifyUserOtp = ({
  username,
  callbackUrl,
  replaceHistory,
  onClose,
  onSuccess,
}: PropsType) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      username: username || '',
      code: '',
    },
  })
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const { products: cartProducts } = useAppSelector((state) => state.cart)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (username) form.setValue('username', username)
  }, [username, form])

  const syncServerCart = async () => {
    try {
      setIsFetching(true)

      console.log('Starting cart sync after OTP verification...')
      console.log('Current local cart:', cartProducts)

      const serverCartResponse = await getCartProducts()
      if (serverCartResponse.hasError) {
        throw new Error(serverCartResponse.message)
      }

      const serverCartItems = serverCartResponse.data || []
      console.log('Server cart items:', serverCartItems)

      // Convert server cart to the format expected by Redux
      const serverCart = serverCartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }))

      // Handle empty carts
      if (serverCart.length === 0 && cartProducts.length === 0) {
        toast({
          description: 'Cart synchronized successfully',
        })
        return true
      }

      // Server cart is empty, but local cart has items - sync all local items to server
      if (serverCart.length === 0) {
        console.log('Server cart empty, syncing all local items to server...')

        const syncPromises = cartProducts.map((localItem) => {
          const productId = localItem.product._id
          if (productId) {
            console.log(
              `Syncing product ${productId} with quantity ${localItem.quantity}`
            )
            return addProductToCart({
              productId: productId,
              quantity: localItem.quantity,
            })
          }
          return Promise.resolve()
        })

        try {
          const syncResults = await Promise.all(syncPromises)
          console.log('Sync results:', syncResults)

          toast({
            description: `${cartProducts.length} items synchronized to your account`,
          })
          return true
        } catch (error) {
          console.error('Failed to sync local items to server:', error)
          toast({
            description: 'Some items failed to sync. Please try again.',
            variant: 'destructive',
          })
          return false
        }
      }

      // Local cart is empty, use server cart
      if (cartProducts.length === 0) {
        dispatch(cartActions.setCart({ cartItems: serverCart }))
        toast({
          description: 'Your cart has been synchronized with your account',
        })
        return true
      }

      // Both carts have items - merge them intelligently
      console.log('Both carts have items, merging...')
      const mergedCart: CartItem[] = []
      const processedProductIds = new Set<string>()
      const itemsToSyncToServer: CartItem[] = []

      // First, add all server cart items (server takes precedence)
      serverCart.forEach((serverItem) => {
        const productId = serverItem.product._id
        if (productId) {
          mergedCart.push(serverItem)
          processedProductIds.add(productId)
        }
      })

      // Then identify local cart items that don't exist in server cart
      cartProducts.forEach((localItem) => {
        const productId = localItem.product._id
        if (productId && !processedProductIds.has(productId)) {
          mergedCart.push(localItem)
          itemsToSyncToServer.push(localItem)
        }
      })

      console.log(
        'Items to sync to server:',
        itemsToSyncToServer.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }))
      )

      // IMPORTANT: Sync local-only items to server FIRST before updating Redux
      if (itemsToSyncToServer.length > 0) {
        const syncPromises = itemsToSyncToServer.map((item) => {
          const productId = item.product._id
          if (productId) {
            console.log(
              `Syncing guest item - Product: ${productId}, Quantity: ${item.quantity}`
            )
            return addProductToCart({
              productId: productId,
              quantity: item.quantity,
            })
          }
          return Promise.resolve()
        })

        try {
          const syncResults = await Promise.all(syncPromises)
          console.log('Guest items sync results:', syncResults)

          // Update Redux store only after successful server sync
          dispatch(cartActions.setCart({ cartItems: mergedCart }))

          toast({
            description: `Cart synchronized successfully. ${itemsToSyncToServer.length} guest items added to your account.`,
          })
        } catch (error) {
          console.error('Failed to sync guest items to server:', error)

          // Still update Redux with server items, but don't include failed local items
          dispatch(cartActions.setCart({ cartItems: serverCart }))

          toast({
            description: `Failed to sync ${itemsToSyncToServer.length} guest items to your account. Please try adding them again.`,
            variant: 'destructive',
          })
          return false
        }
      } else {
        // No local items to sync, just use merged cart (server items only)
        dispatch(cartActions.setCart({ cartItems: mergedCart }))
        toast({
          description: `Cart synchronized successfully. ${mergedCart.length} items in your cart.`,
        })
      }

      return true
    } catch (error) {
      console.error('Failed to sync carts:', error)
      toast({
        description: 'Failed to sync your cart. Please try again later.',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (value: string) => {
    form.setValue('code', value)
  }

  const handleNavigation = () => {
    const targetUrl = callbackUrl || '/'
    console.log('Attempting to navigate to:', targetUrl)

    if (replaceHistory) {
      console.log('Using router.replace')
      router.replace(targetUrl)
    } else {
      console.log('Using router.push')
      router.push(targetUrl)
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (!data.username) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
      return
    }

    console.log('Starting OTP verification...')

    // Verify OTP with NextAuth
    const res = await signIn('credentials', {
      ...data,
      username: data.username,
      password: '',
      redirect: false,
    })

    if (res?.error) {
      toast({
        description: res.error,
        variant: 'destructive',
      })
      return
    }

    console.log('OTP verification successful, starting cart sync...')

    // Sync carts after successful OTP verification
    const cartSyncSuccess = await syncServerCart()

    if (!cartSyncSuccess) {
      console.warn('Cart sync failed, but continuing with login flow')
    }

    // Display a success toast to the user
    toast({
      description: 'OTP verified successfully',
    })

    // Call success callback if provided
    if (onSuccess) {
      console.log('Calling onSuccess callback')
      onSuccess()
    }

    // Handle navigation based on whether this is a modal or standalone page
    if (onClose) {
      console.log('Modal context detected, closing modal first')
      onClose()

      // Add a small delay to let the modal close animation complete
      setTimeout(() => {
        handleNavigation()
      }, 300)
    } else {
      console.log('Standalone page context, navigating immediately')
      // Add a small delay to ensure all async operations complete
      setTimeout(() => {
        handleNavigation()
      }, 100)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
      <InputOTP
        maxLength={4}
        pattern={REGEXP_ONLY_DIGITS}
        value={form.watch('code')}
        onChange={handleChange}
        containerClassName='mx-auto'
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <React.Fragment key={index}>
            <InputOTPGroup>
              <InputOTPSlot index={index} className='size-14 text-xl' />
            </InputOTPGroup>
            {index !== 3 && <InputOTPSeparator />}
          </React.Fragment>
        ))}
      </InputOTP>
      <Button
        type='submit'
        isDisabled={form.formState.isSubmitting || isFetching}
        isLoading={form.formState.isSubmitting || isFetching}
        size='lg'
        className='bg-green-500 text-white rounded-md font-medium'
      >
        {form.formState.isSubmitting || isFetching ? 'Verifying...' : 'Verify'}
      </Button>
    </form>
  )
}

export default VerifyUserOtp
