'use client'

import React from 'react'

type Props = {
  error: string
}

const ErrorDisplay = ({ error }: Props) => {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className='p-6 bg-red-50 rounded-lg text-center'>
      <h2 className='text-xl font-semibold text-red-600 mb-2'>Error</h2>
      <p>{error}</p>
      <button
        onClick={handleRetry}
        className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg'
      >
        Try Again
      </button>
    </div>
  )
}

export default ErrorDisplay
