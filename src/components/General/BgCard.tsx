import AddToCartBtn from "@/components/General/AddToCartBtn";
import { Product } from "@/lib/types";
import React from "react";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

type PropsType = {
  product: Product;
  backgroundImage: string;
  text: string;
  className?: string;
};

const BgCard = ({ backgroundImage, text, className, product }: PropsType) => {
  return (
    <div className="mb-3 w-full">
      <div
        className={`rounded-xl relative ${className} w-full`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-1/2 py-20 items-center text-white ml-4 md:ml-40">
          <p className="text-[25px] md:text-[40px] text-left font-bold">
            {text}
          </p>
        </div>
        <div className="absolute right-3 md:-right-2 -bottom-3">
          {/* <AddToCartBtn
            product={product}
            className="flex items-center justify-center gap-2 px-10 rounded-lg py-3 h-[65px] text-lg"
          >
            <PiShoppingCartSimpleLight size={40} />
            <span>Add</span>
          </AddToCartBtn> */}
        </div>
      </div>
    </div>
  );
};

export default BgCard;
