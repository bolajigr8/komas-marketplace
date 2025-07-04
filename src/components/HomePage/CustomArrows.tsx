'use client'

import { ComponentPropsWithRef } from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";

type PropsType = ComponentPropsWithRef<'button'>

const NextArrow = (props: PropsType) => {
  return (
    <button
      aria-label='Scroll Next'
      className="absolute top-1/2 -right-1 lg:-right-8 transform -translate-y-1/2 bg-gray-200 rounded-full text-gray-800 p-1 cursor-pointer z-10"
      {...props}
    >
      <FaArrowRight />  
    </button>
  );
};

const PrevArrow = (props: PropsType) => {
  return (
    <button
      aria-label='Scroll Previous'
      className="absolute top-1/2 -left-1 lg:-left-8 transform -translate-y-1/2 rounded-full bg-gray-200 text-gray-800 p-1 cursor-pointer z-10"
      {...props}
    >
      <FaArrowLeftLong />
    </button>
  );
};

export { NextArrow, PrevArrow };
