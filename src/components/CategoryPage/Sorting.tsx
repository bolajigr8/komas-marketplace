import { Product } from "@/lib/types";

export const sortProducts = (
  products: Product[],
  sortBy: string
): Product[] => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "topSales":
      return sortedProducts.sort(
        (a, b) => (b.salesCount || 0) - (a.salesCount || 0)
      );

    case "mostRecent":
      return sortedProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case "priceLow":
      return sortedProducts.sort((a, b) => a.price - b.price);

    case "priceHigh":
      return sortedProducts.sort((a, b) => b.price - a.price);

    case "featured":
    default:
      return sortedProducts.sort(
        (a, b) =>
          (b.tags.includes("featured") ? 1 : 0) -
          (a.tags.includes("featured") ? 1 : 0)
      );
  }
};
