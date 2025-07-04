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
  // const { data: session, status } = useSession();
  // const isLoggedIn = !!session?.user;
  const router = useRouter()
  const { toast } = useToast()
  const [isFetching, setIsFetching] = useState(false)

  // useEffect(() => {
  //   async function initialCartSync() {
  //     if (!isLoggedIn || status === "loading" || isFetching) return;

  //     setIsFetching(true);
  //     try {
  //       const response = await getCartProducts();
  //       const serverCartItems = response?.data || [];

  //       if (serverCartItems.length > 0) {
  //         serverCartItems.map((item) => {
  //           dispatch(
  //             cartActions.addToCart({
  //               product: item.product,
  //               quantity: item.quantity,
  //             })
  //           );
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch server cart:", error);
  //     } finally {
  //       setIsFetching(false);
  //     }
  //   }

  //   initialCartSync();
  // }, [dispatch, isLoggedIn, status, isFetching]);

  const syncServerCart = async () => {
    try {
      setIsFetching(true)

      const serverCartResponse = await getCartProducts()
      if (serverCartResponse.hasError) {
        throw new Error(serverCartResponse.message)
      }

      const serverCart =
        serverCartResponse.data?.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })) || []

      const cart = [...cartProducts, ...serverCart]
      dispatch(
        cartActions.setCart({
          cartItems: cart,
        })
      )

      console.log(cart)
      // if (serverCart.length > 0) {
      //   serverCart.map((item) => {
      //     dispatch(
      //       cartActions.addToCart({
      //         product: item.product,
      //         quantity: item.quantity,
      //       })
      //     );
      //   });
      // }
      toast({
        description: 'Your cart has been synchronized with your account',
      })

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
        // Sync carts after successful login
        const cartSyncSuccess = await syncServerCart()

        // Store 2FA preference
        localStorage.setItem('is2FAEnabled', (!res.data).toString())

        // Show success message
        toast({
          description: res.message || 'Signed in successfully',
        })

        // Handle redirection based on 2FA requirement
        if (res.data) {
          // No 2FA needed, redirect to intended page or home
          if (replaceHistory) {
            router.replace(callbackUrl || '/')
          } else {
            router.push(callbackUrl || '/')
          }
          onSuccess?.()
        } else {
          // 2FA needed, go to verification page
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
        isDisabled={form.formState.isSubmitting}
        isLoading={form.formState.isSubmitting}
        size='lg'
        className='bg-green-500 text-white font-semibold mt-4 rounded-lg'
      >
        {form.formState.isSubmitting
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
