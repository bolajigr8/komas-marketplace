"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AccordionData = {
  title: string;
  description: string;
};

type AccordionProps = {
  data: AccordionData[];
};

const Accordion = ({ data }: AccordionProps) => {
  const [selected, setSelected] = useState<number | null>(0);

  const handleSelect = (index: number) => {
    setSelected(selected === index ? null : index);
  };
  return (
    <AnimatePresence>
      <motion.div className="grid gap-4">
        {data.map((item, index) => (
          <motion.div key={index} className="grid gap-2">
            <motion.div
              initial={selected === index ? { height: "auto" } : { height: 0 }}
              animate={selected === index ? { height: "auto" } : { height: 0 }}
              className="overflow-hidden"
            >
              <motion.p className={`text-sm text-left text-pretty`}>
                {item.description}
              </motion.p>
            </motion.div>
            <motion.div
              className="flex justify-center p-4 py-2 border border-gray-400 relative cursor-pointer"
              onClick={() => handleSelect(index)}
            >
              <p className="text-center">{item.title}</p>
              <span className="absolute right-3">
                {selected === index ? (
                  <span>&#65087;</span>
                ) : (
                  <span>&#65088;</span>
                )}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default Accordion;