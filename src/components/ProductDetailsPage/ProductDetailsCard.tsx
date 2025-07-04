"use client";
import { calculateDiscountPrice, formatNumber } from "@/lib/utils";
import React, { useState } from "react";
import { BsStarFill } from "react-icons/bs";
import AddToCartBtn from "../General/AddToCartBtn";
import Accordion from "./Accordion";
import { BiCheckCircle } from "react-icons/bi";
import { Product } from "@/lib/types";
import { MinusIcon, PlusIcon, StarIcon } from "@radix-ui/react-icons";

type PropsType = {
  product: Product;
};

const ProductDetailsCard = ({ product }: PropsType) => {
  // const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);
  const handleChangeQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  const [quantity, setQuantity] = useState<number>(1);
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="space-y-4 pb-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#3bb77e]">
                ₦{product.price.toLocaleString()}
              </span>
              {/* {product.oldPrice && ( */}
              <span className="text-lg text-gray-400 line-through">
                ₦200,000
                {/* {product.oldPrice.toLocaleString()} */}
              </span>
              {/* )} */}
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">4.8</span>
              <span className="text-gray-500">
                {/* ({product.reviews?.length || 0} reviews) */}2 reviews
              </span>
            </div>
          </div>
        </div>

        <div className="py-4 border-b">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                product.quantity > 0 ? "bg-[#3bb77e]" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm font-medium text-gray-700">
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              {product.quantity > 0 && ` (${product.quantity} units)`}
            </span>
          </div>
        </div>

        <div className="py-6 border-b">
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        <div className="pt-6 space-y-4">
          {product.quantity > 0 ? (
            <>
              <div className="flex items-center gap-4">
                <QuantitySelector
                  value={quantity}
                  onChange={handleChangeQuantity}
                  max={product.quantity}
                  min={1}
                />
                <AddToCartBtn
                  product={product}
                  quantity={quantity}
                  text="Add to cart"
                  className="flex-1 bg-[#3bb77e] hover:bg-[#2da56d] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                />
              </div>
              <button className="w-full border-2 border-[#3bb77e] text-[#3bb77e] px-8 py-3 rounded-lg font-medium hover:bg-[#3bb77e] hover:text-white transition-colors">
                Buy Now
              </button>
            </>
          ) : (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 px-8 py-3 rounded-lg font-medium cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <BiCheckCircle className="text-[#3bb77e] text-xl" />
            <p className="text-sm text-gray-700">
              Free delivery on orders over{" "}
              <span className="font-medium text-[#3bb77e]">₦10,000</span>
            </p>
          </li>
          <li className="flex items-center gap-3">
            <BiCheckCircle className="text-[#3bb77e] text-xl" />
            <p className="text-sm text-gray-700">
              Delivery within Lagos: 24 hours
            </p>
          </li>
          <li className="flex items-center gap-3">
            <BiCheckCircle className="text-[#3bb77e] text-xl" />
            <p className="text-sm text-gray-700">
              Support available 7 days a week
            </p>
          </li>
          <li className="flex items-center gap-3">
            <BiCheckCircle className="text-[#3bb77e] text-xl" />
            <p className="text-sm text-gray-700">
              Secure payment with multiple options
            </p>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <Accordion
          data={[
            {
              title: "Product Details",
              description: product.description,
            },
            {
              title: "Return & Refund Policy",
              description:
                "7-day return policy for unused items in original packaging. Contact our customer service for return authorization.",
            },
            {
              title: "Shipping Information",
              description:
                "Free shipping on orders above ₦10,000. Standard delivery within Lagos takes 24 hours. Nationwide delivery: 2-5 working days.",
            },
          ]}
        />
      </div>
    </div>
  );
};

const QuantitySelector = ({
  value,
  onChange,
  max,
  min = 1,
}: {
  value: number;
  onChange: (quantity: number) => void;
  max: number;
  min: number;
}) => {
  return (
    <div className="flex items-center border rounded-lg">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-3 py-2 text-gray-600 hover:text-[#3bb77e] disabled:text-gray-300"
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-medium">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-3 py-2 text-gray-600 hover:text-[#3bb77e] disabled:text-gray-300"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProductDetailsCard;
