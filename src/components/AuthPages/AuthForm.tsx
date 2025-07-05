'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/lib/schemas'
import Link from 'next/link'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  createUser,
  loginUser,
  resetPassword,
  sendPasswordResetCode,
} from '@/lib/server-actions/auth'
import { Button, Input } from '@nextui-org/react'
import { signIn, useSession } from 'next-auth/react'
import { addProductToCart, getCartProducts } from '@/lib/server-actions/product'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { CartItem } from '@/lib/types'

type Action = 'register' | 'login' | 'forgot-password'

type FormValues<T extends Action> = T extends 'register'
  ? z.infer<typeof registerSchema>
  : T extends 'login'
  ? z.infer<typeof loginSchema>
  : z.infer<typeof forgotPasswordSchema>

const formSchema = {
  register: registerSchema,
  login: loginSchema,
  'forgot-password': forgotPasswordSchema,
}

interface PropsType<T extends Action> {
  action: T
  callbackUrl?: string // redirect to this page after successful login
  replaceHistory?: boolean
  resetPasswordCode?: string
  onSuccess?: () => void
}

const AuthForm = <T extends Action>({
  action,
  callbackUrl,
  replaceHistory,
  resetPasswordCode,
  onSuccess,
}: PropsType<T>) => {
  const form = useForm<FormValues<'register'>>({
    resolver: zodResolver(formSchema[action]),
    mode: 'all',
  })
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { products: cartProducts } = useAppSelector((state) => state.cart)
  const router = useRouter()
  const { toast } = useToast()
  const [isFetching, setIsFetching] = useState(false)

  const syncServerCart = async () => {
    try {
      setIsFetching(true)

      console.log('Starting cart sync...')
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

  const onSubmit = async (data: FormValues<'register'>) => {
    console.log('Form submitted for action:', action)

    if (action === 'register') {
      // Create a new user with the provided data
      const res = await createUser(data)

      // Display success or error message based on the response
      if (res.hasError)
        return toast({
          description: res.message,
          variant: 'destructive',
        })

      toast({
        description: res.message,
      })

      // Set is2FAEnabled in localStorage
      localStorage.setItem('is2FAEnabled', 'true')

      const searchParams = new URLSearchParams({
        username: data.emailAddress,
        callbackUrl: callbackUrl || '',
      })

      // Redirect to OTP verification with optional redirect URL
      replaceHistory
        ? router.replace(`/otp-verify?${searchParams.toString()}`)
        : router.push(`/otp-verify?${searchParams.toString()}`)
    } else if (action === 'login') {
      console.log('Starting login process...')
      console.log('Current cart before login:', cartProducts)

      // Login flow
      const res = await loginUser({
        username: data.emailAddress,
        password: data.password,
      })

      // Display error message if login failed
      if (res.hasError) {
        toast({
          description: res.message,
          variant: 'destructive',
        })
        return
      }

      // Sign in with NextAuth
      const signInRes = await signIn('credentials', {
        username: data.emailAddress,
        password: data.password,
        code: '',
        redirect: false,
      })

      // Handle sign-in errors
      if (signInRes?.error) {
        toast({
          description: signInRes.error,
          variant: 'destructive',
        })
        return
      }

      // If login was successful
      if (res.data !== undefined) {
        console.log('Login successful, starting cart sync...')

        // Sync carts after successful login
        const cartSyncSuccess = await syncServerCart()

        if (!cartSyncSuccess) {
          console.warn('Cart sync failed, but continuing with login flow')
        }

        // Store 2FA preference
        localStorage.setItem('is2FAEnabled', (!res.data).toString())

        // Show success message
        toast({
          description: res.message || 'Signed in successfully',
        })

        // Handle redirection based on 2FA requirement
        if (res.data) {
          // No 2FA needed, redirect to intended page or home
          console.log('No 2FA required, redirecting...')
          if (replaceHistory) {
            router.replace(callbackUrl || '/')
          } else {
            router.push(callbackUrl || '/')
          }
          onSuccess?.()
        } else {
          // 2FA needed, go to verification page
          console.log('2FA required, redirecting to OTP verification...')
          const searchParams = new URLSearchParams({
            username: data.emailAddress,
            callbackUrl: callbackUrl || '',
          })

          if (replaceHistory) {
            router.replace(`/otp-verify?${searchParams.toString()}`)
          } else {
            router.push(`/otp-verify?${searchParams.toString()}`)
          }
        }
      }
    } else if (action === 'forgot-password') {
      // Send password reset email
      const res = await sendPasswordResetCode(data.emailAddress)

      // Display error message if sending code failed
      if (res.hasError)
        return toast({
          description: res.message,
          variant: 'destructive',
        })

      toast({
        description: res.message,
      })

      const searchParams = new URLSearchParams({
        email: data.emailAddress,
        callbackUrl: callbackUrl || '',
      })

      // Redirect to forgot password reset page with optional redirect URL
      replaceHistory
        ? router.replace(`/forgot-password?${searchParams.toString()}`)
        : router.push(`/forgot-password?${searchParams.toString()}`)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-3'>
      {action === 'register' && (
        <Input
          label='Full Name'
          size='lg'
          variant='underlined'
          color='success'
          isInvalid={!!form.formState.errors.fullName}
          {...form.register('fullName')}
          errorMessage={form.formState.errors.fullName?.message}
          classNames={{
            label: 'font-medium text-black',
          }}
        />
      )}

      <Input
        type='email'
        label='Email'
        size='lg'
        variant='underlined'
        color='success'
        isInvalid={!!form.formState.errors.emailAddress}
        {...form.register('emailAddress')}
        errorMessage={form.formState.errors.emailAddress?.message}
        classNames={{
          label: 'font-medium text-black',
        }}
      />

      {action !== 'forgot-password' && (
        <Input
          type={showPassword ? 'text' : 'password'}
          label={'Password'}
          size='lg'
          variant='underlined'
          color='success'
          isInvalid={!!form.formState.errors.password}
          {...form.register('password')}
          errorMessage={form.formState.errors.password?.message}
          endContent={
            <ToggleShow
              show={showPassword}
              setShow={setShowPassword}
              className={`${form.formState.errors.password && 'text-red-500'}`}
            />
          }
          classNames={{
            label: 'font-medium text-black',
          }}
        />
      )}

      {['register'].includes(action) && (
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          label={'Confirm Password'}
          size='lg'
          variant='underlined'
          color='success'
          isInvalid={!!form.formState.errors.confirmPassword}
          {...form.register('confirmPassword')}
          errorMessage={form.formState.errors.confirmPassword?.message}
          endContent={
            <ToggleShow
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              className={`${
                form.formState.errors.confirmPassword && 'text-red-500'
              }`}
            />
          }
          classNames={{
            label: 'font-medium text-black',
          }}
        />
      )}

      {action === 'forgot-password' && (
        <Link
          href={`/sign-in?${new URLSearchParams({
            callbackUrl: callbackUrl || '',
          }).toString()}`}
          replace={replaceHistory}
          className='text-green-500 text-sm font-medium ml-auto'
        >
          Back to Sign In
        </Link>
      )}

      {action === 'login' && (
        <Link
          href={`/forgot-password?${new URLSearchParams({
            callbackUrl: callbackUrl || '',
          }).toString()}`}
          replace={replaceHistory}
          className='text-green-500 text-sm font-medium ml-auto'
        >
          Forgot Password?
        </Link>
      )}

      <Button
        type='submit'
        isDisabled={form.formState.isSubmitting || isFetching}
        isLoading={form.formState.isSubmitting || isFetching}
        size='lg'
        className='bg-green-500 text-white font-semibold mt-4 rounded-lg'
      >
        {form.formState.isSubmitting || isFetching
          ? 'Submitting...'
          : action === 'register'
          ? 'Create Account'
          : action === 'login'
          ? 'Sign In'
          : action === 'forgot-password'
          ? 'Receive Code'
          : 'Reset Password'}
      </Button>
    </form>
  )
}

export default AuthForm

type ShowProps = {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

const ToggleShow = ({ show, setShow, className }: ShowProps) => {
  return (
    <label
      className={`text-green-500 grid place-content-center transition-colors cursor-pointer ${className}`}
    >
      {show ? (
        <FaRegEye size={20} className='relative' />
      ) : (
        <FaRegEyeSlash size={20} className='relative' />
      )}
      <input
        type='checkbox'
        name='show'
        className='hidden'
        checked={show}
        onChange={() => setShow(!show)}
      />
    </label>
  )
}
