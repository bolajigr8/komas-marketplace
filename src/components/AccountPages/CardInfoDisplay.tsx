'use client'

import React, { useCallback, useState } from 'react'
import { PanInfo, motion, useMotionValue } from 'framer-motion';
import { HiOutlineUser } from 'react-icons/hi';
import { HiOutlineBriefcase } from 'react-icons/hi2';
import { TbCalendarCheck } from 'react-icons/tb';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { CiSquarePlus } from 'react-icons/ci';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { Input } from '@nextui-org/react';

const bankCards = [
  {
    image: "/Images/Credit card mockup.jpg",
    type: "Mastercard",
    name: "Rex bank",
    holder: "Tony Briggs",
    number: "5234 4534 2342 1234",
    expiry: '12/35',
    cvv: '878'
  },
  {
    image: "/Images/Credit card mockup.jpg",
    type: "Mastercard",
    name: "UBA",
    holder: "Tony Briggs",
    number: "5863 1234 4124 5678",
    expiry: '10/25',
    cvv: '123'
  },
  {
    image: "/Images/Credit card mockup.jpg",
    type: "Mastercard",
    name: "First bank",
    holder: "Tony Briggs",
    number: "5543 4321 5456 3452",
    expiry: '10/26',
    cvv: '078'
  },
];

const springOptions = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

const CardInfoDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCVV, setShowCVV] = useState(false)
  const dragX = useMotionValue(0); // returns the current distance in px by which the slide is dragged

  const goToNext = useCallback(() => {
    if (currentIndex < bankCards.length - 1) setCurrentIndex(currentIndex + 1);
    else setCurrentIndex(0);
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else setCurrentIndex(bankCards.length - 1);
  }, [currentIndex]);

  // Go to change slide after drag
  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (dragX.get() <= -50 && currentIndex < bankCards.length - 1) goToNext();
    else if (dragX.get() >= 50 && currentIndex > 0) goToPrevious();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-6">
        <div className="w-[80%] mx-auto relative">
          <div
            className={`w-full aspect-[14/8] rounded-2xl overflow-hidden relative`}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x: dragX }}
              animate={{
                translateX: `-${currentIndex * 100}%`,
              }}
              transition={springOptions}
              onDragEnd={onDragEnd}
              className="flex items-center cursor-grab active:cursor-grabbing"
            >
              {bankCards.map((card, index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: currentIndex === index ? 1 : 0.9,
                  }}
                  transition={springOptions}
                  className="w-full aspect-[14/8] shrink-0"
                >
                  <Image
                    src={card.image}
                    alt="product image"
                    height={500}
                    width={800}
                    priority
                    className="object-cover overflow-hidden w-full aspect-[14/8] pointer-events-none rounded-2xl"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Link href={"/"} className="absolute -right-8 md:-right-12 top-[45%]">
            <CiSquarePlus className="text-green-500 text-3xl md:text-[40px]" />
          </Link>
          <div className="flex gap-1 md:gap-3 absolute -right-10 md:-right-14 top-[80%]">
            <button onClick={goToPrevious}>
              <SlArrowLeft size={20} />
            </button>
            <button onClick={goToNext}>
              <SlArrowRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center md:items-end gap-2 md:gap-4">
            <h3 className="md:text-lg font-semibold">Card Type</h3>
            <p className="text-sm md:text-base">
              {bankCards[currentIndex].type}
            </p>
          </div>
          <div className="flex items-center md:items-end gap-2 md:gap-4">
            <h3 className="md:text-lg font-semibold">Bank Name</h3>
            <p className="text-sm md:text-base">
              {bankCards[currentIndex].name}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Input
          label="Name on card"
          labelPlacement="outside"
          defaultValue={bankCards[currentIndex].name}
          isReadOnly
          size="lg"
          classNames={{
            label: "font-medium",
            input: "text-center font-bold text-base",
          }}
          endContent={
            <HiOutlineUser size={25} className="text-green-500 my-auto" />
          }
        />
        <Input
          label="Card number"
          labelPlacement="outside"
          defaultValue={bankCards[currentIndex].number}
          isReadOnly
          size="lg"
          classNames={{
            label: "font-medium",
            input: "text-center font-bold text-base",
          }}
          endContent={
            <HiOutlineBriefcase size={25} className="text-green-500 my-auto" />
          }
        />
        <div className="grid grid-cols-[55%_35%] justify-between">
          <Input
            label="Expiry date"
            labelPlacement="outside"
            defaultValue={bankCards[currentIndex].expiry}
            isReadOnly
            size="lg"
            classNames={{
              label: "font-medium",
              input: "text-center font-bold text-base",
            }}
            endContent={
              <TbCalendarCheck size={25} className="text-green-500 my-auto" />
            }
          />
          <Input
            type={showCVV ? "text" : "password"}
            label="CVV"
            labelPlacement="outside"
            defaultValue={bankCards[currentIndex].cvv}
            isReadOnly
            size="lg"
            classNames={{
              label: "font-medium",
              input: "text-center font-bold text-base",
            }}
            endContent={
              showCVV ? (
                <IoEyeOffOutline
                  size={25}
                  className="text-green-500 my-auto"
                  onClick={() => setShowCVV(!showCVV)}
                />
              ) : (
                <IoEyeOutline
                  size={25}
                  className="text-green-500 my-auto"
                  onClick={() => setShowCVV(!showCVV)}
                />
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default CardInfoDisplay