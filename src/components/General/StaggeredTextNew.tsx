'use client'
import React, { useEffect, useRef, useMemo } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

type PropsType = {
  text: string | string[]
  el?: keyof JSX.IntrinsicElements
  duration?: number
  delay?: number
  stagger?: number
  once?: boolean
  className?: string
}

const defaultAnimations = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
}

const StaggeredText = ({
  text,
  el: Wrapper = 'p',
  duration = 0.5,
  delay = 0,
  stagger = 0.1,
  once = false,
  className,
}: PropsType) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.5, once })
  const controls = useAnimation()
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

  useEffect(() => {
    if (isInView) controls.start('animate')
    else controls.start('initial')
  }, [isInView])

  return (
    <Wrapper className={className}>
      <span className='sr-only'>{text}</span>
      <motion.span
        ref={ref}
        aria-hidden
        initial='initial'
        animate={controls}
        variants={{
          animate: { transition: { staggerChildren: stagger } },
          initial: {},
        }}
        transition={{ duration, delay }}
      >
        {texts.map((line, lineIndex) => (
          <span key={lineIndex} className='block'>
            {line.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className='inline-block'>
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={defaultAnimations}
                    className='inline-block'
                  >
                    {char}
                  </motion.span>
                ))}
                <span className='inline-block'>&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  )
}

export default StaggeredText
