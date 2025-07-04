"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/lib/types";
import {
  getProductsByCategory,
  getProductsByVendorCategory,
} from "@/lib/server-actions/product";
import { Skeleton } from "@nextui-org/react";
import ServerImageRender from "../General/ServerImageRender";

export type GetFor = "allProducts" | "vendorProducts";

type CardProps = {
  category: Category;
  className?: string;
  baseRoute: string;
  stopNavigateScroll?: boolean;
  isSelected: boolean;
  getItemsLengthFor: GetFor;
  vendorId?: string;
};

type ItemsLengthProps = {
  categoryId: string;
  getFor: GetFor;
  vendorId?: string;
};

const CategoryItemsCard = ({
  category,
  getItemsLengthFor,
  className,
  baseRoute,
  stopNavigateScroll,
  isSelected,
  vendorId,
}: CardProps) => {
  return (
    <div
      data-selected={isSelected}
      className={`group bg-white rounded-xl p-4 text-center shadow-sm data-[selected=true]:bg-green-500 data-[selected=true]:text-white ${className}`}
    >
      <Link
        aria-label={category.name}
        href={`${baseRoute}${category._id}`}
        className="flex flex-col gap-2"
        scroll={!stopNavigateScroll}
      >
        <div className="flex items-center justify-center">
          {/* <Image
            src={'/Images/Home/categories/food/breakfast.png'}
            width={200}
            height={200}
            alt={category.name}
            className='w-[120px] aspect-square object-contain'
          /> */}
          <ServerImageRender
            folderName="categories"
            src={category.imageUrl}
            alt={category.name}
            width={200}
            height={200}
            className="size-[180px] object-contain"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold line-clamp-1">
            {category.name}
          </h3>
          <Suspense
            fallback={<Skeleton className=" py-3 w-2/3 mx-auto rounded-md" />}
          >
            <CategoryItemsLength
              categoryId={category._id}
              getFor={getItemsLengthFor}
              vendorId={vendorId}
            />
          </Suspense>
        </div>
      </Link>
    </div>
  );
};

const CategoryItemsLength = async ({
  categoryId,
  getFor,
  vendorId,
}: ItemsLengthProps) => {
  const res =
    getFor === "allProducts"
      ? await getProductsByCategory(categoryId)
      : await getProductsByVendorCategory({
          categoryId,
          vendorId: vendorId || "",
        });

  return (
    <p className="text-gray-500 group-aria-selected:text-gray-200">
      {res.data && res.data.length !== 1
        ? `${res.data.length} items`
        : res.data?.length === 1
        ? `${res.data.length} item`
        : "No items found"}
    </p>
  );
};

export default CategoryItemsCard;
