// import React from 'react'
// import ProductsList from '../General/ProductsList';
// import { Category, Product } from '@/lib/types';
// import { divideProductsByCategory } from '@/lib/utils';

// type PropsType = {
//   products: Product[]
//   categories: Category[]
//   category?: string
// }

// const VendorProductsDivided = async ({ products, categories, category }: PropsType) => {
//   const vendorProducts = category
//     ? products.filter((product) => typeof product.category === "string" ? product.category === category : product.category._id === category)
//     : products;

//   const productsByCategories = divideProductsByCategory(vendorProducts)

//   return (
//     <>
//       {Object.entries(productsByCategories).map(([categoryId, products]) => (
//         <ProductsList
//           key={categoryId}
//           title={
//            categories.find(
//               (category) => category._id === categoryId
//             )?.name || ""
//           }
//           products={products}
//           showCartBtn
//         />
//       ))}
//     </>
//   );
// }

// export default VendorProductsDivided
"use client";
import React from "react";
import { Category, Product } from "@/lib/types";
import { divideProductsByCategory } from "@/lib/utils";
import ProductCard from "../General/ProductCard";

type PropsType = {
  products: Product[];
  categories: Category[];
  category?: string;
};

const VendorProductsDivided = ({
  products,
  categories,
  category,
}: PropsType) => {
  const vendorProducts = category
    ? products.filter((product) =>
        typeof product.category === "string"
          ? product.category === category
          : product.category._id === category
      )
    : products;

  const productsByCategories = divideProductsByCategory(vendorProducts);
  const categoryEntries = Object.entries(productsByCategories);

  // If a specific category is selected, only show that category
  const displayedCategories = category
    ? categoryEntries.filter(
        ([categoryId]) =>
          categories.find((cat) => cat._id === categoryId)?._id === category
      )
    : categoryEntries;

  return (
    <div className="space-y-12">
      {displayedCategories.map(([categoryId, categoryProducts]) => {
        const categoryName =
          categories.find((cat) => cat._id === categoryId)?.name || "Products";
        return (
          <section
            key={categoryId}
            className="scroll-mt-24"
            id={`category-${categoryId}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {categoryName}
              </h2>
              {categoryProducts.length > 8 && (
                <a
                  href={`/category/?query=${categoryId}`}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  View all {categoryProducts.length}
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {categoryProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showCartBtn
                  // hoverEffect
                  className="transition duration-200 hover:shadow-md"
                />
              ))}
            </div>

            {categoryProducts.length > 8 && (
              <div className="mt-6 text-center">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Load more {categoryName}
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default VendorProductsDivided;
