import { Shopmate } from '@/lib/types'
import { Avatar } from '@nextui-org/react'
import React from 'react'

type PropsType = {
  user: Shopmate // Expect the full Shopmate object
  description: keyof Shopmate['admin'] // Ensure it matches keys in admin
}

const UserAutocompleteCard = ({ user, description }: PropsType) => {
  const admin = user.admin

  return (
    <div className='flex gap-2 items-center'>
      <Avatar
        alt={admin.fullName}
        className='flex-shrink-0'
        size='sm'
        src={admin.profileUrl || ''}
      />
      <div className='flex flex-col'>
        <span className='text-small'>{admin.fullName}</span>
        <span className='text-tiny text-default-400'>
          {admin[description]?.toString() || ''}
        </span>
      </div>
    </div>
  )
}

export default UserAutocompleteCard
