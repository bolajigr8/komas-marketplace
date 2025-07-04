import VerifyUserOtp from '@/components/AuthPages/VerifyUserOtp';
import React from 'react'
import { z } from 'zod';

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const schema = z.object({
  username: z.string().optional(),
  callbackUrl: z.string().optional()
})

const OTP = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  return (
    <div className="flex items-center justify-center flex-1 p-4 bg-white">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <p className="text-2xl text-center font-bold mb-2">
          Enter Verification Code
        </p>
        <VerifyUserOtp
          username={data?.username}
          callbackUrl={data?.callbackUrl}
        />
      </div>
    </div>
  );
}

export default OTP