"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  TabsProvider,
  TabsProviderProps,
  useTabs,
} from "@/providers/TabsProvider";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type TabProps = {
  children: React.ReactNode;
  value: string;
  className?: string;
};

type TabsListProps = {
  children: React.ReactNode
};

const Tabs = ({
  children,
  classNames,
  isLink,
  arrangement,
}: TabsProviderProps) => (
  <TabsProvider
    isLink={isLink}
    classNames={classNames}
    arrangement={arrangement}
  >
    {children}
  </TabsProvider>
);

const TabsList = ({ children }: TabsListProps) => {
  const { arrangement, classNames } = useTabs();
  return (
    <ul
      role="tablist"
      className={`flex justify-between p-1 ${
        arrangement === "horizontal" ? "flex-row" : "flex-col"
      } ${classNames?.tabsList}`}
    >
      {children}
    </ul>
  );
};

const Tab = ({ children, value }: TabProps) => {
  const { selected, setSelected, isLink, classNames } = useTabs();
  const pathname = usePathname();
  const ref = useRef<HTMLLIElement>(null);

  const checkIsActive = useCallback(
    (value: string): boolean => {
      if (value === "/") return pathname === value;
      return pathname?.startsWith(value);
    },
    [pathname]
  );

  useEffect(() => {
    if (!isLink) return;

    if (checkIsActive(value)) {
      setSelected(value);
    }
  }, [checkIsActive, pathname]);

  const handleClick = () => {
    setSelected(value);
  };
  return (
    <li
      ref={ref}
      role="tab"
      aria-selected={selected === value}
      data-selected={selected === value}
      onClick={handleClick}
      className={`relative cursor-pointer flex transition-colors duration-500 delay-100 data-[selected=true]:text-white ${classNames?.tab}`}
    >
      {selected === value && <Cursor />}
      <span className="relative flex-1 w-full">{children}</span>
    </li>
  );
};

const Cursor = () => {
  const { classNames, selected, tabId } = useTabs();
  return (
    <motion.div
      layoutId={tabId}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={`absolute rounded-full bg-black inset-0 ${classNames?.cursor}`}
    />
  );
};

export default Tabs;
export { TabsList, Tab };