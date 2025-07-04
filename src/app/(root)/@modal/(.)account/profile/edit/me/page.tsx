"use client";
import AccountInfoFormWrapper from "@/components/AccountPages/AccountInfoFormWrapper";
import InterceptModal from "@/components/General/InterceptModal";
import Loader from "@/components/General/Loader";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import React, { CSSProperties, Suspense } from "react";

const InterceptedUserEdit = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <InterceptModal
      className="h-[90vh] md:h-[70vh]"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <ModalHeader className="text-2xl text-center font-bold mb-2">
        Edit Account Information
      </ModalHeader>
      <ModalBody>
        <Suspense
          fallback={
            <div className="flex-1 h-full flex items-center justify-center">
              <Loader className="!w-6" />
            </div>
          }
        >
          <AccountInfoFormWrapper isIntercepted />
        </Suspense>
      </ModalBody>
    </InterceptModal>
  );
};

export default InterceptedUserEdit;
