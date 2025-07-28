'use client'

import { useRouter, usePathname } from 'next/navigation'
import { PiShoppingCartSimpleLight } from 'react-icons/pi'
import { useAppSelector } from '@/redux-store/hooks'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutButton() {
  const router = useRouter()
  const pathname = usePathname()
  const cartItems = useAppSelector((state) => state.cart.products)

  // Calculate total quantity
  const quantity = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  )

  // Hide on checkout and payment pages
  const hiddenPaths = ['/checkout', '/payment', '/cart']
  const shouldHide = hiddenPaths.some((path) => pathname.includes(path))

  const handleClick = () => {
    router.push('/checkout')
  }

  if (shouldHide || quantity === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className='fixed bottom-16 right-6 z-50'
      >
        <button
          onClick={handleClick}
          className='relative w-[3rem] h-[3rem] rounded-full border-2 border-black bg-white hover:bg-green/5 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm'
          aria-label={`Cart with ${quantity} items`}
        >
          {/* Cart Icon */}
          <PiShoppingCartSimpleLight size={24} className='text-black' />

          {/* Quantity Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black border-2 border-white flex items-center justify-center'
          >
            <span className='text-white text-xs font-bold'>
              {quantity > 99 ? '99+' : quantity}
            </span>
          </motion.div>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
