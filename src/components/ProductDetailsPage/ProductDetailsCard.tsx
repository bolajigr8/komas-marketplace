'use client'
import { calculateDiscountPrice, formatNumber } from '@/lib/utils'
import React, { useState, useEffect, useMemo } from 'react'
import { BsStarFill } from 'react-icons/bs'
import AddToCartBtn from '../General/AddToCartBtn'
import Accordion from './Accordion'
import { BiCheckCircle } from 'react-icons/bi'
import { Product } from '@/lib/types'
import { MinusIcon, PlusIcon, StarIcon } from '@radix-ui/react-icons'
import { RiShoppingCart2Line } from 'react-icons/ri'
import { addProductToCart } from '@/lib/server-actions/product'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import CartCounter from '../CartPage/CartCounter'
import { Button } from '../ui/button'

type PropsType = {
  product: Product
}

interface SelectedVariant {
  color?: string
  size?: string
  price?: number
  quantity?: number
  variantId?: string
}

const ProductDetailsCard = ({ product }: PropsType) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant>({})
  const [isSync, setIsSync] = useState(true)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()

  console.log('Product Details Section', product)

  const cartProducts = useAppSelector((state) => state.cart.products)

  // Create a unique identifier for cart items that includes variant info
  const createCartItemId = (productId: string, variantId?: string) => {
    return variantId ? `${productId}-${variantId}` : productId
  }

  // Extract unique colors and sizes from variants
  const availableOptions = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return { colors: [], sizes: [] }
    }

    const colors = Array.from(
      new Set(product.variants.map((v) => v.color).filter(Boolean))
    )
    const sizes = Array.from(
      new Set(product.variants.map((v) => v.size).filter(Boolean))
    )

    return { colors, sizes }
  }, [product.variants])

  // Get variants that match current selection
  const matchingVariants = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return []

    return product.variants.filter((variant) => {
      const colorMatch =
        !selectedVariant.color || variant.color === selectedVariant.color
      const sizeMatch =
        !selectedVariant.size || variant.size === selectedVariant.size
      return colorMatch && sizeMatch
    })
  }, [product.variants, selectedVariant])

  // Get available colors - show all colors that have stock, regardless of size selection
  const availableColors = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return []

    return availableOptions.colors.filter((color) => {
      // Check if this color has ANY variant with stock > 0
      return product.variants?.some(
        (variant) => variant.color === color && variant.quantity > 0
      )
    })
  }, [product.variants, availableOptions.colors])

  // Get available sizes - show all sizes that have stock, regardless of color selection
  const availableSizes = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return []

    return availableOptions.sizes.filter((size) => {
      // Check if this size has ANY variant with stock > 0
      return product.variants?.some(
        (variant) => variant.size === size && variant.quantity > 0
      )
    })
  }, [product.variants, availableOptions.sizes])

  // Get sizes available for selected color
  const sizesForSelectedColor = useMemo(() => {
    if (!selectedVariant.color || !product.variants) return availableSizes

    return availableSizes.filter((size) => {
      return product.variants?.some(
        (variant) =>
          variant.color === selectedVariant.color &&
          variant.size === size &&
          variant.quantity > 0
      )
    })
  }, [selectedVariant.color, product.variants, availableSizes])

  // Get colors available for selected size
  const colorsForSelectedSize = useMemo(() => {
    if (!selectedVariant.size || !product.variants) return availableColors

    return availableColors.filter((color) => {
      return product.variants?.some(
        (variant) =>
          variant.size === selectedVariant.size &&
          variant.color === color &&
          variant.quantity > 0
      )
    })
  }, [selectedVariant.size, product.variants, availableColors])

  // Check if a color is available (either selected or has valid combinations)
  const isColorAvailable = (color: string) => {
    if (color === selectedVariant.color) return true // Always allow deselection
    if (!selectedVariant.size) return availableColors.includes(color)
    return colorsForSelectedSize.includes(color)
  }

  // Check if a size is available (either selected or has valid combinations)
  const isSizeAvailable = (size: string) => {
    if (size === selectedVariant.size) return true // Always allow deselection
    if (!selectedVariant.color) return availableSizes.includes(size)
    return sizesForSelectedColor.includes(size)
  }

  // Get current variant based on selection - MOVED UP BEFORE cartItem
  const currentVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null

    return product.variants.find(
      (variant) =>
        variant.color === selectedVariant.color &&
        variant.size === selectedVariant.size
    )
  }, [product.variants, selectedVariant])

  // Find cart item that matches both product and variant - NOW AFTER currentVariant
  const cartItem = useMemo(() => {
    const currentVariantId = currentVariant?._id
    const cartItemId = createCartItemId(product._id, currentVariantId)

    return cartProducts.find((item) => {
      const itemVariantId = item.product?.selectedVariant?.variantId
      const itemCartId = createCartItemId(
        item.product?._id || '',
        itemVariantId
      )
      return itemCartId === cartItemId
    })
  }, [cartProducts, product._id, currentVariant]) // Updated dependency

  // Calculate current price and stock - DEFAULT TO PRODUCT VALUES
  const currentPrice = useMemo(() => {
    // If a specific variant is selected, use its price
    if (currentVariant && currentVariant.price) {
      return parseFloat(currentVariant.price.toString())
    }
    // Otherwise, use the product's base price
    return product.price || 0
  }, [currentVariant, product.price])

  const currentStock = useMemo(() => {
    // If a specific variant is selected, use its stock
    if (currentVariant && currentVariant.quantity !== undefined) {
      return currentVariant.quantity
    }
    // Otherwise, use the product's base stock
    return product.quantity || 0
  }, [currentVariant, product.quantity])

  // Check if user has made any variant selections
  const hasVariantSelection = selectedVariant.color || selectedVariant.size

  // Check if we can add to cart (either no variants, or size is selected when sizes exist)
  const canAddToCart = useMemo(() => {
    const hasVariants = product.variants && product.variants.length > 0
    const hasSizes = availableOptions.sizes.length > 0

    // If no variants exist, can always add to cart
    if (!hasVariants) return true

    // If variants exist but no sizes, can add to cart
    if (!hasSizes) return true

    // If sizes exist, must select a size to add to cart
    return Boolean(selectedVariant.size)
  }, [product.variants, availableOptions.sizes, selectedVariant.size])

  // Get current cart quantity for this specific product variant combination
  const currentCartQuantity = cartItem ? cartItem.quantity : 0

  useEffect(() => {
    dispatch(cartActions.initializeCart())
  }, [dispatch, session?.user])

  const handleColorSelect = (color: string) => {
    // Toggle selection: if clicking the same color, deselect it
    if (selectedVariant.color === color) {
      setSelectedVariant((prev) => ({
        ...prev,
        color: undefined,
      }))
    } else {
      setSelectedVariant((prev) => ({
        ...prev,
        color: color,
      }))
    }
    setQuantity(1) // Reset quantity when variant changes
  }

  const handleSizeSelect = (size: string) => {
    // Toggle selection: if clicking the same size, deselect it
    if (selectedVariant.size === size) {
      setSelectedVariant((prev) => ({
        ...prev,
        size: undefined,
      }))
    } else {
      setSelectedVariant((prev) => ({
        ...prev,
        size: size,
      }))
    }
    setQuantity(1) // Reset quantity when variant changes
  }

  const handleChangeQuantity = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    if (!isSync) return

    try {
      setIsSync(false)

      // Create product data with selected variant info
      const productWithVariant = {
        ...product,
        selectedVariant: currentVariant ? currentVariant : undefined,
        price: currentPrice, // Use current price based on variant or default
      }

      // Add only 1 item to cart (like the plus button)
      dispatch(
        cartActions.addToCart({
          product: productWithVariant,
          quantity: 1,
        })
      )

      toast({
        description: 'Added 1 item to cart',
        duration: 2000,
      })

      if (session?.user) {
        const res = await addProductToCart({
          productId: product._id,
          quantity: 1,
          variantId: currentVariant?._id, // Include variantId when available
        })
        if (res.hasError) throw new Error(res.message)
      }
    } catch (error) {
      dispatch(
        cartActions.removeFromCart({
          productId: product._id,
          variantId: currentVariant?._id, // Also pass variantId for removal
        })
      )

      toast({
        title: 'Error syncing cart',
        description: 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsSync(true)
    }
  }

  const handleBuyNow = async () => {
    if (!canAddToCart || isBuyingNow) return

    try {
      setIsBuyingNow(true)

      // If product is not in cart, add it first
      if (!cartItem) {
        // Create product data with selected variant info
        const productWithVariant = {
          ...product,
          selectedVariant: currentVariant ? currentVariant : undefined,
          price: currentPrice,
        }

        // Add to cart
        dispatch(
          cartActions.addToCart({
            product: productWithVariant,
            quantity: 1,
          })
        )

        // Sync with server if user is logged in
        if (session?.user) {
          const res = await addProductToCart({
            productId: product._id,
            quantity: 1,
            variantId: currentVariant?._id, // Include variantId when available
          })
          if (res.hasError) {
            // Remove from local cart if server sync fails
            dispatch(
              cartActions.removeFromCart({
                productId: product._id,
                variantId: currentVariant?._id, // Also pass variantId for removal
              })
            )
            throw new Error(res.message)
          }
        }

        toast({
          description: 'Added to cart and proceeding to checkout',
          duration: 2000,
        })
      } else {
        toast({
          description: 'Proceeding to checkout',
          duration: 2000,
        })
      }

      // Navigate to checkout
      router.push('/checkout')
    } catch (error) {
      toast({
        title: 'Error processing request',
        description: 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsBuyingNow(false)
    }
  }

  const hasVariants = product.variants && product.variants.length > 0

  return (
    <div className='space-y-8'>
      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <div className='space-y-4 pb-6 border-b'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
            {product.name}
          </h1>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <span className='text-2xl md:text-3xl font-bold text-[#3bb77e]'>
                ₦{currentPrice.toLocaleString()}
              </span>
              {currentVariant && currentPrice !== product.price && (
                <span className='text-lg text-gray-400 line-through'>
                  ₦{product.price?.toLocaleString()}
                </span>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <StarIcon className='w-5 h-5 text-yellow-400 fill-current' />
              <span className='font-medium'>4.8</span>
              <span className='text-gray-500 text-sm'>(2 reviews)</span>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div className='py-4 border-b'>
          <div className='flex items-center gap-2'>
            <span
              className={`w-3 h-3 rounded-full ${
                currentStock > 0 ? 'bg-[#3bb77e]' : 'bg-red-500'
              }`}
            ></span>
            <span className='text-sm font-medium text-gray-700'>
              {currentStock > 0 ? 'In Stock' : 'Out of Stock'}
              {currentStock > 0 && ` (${currentStock} units)`}
            </span>
          </div>
        </div>

        {/* Product Description */}
        <div className='py-6 border-b'>
          <p className='text-gray-600 leading-relaxed'>{product.description}</p>
        </div>

        {/* Variants Selection */}
        {hasVariants && (
          <div className='py-6 border-b space-y-6'>
            {/* Color Selection */}
            {availableOptions.colors.length > 0 && (
              <div className='space-y-3'>
                <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
                  Color (Optional)
                  {selectedVariant.color &&
                    ` - Selected: ${selectedVariant.color}`}
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {availableColors.map((color) => {
                    const isSelected = selectedVariant.color === color
                    const isAvailable = isColorAvailable(color)

                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        disabled={!isAvailable}
                        className={`
                          px-4 py-2 rounded-lg border-2 font-medium transition-all
                          ${
                            isSelected
                              ? 'border-[#3bb77e] bg-[#3bb77e] text-white'
                              : isAvailable
                              ? 'border-gray-200 text-gray-700 hover:border-[#3bb77e] hover:text-[#3bb77e]'
                              : 'border-gray-100 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {color}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableOptions.sizes.length > 0 && (
              <div className='space-y-3'>
                <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
                  Size {availableOptions.sizes.length > 0 ? '(Required)' : ''}
                  {selectedVariant.size &&
                    ` - Selected: ${selectedVariant.size}`}
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {availableSizes.map((size) => {
                    const isSelected = selectedVariant.size === size
                    const isAvailable = isSizeAvailable(size)

                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        disabled={!isAvailable}
                        className={`
                          px-4 py-2 rounded-lg border-2 font-medium transition-all min-w-[3rem]
                          ${
                            isSelected
                              ? 'border-[#3bb77e] bg-[#3bb77e] text-white'
                              : isAvailable
                              ? 'border-gray-200 text-gray-700 hover:border-[#3bb77e] hover:text-[#3bb77e]'
                              : 'border-gray-100 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selected Variant Info */}
            {hasVariantSelection && (
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex flex-wrap gap-4 text-sm'>
                  {selectedVariant.color && (
                    <div className='flex items-center gap-2'>
                      <span className='text-gray-600'>Color:</span>
                      <span className='font-medium'>
                        {selectedVariant.color}
                      </span>
                    </div>
                  )}
                  {selectedVariant.size && (
                    <div className='flex items-center gap-2'>
                      <span className='text-gray-600'>Size:</span>
                      <span className='font-medium'>
                        {selectedVariant.size}
                      </span>
                    </div>
                  )}
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-600'>Price:</span>
                    <span className='font-medium text-[#3bb77e]'>
                      ₦{currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-600'>Available:</span>
                    <span className='font-medium'>{currentStock} units</span>
                  </div>
                </div>
              </div>
            )}

            {/* Show message when size is required but not selected */}
            {availableOptions.sizes.length > 0 && !selectedVariant.size && (
              <div className='bg-amber-50 rounded-lg p-4'>
                <p className='text-sm text-amber-700'>
                  Please select a size to add this item to your cart. Color
                  selection is optional.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Add to Cart Section */}
        <div className='pt-6 space-y-4'>
          {currentStock > 0 ? (
            <>
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
                {/* Show quantity selector and cart counter together */}
                <div className='flex items-center gap-4'>
                  {/* <QuantitySelector
                    value={quantity}
                    onChange={handleChangeQuantity}
                    max={currentStock}
                    min={1}
                  /> */}
                  {cartItem && (
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <span>In cart: {currentCartQuantity}</span>
                    </div>
                  )}
                </div>

                {/* Add to Cart button - always visible */}
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !isSync ||
                    !canAddToCart ||
                    currentCartQuantity >= currentStock
                  }
                  className='flex-1 bg-[#3bb77e] hover:bg-[#2da56d] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
                >
                  <RiShoppingCart2Line className='w-5 h-5' />
                  {cartItem ? 'Add More' : 'Add to Cart'}
                </Button>
              </div>

              {/* Show cart counter for quantity adjustment */}
              {cartItem && (
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>
                      Adjust quantity in cart:
                    </span>
                    <CartCounter
                      productId={product._id}
                      variantId={currentVariant?._id} // Pass variantId to CartCounter
                      initialQuantity={cartItem.quantity}
                      maxQuantity={currentStock}
                    />
                  </div>
                </div>
              )}

              {!canAddToCart && (
                <p className='text-sm text-amber-600 bg-amber-50 p-3 rounded-lg'>
                  {availableOptions.sizes.length > 0 && !selectedVariant.size
                    ? 'Please select a size before adding to cart'
                    : 'Please complete your selection'}
                </p>
              )}

              {currentCartQuantity >= currentStock && (
                <p className='text-sm text-red-600 bg-red-50 p-3 rounded-lg'>
                  Maximum available quantity already in cart
                </p>
              )}

              <button
                onClick={handleBuyNow}
                disabled={!canAddToCart || isBuyingNow}
                className='w-full border-2 border-[#3bb77e] text-[#3bb77e] px-8 py-3 rounded-lg font-medium hover:bg-[#3bb77e] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isBuyingNow
                  ? 'Processing...'
                  : cartItem
                  ? 'Buy Now - Go to Checkout'
                  : 'Buy Now'}
              </button>
            </>
          ) : (
            <button
              disabled
              className='w-full bg-gray-100 text-gray-400 px-8 py-3 rounded-lg font-medium cursor-not-allowed'
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <ul className='space-y-4'>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl flex-shrink-0' />
            <p className='text-sm text-gray-700'>
              Free delivery on orders over{' '}
              <span className='font-medium text-[#3bb77e]'>₦10,000</span>
            </p>
          </li>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl flex-shrink-0' />
            <p className='text-sm text-gray-700'>
              Delivery within Lagos: 24 hours
            </p>
          </li>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl flex-shrink-0' />
            <p className='text-sm text-gray-700'>
              Support available 7 days a week
            </p>
          </li>
          <li className='flex items-center gap-3'>
            <BiCheckCircle className='text-[#3bb77e] text-xl flex-shrink-0' />
            <p className='text-sm text-gray-700'>
              Secure payment with multiple options
            </p>
          </li>
        </ul>
      </div>

      {/* Accordion Section */}
      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <Accordion
          data={[
            {
              title: 'Product Details',
              description: product.description,
            },
            {
              title: 'Specifications',
              description: `
                ${product.length ? `Length: ${product.length}cm` : ''}
                ${product.breadth ? `Breadth: ${product.breadth}cm` : ''}
                ${product.width ? `Width: ${product.width}cm` : ''}
                ${
                  product.brand && typeof product.brand === 'object'
                    ? `Brand: ${product.brand.name}`
                    : ''
                }
                ${product.sku ? `SKU: ${product.sku}` : ''}
              `.trim(),
            },
            {
              title: 'Return & Refund Policy',
              description:
                '7-day return policy for unused items in original packaging. Contact our customer service for return authorization.',
            },
            {
              title: 'Shipping Information',
              description:
                'Free shipping on orders above ₦10,000. Standard delivery within Lagos takes 24 hours. Nationwide delivery: 2-5 working days.',
            },
          ]}
        />
      </div>
    </div>
  )
}

const QuantitySelector = ({
  value,
  onChange,
  max,
  min = 1,
}: {
  value: number
  onChange: (quantity: number) => void
  max: number
  min: number
}) => {
  return (
    <div className='flex items-center border rounded-lg bg-white'>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className='px-3 py-2 text-gray-600 hover:text-[#3bb77e] disabled:text-gray-300 transition-colors'
      >
        <MinusIcon className='w-4 h-4' />
      </button>
      <span className='w-12 text-center font-medium py-2'>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className='px-3 py-2 text-gray-600 hover:text-[#3bb77e] disabled:text-gray-300 transition-colors'
      >
        <PlusIcon className='w-4 h-4' />
      </button>
    </div>
  )
}

export default ProductDetailsCard
