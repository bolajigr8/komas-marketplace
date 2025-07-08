"use client";

import React, { useMemo } from "react";
import { DeliveryAddress } from "@/redux-store/store-slices/DeliverySlice";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button, SharedSelection } from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";

type PropsType = {
  addressList: DeliveryAddress[];
  selectedAddressIndex: number;
  setSelectedAddressIndex: React.Dispatch<React.SetStateAction<number>>;
};

const DeliveryListDropdown = ({
  addressList,
  selectedAddressIndex,
  setSelectedAddressIndex,
}: PropsType) => {
  const selectedKey = useMemo(() => {
    if (selectedAddressIndex === -1) {
      return undefined;
    }
    return addressList[selectedAddressIndex]?.id;
  }, [addressList, selectedAddressIndex]);

  const router = useRouter();

  const handleSelect = ({ currentKey }: SharedSelection) => {
    if (currentKey === "add-address") {
      return router.push("/account/profile/edit/delivery-address/add");
    }

    setSelectedAddressIndex(
      addressList.findIndex((address) => address.id === currentKey)
    );
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          className="text-sm text-green-500 font-medium border-0"
        >
          Edit
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label=""
        selectionMode="single"
        selectedKeys={selectedKey ? [selectedKey] : undefined}
        onSelectionChange={handleSelect}
      >
        <DropdownSection title="Saved Addresses">
          {addressList.map((addr) => {
            const { houseNumber, address, city, state } = addr;
            return (
              <DropdownItem
                key={addr.id}
                description={`${city} ${state}`}
                endContent={
                  <Link
                    aria-label="Edit Shipping Info"
                    href={`/account/profile/edit/delivery-address/${addr.id}`}
                    className="p-1"
                  >
                    <CiEdit size={14} className="text-green-500" />
                  </Link>
                }
              >
                {`${houseNumber} ${address}`}
              </DropdownItem>
            );
          })}
        </DropdownSection>
        <DropdownItem
          key="add-address"
          className="text-xs p-2 w-full text-white bg-green-500 data-[hover]:bg-green-500/90 data-[hover]:text-white font-medium rounded-md text-center"
        >
          Add new address
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DeliveryListDropdown;
