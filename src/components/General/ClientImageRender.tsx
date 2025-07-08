'use client'

import { useImage } from '@/hooks/queries'
import { Skeleton } from '@nextui-org/react'
import Image, { ImageProps } from 'next/image'
import React from 'react'

type PropsType = ImageProps & {
  folderName: string
}

const ClientImageRender = ({ folderName, ...props }: PropsType) => {
  const { data: src, isLoading } = useImage({ folderName, fileName: props.src as string })

  return (
    <Skeleton
      isLoaded={!isLoading}
      className={props.className}
    >
      <Image
        {...props}
        src={src || ""}
        alt={props.alt}
      />
    </Skeleton>
  );
}

export default ClientImageRender