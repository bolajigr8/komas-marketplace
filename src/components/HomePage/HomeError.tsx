'use client'

import { Button } from '@nextui-org/react'
import { ErrorComponent } from 'next/dist/client/components/error-boundary'
import React from 'react'

const HomeError: ErrorComponent = ({ error, reset }) => {
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-6 p-4">
      <h2 className="text-3xl font-bold">Something went wrong</h2>
      {process.env.NODE_ENV !== "production" && (
        <p className="text-lg">{error.message}</p>
      )}
      <Button
        size='lg'
        className="w-full max-w-32 h-10 bg-green-500 text-white rounded-md"
        onPress={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
}

export default HomeError