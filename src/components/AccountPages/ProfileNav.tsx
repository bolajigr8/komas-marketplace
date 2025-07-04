import React from 'react'
import Tabs, { Tab, TabsList } from '../General/CustomTabs'
import Link from 'next/link'

const profileLinks = [
  { name: "Account Info", link: "/account/profile/info" },
  { name: "Delivery Details", link: "/account/profile/delivery" },
  { name: "Edit Account", link: "/account/profile/edit" },
]

const ProfileNav = () => {
  return (
    <nav>
      <Tabs
        isLink
        arrangement={"horizontal"}
        classNames={{
          tabsList: "w-full gap-1 md:gap-2 md:w-fit rounded-none !p-0",
          tab: "w-full text-center text-black data-[selected=true]:!text-green-500 font-medium data-[selected=false]:bg-gray-100 rounded-xl",
          cursor: "bg-green-500/20 rounded-xl",
        }}
      >
        <TabsList>
          {profileLinks.map((link) => (
            <Tab key={link.link} value={link.link}>
              <Link
                href={link.link}
                className="flex-1 flex items-center justify-center p-3 md:px-6 text-nowrap text-xs min-[400px]:text-sm md:text-base"
              >
                {link.name}
              </Link>
            </Tab>
          ))}
        </TabsList>
      </Tabs>
    </nav>
  );
}

export default ProfileNav