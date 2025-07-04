'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'

const MotionWrapper = (props: MotionProps) => {
  return (
    <motion.div {...props}>
      {props.children}
    </motion.div>
  )
}

export default MotionWrapper