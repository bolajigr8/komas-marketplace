"use client";
import React from "react";
import PartnerStoresList from "../StoresPage/PartnerStoreList";
import { Vendor } from "@/lib/types";
import Link from "next/link";

type PropsType = {
  stores: Vendor[];
};

export default function Stores({ stores }: PropsType) {
  return (
    <section className="max-w-6xl mx-auto h-full px-4">
      <div className="w-full flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Our Partner Stores</h2>
        <Link href={"/store"} className="text-sm text-gray-500">
          View All
        </Link>
      </div>
      {stores.length ? (
        <PartnerStoresList stores={stores} className="grid-cols-4" />
      ) : (
        <div className="w-full h-[200px] flex items-center justify-center rounded-md bg-gray-100">
          <p className="font-medium text-center">No stores here</p>
        </div>
      )}
    </section>
  );
}
