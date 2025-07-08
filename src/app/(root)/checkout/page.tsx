import DeliveryForm from '@/components/CheckoutPage/DeliveryForm'
import PaymentForm from '@/components/CheckoutPage/PaymentForm'
import Loader from '@/components/General/Loader'
import ProductsList from '@/components/General/ProductsList'
import { getProducts } from '@/lib/server-actions/product'
import { Metadata } from 'next'
import {
  ErrorBoundary,
  ErrorComponent,
} from 'next/dist/client/components/error-boundary'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { z } from 'zod'

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const schema = z.object({
  step: z.enum(['1', '2']).optional(),
  shopmate: z.enum(['true', 'false']).optional(),
  vendorId: z.string().optional(),
  shopmateId: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  emailAddress: z.string().optional(),
})

const Checkout = async ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams)
  console.log(data)

  return (
    <main className='w-full flex flex-col gap-10 bg-gray-100 min-h-[70vh]'>
      <div className='flex items-center justify-center gap-3 p-4 -mb-10'>
        {Array.from({ length: 3 }).map((_, index) =>
          index !== 2 ? (
            <React.Fragment key={index}>
              <div
                className={`size-8 flex items-center justify-center border rounded-full font-bold md:text-lg ${
                  Number(data?.step || '1') >= index + 1
                    ? 'border-black text-black'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {index + 1}
              </div>
              <Image
                src={'/Icons/Vector 55.svg'}
                alt='divider'
                height={20}
                width={40}
                className={
                  Number(data?.step || '1') > index + 1
                    ? 'opacity-100'
                    : 'opacity-50'
                }
              />
            </React.Fragment>
          ) : (
            <div
              key={index}
              className={`size-8 flex items-center justify-center border rounded-full font-bold md:text-lg ${
                Number(data?.step || '1') >= index + 1
                  ? 'border-black text-black'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {index + 1}
            </div>
          )
        )}
      </div>
      {Number(data?.step || '1') === 1 ? (
        <>
          <DeliveryForm
            isShopmate={data?.shopmate === 'true'}
            vendorId={data?.vendorId}
            persistFormData={true} // Enable form data persistence
          />
          <ErrorBoundary
            errorComponent={
              (<div>Error fetching products</div>) as unknown as ErrorComponent
            }
          >
            <Suspense
              fallback={
                <div className='flex flex-col gap-3 items-center justify-center h-[30vh]'>
                  <Loader />
                </div>
              }
            >
              <SuggestedProducts />
            </Suspense>
          </ErrorBoundary>
        </>
      ) : (
        <PaymentForm
          shopmateId={data?.shopmateId || ''}
          phoneNumber={data?.phoneNumber || ''}
          address={data?.address || ''}
          emailAddress={data?.emailAddress || ''}
          vendorId={data?.vendorId || ''}
        />
      )}
    </main>
  )
}

const SuggestedProducts = async () => {
  const { data, hasError } = await getProducts({ perPage: 20, page: 0 })

  if (hasError) throw new Error('Error fetching products')

  return (
    <ProductsList
      title='Suggested for you'
      products={data?.products || []}
      className='py-12 bg-[#FEFAFA]'
      showCartBtn
    />
  )
}

export const generateMetadata = ({ searchParams }: PropsType): Metadata => {
  const { data } = schema.safeParse(searchParams)
  return {
    title: `Step ${data?.step || 1} - Checkout`,
    description: 'Checkout',
  }
}

export default Checkout
