import AccountInfoFormWrapper from '@/components/AccountPages/AccountInfoFormWrapper';
import Loader from '@/components/General/Loader';
import React, { Suspense } from 'react'

const EditUser = () => {
  return (
    <main className="bg-white w-full overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]">
      <div className="flex flex-col gap-4 py-2 mx-auto">
        <h2 className="text-xl font-semibold">Account Information</h2>
        <Suspense
          fallback={
            <div className="flex-1 h-[80vh] md:h-full flex items-center justify-center">
              <Loader className="!w-6" />
            </div>
          }
        >
          <AccountInfoFormWrapper />
        </Suspense>
      </div>
    </main>
  );
}

export default EditUser