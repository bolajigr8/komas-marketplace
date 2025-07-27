'use client'

import { useEffect } from 'react'
import { PiShoppingCartSimpleLight } from 'react-icons/pi'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
  Image,
} from '@nextui-org/react'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { useCart } from '@/hooks/queries'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { ChevronDown, Lock } from './Icons'
// Alternative: Import from react-icons if ChevronDown isn't working
// import { IoChevronDown } from 'react-icons/io5'
import { useSession } from 'next-auth/react'
import { IoChevronDown } from 'react-icons/io5'

export default function CartHeaderDisplay() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.products)
  const quantity = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  )
  const { data, isLoading } = useCart()
  const { data: session, status } = useSession()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant='light'
          className='p-2 hover:bg-[#3BB77E]/10 transition-colors focus:outline-none focus:ring-0'
          endContent={
            // Option 1: If ChevronDown from ./Icons works
            // <ChevronDown className='text-default-500' size={16} />

            // Option 2: If ChevronDown isn't working, use react-icons
            <IoChevronDown className='text-default-500' size={16} />

            // Option 3: Simple Unicode arrow as fallback
            // <span className="text-default-500">▼</span>
          }
        >
          <Badge
            content={isLoading ? undefined : quantity}
            color='success'
            size='sm'
            className='translate-x-1'
          >
            <PiShoppingCartSimpleLight size={24} className='text-default-500' />
          </Badge>
          <span className='hidden md:inline-block ml-2 text-sm font-medium'>
            My Cart
          </span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label='Cart items'
        className='w-80'
        itemClasses={{
          base: 'gap-4',
          title: 'font-medium',
          description: 'text-default-500',
        }}
      >
        <DropdownSection title={`Cart (${cartItems.length})`} showDivider>
          {cartItems.slice(0, 5).map((item, index) => (
            <DropdownItem
              key={item.product?._id || index}
              className='focus:outline-none focus:ring-2 focus:ring-[#3bb77e]'
              description={`Quantity: ${item.quantity ?? 0}`}
              href={`/product/${item.product?._id}`}
              startContent={
                <Image
                  src={item.product?.images?.[0] || '/placeholder.png'}
                  alt={item.product?.name || 'Product Image'}
                  width={40}
                  height={40}
                  className='rounded-md object-cover'
                />
              }
            >
              <p className='font-medium truncate'>
                {item.product?.name || 'Unknown Product'}
              </p>
              <p className='text-[#3BB77E] text-sm'>
                ₦{item.product?.price ?? 'N/A'}
              </p>
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownSection>
          <DropdownItem
            href='/cart'
            className='text-[#3BB77E] font-medium'
            startContent={<Lock size={18} />}
          >
            View Cart & Checkout
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
