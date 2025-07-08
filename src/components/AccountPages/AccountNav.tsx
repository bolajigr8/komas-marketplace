import React from 'react'
import Tabs, { Tab, TabsList } from '../General/CustomTabs'
import Link from 'next/link'
import { accountLinks } from '@/constants'

const AccountNav = () => {
  return (
    <nav className='md:w-[30%] lg:w-[20%] hidden md:flex flex-col gap-6 bg-green-500 py-8 pb-12 text-white overflow-x-hidden h-[700px]'>
      <h2 className='text-2xl text-center md:text-left font-semibold md:ml-6'>
        My Account
      </h2>
      <Tabs
        isLink
        arrangement={'vertical'}
        classNames={{
          tabsList:
            'w-full h-fit flex-row md:flex-col rounded-none overflow-hidden py-2 px-0',
          tab: 'w-full text-left data-[selected=true]:!text-green-500 font-semibold',
          cursor:
            'rounded-none bg-white before:absolute before:-top-1 before:-right-3 before:rotate-45 before:content-[""] before:size-6 before:bg-white after:absolute after:-bottom-1 after:-right-3 after:rotate-45 after:content-[""] after:size-6 after:bg-white',
        }}
      >
        <TabsList>
          {accountLinks.map((link) => (
            <Tab
              key={link.link}
              value={
                link.link.startsWith('/account/profile')
                  ? '/account/profile'
                  : link.link
              }
            >
              <Link
                href={link.link}
                className='flex-1 flex p-2 md:p-4 md:px-6 text-nowrap md:text-wrap'
              >
                {link.title}
              </Link>
            </Tab>
          ))}
        </TabsList>
      </Tabs>
    </nav>
  )
}

export default AccountNav
