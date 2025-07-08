// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { RadioGroup, RadioProps, Button, Tooltip } from "@nextui-org/react";
// import CustomRadio from "../General/CustomRadio";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { paymentSchema } from "@/lib/schemas";
// import { useSession } from "next-auth/react";
// import { useToast } from "@/hooks/use-toast";
// import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";

// type FormData = z.infer<typeof paymentSchema>;

// type PropsType = {
//   shopmateId: string;
//   vendorId: string;
//   phoneNumber: string;
//   address: string;
//   emailAddress: string;
// };

// const PaymentForm = ({
//   shopmateId,
//   vendorId,
//   phoneNumber,
//   address,
//   emailAddress,
// }: PropsType) => {
//   const dispatch = useAppDispatch();
//   const cart = useAppSelector((state) => state.cart.products);
//   const deliveryAddresses = useAppSelector(
//     (state) => state.delivery.addressList
//   );
//   const deliveryDetails = useAppSelector(
//     (state) => state.delivery.deliveryDetails
//   );
//   const { data: session } = useSession();
//   const user = session?.user;
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<FormData>({
//     resolver: zodResolver(paymentSchema),
//     defaultValues: {
//       user: {
//         fullName: user?.fullName || "",
//         address: user?.address || "",
//         phoneNumber: user?.phoneNumber || "",
//       },
//       delivery: {
//         type: "",
//         address: "",
//       },
//     },
//     mode: "all",
//   });

//   const watchedValues = form.watch();

//   useEffect(() => {
//     if (user) {
//       form.setValue(
//         "user",
//         {
//           fullName: user.fullName || "",
//           address: user.address || "",
//           phoneNumber: user.phoneNumber || "",
//         },
//         { shouldValidate: true }
//       );
//     }
//   }, [user, form]);

//   useEffect(() => {

//     if (deliveryDetails) {
//       try {

//         form.setValue(
//           "delivery",
//           {
//             type: deliveryDetails.deliveryMethod.type,
//             address: deliveryDetails.deliveryAddress.addressString,
//           },
//           {
//             shouldValidate: true,
//           }
//         );
//       } catch (error) {
//         console.error("Error loading delivery details:", error);
//         toast({
//           description: "Failed to load delivery details",
//           variant: "destructive",
//         });
//       }
//     }
//   }, [form, toast]);

//   const onSubmit = async (data: FormData) => {
//     try {
//       setIsSubmitting(true);

//       if (
//         !data.user.phoneNumber ||
//         !data.user.address ||
//         !data.delivery.address
//       ) {
//         toast({
//           title: "Missing Information",
//           description: "Please complete all required fields before proceeding",
//           variant: "destructive",
//         });
//         return;
//       }

//       const searchParams = new URLSearchParams({
//         shopmateId,
//         vendor: vendorId,
//         phone: data.user.phoneNumber,
//         address: data.user.address,
//         email: emailAddress || user?.emailAddress || "",
//       });

//       // Simulate network delay (for demo purposes)
//       // await new Promise(resolve => setTimeout(resolve, 1000));

//       router.push(`/checkout/payment?${searchParams.toString()}`);
//     } catch (error) {
//       console.error("Error during payment processing:", error);
//       toast({
//         title: "Error",
//         description: "Failed to process payment. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isFormComplete = () => {
//     return (
//       !!watchedValues.user.fullName &&
//       !!watchedValues.user.address &&
//       !!watchedValues.user.phoneNumber &&
//       !!watchedValues.delivery.type &&
//       !!watchedValues.delivery.address
//     );
//   };

//   const radioClassNames: RadioProps["classNames"] = {
//     base: "w-full max-w-full flex-row justify-start items-start data-[selected=true]:border-transparent hover:bg-gray-50 transition-all",
//     label: "font-semibold -mt-1",
//     description: "flex-1 flex justify-between gap-4 text-black",
//     labelWrapper: "gap-2 flex-1",
//   };

//   return (
//     <form
//       className="max-w-6xl w-full flex flex-col gap-6 mx-auto p-4 animate-fadeIn"
//       onSubmit={form.handleSubmit(onSubmit)}
//     >
//       <div className="flex flex-col gap-6 bg-white rounded-2xl p-6 shadow-sm">
//         <RadioGroup
//           value={
//             watchedValues.user.fullName &&
//             watchedValues.user.address &&
//             watchedValues.user.phoneNumber
//               ? "true"
//               : "false"
//           }
//           color="success"
//           aria-label="Customer details"
//         >
//           <CustomRadio
//             value={"true"}
//             description={
//               <>
//                 <div className="flex flex-col gap-1">
//                   <h3 className="font-medium text-sm text-gray-500">
//                     Customer Details
//                   </h3>
//                   <p className="text-sm break-words">
//                     {watchedValues.user.fullName || "Name not provided"} <br />
//                     {watchedValues.user.address || "Address not provided"}{" "}
//                     <br />
//                     {watchedValues.user.phoneNumber || "Phone not provided"}
//                   </p>
//                 </div>
//                 <Link
//                   href={"/account/profile/edit/me"}
//                   className="text-green-500 font-semibold ml-auto hover:text-green-600 transition-colors flex-shrink-0"
//                 >
//                   Edit
//                 </Link>
//               </>
//             }
//             classNames={{
//               ...radioClassNames,
//               description:
//                 "flex-1 flex justify-between items-center gap-4 text-black",
//             }}
//           >
//             Customer Information
//           </CustomRadio>
//         </RadioGroup>

//         <RadioGroup
//           value={form.getFieldState("delivery").isDirty.toString()}
//           color="success"
//           aria-label="Delivery option"
//         >
//           <CustomRadio
//             value={"true"}
//             description={
//               <>
//                 <div>
//                   <h3 className="font-medium text-sm text-gray-500">
//                     Delivery Details
//                   </h3>
//                   <p className="text-sm mt-1">
//                     {watchedValues.delivery.type ||
//                       "Delivery type not selected"}
//                   </p>
//                   <p className="text-sm mt-2 break-words">
//                     <span className="font-medium">Address</span> |{" "}
//                     {watchedValues.delivery.address || "Not selected"}
//                   </p>
//                 </div>
//                 <Link
//                   href={"/checkout?step=1"}
//                   className="text-green-500 font-semibold ml-auto hover:text-green-600 transition-colors flex-shrink-0"
//                 >
//                   Edit
//                 </Link>
//               </>
//             }
//             classNames={{
//               ...radioClassNames,
//               description:
//                 "flex-1 flex justify-between items-center gap-4 text-black",
//             }}
//           >
//             Delivery Option
//           </CustomRadio>
//         </RadioGroup>
//       </div>

//       <div className="bg-white rounded-2xl p-6 shadow-sm">
//         <h2 className="font-semibold mb-4 text-lg">Payment Method</h2>
//         <RadioGroup
//           defaultValue="card"
//           color="success"
//           aria-label="Payment methods"
//           classNames={{
//             base: "gap-4",
//           }}
//         >
//           <CustomRadio
//             value={"card"}
//             description="You will be directed to our secure payment gateway"
//             classNames={{
//               ...radioClassNames,
//               base: "w-full max-w-full flex-row justify-start items-start border border-gray-200 rounded-xl p-4 data-[selected=true]:border-green-500 hover:bg-gray-50 transition-all",
//             }}
//           >
//             Credit/Debit Card | Bank Transfer
//           </CustomRadio>

//           {/* <CustomRadio
//             value={"transfer"}
//             description="Pay directly to our bank account"
//             classNames={{
//               ...radioClassNames,
//               base: "w-full max-w-full flex-row justify-start items-start border border-gray-200 rounded-xl p-4 data-[selected=true]:border-green-500 hover:bg-gray-50 transition-all",
//             }}
//           >
//             Bank Transfer
//           </CustomRadio> */}
//         </RadioGroup>

//         <Button
//           type="submit"
//           size="lg"
//           isLoading={isSubmitting}
//           isDisabled={!isFormComplete()}
//           className="w-full py-3 mt-6 text-base font-medium bg-green-500 text-white hover:bg-green-600 transition-colors rounded-xl"
//         >
//           {isSubmitting ? "Processing..." : "Proceed to payment"}
//         </Button>

//         <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="w-5 h-5"
//           >
//             <path
//               fillRule="evenodd"
//               d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Secure payment processing
//         </div>
//       </div>

//       <Link
//         href="/"
//         className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mt-2 mx-auto"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="w-4 h-4"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
//           />
//         </svg>
//         Continue shopping
//       </Link>
//     </form>
//   );
// };

// export default PaymentForm;

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioProps, Button } from '@nextui-org/react'
import CustomRadio from '../General/CustomRadio'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema } from '@/lib/schemas'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'

