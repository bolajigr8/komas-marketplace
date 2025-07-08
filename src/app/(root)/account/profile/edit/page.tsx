import AccountInfoDisplay from '@/components/AccountPages/AccountInfoDisplay'
import EditSection from '@/components/AccountPages/EditSection'
import { Metadata } from 'next'
import Link from 'next/link'
import React, { CSSProperties } from 'react'
import { LiaUserEditSolid } from 'react-icons/lia'

export const metadata: Metadata = {
  title: 'Edit Account',
  description: 'Edit your KOMAS500 account',
}

const EditAccount = () => {
  return (
    <main className="flex-1 bg-white overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]">
      <EditSection>
        <AccountInfoDisplay
          controls={
            <Link aria-label='Edit Profile' href={"/account/profile/edit/me"}>
              <LiaUserEditSolid size={20} className="text-green-500" />
            </Link>
          }
        />
      </EditSection>
    </main>
  );
}

export default EditAccount