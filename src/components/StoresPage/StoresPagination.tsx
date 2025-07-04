"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import StoresPaginationControls from "./StoresPaginationControls";

interface StoresPaginationProps {
  totalPages: number;
  currentPage: number;
}

export const StoresPagination = ({
  totalPages,
  currentPage,
}: StoresPaginationProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const handlePageChange = (page: number): void => {
    const newUrl = formUrlQuery({
      params: params.toString(),
      keys: ["page"],
      values: [page.toString()],
    });
    router.push(newUrl);
  };

  return (
    <div className="mt-8 flex justify-center">
      <StoresPaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StoresPagination;
