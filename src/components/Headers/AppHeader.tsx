// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarMenuToggle,
// } from '@nextui-org/react'
// import Image from 'next/image'
// import { Search, Download, X } from 'lucide-react'
// import UserHeaderCard from './UserHeaderCard'
// import MobileNav from './MobileNav'
// import CartHeaderDisplay from './CartHeaderDisplay'
// import { useWidth } from '@/providers/WidthProvider'
// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// import NotificationBell from './NotificationBell'

// // Implement useLocalStorage hook directly
// function useLocalStorage<T>(
//   key: string,
//   initialValue: T
// ): [T, (value: T | ((val: T) => T)) => void] {
//   // Get from local storage then parse stored json or return initialValue
//   const readValue = (): T => {
//     // Prevent build error "window is undefined" but keep working
//     if (typeof window === 'undefined') {
//       return initialValue
//     }

//     try {
//       const item = window.localStorage.getItem(key)
//       return item ? (JSON.parse(item) as T) : initialValue
//     } catch (error) {
//       console.warn(`Error reading localStorage key "${key}":`, error)
//       return initialValue
//     }
//   }

//   // State to store our value
//   const [storedValue, setStoredValue] = useState<T>(readValue)

//   // Return a wrapped version of useState's setter function that persists the new value to localStorage
//   const setValue = (value: T | ((val: T) => T)) => {
//     try {
//       // Allow value to be a function so we have the same API as useState
//       const valueToStore =
//         value instanceof Function ? value(storedValue) : value

//       // Save state
//       setStoredValue(valueToStore)

//       // Save to local storage
//       if (typeof window !== 'undefined') {
//         window.localStorage.setItem(key, JSON.stringify(valueToStore))
//       }
//     } catch (error) {
//       console.warn(`Error setting localStorage key "${key}":`, error)
//     }
//   }

//   useEffect(() => {
//     // Subscribe to localStorage changes from other components/tabs
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === key && e.newValue) {
//         try {
//           const newValue = JSON.parse(e.newValue)
//           setStoredValue(newValue)
//         } catch (error) {
//           console.warn(`Error parsing localStorage key "${key}":`, error)
//         }
//       }
//     }

//     window.addEventListener('storage', handleStorageChange)
//     return () => window.removeEventListener('storage', handleStorageChange)
//   }, [key])

//   return [storedValue, setValue]
// }

// // Proper TypeScript interface for BeforeInstallPromptEvent
// interface BeforeInstallPromptEvent extends Event {
//   readonly platforms: string[]
//   readonly userChoice: Promise<{
//     outcome: 'accepted' | 'dismissed'
//     platform: string
//   }>
//   prompt(): Promise<void>
// }

// declare global {
//   interface WindowEventMap {
//     beforeinstallprompt: BeforeInstallPromptEvent
//   }
// }

// const AppHeader = () => {
//   const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const { width } = useWidth()
//   const pathname = usePathname()

//   // Install prompt state
//   const [isIOS, setIsIOS] = useState<boolean>(false)
//   const [isStandalone, setIsStandalone] = useState<boolean>(false)
//   const [deferredPrompt, setDeferredPrompt] =
//     useState<BeforeInstallPromptEvent | null>(null)
//   const [showPrompt, setShowPrompt] = useState<boolean>(false)
//   const [dismissed, setDismissed] = useLocalStorage(
//     'install-prompt-dismissed',
//     false
//   )

//   useEffect(() => {
//     // Don't show if already dismissed
//     if (dismissed) return

//     // Check if iOS device
//     const isIOSDevice =
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
//     setIsIOS(isIOSDevice)

//     // Check if already installed as PWA
//     const isInStandaloneMode = window.matchMedia(
//       '(display-mode: standalone)'
//     ).matches
//     setIsStandalone(isInStandaloneMode)

//     // If already installed or in standalone mode, don't show prompt
//     if (isInStandaloneMode) return

//     // Handle beforeinstallprompt event for non-iOS
//     const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
//       // Prevent the mini-infobar from appearing on mobile
//       e.preventDefault()
//       // Store the event for later use
//       setDeferredPrompt(e)
//       // Show our custom prompt after a short delay (let page load first)
//       setTimeout(() => setShowPrompt(true), 2000)
//     }

//     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

//     // For iOS, show the prompt after a delay if user has visited before
//     // This mimics the behavior we want since iOS doesn't have beforeinstallprompt
//     if (isIOSDevice) {
//       const hasVisitedBefore = localStorage.getItem('visited-before')
//       if (hasVisitedBefore) {
//         setTimeout(() => setShowPrompt(true), 2000)
//       } else {
//         localStorage.setItem('visited-before', 'true')
//       }
//     }

//     return () => {
//       window.removeEventListener(
//         'beforeinstallprompt',
//         handleBeforeInstallPrompt
//       )
//     }
//   }, [dismissed])

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return

//     try {
//       // Show the install prompt
//       await deferredPrompt.prompt()

//       // Wait for the user to respond to the prompt
//       const choiceResult = await deferredPrompt.userChoice

//       // Reset the deferred prompt variable
//       setDeferredPrompt(null)

//       // Hide our custom prompt
//       setShowPrompt(false)

//       // Mark as dismissed regardless of outcome to avoid annoying users
//       setDismissed(true)
//     } catch (error) {
//       console.error('Error showing install prompt:', error)
//       setShowPrompt(false)
//     }
//   }

//   const handleDismiss = () => {
//     setShowPrompt(false)
//     setDismissed(true)
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!searchQuery.trim()) return

