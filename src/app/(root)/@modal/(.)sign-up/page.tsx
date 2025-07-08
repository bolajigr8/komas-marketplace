// "use client";
// import AuthForm from "@/components/AuthPages/AuthForm";
// import InterceptModal from "@/components/General/InterceptModal";
// import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
// import Link from "next/link";
// import React, { CSSProperties } from "react";
// import { z } from "zod";

// type PropsType = {
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// };

// const schema = z.object({
//   callbackUrl: z.string().optional(),
// });

// const InterceptedSignUp = ({ searchParams }: PropsType) => {
//   const { data } = schema.safeParse(searchParams);
//   const [isOpen, setIsOpen] = React.useState(true);
//   return (
//     <InterceptModal isOpen={isOpen} setIsOpen={setIsOpen}>
//       <ModalHeader className="text-2xl text-center font-bold mb-2">
//         Create Account
//       </ModalHeader>
//       <ModalBody>
//         <AuthForm
//           action="register"
//           callbackUrl={data?.callbackUrl}
//           replaceHistory
//           onSuccess={() => setIsOpen(false)}
//         />
//       </ModalBody>
//       <ModalFooter className="justify-start">
//         <p>
//           Already have an account?{" "}
//           <Link
//             replace
//             href={`/sign-in?${new URLSearchParams({
//               callbackUrl: data?.callbackUrl || "",
//             }).toString()}`}
//             className="text-green-500"
//           >
//             Login
//           </Link>
//         </p>
//       </ModalFooter>
//     </InterceptModal>
//   );
// };

// export default InterceptedSignUp;

// InterceptedSignUp.tsx
'use client'
import AuthForm from '@/components/AuthPages/AuthForm'
import InterceptModal from '@/components/General/InterceptModal'
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react'
import Link from 'next/link'
import React, { CSSProperties } from 'react'
import { z } from 'zod'

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const schema = z.object({
  callbackUrl: z.string().optional(),
})

const InterceptedSignUp = ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  const [isOpen, setIsOpen] = React.useState(true)

  // const callbackUrl = data?.callbackUrl || "https://example.com/dashboard";
  const callbackUrl = 'https://example.com/dashboard'

  return (
    <InterceptModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalHeader className='text-2xl text-center font-bold mb-2'>
        Create Account
      </ModalHeader>
      <ModalBody>
        <AuthForm
          action='register'
          callbackUrl={callbackUrl}
          replaceHistory
          onSuccess={() => setIsOpen(false)}
        />
      </ModalBody>
      <ModalFooter className='justify-start'>
        <p>
          Already have an account?{' '}
          <Link
            replace
            href={`/sign-in?${new URLSearchParams({
              callbackUrl: callbackUrl,
            }).toString()}`}
            className='text-green-500'
          >
            Login
          </Link>
        </p>
      </ModalFooter>
    </InterceptModal>
  )
}

export default InterceptedSignUp
