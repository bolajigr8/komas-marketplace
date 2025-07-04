'use client'

import { Button } from '@nextui-org/react'
import React from 'react'

type PropsType = {
  error: Error
  reset: () => void
}

const ErrorPage = ({ error, reset }: PropsType) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-5 md:p-8 lg:p-14 h-[90vh]">
      <h2 className="text-2xl font-bold">{error.message}</h2>
      <p className="text-xl text-center font-semibold">
        Something went wrong. Please try again later.
      </p>
      <Button
        className='w-full max-w-[200px] p-4 bg-green-500 text-white font-medium rounded-md text-center'
        onPress={reset}
      >
        Try again
      </Button>
    </div>
  );
}

export default ErrorPage