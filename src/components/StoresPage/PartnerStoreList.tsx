"use client";
import React from "react";
import { Vendor } from "@/lib/types";
import VendorCard from "./VendorCard";

type PropsType = {
  stores: Vendor[];
  className?: string;
};

const PartnerStoresList: React.FC<PropsType> = ({ className, stores }) => {
  return (
    <div className={`grid gap-x-2 gap-y-6 justify-items-center ${className}`}>
      {stores.map((store) => (
        <VendorCard key={store._id} store={store} />
      ))}
    </div>
  );
};

export default PartnerStoresList;
