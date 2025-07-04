import React from "react";
import {
  deliveryActions,
  DeliveryAddress,
} from "@/redux-store/store-slices/DeliverySlice";
import { numberToOrdinal } from "@/lib/utils";
import { Button, Input } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { Star } from "lucide-react";
import { useAppSelector } from "@/redux-store/hooks";

type PropsType = {
  index: number;
  deliveryInfo: DeliveryAddress;
  addPhoneNumber?: boolean;
  controls?: React.ReactNode;
};

const DeliveryAddressDisplay = ({
  index,
  deliveryInfo,
  addPhoneNumber,
  controls,
}: PropsType) => {
  const { houseNumber, address, city, state, country, postCode } = deliveryInfo;
  const dispatch = useDispatch();
  const handleSetDefault = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deliveryActions.setDefaultAddress(addressId));
  };
  return (
    <div
      className={`p-4 w-full flex flex-col gap-4 rounded-xl border ${
        deliveryInfo.isDefault && "border-green-500"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {numberToOrdinal(index)} Shipping Info
        </h2>
        <div className="flex items-center gap-4">
          {!deliveryInfo.isDefault ? (
            <Button
              size="sm"
              variant="light"
              className="min-w-0 p-1"
              onClick={(e) => handleSetDefault(deliveryInfo.id, e)}
              title="Set as default"
            >
              <Star size={16} className="text-gray-400" />
            </Button>
          ) : (
            <Star
              size={16}
              className="text-gray-400"
              fill="gold"
              stroke="none"
            />
          )}

          {controls}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Input
          label="First Name"
          labelPlacement="outside"
          defaultValue={deliveryInfo.firstName}
          isReadOnly
          size="lg"
          classNames={{ label: "font-medium" }}
        />
        <Input
          label="Last Name"
          labelPlacement="outside"
          defaultValue={deliveryInfo.lastName}
          isReadOnly
          size="lg"
          classNames={{ label: "font-medium" }}
        />
        <Input
          label="Email"
          labelPlacement="outside"
          defaultValue={deliveryInfo.emailAddress}
          isReadOnly
          size="lg"
          classNames={{ label: "font-medium" }}
        />
        {addPhoneNumber && (
          <Input
            label="Phone Number"
            labelPlacement="outside"
            defaultValue={deliveryInfo.phoneNumber}
            isReadOnly
            size="lg"
            classNames={{ label: "font-medium" }}
          />
        )}
        <Input
          label="Address"
          labelPlacement="outside"
          defaultValue={`${houseNumber}, ${address}, ${city}, ${state}, ${country}`}
          isReadOnly
          size="lg"
          classNames={{ label: "font-medium" }}
        />
      </div>
    </div>
  );
};

export default DeliveryAddressDisplay;
