import Link from "next/link";
import React from "react";
import ServerImageRender from "../General/ServerImageRender";
import { Vendor } from "@/lib/types";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type PropsType = {
  store: Vendor;
};

const VendorCard = ({ store }: PropsType) => {
  return (
    <Link
      href={`/store/${store._id}`}
      className="text-center w-full max-w-[300px]"
    >
      {/* <div className="w-full">
        {store.logo ? (
          <ServerImageRender
            folderName="vendor"
            src={store.logo}
            alt={store.name}
            width={300}
            height={300}
            className="w-full aspect-square object-cover rounded-lg shadow-lg"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div className="w-full aspect-square bg-gray-200 rounded-lg shadow-lg" />
        )}
        <div className="mt-2">
          <h3 className="text-sm md:text-lg font-semibold line-clamp-1">
            {store.name}
          </h3>
        </div>
      </div> */}
      <motion.div
        whileHover={{ y: -5 }}
        className="group w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl"
      >
        <div className="aspect-square relative overflow-hidden">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">{store.name[0]}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600">4.5 (200+ reviews)</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default VendorCard;
