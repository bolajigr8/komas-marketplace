"use client";
import VerifyUserOtp from "@/components/AuthPages/VerifyUserOtp";
import InterceptModal from "@/components/General/InterceptModal";
import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import React, { CSSProperties } from "react";
import { z } from "zod";

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const schema = z.object({
  username: z.string().optional(),
  callbackUrl: z.string().optional(),
});

const InterceptedOtpVerify = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams);
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <InterceptModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalHeader className="text-2xl text-center font-bold mb-2">
        Enter Verification Code
      </ModalHeader>
      <ModalBody>
        <VerifyUserOtp
          username={data?.username}
          callbackUrl={data?.callbackUrl}
          replaceHistory
        />
      </ModalBody>
    </InterceptModal>
  );
};

export default InterceptedOtpVerify;
