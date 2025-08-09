import React from 'react'
import { BiPhone } from 'react-icons/bi'
import { IoLocationOutline } from 'react-icons/io5'
import { MdOutlineEmail } from 'react-icons/md'
import NavLink from '../General/NavLink'
import { footerHelpLinks, footerLinks, socialLinks } from '@/constants'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-white'>
      <div className='flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 py-16'>
        <div className='flex flex-col md:flex-row items-start flex-wrap gap-20'>
          <div className='flex flex-col flex-1 gap-4'>
            <p className='text-lg font-medium text-green-500'>KOMAS500</p>
            <ul className='flex flex-col gap-4 text-sm'>
              <li className='flex items-center gap-1'>
                <IoLocationOutline className='text-green-500' />
                <span className='font-medium'>Address: </span>
              </li>
              <div className='text-sm max-w-sm'>
                No 45 East West Rd Mercy Land Rumuigbo, Port Harcourt, Rivers
                State, Nigeria.
              </div>
              <li className='flex items-center gap-1'>
                <BiPhone className='text-green-500' />
                <span className='font-medium'>Call to Order: </span>
                <span>{'(+234) 8029636616'}</span>
              </li>
              <li className='flex items-center gap-1'>
                <MdOutlineEmail className='text-green-500' />
                <span className='font-medium'>Email: </span>
                <span>support@komas500.com</span>
              </li>
              <li className='flex items-center gap-1'>
                <MdOutlineEmail className='text-green-500' />
                <span className='font-medium'>Chat with Us: </span>
                <Link
                  target='_blank'
                  className='text-green-500'
                  href='https://wa.me/message/YZKWGYCKDUEGE1'
                >
                  Whatsapp Message
                </Link>
              </li>
            </ul>
          </div>
          <div className='flex flex-col flex-1 justify-center gap-4'>
            <p className='text-lg font-medium'>About KOMAS500</p>
            <ul className='flex flex-col items-start text-sm'>
              {footerLinks.map((item, index) => (
                <li key={index}>
                  <NavLink label={item.label} route={item.route} />
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col flex-1 justify-center gap-4'>
            <p className='text-lg font-medium'>Help Center</p>
            <ul className='flex flex-col items-start text-sm'>
              {footerHelpLinks.map((item, index) => (
                <li key={index}>
                  <NavLink label={item.label} route={item.route} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-4'>
          <p>© {currentYear}, All rights reserved</p>
          <div className='flex items-center gap-4'>
            <p className='text-lg font-medium'>Join us</p>
            <ul className='flex items-center gap-2'>
              {socialLinks.map((link, index) => (
                <li
                  key={index}
                  className='p-2 rounded-full bg-green-500 text-white'
                >
                  <a href={link.href} aria-label={link.label}>
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
