"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { deliveryActions } from "@/redux-store/store-slices/DeliverySlice";
import { useToast } from "@/hooks/use-toast";
import DeliveryListDropdown from "./DeliveryListDropdown";

const DeliveryAddressManager = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const addresses = useAppSelector((state) => state.delivery.addressList);
  const selectedAddressId = useAppSelector(
    (state) => state.delivery.selectedAddressId
  );

  const handleSelectAddress = (addressId: string) => {
    dispatch(deliveryActions.setSelectedAddress(addressId));
    toast({ description: "Delivery address selected" });
  };

  const handleAddNewAddress = () => {
    router.push("/account/profile/edit/delivery-address/add");
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Delivery Addresses</h3>
          <div className="flex gap-2">
            <DeliveryListDropdown
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
            />
            <Button
              color="success"
              variant="light"
              onClick={handleAddNewAddress}
            >
              Add New
            </Button>
          </div>
        </div>

        {selectedAddressId && addresses.length > 0 ? (
          <Card className="p-3 bg-gray-50">
            {(() => {
              const selectedAddress = addresses.find(
                (addr) => addr.id === selectedAddressId
              );
              if (!selectedAddress) return null;

              return (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {selectedAddress.firstName} {selectedAddress.lastName}
                    </span>
                    {selectedAddress.isDefault && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.address}, {selectedAddress.city},{" "}
                    {selectedAddress.state}, {selectedAddress.country}
                  </p>
                </div>
              );
            })()}
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-gray-500 mb-4">No delivery addresses found</p>
            <Button color="success" onClick={handleAddNewAddress}>
              Add Your First Address
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DeliveryAddressManager;
