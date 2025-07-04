import Link from "next/link";
import React from "react";
import { BiCheckShield, BiShieldX } from "react-icons/bi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FaHouse } from "react-icons/fa6";

type Status = {
  success: boolean;
  error: boolean;
  processing: boolean;
  created: boolean;
};

type PropsType = {
  status: Status;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const ConfirmationModal = ({ status, isOpen, onOpenChange }: PropsType) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="justify-center">
              {status.success && status.created ? (
                <BiCheckShield size={60} className="text-green-500" />
              ) : status.error ? (
                <BiShieldX size={60} className="text-red-500" />
              ) : null}
            </ModalHeader>
            <ModalBody>
              <p className="text-xl font-semibold text-center">
                {status.success && status.created
                  ? "Transaction Successful"
                  : status.error
                  ? "Transaction Failed. Try Again"
                  : ""}
              </p>
              {status.success && status.created && (
                <p className="text-center px-4">
                  Your order collection code has been sent to your email. To
                  continue tracking your order, go to{" "}
                  <Link
                    href={"/account/track-order"}
                    onClick={onClose}
                    className="text-green-500"
                  >
                    your profile page
                  </Link>
                </p>
              )}
            </ModalBody>
            {status.success && status.created && (
              <ModalFooter className="justify-center">
                <Button size="lg" className="w-full max-w-[200px] bg-green-500">
                  <Link
                    href={"/"}
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-4 text-white font-medium"
                  >
                    Go Home
                    <FaHouse size={25} />
                  </Link>
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
