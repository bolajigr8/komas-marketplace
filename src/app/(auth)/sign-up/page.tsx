import AuthForm from '@/components/AuthPages/AuthForm';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react'
import { z } from 'zod';

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an account",
};

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const schema = z.object({
  callbackUrl: z.string().optional()
})

const SignUp = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  return (
    <div className="flex items-center justify-center flex-1 p-4 bg-white">
      <div className='w-full md:w-1/2 flex flex-col gap-4'>
        <p className="text-2xl text-center font-bold mb-2">Create Account</p>
        <AuthForm action='register' callbackUrl={data?.callbackUrl} />
        <p>
          Already have an account?{" "}
          <Link href={`/sign-in?${new URLSearchParams({ callbackUrl: data?.callbackUrl || ''}).toString()}`} className="text-green-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp