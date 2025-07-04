import AuthForm from '@/components/AuthPages/AuthForm';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react'
import { z } from 'zod';

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account"
}

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const schema = z.object({
  callbackUrl: z.string().optional(),
});

const SignIn = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  return (
    <div className="flex items-center justify-center flex-1 p-4 bg-white">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <p className="text-2xl text-center font-bold mb-2">Sign In</p>
        <AuthForm action="login" callbackUrl={data?.callbackUrl} />
        <p>
          Don't have an account?{" "}
          <Link
            href={`/sign-up?${new URLSearchParams({
              callbackUrl: data?.callbackUrl || "",
            }).toString()}`}
            className="text-green-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn