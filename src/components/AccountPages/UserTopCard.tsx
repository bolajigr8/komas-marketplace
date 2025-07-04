'use client'

import { Skeleton, User } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'

const UserTopCard = () => {
  const { data: session, status } = useSession()

  const user = session?.user
  return (
    <Skeleton
      isLoaded={status !== "loading"}
      className='rounded-xl'
    >
      <User
        name={user?.fullName}
        description={user?.emailAddress}
        avatarProps={{
          src: user?.profileUrl,
          showFallback: true,
          size: "lg",
        }}
        classNames={{
          base: "justify-start p-4 rounded-xl bg-gray-100 w-full",
          wrapper: "gap-2",
          name: "md:text-xl font-semibold",
          description: "text-gray-500",
        }}
      />
    </Skeleton>
  );
}

export default UserTopCard