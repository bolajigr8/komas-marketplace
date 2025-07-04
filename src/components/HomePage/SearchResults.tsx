"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  //   RiStarFill,
  //   RiHeartLine,
  //   RiShoppingCart2Line,
  RiFilterLine,
} from "react-icons/ri";
import { Product } from "@/lib/types";
import { getProductsByName } from "@/lib/server-actions/product";
import Loader from "../General/Loader";
import ProductsList from "../General/ProductsList";
import { Grid, List } from "lucide-react";

interface SearchResultsProps {
  onSort?: (sort: string) => void;
  onFilter?: (filters: any) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

const sortOptions = [
  { value: "relevant", label: "Most Relevant" },
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function SearchResults({
  onSort,
  onFilter,
  onAddToCart,
  onAddToWishlist,
}: SearchResultsProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedSort, setSelectedSort] = useState("relevant");
  const [products, setProducts] = useState<Product[]>();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const getSearchResults = async () => {
      const [response] = await Promise.all([getProductsByName({ query })]);
      setProducts(response.data || []);
    };
    getSearchResults();
  }, [query]);

  const handleSort = (value: string) => {
    setSelectedSort(value);
    onSort?.(value);
  };

  const handleFilter = () => {
    onFilter?.({ priceRange });
    setShowFilters(false);
  };

  const Filters = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setShowFilters(false)}
        >
          ×
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <Slider
          defaultValue={[0, 100000]}
          max={100000}
          step={1000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₦{priceRange[0].toLocaleString()}</span>
          <span>₦{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Button
        className="w-full bg-[#3bb77e] hover:bg-[#2ea56c] text-white"
        onClick={handleFilter}
      >
        Apply Filters
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">{products?.length || 0} products found</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        <Button
          className="md:hidden mb-4 bg-[#3bb77e] hover:bg-[#2ea56c] text-white"
          onClick={() => setShowFilters(true)}
        >
          <RiFilterLine className="mr-2" /> Show Filters
        </Button>

        <div
          className={`
          ${
            showFilters ? "fixed inset-0 z-50 bg-black bg-opacity-50" : "hidden"
          } 
          md:relative md:block md:w-64 md:flex-shrink-0
        `}
        >
          <div
            className={`
            ${
              showFilters
                ? "fixed inset-y-0 left-0 w-80 overflow-y-auto bg-white p-4"
                : ""
            }
            md:static md:block md:w-auto md:overflow-visible md:p-0
          `}
          >
            <Filters />
          </div>
        </div>

        {!products ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">
                  Showing 1-{Math.min(products.length, 24)} of {products.length}{" "}
                  results
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full ${
                      viewMode === "grid"
                        ? "bg-[#3bb77e]/10 text-[#3bb77e]"
                        : "text-gray-500"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full ${
                      viewMode === "list"
                        ? "bg-[#3bb77e]/10 text-[#3bb77e]"
                        : "text-gray-500"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Select value={selectedSort} onValueChange={handleSort}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ProductsList
              products={products}
              showCartBtn
              viewMode={viewMode}
              // cardClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            />
          </div>
        )}
      </div>
    </div>
  );
}
