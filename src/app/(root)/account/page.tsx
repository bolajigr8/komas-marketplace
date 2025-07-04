import { accountLinks } from '@/constants'
import Link from 'next/link';
import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md';

const Account = () => {
  return (
    <main className="flex-1 bg-white pb-2">
      <div className="md:hidden flex flex-col gap-4 py-8 shadow-md">
        <h2 className="text-xl font-semibold pl-4">My Account</h2>
        <div className="bg-white flex-1">
          <ul className="w-full flex flex-col">
            {accountLinks.map((link) =>
              link.link === "/account/sign-out" ? null : (
                <li key={link.link}>
                  <Link
                    href={link.link}
                    className="flex items-center justify-between p-4"
                  >
                    <span>{link.title}</span>
                    <MdKeyboardArrowRight size={20} />
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
        <Link href={"/account/sign-out"} className='font-medium text-red-600 text-center p-2 w-fit mx-auto uppercase'>sign out</Link>
      </div>
    </main>
  );
}

export default Account