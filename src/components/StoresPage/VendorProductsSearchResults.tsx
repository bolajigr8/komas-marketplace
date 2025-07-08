// "use client";
// import React from "react";
// import StoresPaginationControls from "./StoresPaginationControls";
// import ProductCard from "../General/ProductCard";
// import { Product } from "@/lib/types";
// import { divideIntoArrays } from "@/lib/utils";
// import ProductsList from "../General/ProductsList";

// type PropsType = {
//   query: string;
//   products: Product[];
//   page: number;
//   category?: string;
// };

// const VendorProductsSearchResults = ({
//   query,
//   page,
//   products,
//   category,
// }: PropsType) => {
//   const searchPages = divideIntoArrays({
//     data: products,
//     itemsPerArray: 24,
//   });

//   const currentPage = searchPages[page] || [];

//   return (
//     <div className="max-w-6xl px-4 mx-auto space-y-12">
//       <h2 className="text-2xl font-semibold">
//         Search results for {query} {!!category && `in ${category}`} hh
//       </h2>
//       {products ? (
//         <ProductsList
//           title=""
//           products={searchPages[0]}
//           className="pb-12"
//           showCartBtn
//         />
//       ) : (
//         <div className="w-full h-[200px] rounded-md bg-gray-100 flex items-center justify-center">
//           <p className="font-medium">No products found</p>
//         </div>
//       )}

//       {/* )} */}
//     </div>
//   );
// };

// export default VendorProductsSearchResults;

"use client";
import React, { useState } from "react";
import { Product } from "@/lib/types";
import { divideIntoArrays } from "@/lib/utils";
import ProductCard from "../General/ProductCard";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrainFrontTunnelIcon,
} from "lucide-react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
// import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

type PropsType = {
  query: string;
  products: Product[];
  page: number;
  category?: string;
};

const VendorProductsSearchResults = ({
  query,
  page,
  products,
  category,
}: PropsType) => {
  const ITEMS_PER_PAGE = 24;
  const [sortOption, setSortOption] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const searchPages = divideIntoArrays({
    data: products,
    itemsPerArray: ITEMS_PER_PAGE,
  });

  const totalPages = searchPages.length;
  const currentPage = searchPages[page] || [];
  const displayedProducts = currentPage;

  // Pagination calculations
  const startItem = page * ITEMS_PER_PAGE + 1;
  const endItem = Math.min((page + 1) * ITEMS_PER_PAGE, products.length);

  return (
    <div className="space-y-6">
      {/* Header with search info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            <span>Results for "{query}"</span>
            {category && <span className="text-gray-500">in {category}</span>}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Sort and view controls */}
        <div className="flex items-center gap-4 self-end">
          <div className="flex items-center gap-2">
            <TrainFrontTunnelIcon className="h-5 w-5 text-gray-500" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-sm border-0 py-1 px-2 rounded bg-gray-50 text-gray-700 focus:ring-indigo-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="flex border rounded overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-sm ${
                viewMode === "grid"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-white text-gray-600"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-sm ${
                viewMode === "list"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-white text-gray-600"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Products display */}
      {displayedProducts.length > 0 ? (
        <div
          className={`
          ${
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
              : "flex flex-col space-y-4"
          }
        `}
        >
          {displayedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showCartBtn
              viewMode={viewMode}
              className={viewMode === "list" ? "flex-row p-4 gap-6" : ""}
            />
          ))}
        </div>
      ) : (
        <div className="w-full py-16 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
          <img
            src="/images/empty-search.svg"
            alt="No results"
            className="w-32 h-32 mb-4 opacity-60"
          />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any products matching "{query}". Try using
            different keywords or browsing categories.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 border-t pt-6">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">{startItem}</span> to{" "}
            <span className="font-medium text-gray-900">{endItem}</span> of{" "}
            <span className="font-medium text-gray-900">{products.length}</span>{" "}
            results
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page === 0}
              onClick={() =>
                (window.location.href = `?query=${query}${
                  category ? `&category=${category}` : ""
                }&page=${page - 1}`)
              }
              className="inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              Previous
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() =>
                (window.location.href = `?query=${query}${
                  category ? `&category=${category}` : ""
                }&page=${page + 1}`)
              }
              className="inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProductsSearchResults;
