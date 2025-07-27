import { formatNumber } from '@/lib/utils'
import { CartItem } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Tag, Check, X } from 'lucide-react'
import { applyPromoCode } from '@/app/actions'

type TotalSummaryProps = {
  cartItems: CartItem[]
  imageSize?: 'sm' | 'md' | 'lg'
}

type PromoResult = {
  success: boolean
  error?: string
  discount?: number
  type?: string
}

const TotalSummary = ({ cartItems }: TotalSummaryProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Promo code state
  const [promoCode, setPromoCode] = useState<string>('')
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null)
  const [isApplying, setIsApplying] = useState<boolean>(false)
  const [showPromoForm, setShowPromoForm] = useState<boolean>(false)

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0
  )

  // Calculate discount
  const discount = promoResult?.success
    ? promoResult.type === 'percentage'
      ? (subtotal * (promoResult.discount || 0)) / 100
      : promoResult.discount || 0
    : 0

  // Calculate total
  const totalPrice = subtotal - discount

  const handlePromoApply = async () => {
    if (!promoCode) return

    setIsApplying(true)
    try {
      const result = await applyPromoCode(promoCode)
      setPromoResult(result)
    } catch (error) {
      console.error('Error applying promo code:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleCheckout = () => {
    if (!session) {
      router.push(`/sign-in?${new URLSearchParams({ callbackUrl: pathname })}`)
      return
    }

    const isShopmate = session.user.userRoleType.includes('shopmate')
    console.log('shopmate', isShopmate)
    router.push(
      `/checkout?${new URLSearchParams({
        step: '1',
        vendorId: '',
        shopmate: isShopmate.toString(),
        ...(promoResult?.success && {
          promoCode,
          discountType: promoResult.type || '',
          discountAmount: promoResult.discount?.toString() || '',
        }),
      })}`
    )
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold text-gray-800'>Order Summary</h2>

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>Subtotal</span>
          <span className='font-medium text-gray-800'>
            ₦{formatNumber(subtotal)}
          </span>
        </div>

        {promoResult?.success && (
          <div className='flex justify-between items-center text-green-600'>
            <span className='flex items-center'>
              <Tag className='w-4 h-4 mr-1' />
              Discount
            </span>
            <span>-₦{formatNumber(discount)}</span>
          </div>
        )}

        <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
          <span className='font-medium text-gray-700'>Total</span>
          <span className='font-bold text-gray-900'>
            ₦{formatNumber(totalPrice)}
          </span>
        </div>
      </div>

      {/* Promo Code Section */}
      {/* {!showPromoForm ? (
        <button
          onClick={() => setShowPromoForm(true)}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
        >
          <Tag className="w-4 h-4 mr-1" />
          Add discount code
        </button>
      ) : (
        <div>
          <div className="flex mb-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="flex-1 p-2 text-sm border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-300"
            />
            <button
              onClick={handlePromoApply}
              disabled={isApplying || !promoCode}
              className="px-3 py-2 bg-primary-600 text-white text-sm rounded-r-md disabled:opacity-50 hover:bg-primary-700 transition-colors"
            >
              {isApplying ? "..." : "Apply"}
            </button>
          </div>

          {promoResult && (
            <div
              className={`p-2 rounded-md text-xs flex items-start ${
                promoResult.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {promoResult.success ? (
                <>
                  <Check className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <p>
                    {promoResult.type === "percentage"
                      ? `${promoResult.discount}% discount applied`
                      : `₦${promoResult.discount} discount applied`}
                  </p>
                </>
              ) : (
                <>
                  <X className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <p>{promoResult.error}</p>
                </>
              )}
            </div>
          )}
        </div>
      )} */}

      <Button
        className='w-full bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-0 focus:outline-none'
        onClick={handleCheckout}
        size='lg'
        variant='solid'
        disableRipple
      >
        Proceed to Checkout
        <IoIosArrowRoundForward className='ml-2 h-6 w-6' />
      </Button>
    </div>
  )
}

export default TotalSummary
