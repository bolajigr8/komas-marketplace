'use client'

import React, { createContext, useContext, useState } from "react"

type ModalContextProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalContext = createContext<ModalContextProps>({
  open: true,
  setOpen: () => {}
})

const InterceptModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true)

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export default InterceptModalProvider

export const useInterceptModal = () => useContext(ModalContext)