import DeliveryAddressForm from "@/components/AccountPages/DeliveryAddressForm";
import { Metadata } from "next";
import React, { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Add Delivery Address",
  description: "Add Delivery Address",
};

const DeliveryAddressAdd = () => {
  return (
    <main className="bg-white w-full overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]">
      <div className="flex flex-col gap-4 py-4 mx-auto">
        <h2 className="text-lg font-semibold">Add Shipping Info</h2>
        <DeliveryAddressForm action="add" />
      </div>
    </main>
  );
};

export default DeliveryAddressAdd;
