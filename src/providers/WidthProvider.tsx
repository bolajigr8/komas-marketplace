'use client'

import React, { createContext, useContext, useEffect, useState } from "react";

type WidthContextProps = {
  width: number;
}

export type WidthProviderProps = {
  children: React.ReactNode;
}

const WidthContext = createContext<WidthContextProps | undefined>(undefined);

export const useWidth = () => { 
  const context = useContext(WidthContext);

  if (context === undefined) {
    throw new Error("useWidth must be used within a WidthProvider");
  }

  return context;
}

export const WidthProvider = ({ children }: WidthProviderProps) => { 
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
   }, [])

  return (
    <WidthContext.Provider value={{ width }}>
      {children}
    </WidthContext.Provider>
  );
}