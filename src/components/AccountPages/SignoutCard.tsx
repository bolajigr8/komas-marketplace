'use client'

import React from 'react'
import { Button } from '@nextui-org/react';
import { signOut } from 'next-auth/react';

const SignoutCard = () => {
  const handleSignout = () => { 
    signOut({
      redirectTo: '/',
    })
  }
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4">
      <h2 className="text-xl font-semibold">Sign Out</h2>
      <p className="text-gray-500 px-4">
        Sign out your account from this device. This logs your account out of
        this device. Click Sign Out to continue.
      </p>
      <Button onPress={handleSignout} className="text-white bg-green-500 font-medium rounded-md p-2 px-6 md:w-[40%] lg:w-[30%] md:mx-auto">
        Sign Out
      </Button>
    </div>
  );
}

export default SignoutCard