"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type PropsType = {
  label: string;
  route: string;
  icon?: React.ReactNode;
  classNames?: {
    wrapper?: string;
    label?: string;
  };
  onClick?: () => void;
};

export default function NavLink({
  label,
  route,
  icon,
  classNames,
  onClick,
}: PropsType) {
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <Link href={route} aria-label={label} onClick={onClick}>
      <motion.div
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg transition-colors",
          isActive
            ? "text-[#3BB77E] bg-[#3BB77E]/10"
            : "hover:text-[#3BB77E] hover:bg-[#3BB77E]/5",
          classNames?.wrapper
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {icon && <span className="text-current">{icon}</span>}
        <span className={cn("font-medium", classNames?.label)}>{label}</span>
      </motion.div>
    </Link>
  );
}
