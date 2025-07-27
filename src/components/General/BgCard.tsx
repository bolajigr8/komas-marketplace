// import AddToCartBtn from "@/components/General/AddToCartBtn";
// import { Product } from "@/lib/types";
// import React from "react";
// import { PiShoppingCartSimpleLight } from "react-icons/pi";

// type PropsType = {
//   product: Product;
//   backgroundImage: string;
//   text: string;
//   className?: string;
// };

// const BgCard = ({ backgroundImage, text, className, product }: PropsType) => {
//   return (
//     <div className="mb-3 w-full">
//       <div
//         className={`rounded-xl relative ${className} w-full`}
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <div className="w-1/2 py-20 items-center text-white ml-4 md:ml-40">
//           <p className="text-[25px] md:text-[40px] text-left font-bold">
//             {text}
//           </p>
//         </div>
//         <div className="absolute right-3 md:-right-2 -bottom-3">
//           {/* <AddToCartBtn
//             product={product}
//             className="flex items-center justify-center gap-2 px-10 rounded-lg py-3 h-[65px] text-lg"
//           >
//             <PiShoppingCartSimpleLight size={40} />
//             <span>Add</span>
//           </AddToCartBtn> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BgCard;import React from "react";
import Image from 'next/image'

type SlideType = {
  id: number
  image: string
  title: string
  subtitle: string
}

type PropsType = {
  slide: SlideType
  backgroundImage: string
  text: string
  subtitle: string
  className?: string
}

const BgCard = ({
  backgroundImage,
  text,
  subtitle,
  className,
  slide,
}: PropsType) => {
  return (
    <div className='mb-3 w-full'>
      <div
        className={`rounded-xl relative ${className} w-full overflow-hidden`}
      >
        {/* Using Next.js Image component */}
        <Image
          src={backgroundImage}
          alt={text}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />

        {/* Overlay content */}
        <div className='absolute inset-0 bg-black bg-opacity-30'></div>

        <div className='absolute w-1/2 py-20 items-center text-white ml-4 md:ml-40 z-10'>
          <p className='text-[25px] md:text-[40px] text-left font-bold mb-2'>
            {text}
          </p>
          <p className='text-[14px] md:text-[18px] text-left'>{subtitle}</p>
        </div>

        <div className='absolute right-3 md:-right-2 -bottom-3 z-10'>
          {/* You can add any action button here if needed */}
        </div>
      </div>
    </div>
  )
}

export default BgCard
