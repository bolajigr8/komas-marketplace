import React from 'react'
import AccountInfoForm from './AccountInfoForm'
import { auth } from '@/auth'

type PropsType = {
  isIntercepted?: boolean
}

const AccountInfoFormWrapper = async ({ isIntercepted }: PropsType) => {
  const session = await auth();

  const user = session?.user;
  
  return <AccountInfoForm user={user!} isIntercepted={isIntercepted} />
}

export default AccountInfoFormWrapper