//     // Navigate to search results page
//     window.location.href = `/?query=${encodeURIComponent(searchQuery)}`
//   }

//   return (
//     <>
//       <Navbar
//         as='header'
//         shouldHideOnScroll={width < 768}
//         isMenuOpen={isMobileNavOpen}
//         onMenuOpenChange={setIsMobileNavOpen}
//         className='bg-white shadow-sm'
//         maxWidth='xl'
//         isBordered
//       >
//         <NavbarContent className='gap-4 flex-1'>
//           <NavbarMenuToggle
//             aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
//             className='md:hidden'
//           />
//           <NavbarBrand as={Link} href='/' className='gap-4 flex-shrink-0'>
//             <div className='w-[120px] h-[60px] relative md:w-[180px]'>
//               <Image
//                 src='/Icons/new/komas pax black.svg'
//                 alt='KOMAS Logo'
//                 layout='fill'
//                 objectFit='cover'
//                 className='rounded-md'
//               />
//             </div>
//           </NavbarBrand>
//         </NavbarContent>

//         <NavbarContent className='hidden md:flex flex-1 justify-center'>
//           <form onSubmit={handleSearch} className='w-full max-w-md relative'>
//             <input
//               type='text'
//               placeholder='Search products...'
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className='w-full py-2 px-4 pr-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all'
//             />
//             <button
//               type='submit'
//               className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
//             >
//               <Search className='w-5 h-5' />
//             </button>
//           </form>
//         </NavbarContent>

//         <NavbarContent justify='end' className='gap-1 sm:gap-2'>
//           <NotificationBell />
//           <CartHeaderDisplay />
//           <UserHeaderCard />
//         </NavbarContent>

//         <MobileNav
//           isOpen={isMobileNavOpen}
//           onClose={() => setIsMobileNavOpen(false)}
//         />
//       </Navbar>

//       {/* Install Prompt Toast */}
//       {/* {showPrompt && !isStandalone && ( */}
//       {/* <div className="fixed bottom-4 right-4 z-50 max-w-xs bg-white rounded-lg shadow-lg overflow-hidden animate-slideUp">
//         <div className="relative">
//           <button
//             onClick={handleDismiss}
//             className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="p-4 pt-3">
//             <div className="flex items-center mb-2">
//               <Download className="w-5 h-5 text-primary-600 mr-2" />
//               <h3 className="font-medium text-gray-800">
//                 Install Komas500 App
//               </h3>
//             </div>

//             <p className="text-xs text-gray-600 mb-3">
//               {isIOS
//                 ? "Add to Home Screen for a faster shopping experience"
//                 : "Install our app for a better shopping experience"}
//             </p>

//             {!isIOS && deferredPrompt ? (
//               <button
//                 onClick={handleInstallClick}
//                 className="w-full py-2 px-3 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
//               >
//                 Install Now
//               </button>
//             ) : isIOS ? (
//               <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
//                 Tap <span className="mx-1">⎋</span> then "Add to Home Screen"
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div> */}
//       {/* )} */}
//     </>
//   )
// }

// export default AppHeader

// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarMenuToggle,
// } from '@nextui-org/react'
// import Image from 'next/image'
// import { Search, Download, X } from 'lucide-react'
// import UserHeaderCard from './UserHeaderCard'
// import MobileNav from './MobileNav'
// import CartHeaderDisplay from './CartHeaderDisplay'
// import { useWidth } from '@/providers/WidthProvider'
// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// import NotificationBell from './NotificationBell'

// // Implement useLocalStorage hook directly
// function useLocalStorage<T>(
//   key: string,
//   initialValue: T
// ): [T, (value: T | ((val: T) => T)) => void] {
//   // Get from local storage then parse stored json or return initialValue
//   const readValue = (): T => {
//     // Prevent build error "window is undefined" but keep working
//     if (typeof window === 'undefined') {
//       return initialValue
//     }

//     try {
//       const item = window.localStorage.getItem(key)
//       return item ? (JSON.parse(item) as T) : initialValue
//     } catch (error) {
//       console.warn(`Error reading localStorage key "${key}":`, error)
//       return initialValue
//     }
//   }

//   // State to store our value
//   const [storedValue, setStoredValue] = useState<T>(readValue)

//   // Return a wrapped version of useState's setter function that persists the new value to localStorage
//   const setValue = (value: T | ((val: T) => T)) => {
//     try {
//       // Allow value to be a function so we have the same API as useState
//       const valueToStore =
//         value instanceof Function ? value(storedValue) : value

//       // Save state
//       setStoredValue(valueToStore)

//       // Save to local storage
//       if (typeof window !== 'undefined') {
//         window.localStorage.setItem(key, JSON.stringify(valueToStore))
//       }
//     } catch (error) {
//       console.warn(`Error setting localStorage key "${key}":`, error)
//     }
//   }

//   useEffect(() => {
//     // Subscribe to localStorage changes from other components/tabs
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === key && e.newValue) {
//         try {
//           const newValue = JSON.parse(e.newValue)
//           setStoredValue(newValue)
//         } catch (error) {
//           console.warn(`Error parsing localStorage key "${key}":`, error)
//         }
//       }
//     }

//     window.addEventListener('storage', handleStorageChange)
//     return () => window.removeEventListener('storage', handleStorageChange)
//   }, [key])

//   return [storedValue, setValue]
// }

// // Proper TypeScript interface for BeforeInstallPromptEvent
// interface BeforeInstallPromptEvent extends Event {
//   readonly platforms: string[]
//   readonly userChoice: Promise<{
//     outcome: 'accepted' | 'dismissed'
//     platform: string
//   }>
//   prompt(): Promise<void>
// }

// declare global {
//   interface WindowEventMap {
//     beforeinstallprompt: BeforeInstallPromptEvent
//   }
// }

// const AppHeader = () => {
//   const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const { width } = useWidth()
//   const pathname = usePathname()

//   // Install prompt state
//   const [isIOS, setIsIOS] = useState<boolean>(false)
//   const [isStandalone, setIsStandalone] = useState<boolean>(false)
//   const [deferredPrompt, setDeferredPrompt] =
//     useState<BeforeInstallPromptEvent | null>(null)
//   const [showPrompt, setShowPrompt] = useState<boolean>(false)
//   const [dismissed, setDismissed] = useLocalStorage(
//     'install-prompt-dismissed',
//     false
//   )

//   useEffect(() => {
//     // Don't show if already dismissed
//     if (dismissed) return

//     // Check if iOS device
//     const isIOSDevice =
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
//     setIsIOS(isIOSDevice)

//     // Check if already installed as PWA
//     const isInStandaloneMode = window.matchMedia(
//       '(display-mode: standalone)'
//     ).matches
//     setIsStandalone(isInStandaloneMode)

//     // If already installed or in standalone mode, don't show prompt
//     if (isInStandaloneMode) return

//     // Handle beforeinstallprompt event for non-iOS
//     const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
//       // Prevent the mini-infobar from appearing on mobile
//       e.preventDefault()
//       // Store the event for later use
//       setDeferredPrompt(e)
//       // Show our custom prompt after a short delay (let page load first)
//       setTimeout(() => setShowPrompt(true), 2000)
//     }

//     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

//     // For iOS, show the prompt after a delay if user has visited before
//     // This mimics the behavior we want since iOS doesn't have beforeinstallprompt
//     if (isIOSDevice) {
//       const hasVisitedBefore = localStorage.getItem('visited-before')
//       if (hasVisitedBefore) {
//         setTimeout(() => setShowPrompt(true), 2000)
//       } else {
//         localStorage.setItem('visited-before', 'true')
//       }
//     }

//     return () => {
//       window.removeEventListener(
//         'beforeinstallprompt',
//         handleBeforeInstallPrompt
//       )
//     }
//   }, [dismissed])

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return

//     try {
//       // Show the install prompt
//       await deferredPrompt.prompt()

//       // Wait for the user to respond to the prompt
//       const choiceResult = await deferredPrompt.userChoice

//       // Reset the deferred prompt variable
//       setDeferredPrompt(null)

//       // Hide our custom prompt
//       setShowPrompt(false)

//       // Mark as dismissed regardless of outcome to avoid annoying users
//       setDismissed(true)
//     } catch (error) {
//       console.error('Error showing install prompt:', error)
//       setShowPrompt(false)
//     }
//   }

//   const handleDismiss = () => {
//     setShowPrompt(false)
//     setDismissed(true)
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!searchQuery.trim()) return

