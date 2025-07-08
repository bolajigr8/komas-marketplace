import { Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react'

const VendorNotFound = () => {
  return (
    <main className="w-full h-[90vh] flex flex-col gap-10 items-center justify-center">
      <h1 className="text-3xl font-bold">Vendor Not Found</h1>
      <p className="text-center">
        The vendor you are looking for does not exist.
      </p>
      <p className="text-center">Please check the URL and try again.</p>
      <Button className='p-0 w-fit h-fit'>
        <Link
          href="/store"
          className="text-white font-medium bg-green-500 p-4 rounded-md"
        >
          Back to Stores
        </Link>
      </Button>
    </main>
  );
}

export default VendorNotFound