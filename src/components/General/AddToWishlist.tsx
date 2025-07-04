'use client'

import React, { useState } from 'react'
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5'
import { useToast } from "@/hooks/use-toast";
import { Button } from '@nextui-org/react';

type PropsType = {
  id: string
}

const AddToWishlist = ({ id }: PropsType) => {
  const [added, setAdded] = useState(false)
  const { toast } = useToast()

  const toggleAddToWishlist = () => { 
    setAdded(!added)

    !added ? toast({ description: 'Added to Wishlist' }) : toast({ description: 'Removed from Wishlist' })
  }
  return (
    <Button
      aria-label={added ? 'Remove to Wishlist' : 'Add from Wishlist'}
      variant='ghost'
      size='sm'
      className="relative text-yellow-400 p-0 w-fit border-0"
      onPress={toggleAddToWishlist}
    >
      {added ? (
        <>
          <IoHeartSharp size={22} />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-white">
            -
          </span>
        </>
      ) : (
        <>
          <IoHeartOutline size={22} />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
            +
          </span>
        </>
      )}
    </Button>
  );
}

export default AddToWishlist