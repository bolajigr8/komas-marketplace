// import { getImageSrc } from '@/lib/server-actions'
// import { Skeleton } from '@nextui-org/react'
// import Image, { ImageProps } from 'next/image'
// import React, { Suspense } from 'react'

// type PropsType = ImageProps & {
//   folderName: string
// }

// const ServerImageRender = ({ folderName, ...props }: PropsType) => {
//   return (
//     <Suspense fallback={<Skeleton className={props.className} />}>
//       <ServerImage {...props} folderName={folderName} />
//     </Suspense>
//   )
// }

// const ServerImage = async ({ folderName, ...props }: PropsType) => {
//   const { data: src } = await getImageSrc({
//     folderName,
//     fileName: props.src as string,
//   })

//   return <Image {...props} src={src || ''} alt={props.alt} />
// }

// export default ServerImageRender

// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Skeleton } from "@nextui-org/react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux-store/store";
// import { fetchImage, selectImage } from "@/redux-store/image-slice";

// type ServerImageProps = {
//   folderName: string;
//   src: string;
//   alt: string;
//   className?: string;
//   width?: number;
//   height?: number;
//   priority?: boolean;
// };

// const ServerImageRender = ({
//   folderName,
//   src,
//   alt,
//   className = "",
//   width,
//   height,
//   priority = false,
// }: ServerImageProps) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [hasError, setHasError] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);

//   const imageKey = `${folderName}/${src}`;
//   const imageState = useSelector((state: RootState) =>
//     selectImage(imageKey)(state)
//   );

//   useEffect(() => {
//     const loadImage = async () => {
//       if (!imageState?.url && !imageState?.isLoading && retryCount < 3) {
//         try {
//           setHasError(false);
//           await dispatch(fetchImage({ fileName: src, folderName })).unwrap();
//         } catch (error) {
//           console.error("Failed to fetch image:", error);
//           setRetryCount((prev) => prev + 1);
//         }
//       }
//     };

//     loadImage();
//   }, [dispatch, folderName, src, imageState, retryCount]);

//   if (!imageState || imageState.isLoading) {
//     return (
//       <div className={`relative ${className}`} style={{ width, height }}>
//         <Skeleton className="absolute inset-0 rounded-lg" />
//       </div>
//     );
//   }

//   if (imageState.error || hasError || !imageState.url) {
//     return (
//       <div
//         className={`flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg ${className}`}
//         style={{ width, height }}
//       >
//         <span className="text-2xl font-bold">
//           {alt?.charAt(0).toUpperCase() || "?"}
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className={`relative ${className}`} style={{ width, height }}>
//       <Image
//         src={imageState.url}
//         alt={alt}
//         width={width}
//         height={height}
//         priority={priority}
//         className="rounded-lg object-cover w-full h-full"
//         onError={() => setHasError(true)}
//       />
//     </div>
//   );
// };

// export default ServerImageRender;

// 'use client'
// import { useEffect, useState, useRef } from 'react'
// import Image from 'next/image'
// import { Skeleton } from '@nextui-org/react'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/redux-store/store'
// import { fetchImage, selectImage } from '@/redux-store/store-slices/image-slice'

// type ServerImageProps = {
//   folderName: string
//   src: string
//   alt: string
//   className?: string
//   width?: number
//   height?: number
//   priority?: boolean
// }

// const ServerImageRender = ({
//   folderName,
//   src,
//   alt,
//   className = '',
//   width,
//   height,
//   priority = false,
// }: ServerImageProps) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const [hasError, setHasError] = useState(false)
//   const [retryCount, setRetryCount] = useState(0)
//   const imageKey = `${folderName}/${src}`
//   const imageState = useSelector((state: RootState) =>
//     selectImage(imageKey)(state)
//   )
//   const isLoadingRef = useRef(false)

//   useEffect(() => {
//     // Prevent multiple simultaneous fetch attempts
//     if (isLoadingRef.current) return

//     const loadImage = async () => {
//       if (
//         !imageState?.url &&
//         !imageState?.isLoading &&
//         retryCount < 3 &&
//         !isLoadingRef.current
//       ) {
//         try {
//           isLoadingRef.current = true
//           setHasError(false)
//           await dispatch(fetchImage({ fileName: src, folderName })).unwrap()
//           isLoadingRef.current = false
//         } catch (error) {
//           console.error('Failed to fetch image:', error)
//           setRetryCount((prev) => prev + 1)
//           isLoadingRef.current = false
//         }
//       }
//     }

//     loadImage()
//   }, [dispatch, folderName, src, imageState, retryCount])

//   // Render logic remains the same
//   if (!imageState || imageState.isLoading) {
//     return (
//       <div className={`relative ${className}`} style={{ width, height }}>
//         <Skeleton className='absolute inset-0 rounded-lg' />
//       </div>
//     )
//   }

//   if (imageState.error || hasError || !imageState.url) {
//     return (
//       <div
//         className={`flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg ${className}`}
//         style={{ width, height }}
//       >
//         <span className='text-2xl font-bold'>
//           {alt?.charAt(0).toUpperCase() || '?'}
//         </span>
//       </div>
//     )
//   }

//   return (
//     <div className={`relative ${className}`} style={{ width, height }}>
//       <Image
//         src={imageState.url}
//         alt={alt}
//         width={width}
//         height={height}
//         priority={priority}
//         className='rounded-lg object-cover w-full h-full'
//         onError={() => setHasError(true)}
//       />
//     </div>
//   )
// }

// export default ServerImageRender

'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Skeleton } from '@nextui-org/react'
import { fetchSignedImageUrl } from '@/lib/getImages'

type ServerImageProps = {
  folderName: string
  src: string
  alt: string
  className?: string
  width: number
  height: number
  priority?: boolean 
}

const ServerImageRender = ({
  folderName,
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}: ServerImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    if (!src || isLoadingRef.current || retryCount >= 3) return

    const fetchImage = async () => {
      setIsLoading(true)
      setHasError(false)
      isLoadingRef.current = true

      try {
        const url = await fetchSignedImageUrl(src, folderName)

        if (!url) {
          throw new Error('No URL returned')
        }

        setImageUrl(url)
        setHasError(false)
      } catch (error) {
        console.error('Failed to load signed image URL:', error)
        setRetryCount((prev) => prev + 1)
        setHasError(true)
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    }

    fetchImage()
  }, [folderName, src, retryCount])

  if (isLoading) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <Skeleton className='absolute inset-0 rounded-lg' />
      </div>
    )
  }

  if (hasError || !imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <span className='text-2xl font-bold'>
          {alt?.charAt(0).toUpperCase() || '?'}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className='rounded-lg object-cover w-full h-full'
        onError={() => setHasError(true)}
      />
    </div>
  )
}
 
export default ServerImageRender
