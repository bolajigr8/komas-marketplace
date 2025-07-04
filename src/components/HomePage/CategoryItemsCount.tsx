"use server";

import {
  getProductsByCategory,
  getProductsByVendorCategory,
} from "@/lib/server-actions/product";

type CategoryItemsCountProps = {
  categoryId: string;
  getFor: "allProducts" | "vendorProducts";
  vendorId?: string;
};

const CategoryItemsCount = async ({
  categoryId,
  getFor,
  vendorId,
}: CategoryItemsCountProps) => {
  const res =
    getFor === "allProducts"
      ? await getProductsByCategory(categoryId)
      : await getProductsByVendorCategory({
          categoryId,
          vendorId: vendorId || "",
        });

  const count = res.data?.length || 0;

  return (
    <p className="text-xs opacity-75">
      {count === 1 ? "1 item" : `${count} items`}
    </p>
  );
};

export default CategoryItemsCount;
