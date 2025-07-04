"use client";

import { headerNavLinks } from "@/constants";
import NavLink from "../General/NavLink";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useWidth } from "@/providers/WidthProvider";

export default function NavHeader() {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const { width } = useWidth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    if (!previous) return;

    if (latest > previous && latest > 100) setIsHidden(true);
    else setIsHidden(false);
  });
  return (
    <motion.nav
      animate={{ y: isHidden ? "-100%" : "0%" }}
      transition={{ type: "tween" }}
      className="hidden md:block sticky z-40 top-[60px] bg-white pt-4 py-3"
      style={{ boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)" }}
    >
      <ul className="flex justify-between items-center w-[66%] mx-auto">
        {headerNavLinks.map((item, index) => (
          <li key={index}>
            <NavLink label={item.label} route={item.route} icon={item.icon} />
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
