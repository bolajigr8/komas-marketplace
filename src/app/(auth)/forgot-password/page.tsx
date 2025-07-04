import AuthForm from '@/components/AuthPages/AuthForm';
import ForgotPasswordOtp from '@/components/AuthPages/ForgotPasswordOtp';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react'
import { z } from 'zod';

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your password",
}

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const schema = z.object({
  email: z.string().email().optional(),
  callbackUrl: z.string().optional()
})

const ForgotPassword = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  return (
    <div className="flex items-center justify-center flex-1 p-4 bg-white">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <p className="text-2xl text-center font-bold mb-2">
          {data?.email ? "Enter Verification Code" : "Forgot Password"}
        </p>
        {data?.email ? <ForgotPasswordOtp email={data?.email} callbackUrl={data?.callbackUrl} /> : <AuthForm action="forgot-password" callbackUrl={data?.callbackUrl} />}
        <p>
          Don't have an account?{" "}
          <Link href={`/sign-up?${new URLSearchParams({ callbackUrl: data?.callbackUrl || ''}).toString()}`} className="text-green-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword