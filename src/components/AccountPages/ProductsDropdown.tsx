'use client'
import React, { useState } from 'react'
import ClientImageRender from '../General/ClientImageRender'
import ServerImageRender from '../General/ServerImageRender'

type ProductsDropdownProps = {
  products: any[]
}

const ProductsDropdown: React.FC<ProductsDropdownProps> = ({ products }) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)

  const renderProductDetails = (productItem: any, index: number) => {
    const product = productItem.productID as any
    const vendor = productItem.vendorID as any

    return (
      <div key={productItem._id} className='space-y-4'>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-1/3'>
            <ServerImageRender
              folderName='products'
              src={product.images?.[0] || '/Images/card.jpg'}
              alt={product.name}
              width={250}
              height={250}
              className='object-contain rounded-lg shadow-sm border border-gray-300'
            />
          </div>
          <div className='w-full md:w-2/3 space-y-2'>
            <h3 className='text-xl font-bold'>{product.name}</h3>
            <p>{product.description}</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p>
                  <strong>Price:</strong> ₦{productItem.price}
                </p>
                <p>
                  <strong>Quantity:</strong> {productItem.quantity}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      productItem.status === 'PROCESSING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : productItem.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {productItem.status}
                  </span>
                </p>
              </div>
              <div className='space-y-1'>
                {product.category && (
                  <p>
                    <strong>Category:</strong> {product.category.name}
                  </p>
                )}
                {product.brand && (
                  <p>
                    <strong>Brand:</strong> {product.brand.name}
                  </p>
                )}
                {vendor && (
                  <p>
                    <strong>Vendor:</strong> {vendor.name}
                  </p>
                )}
              </div>
            </div>
            <div className='mt-3 text-sm text-gray-600'>
              <p>
                <strong>Dimensions:</strong> {productItem.length}" ×{' '}
                {productItem.breadth}"
              </p>
              <p>
                <strong>Subtotal:</strong> ₦
                {productItem.price * productItem.quantity}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 1) {
    return <div>{renderProductDetails(products[0], 0)}</div>
  }

  return (
    <div className='space-y-6'>
      {/* Product Selector Dropdown */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
        <label
          htmlFor='product-select'
          className='text-sm font-medium text-gray-700'
        >
          Select Product:
        </label>
        <select
          id='product-select'
          value={selectedProductIndex}
          onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
          className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white min-w-[200px]'
        >
          {products.map((productItem, index) => {
            const product = productItem.productID as any
            return (
              <option key={productItem._id} value={index}>
                {product.name} (Qty: {productItem.quantity})
              </option>
            )
          })}
        </select>
        <div className='text-sm text-gray-500'>
          Showing {selectedProductIndex + 1} of {products.length} products
        </div>
      </div>

      {/* Selected Product Details */}
      <div className='border-t pt-4'>
        {renderProductDetails(
          products[selectedProductIndex],
          selectedProductIndex
        )}
      </div>
    </div>
  )
}

export default ProductsDropdown
