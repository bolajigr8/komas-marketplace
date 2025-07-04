// "use client";

// import { useEffect, useState, useMemo } from "react";
// import CartGroups from "@/components/CartPage/CartGroups";
// import { CartItem } from "@/lib/types";
// import Link from "next/link";
// import Loader from "../General/Loader";
// import { useSession } from "next-auth/react";
// import { getCartProducts } from "@/lib/server-actions/product";
// import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
// import { cartActions } from "@/redux-store/store-slices/CartSlice";

// export function ClientCart() {
//   cartActions.clearCart();
//   const dispatch = useAppDispatch();
//   const { products: cartProducts, isInitialized } = useAppSelector(
//     (state) => state.cart
//   );
//   console.log(cartProducts);
//   const { data: session, status } = useSession();
//   const [isFetching, setIsFetching] = useState(false);
//   const isLoggedIn = !!session?.user;

//   useEffect(() => {
//     if (!isInitialized && status !== "loading") {
//       dispatch(cartActions.initializeCart());
//     }
//   }, [dispatch, isInitialized, isLoggedIn, status]);

//   const productsByVendors = useMemo(() => {
//     return cartProducts.reduce((groups, item) => {
//       if (!item.product?.vendor) return groups;

//       const vendorId = item.product.vendor as string;
//       if (!groups[vendorId]) groups[vendorId] = [];
//       groups[vendorId].push(item);
//       return groups;
//     }, {} as Record<string, CartItem[]>);
//   }, [cartProducts]);

//   if ((status === "loading" || isFetching) && !cartProducts.length) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <Loader />
//       </div>
//     );
//   }

//   if (!cartProducts.length) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <div className="max-w-md mx-auto">
//           <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">
//             Looks like you haven't added any items to your cart yet.
//           </p>
//           <Link
//             href="/"
//             className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl w-full container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
//       <CartGroups cart={productsByVendors} />
//     </div>
//   );
// }

// // "use client";

// // import { useEffect, useState, useMemo } from "react";
// // import CartGroups from "@/components/CartPage/CartGroups";
// // import { CartItem } from "@/lib/types";
// // import Link from "next/link";
// // import Loader from "../General/Loader";
// // import { useSession } from "next-auth/react";
// // import { getCartProducts } from "@/lib/server-actions/product";
// // import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
// // import { auth } from "@/auth";
// // import { cartActions } from "@/redux-store/store-slices/CartSlice";

// // export function ClientCart() {
// //   const cartProducts = useAppSelector((state) => state.cart.products);
// //   const dispatch = useAppDispatch();
// //   const { data: session, status } = useSession();
// //   // cartActions.clearCart({isAuthenticated:true})

// //   // console.log(session);
// //   const isLoggedIn = !!session?.user;

// //   // const [cartData, setCartData] = useState<CartItem[]>([]);
// //   const [isFetching, setIsFetching] = useState(false);

// //   useEffect(() => {
// //     async function loadCart() {
// //       // clearCart
// //       if (status === "loading") return;

// //       setIsFetching(true);
// //       try {
// //         if (isLoggedIn) {
// //           // const localCart = localStorage.getItem("cart");
// //           // if (localCart) {
// //           //   setCartData(JSON.parse(localCart));
// //           // } else {
// //           //   const { data } = await getCartProducts();
// //           //   setCartData(data || []);
// //           // }
// //           // const { data } = await getCartProducts();
// //           // console.log(data?.[0]?.product, data?.[0]?.quantity);
// //           // data?.forEach((item) => {
// //           //   dispatch(
// //           //     cartActions.addToCart({
// //           //       product: item.product,
// //           //       quantity: item.quantity,
// //           //       isAuthenticated: true,
// //           //     })
// //           //   );
// //           // });
// //         } else {
// //           // const guestCart = localStorage.getItem("guestCart");
// //           // setCartData(guestCart ? JSON.parse(guestCart) : []);
// //           // setCartData(cartProducts);
// //         }
// //       } catch (error) {
// //         console.error("Cart loading failed:", error);
// //         // setCartData([]);
// //       } finally {
// //         setIsFetching(false);
// //       }
// //     }

// //     loadCart();
// //   }, [isLoggedIn, status]);

// //   useEffect(() => {
// //     if (!isLoggedIn && status !== "loading") {
// //       const syncGuestCart = (e: StorageEvent) => {
// //         if (e.key === "guestCart" && e.newValue) {
// //           try {
// //             // setCartData(JSON.parse(e.newValue));
// //           } catch (error) {
// //             console.error("Guest cart sync failed:", error);
// //           }
// //         }
// //       };

// //       window.addEventListener("storage", syncGuestCart);
// //       return () => window.removeEventListener("storage", syncGuestCart);
// //     }
// //   }, [isLoggedIn, status]);

// //   const productsByVendors = useMemo(
// //     () =>
// //       cartProducts.reduce((acc, item) => {
// //         const vendorId = item.product?.vendor as string;
// //         (acc[vendorId] = acc[vendorId] || []).push(item);
// //         return acc;
// //       }, {} as Record<string, CartItem[]>),
// //     [cartProducts]
// //   );

// //   if (status === "loading" || isFetching) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[60vh]">
// //         <Loader />
// //       </div>
// //     );
// //   }

// //   if (!cartProducts.length) {
// //     return (
// //       <div className="container mx-auto px-4 py-16 text-center">
// //         <div className="max-w-md mx-auto">
// //           <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
// //           <p className="text-gray-600 mb-8">
// //             Looks like you haven't added any items to your cart yet.
// //           </p>
// //           <Link
// //             href="/"
// //             className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block"
// //           >
// //             Continue Shopping
// //           </Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
// //       <CartGroups cart={productsByVendors} />
// //     </div>
// //   );
// // }

'use client'

import { useEffect, useMemo, useState } from 'react'
import CartGroups from '@/components/CartPage/CartGroups'
import { CartItem } from '@/lib/types'
import Link from 'next/link'
import Loader from '../General/Loader'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'

export function ClientCart() {
  const dispatch = useAppDispatch()
  const { products: cartProducts, isInitialized } = useAppSelector(
    (state) => state.cart
  )

  const { data: session, status: authStatus } = useSession()
  const isLoggedIn = !!session?.user

  const [isFetching, setIsFetching] = useState(false)

  // Initialize cart on first load (not per session change)
  useEffect(() => {
    if (!isInitialized && authStatus !== 'loading') {
      dispatch(cartActions.initializeCart())
    }
  }, [dispatch, isInitialized, authStatus])

  const productsByVendors = useMemo(() => {
    return cartProducts.reduce((groups, item) => {
      const vendorId = item.product?.vendor as string
      if (!vendorId) return groups

      if (!groups[vendorId]) groups[vendorId] = []
      groups[vendorId].push(item)

      return groups
    }, {} as Record<string, CartItem[]>)
  }, [cartProducts])

  // Loader if cart is still initializing or session is loading
  if (
    (authStatus === 'loading' || !isInitialized || isFetching) &&
    !cartProducts.length
  ) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Loader />
      </div>
    )
  }

  if (!cartProducts.length) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <div className='max-w-md mx-auto'>
          <h2 className='text-2xl font-bold mb-4'>Your cart is empty</h2>
          <p className='text-gray-600 mb-8'>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            href='/'
            className='bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl w-full container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Your Cart</h1>
      <CartGroups cart={productsByVendors} />
    </div>
  )
}