//     // Navigate to search results page
//     window.location.href = `/?query=${encodeURIComponent(searchQuery)}`
//   }

//   return (
//     <>
//       <Navbar
//         as='header'
//         shouldHideOnScroll={width < 768}
//         isMenuOpen={isMobileNavOpen}
//         onMenuOpenChange={setIsMobileNavOpen}
//         className='bg-white shadow-sm w-full'
//         maxWidth='full'
//         isBordered
//       >
//         <NavbarContent className='gap-2 flex-1 min-w-0'>
//           <NavbarMenuToggle
//             aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
//             className='md:hidden flex-shrink-0'
//           />
//           <NavbarBrand
//             as={Link}
//             href='/'
//             className='gap-2 flex-shrink-0 min-w-0'
//           >
//             <div className='w-[100px] h-[50px] relative sm:w-[120px] sm:h-[60px] md:w-[180px] md:h-[60px]'>
//               <Image
//                 src='/Icons/new/komas pax black.svg'
//                 alt='KOMAS Logo'
//                 layout='fill'
//                 objectFit='cover'
//                 className='rounded-md'
//               />
//             </div>
//           </NavbarBrand>
//         </NavbarContent>

//         <NavbarContent className='hidden md:flex flex-1 justify-center min-w-0'>
//           <form onSubmit={handleSearch} className='w-full max-w-md relative'>
//             <input
//               type='text'
//               placeholder='Search products...'
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className='w-full py-2 px-4 pr-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all'
//             />
//             <button
//               type='submit'
//               className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
//             >
//               <Search className='w-5 h-5' />
//             </button>
//           </form>
//         </NavbarContent>

//         <NavbarContent justify='end' className='gap-1 sm:gap-2 flex-shrink-0'>
//           <NotificationBell />
//           <CartHeaderDisplay />
//           <UserHeaderCard />
//         </NavbarContent>

//         <MobileNav
//           isOpen={isMobileNavOpen}
//           onClose={() => setIsMobileNavOpen(false)}
//         />
//       </Navbar>

//       {/* Install Prompt Toast */}
//       {showPrompt && !isStandalone && (
//         <div className='fixed bottom-4 right-4 z-50 max-w-xs bg-white rounded-lg shadow-lg overflow-hidden animate-slideUp'>
//           <div className='relative'>
//             <button
//               onClick={handleDismiss}
//               className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
//             >
//               <X className='w-4 h-4' />
//             </button>

//             <div className='p-4 pt-3'>
//               <div className='flex items-center mb-2'>
//                 <Download className='w-5 h-5 text-primary-600 mr-2' />
//                 <h3 className='font-medium text-gray-800'>
//                   Install Komas500 App
//                 </h3>
//               </div>

//               <p className='text-xs text-gray-600 mb-3'>
//                 {isIOS
//                   ? 'Add to Home Screen for a faster shopping experience'
//                   : 'Install our app for a better shopping experience'}
//               </p>

//               {!isIOS && deferredPrompt ? (
//                 <button
//                   onClick={handleInstallClick}
//                   className='w-full py-2 px-3 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors'
//                 >
//                   Install Now
//                 </button>
//               ) : isIOS ? (
//                 <div className='text-xs text-gray-700 bg-gray-50 p-2 rounded'>
//                   Tap <span className='mx-1'>⎋</span> then "Add to Home Screen"
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default AppHeader

'use client'

import { useState, useEffect } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
} from '@nextui-org/react'
import Image from 'next/image'
import { Search, Download, X } from 'lucide-react'
import UserHeaderCard from './UserHeaderCard'
import MobileNav from './MobileNav'
import CartHeaderDisplay from './CartHeaderDisplay'
import { useWidth } from '@/providers/WidthProvider'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import NotificationBell from './NotificationBell'

