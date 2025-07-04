import Loader from '@/components/General/Loader'
import React from 'react'

const ModalLoading = () => {
  return (
    <div className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center animate-opacity'>
      <Loader />
    </div>
  )
}

export default ModalLoading