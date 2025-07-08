import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { LiaInfoCircleSolid, LiaQuestionCircleSolid } from "react-icons/lia";
import { LuHome } from "react-icons/lu";
import { PiFireLight } from "react-icons/pi";

export const headerNavLinks = [
  { route: "/", label: "Home", icon: <LuHome size={20} /> },
  { route: "/hotDeals", label: "Hot Deals", icon: <PiFireLight size={20} /> },
  {
    route: "/aboutUs",
    label: "About Us",
    icon: <LiaInfoCircleSolid size={20} />,
  },
  { route: "/help", label: "Help", icon: <LiaQuestionCircleSolid size={20} /> },
  {
    route: "/supportCenter",
    label: "Support Center",
    icon: <IoCallOutline size={20} />,
  },
];

export const footerLinks = [
  {
    label: "About Us",
    route: "/about-us",
  },
  {
    label: "Contact",
    route: "/contact",
  },
  {
    label: "Hot Deals",
    route: "/hot-deals",
  },
  {
    label: "Promotions",
    route: "/promotions",
  },
  {
    label: "New Products",
    route: "/new-products",
  },
  {
    label: "Privacy Policy",
    route: "/privacy-policy",
  },
];

export const footerHelpLinks = [
  {
    label: "Payments",
    route: "/payments",
  },
  {
    label: "Refund",
    route: "/refund",
  },
  {
    label: "Checkout",
    route: "/checkout",
  },
  {
    label: "Shipping",
    route: "/shipping",
  },
  {
    label: "Q&A",
    route: "/q-a",
  },
];

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: <FaFacebookF />,
  },
  {
    label: "Twitter",
    href: "https://www.facebook.com/",
    icon: <FaLinkedinIn />,
  },
  {
    label: "Instagram",
    href: "https://www.facebook.com/",
    icon: <FaInstagram />,
  },
  {
    label: "LinkedIn",
    href: "https://www.facebook.com/",
    icon: <FaTwitter />,
  },
];

export const accountLinks = [
  { title: "Account Information", link: "/account/profile/info" },
  { title: "Order History", link: "/account/orders" },
  { title: "Track my Order", link: "/account/track-order" },
  { title: "Payment Information", link: "/account/payment" },
  { title: "Returns and Refunds", link: "/account/returns" },
  { title: "Wishlist", link: "/account/wishlist" },
  { title: "Recently Viewed", link: "/account/recently-viewed" },
  { title: "Sign Out", link: "/account/sign-out" },
];


export const springOptions = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};