// Implement useLocalStorage hook directly
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    // Subscribe to localStorage changes from other components/tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}

// Proper TypeScript interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

const AppHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { width } = useWidth()
  const pathname = usePathname()

  // Install prompt state
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState<boolean>(false)
  const [dismissed, setDismissed] = useLocalStorage(
    'install-prompt-dismissed',
    false
  )

  useEffect(() => {
    // Don't show if already dismissed
    if (dismissed) return

    // Check if iOS device
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if already installed as PWA
    const isInStandaloneMode = window.matchMedia(
      '(display-mode: standalone)'
    ).matches
    setIsStandalone(isInStandaloneMode)

    // If already installed or in standalone mode, don't show prompt
    if (isInStandaloneMode) return

    // Handle beforeinstallprompt event for non-iOS
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e)
      // Show our custom prompt after a short delay (let page load first)
      setTimeout(() => setShowPrompt(true), 2000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show the prompt after a delay if user has visited before
    // This mimics the behavior we want since iOS doesn't have beforeinstallprompt
    if (isIOSDevice) {
      const hasVisitedBefore = localStorage.getItem('visited-before')
      if (hasVisitedBefore) {
        setTimeout(() => setShowPrompt(true), 2000)
      } else {
        localStorage.setItem('visited-before', 'true')
      }
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
    }
  }, [dismissed])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice

      // Reset the deferred prompt variable
      setDeferredPrompt(null)

      // Hide our custom prompt
      setShowPrompt(false)

      // Mark as dismissed regardless of outcome to avoid annoying users
      setDismissed(true)
    } catch (error) {
      console.error('Error showing install prompt:', error)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Navigate to search results page
    window.location.href = `/?query=${encodeURIComponent(searchQuery)}`
  }

  return (
    <>
      <Navbar
        as='header'
        shouldHideOnScroll={false}
        isMenuOpen={isMobileNavOpen}
        onMenuOpenChange={setIsMobileNavOpen}
        className='bg-white shadow-sm w-full fixed top-0 left-0 right-0 z-50'
        maxWidth='full'
        isBordered
      >
        <NavbarContent className='gap-2 flex-1 min-w-0'>
          <NavbarMenuToggle
            aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
            className='md:hidden flex-shrink-0'
          />
          <NavbarBrand
            as={Link}
            href='/'
            className='gap-2 flex-shrink-0 min-w-0'
          >
            <div className='w-[100px] h-[50px] relative sm:w-[120px] sm:h-[60px] md:w-[180px] md:h-[60px]'>
              <Image
                src='/Icons/new/komas pax black.svg'
                alt='KOMAS Logo'
                layout='fill'
                objectFit='cover'
                className='rounded-md'
              />
            </div>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className='hidden md:flex flex-1 justify-center min-w-0'>
          <form onSubmit={handleSearch} className='w-full max-w-md relative'>
            <input
              type='text'
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full py-2 px-4 pr-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all'
            />
            <button
              type='submit'
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              <Search className='w-5 h-5' />
            </button>
          </form>
        </NavbarContent>

        <NavbarContent justify='end' className='gap-1 sm:gap-2 flex-shrink-0'>
          <NotificationBell />
          <CartHeaderDisplay />
          <UserHeaderCard />
        </NavbarContent>

        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
      </Navbar>

      {/* Install Prompt Toast */}
      {showPrompt && !isStandalone && (
        <div className='fixed bottom-4 right-4 z-50 max-w-xs bg-white rounded-lg shadow-lg overflow-hidden animate-slideUp'>
          <div className='relative'>
            <button
              onClick={handleDismiss}
              className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
            >
              <X className='w-4 h-4' />
            </button>

            <div className='p-4 pt-3'>
              <div className='flex items-center mb-2'>
                <Download className='w-5 h-5 text-primary-600 mr-2' />
                <h3 className='font-medium text-gray-800'>
                  Install Komas500 App
                </h3>
              </div>

              <p className='text-xs text-gray-600 mb-3'>
                {isIOS
                  ? 'Add to Home Screen for a faster shopping experience'
                  : 'Install our app for a better shopping experience'}
              </p>

              {!isIOS && deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className='w-full py-2 px-3 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors'
                >
                  Install Now
                </button>
              ) : isIOS ? (
                <div className='text-xs text-gray-700 bg-gray-50 p-2 rounded'>
                  Tap <span className='mx-1'>⎋</span> then "Add to Home Screen"
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AppHeader
