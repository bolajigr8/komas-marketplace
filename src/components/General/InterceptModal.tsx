// 'use client'

// import React from 'react'
// import { useRouter } from 'next/navigation'
// import { Modal, ModalContent } from "@nextui-org/modal"
// import { cn } from '@/lib/utils'

// type PropsType = {
//   children: React.ReactNode
//   className?: string
// }

// const InterceptModal = ({ children, className }: PropsType) => {
//   const router = useRouter();

//   return (
//     <Modal
//       isOpen
//       onClose={() => router.back()}
//       size="lg"
//       backdrop="blur"
//       scrollBehavior="inside"
//     >
//       <ModalContent className={cn(`custom-scrollbar ${className}`)}>
//         {children}
//       </ModalContent>
//     </Modal>
//   );
// }

// export default InterceptModal

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalContent } from "@nextui-org/modal";
import { cn } from "@/lib/utils";

type PropsType = {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  setIsOpen: (open: boolean) => void;
};

const InterceptModal = ({
  children,
  className,
  isOpen,
  setIsOpen,
}: PropsType) => {
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.back();
      }}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
      className={cn("", className)}
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};

export default InterceptModal;
