import { Product } from "@/lib/types";

export const bgSliderProducts: Product[] = [
  {
    _id: "1",
    images: ["/Images/Home/topSellingProducts/topsellingbg.png"],
    name: "Jellof Spaghetti Combo",
    description:
      "Enjoy easy and fast same day delivery on this jellof Spaghetti Combo.",
    price: 1000,
    length: 10,
    breadth: 10,
    width: 10,
    category: "Food",
    tags: [],
    quantity: 1,
    region: "Lagos",
    isDeleted: false,
    brand: "Brand",
    vendor: "Vendor",
    isLive: true,
    sku: "SKU",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    priceWithMarkup:1100
  },
  {
    _id: "2",
    images: ["/Images/Home/flatTommy/flatTommy.png"],
    name: "Flat Tommy",
    description:
      "Enjoy easy and fast same day delivery on this jellof Spaghetti Combo.",
    price: 1000,
    length: 10,
    breadth: 10,
    width: 10,
    quantity: 1,
    region: "Lagos",
    isDeleted: false,
    brand: "Brand",
    vendor: "Vendor",
    category: "Food",
    tags: [],
    isLive: true,
    sku: "SKU",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    priceWithMarkup: 1100
  },
];
