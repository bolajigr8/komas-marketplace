"use client";
import Image from "next/image";
import React from "react";
import Search from "../General/Search";
import StaggeredText from "../General/StaggeredText";
import { motion } from "framer-motion";
import { Search as SearchIcon, MapPin, ChevronRight, Star } from "lucide-react";
import Feature from "./Feature";

type PropsType = {
  query?: string;
  category?: string;
};

const StoresHeroSection = ({ query, category }: PropsType) => {
  const text = [
    "Enjoy easy and fast same day delivery when you shop",
    "from any",
    "of the stores below.",
  ];

  // return (
  //   <section className="flex mx-auto mb-4">
  //     <div
  //       className="mt-4 w-[100%] h-full relative py-24 px-4 flex items-center justify-center"
  //       style={{
  //         backgroundImage: `url(/Images/Home/homebg.png)`,
  //         backgroundSize: "cover",
  //         backgroundPosition: "center",
  //         backgroundRepeat: "no-repeat",
  //       }}
  //     >
  //       <div className="max-w-6xl w-full flex justify-between items-end relative">
  //         <div className="relative z-10 lg:px-4">
  //           <div className="max-w-[800px]">
  //             <StaggeredText
  //               el="h2"
  //               text={text}
  //               className="text-[30px] md:text-[42px] font-semibold text-white leading-15 relative"
  //               stagger={0.1}
  //               duration={0.2}
  //               delay={0}
  //               once
  //             />
  //           </div>

  //           <p className="text-white my-4 relative">
  //             Delivery fee starts from (₦200-₦400)
  //           </p>
  //           <div className="flex items-start">
  //             <ProductSearch
  //               searchFor="store"
  //               q={query}
  //               category={category}
  //               addFilter
  //               classNames={{
  //                 wrapper: "md:max-w-[450px] lg:max-w[600px] z-10",
  //                 input: "w-full",
  //               }}
  //             />
  //           </div>
  //         </div>
  //         <div className="absolute right-0 md:right-40">
  //           <Image
  //             src="/Images/Store/alldrinks.png"
  //             alt="all drinks"
  //             width={250}
  //             height={300}
  //             className="z-0"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
  return (
    <section className="relative w-full bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-16 sm:py-24"
      >
        <div className="relative z-10 flex flex-col gap-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Discover Local Stores
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Fast same-day delivery from your favorite local stores, starting
              from just ₦200
            </p>

            <Search
              searchFor="store"
              q={query}
              // addFilter
              placeholder="search for stores..."
              classNames={{
                wrapper: "md:max-w-[450px] lg:max-w[600px] z-10",
                input: "w-full",
              }}
            />
          </motion.div>

          <div className="flex flex-wrap gap-4 text-white">
            <Feature icon={<MapPin />} text="Local Delivery" />
            <Feature icon={<Star />} text="Top-rated Stores" />
            <Feature icon={<ChevronRight />} text="Easy Ordering" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="white" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default StoresHeroSection;
