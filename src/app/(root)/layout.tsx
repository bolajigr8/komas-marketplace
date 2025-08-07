import CartSyncer from '@/components/CartPage/CartSync'
import CheckoutButton from '@/components/CheckoutPage/CheckoutButton'
import Footer from '@/components/Footer/Footer'
import AppHeader from '@/components/Headers/AppHeader'
import NavHeader from '@/components/Headers/NavHeader'
import { CartProvider } from '@/components/Providers/CartProvider'
import React from 'react'

const RootLayout = ({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) => {
  return (
    <>
      <CartProvider>
        <AppHeader />
        <NavHeader />
        {/* <CartSyncer /> */}
        {modal}
        <CheckoutButton />
        {children}
        <Footer />
      </CartProvider>
    </>
  )
}

export default RootLayout
