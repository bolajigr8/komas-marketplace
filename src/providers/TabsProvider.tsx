"use client";

import React, { createContext, useContext, useId, useState } from "react";


type TabContextProps = {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  tabId: string;
  classNames?: {
    tabsList?: string;
    tab?: string;
    cursor?: string;
  };
  isLink?: boolean;
  arrangement?: "vertical" | "horizontal";
};

export type TabsProviderProps = {
  children: React.ReactNode;
  isLink?: boolean;
  classNames?: {
    tabsList?: string;
    tab?: string;
    cursor?: string;
  };
  arrangement: "vertical" | "horizontal";
};

const TabContext = createContext<TabContextProps | undefined>(undefined);

export const useTabs = () => {
  const context = useContext(TabContext);

  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider");
  }

  return context;
};

export const TabsProvider = ({
  children,
  classNames,
  isLink,
  arrangement,
}: TabsProviderProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const tabId = useId()

  const value = {
    selected,
    setSelected,
    tabId,
    classNames,
    isLink,
    arrangement,
  };
  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};
