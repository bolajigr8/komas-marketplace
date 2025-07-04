"use client"

import { NextUIProvider } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

const UIProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  return (
    <NextUIProvider
      navigate={router.push}
    >
      {children}
    </NextUIProvider>
  )
}

export default UIProvider