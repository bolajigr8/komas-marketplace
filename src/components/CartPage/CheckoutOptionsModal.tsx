// "use client";
// import React from "react";
// import Link from "next/link";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
// } from "@nextui-org/react";
// import { useSession } from "next-auth/react";

// type CheckoutOptionsModalProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   vendorId?: string;
// };

// const CheckoutOptionsModal: React.FC<CheckoutOptionsModalProps> = ({
//   open,
//   onOpenChange,
//   vendorId,
// }) => {
//   const { data: session } = useSession();

//   // console.log(session?.user.userRoleType.includes("admin"));
//   const generateCheckoutUrl = (shopmate: boolean) => {
//     const searchParams = new URLSearchParams({
//       step: "1",
//       vendorId: vendorId || "",
//       shopmate: shopmate.toString(),
//     });
//     return `/checkout?${searchParams.toString()}`;
//   };

//   return (
//     <Modal isOpen={open} onOpenChange={onOpenChange} backdrop="blur">
//       <ModalContent>
//         {(onClose) => (
//           <>
//             <ModalHeader>Choose Checkout Option</ModalHeader>
//             <ModalBody>
//               <p>Would you like to checkout as a customer or as a shopmate?</p>
//             </ModalBody>
//             <ModalFooter>
//               <Button onPress={onClose} color="primary">
//                 <Link
//                   href={generateCheckoutUrl(false)}
//                   className="flex-1 text-white font-medium"
//                 >
//                   Checkout as Customer
//                 </Link>
//               </Button>
//               <Button onPress={onClose} color="secondary">
//                 <Link
//                   href={generateCheckoutUrl(true)}
//                   className="flex-1 font-medium"
//                 >
//                   Checkout as Shopmate
//                 </Link>
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CheckoutOptionsModal;
"use client";

import React from "react";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { IoPersonOutline, IoStorefrontOutline } from "react-icons/io5";

type CheckoutOptionsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId?: string;
};

const CheckoutOptionsModal: React.FC<CheckoutOptionsModalProps> = ({
  open,
  onOpenChange,
  vendorId,
}) => {
  const { data: session } = useSession();

  const generateCheckoutUrl = (shopmate: boolean) => {
    const searchParams = new URLSearchParams({
      step: "1",
      vendorId: vendorId || "",
      shopmate: shopmate.toString(),
    });
    return `/checkout?${searchParams.toString()}`;
  };

  // Check user roles
  const isShopmate = session?.user.userRoleType.includes("shopmate");
  const isCustomer = session?.user.userRoleType.includes("customer");

  // If user is only a customer or only a shopmate, redirect them automatically
  React.useEffect(() => {
    if (open && !isCustomer && isShopmate) {
      window.location.href = generateCheckoutUrl(true);
    } else if (open && isCustomer && !isShopmate) {
      window.location.href = generateCheckoutUrl(false);
    }
  }, [open, isCustomer, isShopmate]);

  // If user has only one role, don't show the modal
  if (!isCustomer || !isShopmate) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "rounded-lg",
        header: "border-b border-gray-200 px-6 py-4",
        body: "px-6 py-4",
        footer: "px-6 py-4 border-t border-gray-200",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-xl font-semibold text-gray-800">
              Choose Checkout Option
            </ModalHeader>

            <ModalBody>
              <p className="text-gray-600 mb-4">
                You have multiple roles available. Please select how you would
                like to proceed:
              </p>

              <div className="space-y-3">
                <Link
                  href={generateCheckoutUrl(false)}
                  className="block w-full"
                  onClick={onClose}
                >
                  <Button
                    className="w-full bg-primary-600 text-white hover:bg-primary-700 h-14"
                    size="lg"
                    style={{
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    <IoPersonOutline className="text-xl mr-2" />
                    Checkout as Customer
                  </Button>
                </Link>

                <Link
                  href={generateCheckoutUrl(true)}
                  className="block w-full"
                  onClick={onClose}
                >
                  <Button
                    className="w-full bg-secondary-600 text-white hover:bg-secondary-700 h-14"
                    size="lg"
                    style={{
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    <IoStorefrontOutline className="text-xl mr-2" />
                    Checkout as Shopmate
                  </Button>
                </Link>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                onPress={onClose}
                className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                size="lg"
                style={{
                  border: "none",
                  boxShadow: "none",
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CheckoutOptionsModal;
