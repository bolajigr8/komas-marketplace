// // "use server";
// "use client";
// import React from "react";
// import BgCard from "./BgCard";
// import CustomSlider from "./CustomSlider";
// import { EmblaOptionsType } from "embla-carousel";
// import { NextArrow, PrevArrow } from "../HomePage/CustomArrows";
// import { Product } from "@/lib/types";

// type PropsType = {
//   products: Product[];
// };

// const settings: EmblaOptionsType = {
//   loop: true,
//   skipSnaps: true,
//   slidesToScroll: 1,
// };

// const BgCardsSlider = ({ products }: PropsType) => {
//   return (
//     <section className="px-2 w-full">
//       <CustomSlider
//         options={settings}
//         autoplay={true}
//         // customArrows={{
//         //   prev: <PrevArrow />,
//         //   next: <NextArrow />,
//         // }}
//         classNames={{ innerWrapperItem: "w-full" }}
//       >
//         {products.map((product) => (
//           <BgCard
//             key={product._id}
//             product={product}
//             backgroundImage={product.images[0]}
//             text={product.description}
//             className="h-[300px] md:h-[400px] mx-2"
//           />
//         ))}
//       </CustomSlider>
//     </section>
//   );
// };

// export default BgCardsSlider;
'use client'
import React from 'react'
import BgCard from './BgCard'
import CustomSlider from './CustomSlider'
import { EmblaOptionsType } from 'embla-carousel'
import { NextArrow, PrevArrow } from '../HomePage/CustomArrows'

// Define the slide type based on your data structure
type SlideType = {
  id: number
  image: string
  title: string
  subtitle: string
}

// Your slides data
const slides: SlideType[] = [
  {
    id: 2,
    image: '/Images/Home/New Home Pics/_komas-Beauty Perfume Banner/2.png',
    title: 'Beauty Perfume',
    subtitle: 'White new organic formula for your daily use',
  },
  {
    id: 4,
    image: '/Images/Home/New Home Pics/komas-Cosmetic skincare/2.png',
    title: 'Cosmetic Sale',
    subtitle: 'Your Favorite Brands at Irresistible Prices',
  },
  {
    id: 1,
    image: '/Images/Home/New Home Pics/komas-Skincare & Cosmetics Promo/2.png',
    title: 'Liceria Beauty SkinCare',
    subtitle:
      'Infused with rosehip and olive oil, help tighten, lighten and enrich your skin',
  },
  {
    id: 3,
    image: '/Images/Home/New Home Pics/pef-komas/2.png',
    title: 'Borcelle Beauty SkinCare',
    subtitle: 'Glow Naturally with Borcelle, Now on Sale!',
  },
]

const settings: EmblaOptionsType = {
  loop: true,
  skipSnaps: true,
  slidesToScroll: 1,
}

const BgCardsSlider = () => {
  return (
    <section className='px-2 w-full'>
      <CustomSlider
        options={settings}
        autoplay={true}
        // customArrows={{
        //   prev: <PrevArrow />,
        //   next: <NextArrow />,
        // }}
        classNames={{ innerWrapperItem: 'w-full' }}
      >
        {slides.map((slide) => (
          <BgCard
            key={slide.id}
            slide={slide}
            backgroundImage={slide.image}
            text={slide.title}
            subtitle={slide.subtitle}
            className='h-[300px] md:h-[400px] '
          />
        ))}
      </CustomSlider>
    </section>
  )
}

export default BgCardsSlider
