"use client";
import DeliveryAddressForm from "@/components/AccountPages/DeliveryAddressForm";
import InterceptModal from "@/components/General/InterceptModal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import React from "react";

type PropsType = {
  params: {
    addressId: string;
  };
};

const InterceptedDeliveryEdit = ({ params: { addressId } }: PropsType) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <InterceptModal
      className="h-[90vh] md:h-[70vh]"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <ModalHeader className="text-2xl text-center font-bold mb-2">
        Edit Shipping Information
      </ModalHeader>
      <ModalBody>
        <DeliveryAddressForm
          action="edit"
          addressId={addressId}
          isIntercepted
          onSuccess={() => setIsOpen(false)}
        />
      </ModalBody>
    </InterceptModal>
  );
};

export default InterceptedDeliveryEdit;
