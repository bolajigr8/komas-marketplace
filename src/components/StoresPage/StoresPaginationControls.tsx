"use client";

import React from "react";
import { Pagination } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

type PropsType = {
  // pageCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const StoresPaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PropsType) => {
  // const router = useRouter();

  // const searchParams = useSearchParams();

  // const handlePageChange = (page: number) => {
  //   const newUrl = formUrlQuery({
  //     params: searchParams.toString(),
  //     keys: ["page"],
  //     values: [page.toString()],
  //   });

  //   router.push(newUrl);
  // };

  return (
    // <Pagination
    //   showControls
    //   total={pageCount}
    //   page={currentPage + 1}
    //   onChange={handlePageChange}
    //   classNames={{
    //     cursor: 'bg-green-500'
    //   }}
    // />

    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            currentPage === index
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default StoresPaginationControls;
