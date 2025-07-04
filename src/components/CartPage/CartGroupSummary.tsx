"use client";

import { formatNumber } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { CartItem, Vendor } from "@/lib/types";
import { useAppSelector } from "@/redux-store/hooks";
import CheckoutOptionsModal from "./CheckoutOptionsModal";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const CartGroupSummary = ({
  cartItems,
  vendor,
}: {
  cartItems: CartItem[];
  vendor: Vendor;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [showCheckout, setShowCheckout] = useState(false);
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );
  const handleCheckout = () => {
    if (!session) {
      router.push(`/sign-in?${new URLSearchParams({ callbackUrl: pathname })}`);
      return;
    }

    const isShopmate = session.user.userRoleType.includes("shopmate");
    router.push(
      `/checkout?${new URLSearchParams({
        step: "1",
        vendorId: vendor._id,
        shopmate: isShopmate.toString(),
      })}`
    );
  };
  return (
    <div className="flex flex-col gap-4 w-full md:w-3/4 mx-auto">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Cart Summary</span>
        <span className="text-lg font-semibold">
          ₦{totalPrice.toLocaleString()}
        </span>
      </div>

      <Button
        size="lg"
        onClick={handleCheckout}
        className="bg-yellow-400 text-white rounded-xl flex items-center justify-between"
      >
        <span>₦{totalPrice.toLocaleString()}</span>
        <span className="flex items-center gap-2">
          Checkout {vendor.name}
          <IoIosArrowRoundForward size={15} />
        </span>
      </Button>

      {/* <CheckoutOptionsModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        vendorId={vendor._id}
      /> */}
    </div>
  );
};
export default CartGroupSummary;
//  const vendorAssociatedItems = useAppSelector((state) =>
//     state.cart.products.filter((item) =>
//       typeof item.product?.vendor === "string"
//         ? item.product?.vendor === vendor?._id
//         : item.product?.vendor?._id === vendor?._id
//     )
//   );

//   const totalPrice = useMemo(() => {
//     return vendorAssociatedItems.reduce(
//       (acc, item) => acc + item.product?.price * item.quantity,
//       0
//     );
//   }, [vendorAssociatedItems]);
