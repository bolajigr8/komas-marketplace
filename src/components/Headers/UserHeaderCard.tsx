// "use client";

// import { accountLinks } from "@/constants";
// import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
// import {
//   DeliveryAddress,
//   deliveryActions,
// } from "@/redux-store/store-slices/DeliverySlice";
// import {
//   Avatar,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownSection,
//   DropdownTrigger,
//   Skeleton,
//   User,
//   Button,
// } from "@nextui-org/react";
// import React, { useEffect } from "react";
// import { signOut, useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";

// const UserHeaderCard = () => {
//   const dispatch = useAppDispatch();
//   const addressList = useAppSelector((state) => state.delivery.addressList);
//   const { data: session, status } = useSession();
//   const pathname = usePathname();

//   useEffect(() => {
//     const deliveryAddress = localStorage.getItem("delivery address list");

//     if (deliveryAddress) {
//       try {
//         const parsedData: DeliveryAddress[] = JSON.parse(deliveryAddress);
//         dispatch(deliveryActions.setDeliveryAddressList(parsedData));
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (addressList.length > 0) {
//       localStorage.setItem(
//         "delivery address list",
//         JSON.stringify(addressList)
//       );
//     }
//   }, [addressList]);

//   return (
//     <Dropdown placement="bottom-end">
//       <DropdownTrigger className="p-0 focus:outline-none focus:ring-0">
//         <Button
//           variant="light"
//           className="p-0 hover:bg-[#3BB77E]/10 focus:outline-none focus:ring-0"
//         >
//           <Skeleton isLoaded={status !== "loading"} className="rounded-full">
//             <Avatar
//               isBordered
//               color="success"
//               size="sm"
//               src={session?.user.profileUrl}
//               name={session?.user.fullName}
//               showFallback
//               className="transition-transform "
//             />
//           </Skeleton>
//         </Button>
//       </DropdownTrigger>

//       <DropdownMenu
//         aria-label="User menu"
//         className="w-80"
//         onAction={(key) => key === "logout" && signOut({ redirectTo: "/" })}
//       >
//         <DropdownSection showDivider>
//           <DropdownItem
//             isReadOnly
//             className="h-20 gap-2 focus:outline-none focus:ring-0"
//           >
//             <Skeleton isLoaded={status !== "loading"}>
//               <User
//                 name={session?.user.fullName || "Guest"}
//                 description={session?.user.emailAddress}
//                 avatarProps={{
//                   size: "lg",
//                   src: session?.user.profileUrl,
//                   showFallback: true,
//                   color: "success",
//                 }}
//                 classNames={{
//                   name: "font-semibold text-lg",
//                   description: "text-default-500",
//                 }}
//               />
//             </Skeleton>
//           </DropdownItem>
//         </DropdownSection>

//         <DropdownSection
//           items={
//             session?.user
//               ? accountLinks.filter((link) => link.link !== "/account/sign-out")
//               : []
//           }
//           className="focus:outline-none focus:ring-2 focus:ring-[#3bb77e]"
//         >
//           {(link) => (
//             <DropdownItem key={link.link} href={link.link} className="py-2">
//               {link.title}
//             </DropdownItem>
//           )}
//         </DropdownSection>

//         <DropdownItem
//           key={session?.user ? "logout" : "signin"}
//           color={session?.user ? "danger" : "success"}
//           href={
//             session?.user
//               ? undefined
//               : `/sign-in?${new URLSearchParams({
//                   callbackUrl: pathname,
//                 }).toString()}`
//           }
//           className="py-2 focus:outline-none focus:ring-0"
//         >
//           {session?.user ? "Log Out" : "Sign In"}
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   );
// };
// export default UserHeaderCard;

"use client";

import { accountLinks } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  DeliveryAddress,
  deliveryActions,
} from "@/redux-store/store-slices/DeliverySlice";
import { cartActions } from "@/redux-store/store-slices/CartSlice";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Skeleton,
  User,
  Button,
} from "@nextui-org/react";
import React, { useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const UserHeaderCard = () => {
  const dispatch = useAppDispatch();
  // const addressList = useAppSelector((state) => state.delivery.addressList);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Load delivery addresses from localStorage
  useEffect(() => {
    const deliveryAddress = localStorage.getItem("delivery address list");

    if (deliveryAddress) {
      try {
        const parsedData: DeliveryAddress[] = JSON.parse(deliveryAddress);
        dispatch(deliveryActions.setDeliveryAddressList(parsedData));
      } catch (error) {
        console.error(error);
      }
    }
  }, [dispatch]);

  // Save delivery addresses to localStorage when they change
  // useEffect(() => {
  //   if (addressList.length > 0) {
  //     localStorage.setItem(
  //       "delivery address list",
  //       JSON.stringify(addressList)
  //     );
  //   }
  // }, [addressList]);

  // Handle sign out with state cleanup
  const handleSignOut = useCallback(() => {
    // Clear cart in Redux store
    dispatch(cartActions.clearCart());

    // Clear delivery addresses in Redux store
    // dispatch(deliveryActions.clearDeliveryDetails());
    // dispatch(deliveryActions.clearAddressList());

    // Clear localStorage items
    // localStorage.removeItem("guestCart");
    // localStorage.removeItem("delivery address list");
    localStorage.removeItem("is2FAEnabled");

    // Perform NextAuth signOut
    signOut({ redirectTo: "/" });
  }, [dispatch]);

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger className="p-0 focus:outline-none focus:ring-0">
        <Button
          variant="light"
          className="p-0 hover:bg-[#3BB77E]/10 focus:outline-none focus:ring-0"
        >
          <Skeleton isLoaded={status !== "loading"} className="rounded-full">
            <Avatar
              isBordered
              color="success"
              size="sm"
              src={session?.user.profileUrl}
              name={session?.user.fullName}
              showFallback
              className="transition-transform"
            />
          </Skeleton>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="User menu"
        className="w-80"
        onAction={(key) => key === "logout" && handleSignOut()}
      >
        <DropdownSection showDivider>
          <DropdownItem
            isReadOnly
            className="h-20 gap-2 focus:outline-none focus:ring-0"
          >
            <Skeleton isLoaded={status !== "loading"}>
              <User
                name={session?.user.fullName || "Guest"}
                description={session?.user.emailAddress}
                avatarProps={{
                  size: "lg",
                  src: session?.user.profileUrl,
                  showFallback: true,
                  color: "success",
                }}
                classNames={{
                  name: "font-semibold text-lg",
                  description: "text-default-500",
                }}
              />
            </Skeleton>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection
          items={
            session?.user
              ? accountLinks.filter((link) => link.link !== "/account/sign-out")
              : []
          }
          className="focus:outline-none focus:ring-2 focus:ring-[#3bb77e]"
        >
          {(link) => (
            <DropdownItem key={link.link} href={link.link} className="py-2">
              {link.title}
            </DropdownItem>
          )}
        </DropdownSection>

        <DropdownItem
          key={session?.user ? "logout" : "signin"}
          color={session?.user ? "danger" : "success"}
          href={
            session?.user
              ? undefined
              : `/sign-in?${new URLSearchParams({
                  callbackUrl: pathname,
                }).toString()}`
          }
          className="py-2 focus:outline-none focus:ring-0"
        >
          {session?.user ? "Log Out" : "Sign In"}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserHeaderCard;
