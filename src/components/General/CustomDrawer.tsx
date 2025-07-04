"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
} from "framer-motion";

type PropsType = {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  classNames?: {
    outerWrapper?: string
    innerWrapper?: string
  }
}

const CustomDrawer = ({ children, open, onOpenChange, classNames }: PropsType) => {
  const [isOpen, setIsOpen] = useState(open)
  const dragY = useMotionValue(0);
  const dragControls = useDragControls();
  const [scope, animate] = useAnimate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(async () => {
    if (drawerRef.current) {
      animate('#overlay', {
        opacity: [1, 0],
      });

      const yStart = typeof dragY.get() === "number" ? dragY.get() : 0;

      const height = drawerRef.current.offsetHeight;

      await animate("#drawer", {
        y: [yStart, height],
      }, {
        ease: 'easeInOut'
      });
      setIsOpen(false)
    }
  }, [drawerRef.current, animate]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }

    // Handle focus trapping
    if (e.key === "Tab") {
      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements) return;
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (!e.shiftKey) {
        // If Tab is pressed
        e.preventDefault();
        return firstElement?.focus();
      }

      // If Shift + Tab is pressed
      e.preventDefault();
      lastElement?.focus();
    }
  };

  useEffect(() => {
    open ? setIsOpen(true) : handleClose()
  }, [open])

  useEffect(() => {
    onOpenChange(isOpen)

    if (!isOpen) return

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={scope}
          role="dialog"
          aria-modal
          className="fixed z-50 inset-0"
        >
          <motion.div
            id="overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />
          <motion.div
            id="drawer"
            ref={drawerRef}
            initial={{
              y: "100%",
            }}
            animate={{
              y: "0%",
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            dragControls={dragControls}
            dragListener={false}
            onDragEnd={() => dragY.get() > 100 && handleClose()}
            style={{ y: dragY }}
            transition={{
              ease: "easeInOut",
            }}
            onClick={(e) => e.stopPropagation()}
            className={`fixed z-10 inset-x-0 bottom-0 max-h-[90vh] bg-white !flex flex-col gap-2 rounded-t-xl p-4 pt-0 overflow-hidden ${classNames?.outerWrapper}`}
          >
            <button
              aria-label="Drag to close"
              onPointerDown={(e) => dragControls.start(e)}
              className="flex w-full items-center justify-center touch-none focus:outline-none py-4"
            >
              <span className="w-28 h-1 rounded-xl bg-gray-400 cursor-grab active:cursor-grabbing touch-none" />
            </button>
            <div
              className={`max-h-full flex-1 w-full overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px] ${classNames?.innerWrapper}`}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomDrawer;
