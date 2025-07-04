"use client";

import React, { useMemo } from "react";
import DeliveryAddressDisplay from "./DeliveryAddressDisplay";
import { useAppSelector } from "@/redux-store/hooks";

const DeliveryList = () => {
  const addresses = useAppSelector((state) => state.delivery.addressList);

  const sortedAddresses = useMemo(
    () =>
      [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses]
  );

  if (!sortedAddresses.length) {
    return (
      <div className="col-span-1 md:col-span-2 h-[200px] bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-center font-medium">No address found</p>
      </div>
    );
  }

  return (
    <>
      {sortedAddresses.map((address, index) => (
        <DeliveryAddressDisplay
          key={address.id}
          index={index + 1}
          deliveryInfo={address}
          addPhoneNumber
        />
      ))}
    </>
  );
};

export default DeliveryList;