type FormData = z.infer<typeof paymentSchema>

type PropsType = {
  shopmateId: string
  vendorId: string
  phoneNumber: string
  address: string
  emailAddress: string
}

const PaymentForm = ({
  shopmateId,
  vendorId,
  phoneNumber,
  address,
  emailAddress,
}: PropsType) => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart.products)
  const deliveryAddresses = useAppSelector(
    (state) => state.delivery.addressList
  )
  const deliveryDetails = useAppSelector(
    (state) => state.delivery.deliveryDetails
  )

  console.log('Delivery Details:', deliveryDetails)
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      user: {
        fullName: user?.fullName || '',
        address: user?.address || '',
        phoneNumber: user?.phoneNumber || '',
      },
      delivery: {
        type: '',
        address: '',
      },
    },
    mode: 'all',
  })

  const watchedValues = form.watch()

  useEffect(() => {
    if (user) {
      form.setValue(
        'user',
        {
          fullName: user.fullName || '',
          address: user.address || '',
          phoneNumber: user.phoneNumber || '',
        },
        { shouldValidate: true }
      )
    }
  }, [user, form])

  useEffect(() => {
    if (deliveryDetails) {
      try {
        form.setValue(
          'delivery',
          {
            type: deliveryDetails.deliveryMethod.type,
            address: deliveryDetails.deliveryAddress.addressString,
          },
          {
            shouldValidate: true,
          }
        )
      } catch (error) {
        console.error('Error loading delivery details:', error)
        toast({
          description: 'Failed to load delivery details',
          variant: 'destructive',
        })
      }
    }
  }, [form, toast, deliveryDetails])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      if (
        !data.user.phoneNumber ||
        !data.user.address ||
        !data.delivery.address
      ) {
        toast({
          title: 'Missing Information',
          description: 'Please complete all required fields before proceeding',
          variant: 'destructive',
        })
        return
      }

      const searchParams = new URLSearchParams({
        shopmateId,
        vendor: vendorId,
        phone: data.user.phoneNumber,
        address: data.user.address,
        email: emailAddress || user?.emailAddress || '',
      })

      router.push(`/checkout/payment?${searchParams.toString()}`)
    } catch (error) {
      console.error('Error during payment processing:', error)
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormComplete = () => {
    return (
      !!watchedValues.user.fullName &&
      !!watchedValues.user.address &&
      !!watchedValues.user.phoneNumber &&
      !!watchedValues.delivery.type &&
      !!watchedValues.delivery.address
    )
  }

  const radioClassNames: RadioProps['classNames'] = {
    base: 'w-full max-w-full flex-row justify-start items-start data-[selected=true]:border-transparent hover:bg-gray-50 transition-all',
    label: 'font-semibold -mt-1',
    description: 'flex-1 flex justify-between gap-4 text-black',
    labelWrapper: 'gap-2 flex-1',
  }

  return (
    <form
      className='max-w-6xl w-full flex flex-col gap-6 mx-auto p-4 animate-fadeIn'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className='flex flex-col gap-6 bg-white rounded-2xl p-6 shadow-sm'>
        <RadioGroup value='true' color='success' aria-label='Customer details'>
          <CustomRadio
            value='true'
            description={
              <>
                <div className='flex flex-col gap-1'>
                  <h3 className='font-medium text-sm text-gray-500'>
                    Customer Details
                  </h3>
                  <p className='text-sm break-words'>
                    {watchedValues.user.fullName || 'Name not provided'} <br />
                    {watchedValues.user.address || 'Address not provided'}{' '}
                    <br />
                    {watchedValues.user.phoneNumber || 'Phone not provided'}
                  </p>
                </div>
                <Link
                  href={'/account/profile/edit/me'}
                  className='text-green-500 font-semibold ml-auto hover:text-green-600 transition-colors flex-shrink-0'
                >
                  Edit
                </Link>
              </>
            }
            classNames={{
              ...radioClassNames,
              description:
                'flex-1 flex justify-between items-center gap-4 text-black',
            }}
          >
            Customer Information
          </CustomRadio>
        </RadioGroup>

        <RadioGroup value='true' color='success' aria-label='Delivery option'>
          <CustomRadio
            value='true'
            description={
              <>
                <div>
                  <h3 className='font-medium text-sm text-gray-500'>
                    Delivery Details
                  </h3>
                  <p className='text-sm mt-1'>
                    {watchedValues.delivery.type ||
                      'Delivery type not selected'}
                  </p>
                  <p className='text-sm mt-2 break-words'>
                    <span className='font-medium'>Address</span> |{' '}
                    {watchedValues.delivery.address || 'Not selected'}
                  </p>
                </div>
                <Link
                  href={'/checkout?step=1'}
                  className='text-green-500 font-semibold ml-auto hover:text-green-600 transition-colors flex-shrink-0'
                >
                  Edit
                </Link>
              </>
            }
            classNames={{
              ...radioClassNames,
              description:
                'flex-1 flex justify-between items-center gap-4 text-black',
            }}
          >
            Delivery Option
          </CustomRadio>
        </RadioGroup>
      </div>

      <div className='bg-white rounded-2xl p-6 shadow-sm'>
        <h2 className='font-semibold mb-4 text-lg'>Payment Method</h2>
        <RadioGroup
          defaultValue='card'
          color='success'
          aria-label='Payment methods'
          classNames={{
            base: 'gap-4',
          }}
        >
          <CustomRadio
            value='card'
            description='You will be directed to our secure payment gateway'
            classNames={{
              ...radioClassNames,
              base: 'w-full max-w-full flex-row justify-start items-start border border-gray-200 rounded-xl p-4 data-[selected=true]:border-green-500 hover:bg-gray-50 transition-all',
            }}
          >
            Credit/Debit Card | Bank Transfer
          </CustomRadio>
        </RadioGroup>

        <Button
          type='submit'
          size='lg'
          isLoading={isSubmitting}
          isDisabled={!isFormComplete()}
          className='w-full py-3 mt-6 text-base font-medium bg-green-500 text-white hover:bg-green-600 transition-colors rounded-xl'
        >
          {isSubmitting ? 'Processing...' : 'Proceed to payment'}
        </Button>

        <div className='mt-6 text-sm text-gray-500 flex items-center justify-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path
              fillRule='evenodd'
              d='M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z'
              clipRule='evenodd'
            />
          </svg>
          Secure payment processing
        </div>
      </div>

      <Link
        href='/'
        className='flex items-center gap-2 text-gray-600 hover:text-black transition-colors mt-2 mx-auto'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
          />
        </svg>
        Continue shopping
      </Link>
    </form>
  )
}

export default PaymentForm
