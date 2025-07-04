'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation, useInView } from 'framer-motion'

type PropsType = {
  text: string | string[]
  el?: keyof JSX.IntrinsicElements
  duration?: number
  delay?: number
  stagger?: number
  once?: boolean
  repeatDelay?: number
  repeat?: number
  onReset?: () => void
  className?: string
}

const defaultAnimations = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

const StaggeredText = ({
  text,
  el: Wrapper = 'p',
  duration = 0.5,
  delay = 0,
  stagger = 0.1,
  once = false,
  repeat = 0,
  repeatDelay = 0,
  onReset = () => { },
  className
}: PropsType) => {
  const [counter, setCounter] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.5, once })
  const controls = useAnimation()
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const show = () => {
      controls.start('animate')

      // repeat animation if repeat prop is set
      if (repeat > 0) {
        interval = setInterval(async () => {
          setCounter((prev) => {
            if (prev + 1 >= repeat) {
              clearInterval(interval);
            }
            return prev + 1;
          });
          await controls.start("initial");
          controls.start("animate");
          onReset();
        }, repeatDelay);
      }
    }

    if (isInView) { 
      setCounter(0) // reset counter everytime the component is in view
      show()
    } else {
      controls.start('initial')
    }

    return () => clearInterval(interval)
  }, [isInView, texts])
  return (
    <AnimatePresence>
      <Wrapper className={className}>
        <span className="sr-only">{text}</span>
        <motion.span
          ref={ref}
          aria-hidden
          initial="initial"
          animate={controls}
          exit="exit"
          variants={{
            animate: { transition: { staggerChildren: stagger } },
            initial: {},
          }}
          transition={{ duration, delay }}
        >
          {texts.map((line, index) => (
            <span key={index} className='block'>
              {line.split(' ').map((text, index) => (
                <span
                  key={index}
                  className="inline-block"
                >
                  {text.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={defaultAnimations}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                  <span className="inline-block">&nbsp;</span>
                </span>
              ))}
            </span>
          ))}
        </motion.span>
      </Wrapper>
    </AnimatePresence>
  );
}

export default StaggeredText