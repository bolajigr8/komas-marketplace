'use client'

import { AnimatePresence, AnimatePresenceProps } from 'framer-motion'
import React from 'react'

type Props = {
  children: React.ReactNode
} & AnimatePresenceProps

const AnimatePresenseWrapper = ({ children, ...props }: Props) => {
  return (
    <AnimatePresence {...props}>
      {children}
    </AnimatePresence>
  )
}

export default AnimatePresenseWrapper