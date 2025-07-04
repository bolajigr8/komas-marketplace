"use client";

import React from "react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import DeliveryAddressDisplay from "./DeliveryAddressDisplay";
import { useWidth } from "@/providers/WidthProvider";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  DeliveryAddress,
  deliveryActions,
} from "@/redux-store/store-slices/DeliverySlice";
import { CiEdit } from "react-icons/ci";
import DeleteConfirmation from "./DeleteConfirmation";
import { Button } from "@nextui-org/react";

type PropsType = {
  children: React.ReactNode;
};

const EditSection = ({ children }: PropsType) => {
  const addressList = useAppSelector((state) => state.delivery.addressList);
  const dispatch = useAppDispatch();
  const { width } = useWidth();

  const handleReorder = (newOrder: DeliveryAddress[]) => {
    dispatch(deliveryActions.setDeliveryAddressList(newOrder));
  };

  const handleDelete = (id: string) => {
    dispatch(deliveryActions.removeDeliveryAddress(id));
  };
  return (
    <div className="flex flex-col gap-2">
      {children}
      <Reorder.Group
        axis={width < 768 ? "y" : "x"}
        values={addressList}
        onReorder={handleReorder}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <AnimatePresence initial={false}>
          {addressList.map((address, index) => (
            <Reorder.Item
              key={address.id}
              value={address}
              layoutId={address.id}
              drag={width < 768 ? "y" : "x"}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white cursor-grab active:cursor-grabbing"
            >
              <DeliveryAddressDisplay
                deliveryInfo={address}
                index={index + 1}
                addPhoneNumber
                controls={
                  <div className="flex items-center gap-4">
                    <Link
                      aria-label="Edit Shipping Info"
                      href={`/account/profile/edit/delivery-address/${address.id}`}
                    >
                      <CiEdit size={20} className="text-green-500" />
                    </Link>
                    <DeleteConfirmation
                      onConfirm={() => handleDelete(address.id)}
                    />
                  </div>
                }
              />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      <AnimatePresence initial={false} mode="popLayout">
        {addressList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-[200px] bg-gray-100 flex items-center justify-center rounded-md"
          >
            <p className="text-center font-medium">No address found</p>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        size="lg"
        className="mt-4 flex md:w-[80%] md:mx-auto bg-green-500"
      >
        <Link
          href={"/account/profile/edit/delivery-address/add"}
          className="text-white font-medium flex-1"
        >
          Add New Address
        </Link>
      </Button>
    </div>
  );
};

export default EditSection;
