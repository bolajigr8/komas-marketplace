'use client'
import AuthForm from '@/components/AuthPages/AuthForm'
import InterceptModal from '@/components/General/InterceptModal'
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { CSSProperties } from 'react'
import { z } from 'zod'

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const schema = z.object({
  callbackUrl: z.string().optional(),
})

const InterceptedSignUp = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  const [isOpen, setIsOpen] = React.useState(true)
  const router = useRouter()

  const callbackUrl = data?.callbackUrl || 'https://example.com/dashboard'
  // const callbackUrl = 'https://komas-blacksales.vercel.app/reg-success'

  const handlePrivacyPolicyClick = () => {
    setIsOpen(false)
    router.push('/privacy-policy')
  }

  return (
    <InterceptModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalHeader className='text-xl text-center font-bold mb-1 py-2'>
        Create Account
      </ModalHeader>
      <ModalBody className='py-2'>
        <div className='space-y-3'>
          <AuthForm
            action='register'
            callbackUrl={callbackUrl}
            replaceHistory
            onSuccess={() => setIsOpen(false)}
          />
          <p className='text-xs text-gray-600 text-center'>
            By creating an account, you agree to Komas500{' '}
            <Link
              href='/privacy-policy'
              // target='_blank'
              onClick={handlePrivacyPolicyClick}
              rel='noopener noreferrer'
              className='text-green-500 cursor-pointer hover:underline'
            >
              Conditions of use and Privacy notice
            </Link>
          </p>
        </div>
      </ModalBody>
      <ModalFooter className='justify-start py-2'>
        <p className='text-sm'>
          Already have an account?{' '}
          <Link
            replace
            href={`/sign-in?${new URLSearchParams({
              callbackUrl: callbackUrl,
            }).toString()}`}
            className='text-green-500'
          >
            Login
          </Link>
        </p>
      </ModalFooter>
    </InterceptModal>
  )
}

export default InterceptedSignUp
