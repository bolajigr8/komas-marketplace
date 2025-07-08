"use client";

import React from "react";
import { headerNavLinks } from "@/constants";
import { NavbarMenu, NavbarMenuItem, Link } from "@nextui-org/react";
// import NavLink from "../General/NavLink";
import { motion } from "framer-motion";
import { RxDashboard } from "react-icons/rx";
import { usePathname } from "next/navigation";

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

const MobileNav = ({ isOpen, onClose }: Props) => {
  const pathname = usePathname();
  return (
    <NavbarMenu className="pt-6 gap-6">
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 bg-[#3BB77E]/10 text-[#3BB77E] p-4 rounded-lg mb-4"
      >
        <RxDashboard size={20} />
        <div>
          <p className="text-sm font-medium">Shopping Address</p>
          <p className="text-xs">Aladinma Owerre Imo</p>
        </div>
      </motion.div> */}

      {headerNavLinks.map((item, index) => (
        <motion.div
          key={item.route}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <NavbarMenuItem>
            <Link
              href={item.route}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors
                ${
                  pathname === item.route
                    ? "text-[#3BB77E] bg-[#3BB77E]/10"
                    : "hover:text-[#3BB77E] hover:bg-[#3BB77E]/10"
                }`}
              onClick={onClose}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          </NavbarMenuItem>
        </motion.div>
      ))}
    </NavbarMenu>
  );
};

export default MobileNav;
