import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa'
import { SiTiktok } from 'react-icons/si'
import { IoCallOutline } from 'react-icons/io5'
import { LiaInfoCircleSolid, LiaQuestionCircleSolid } from 'react-icons/lia'
import { LuHome } from 'react-icons/lu'
import { PiFireLight } from 'react-icons/pi'

export const headerNavLinks = [
  { route: '/', label: 'Home', icon: <LuHome size={20} /> },
  { route: '/category', label: 'Hot Deals', icon: <PiFireLight size={20} /> },
  {
    route: '/aboutUs',
    label: 'About Us',
    icon: <LiaInfoCircleSolid size={20} />,
  },
  { route: '/help', label: 'Help', icon: <LiaQuestionCircleSolid size={20} /> },
  {
    route: '/supportCenter',
    label: 'Support Center',
    icon: <IoCallOutline size={20} />,
  },
]

export const footerLinks = [
  {
    label: 'About Us',
    route: '/about-us',
  },
  {
    label: 'Contact',
    route: '/contact',
  },
  {
    label: 'Hot Deals',
    route: '/category',
  },
  {
    label: 'Influencers',
    route: '/influencers',
  },
  {
    label: 'New Products',
    route: '/category',
  },
  {
    label: 'Privacy Policy',
    route: '/privacy-policy',
  },
]

export const footerHelpLinks = [
  {
    label: 'Payments',
    route: '/account/payment',
  },
  {
    label: 'Refund',
    route: '/account/returns',
  },
  {
    label: 'Checkout',
    route: '/checkout',
  },
  {
    label: 'Shipping',
    route: '/account/orders',
  },
  {
    label: 'Q&A',
    route: '/',
  },
]

export const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=61574397261627',
    icon: <FaFacebookF />,
  },
  {
    label: 'Twitter',
    href: 'https://x.com/komas500Global?t=nczrcka8lEuyLufa4fRvXg&s=09',
    icon: <FaTwitter />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/komas500global?igsh=OTZzN2IzbmFmeDM1',
    icon: <FaInstagram />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/komas500/',
    icon: <FaLinkedinIn />,
  },
  {
    label: 'Tiktok',
    href: 'https://www.tiktok.com/@komas500global',
    icon: <SiTiktok />,
  },
]

export const accountLinks = [
  { title: 'Account Information', link: '/account/profile/info' },
  { title: 'Order History', link: '/account/orders' },
  { title: 'Track my Order', link: '/account/track-order' },
  { title: 'Payment Information', link: '/account/payment' },
  { title: 'Returns and Refunds', link: '/account/returns' },
  { title: 'Wishlist', link: '/account/wishlist' },
  { title: 'Recently Viewed', link: '/account/recently-viewed' },
  { title: 'Sign Out', link: '/account/sign-out' },
]

export const springOptions = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50,
}
