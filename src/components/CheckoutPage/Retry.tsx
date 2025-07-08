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
  onClick: () => void;
  onOpenChange: (open: boolean) => void;
};

const Retry = ({ status, isOpen, onOpenChange, onClick }: PropsType) => {
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
              {/* {status.success ? (
                <BiCheckShield size={60} className="text-green-500" />
              ) : status.error ? ( */}
              <BiShieldX size={60} className="text-red-500" />
              {/* ) : null} */}
            </ModalHeader>
            <ModalBody>
              {/* <p className="text-xl font-semibold text-center">
                {status.success 
                  ? "Transaction Successful"
                  : status.error
                  ? "Transaction Failed. Try Again"
                  : ""}
              </p> */}
              {status.success && !status.created && (
                <p className="text-center px-4">
                  Your order creation is not completed
                </p>
              )}
            </ModalBody>
            {status.success && !status.created && (
              <ModalFooter className="justify-center">
                <Button
                  onClick={onClick}
                  size="lg"
                  className="w-full max-w-[200px] bg-green-500/20"
                >
                  Retry
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Retry;
