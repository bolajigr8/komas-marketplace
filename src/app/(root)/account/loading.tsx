import Loader from '@/components/General/Loader';
import React from 'react'

const AccountLoading = () => {
  return (
    <div className="flex-1 flex items-center justify-center w-full h-[80vh] md:h-[700px] bg-white">
      <Loader />
    </div>
  );
}

export default AccountLoading