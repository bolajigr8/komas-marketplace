'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ServerImageRender from '../General/ServerImageRender'

type ProductType = {
  productID: any
  vendorID: any
  quantity: number
  price: number
  length: string
  breadth: string
  returned: boolean
  status: string
  _id: string
}

type PropsType = {
  products: ProductType[]
}

const ExpandableOrderDetails = ({ products }: PropsType) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Don't show expand button for single product orders
  if (products.length <= 1) {
    return null
  }

  return (
    <div className='border-t pt-3'>
      {/* Toggle button */}
      <button
        onClick={toggleExpanded}
        className='flex items-center justify-between w-full p-2 text-sm font-medium text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200'
      >
        <span>
          {isExpanded ? 'Hide' : 'View'} Ordered products ({products.length}{' '}
          items)
        </span>
        {isExpanded ? (
          <ChevronUp className='w-4 h-4' />
        ) : (
          <ChevronDown className='w-4 h-4' />
        )}
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className='mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200'>
          {products.map((product, index) => {
            const productName =
              (product.productID as any)?.name || `Product ${index + 1}`
            const productDescription =
              (product.productID as any)?.description || ''
            const vendorName =
              (product.vendorID as any)?.name || 'Unknown Vendor'
            const productImages =
              product.productID &&
              typeof product.productID === 'object' &&
              'images' in product.productID &&
              Array.isArray((product.productID as { images?: unknown }).images)
                ? (product.productID as { images: string[] }).images
                : []

            const productImage =
              productImages.length > 0 ? productImages[0] : ''

            return (
              <div
                key={product._id}
                className='flex gap-3 p-3 bg-white border rounded-lg shadow-sm'
              >
                <ServerImageRender
                  folderName='orders'
                  src={productImage}
                  alt={productName}
                  width={60}
                  height={60}
                  className='object-contain rounded border border-gray-200 w-12 h-12 flex-shrink-0'
                />
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex-1'>
                      <h4 className='text-sm font-semibold truncate'>
                        {productName}
                      </h4>
                      <p className='text-xs text-gray-600 mt-1'>{vendorName}</p>
                      {productDescription && (
                        <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                          {productDescription}
                        </p>
                      )}
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <p className='text-sm font-medium'>
                        <span className='line-through'>N</span>
                        {product.price}
                      </p>
                      <p className='text-xs text-gray-600'>
                        Qty: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between mt-2 text-xs'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.status === 'PROCESSING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : product.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.status}
                    </span>
                    <span className='text-gray-500'>
                      {product.length}"×{product.breadth}"
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExpandableOrderDetails
