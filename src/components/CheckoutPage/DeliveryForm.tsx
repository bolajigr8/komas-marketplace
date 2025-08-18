// 'use client'

// import { useRouter } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// import { RadioGroup, RadioGroupProps, RadioProps } from '@nextui-org/react'
// import CustomRadio from '../General/CustomRadio'
// import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
// import { Button, Textarea } from '@nextui-org/react'
// import PickupStations from './PickupStation'
// import {
//   DeliveryType,
//   DeliveryMethod,
//   deliveryActions,
//   DeliveryOptionData,
// } from '@/redux-store/store-slices/DeliverySlice'
// import DeliveryListDropdown from '../AccountPages/DeliveryListDropdown'
// import { useSession } from 'next-auth/react'
// import { fetchPickupStations } from '@/lib/server-actions/pickup'
// import { PickupStation } from '@/lib/types'

// // Map UI delivery types to store delivery types
// const mapDeliveryType = (uiType: string): DeliveryType => {
//   switch (uiType) {
//     case 'Express delivery':
//       return 'express'
//     case 'Batch delivery':
//       return 'batch'
//     case 'Store pick up':
//       return 'storePickup'
//     case 'Fulfilment Center pick up':
//       return 'fulfillmentCenterPickup'
//     default:
//       return 'express'
//   }
// }

// // Map store delivery types to UI delivery types
// const mapToUIDeliveryType = (storeType: DeliveryType): string => {
//   switch (storeType) {
//     case 'express':
//       return 'Express delivery'
//     case 'batch':
//       return 'Batch delivery'
//     case 'storePickup':
//       return 'Store pick up'
//     case 'fulfillmentCenterPickup':
//       return 'Fulfilment Center pick up'
//     default:
//       return 'Express delivery'
//   }
// }

// // Get delivery category from type
// const getDeliveryCategory = (type: DeliveryType): 'home' | 'pickup' => {
//   return type === 'express' || type === 'batch' ? 'home' : 'pickup'
// }

// // Helper function to extract postal code from pickup station data
// const getPostCodeFromStation = (station: PickupStation): string => {
//   // First try to get from pickupStationAgent
//   if (station.pickupStationAgent?.postCode) {
//     return station.pickupStationAgent.postCode
//   }

//   const nigerianPostCodeMatch = station.address.match(/\b\d{6}\b/)
//   if (nigerianPostCodeMatch) return nigerianPostCodeMatch[0]

//   const generalPostCodeMatch = station.address.match(/\b[A-Z0-9]{3,8}\b$/i)
//   if (generalPostCodeMatch) return generalPostCodeMatch[0]

//   return ''
// }

// type UIDeliveryType =
//   | 'Express delivery'
//   | 'Batch delivery'
//   | 'Store pick up'
//   | 'Fulfilment Center pick up'

// type FulfillmentCenter = {
//   name: string
//   address: string
//   city?: string
//   // region?: string
//   state?: string
//   id: string
//   postCode?: string
//   geolocation: {
//     latitude: number
//     longitude: number
//   }
// }

// type Props = {
//   isShopmate: boolean
//   vendorId?: string
//   persistFormData?: boolean
// }

// const radioGroupClassNames: RadioGroupProps['classNames'] = {
//   wrapper: 'flex-nowrap flex-col md:flex-row',
// }

// const radioClassNames: RadioProps['classNames'] = {
//   base: 'w-full max-w-full flex-row justify-start items-start data-[selected=true]:border-green-500 hover:bg-content1',
//   label: 'font-semibold -mt-1',
//   description: 'flex-1 flex flex-col justify-between gap-4 text-black',
//   labelWrapper: 'gap-4 flex-1',
// }

// const DeliveryForm = ({
//   isShopmate,
//   vendorId,
//   persistFormData = true,
// }: Props) => {
//   const dispatch = useAppDispatch()
//   const router = useRouter()
//   const [pickupModalOpen, setPickupModalOpen] = useState(false)
//   const [pickupType, setPickupType] = useState<'store' | 'fulfillment'>('store')
//   const [deliveryNote, setDeliveryNote] = useState('')
//   const [defaultStationLoaded, setDefaultStationLoaded] = useState(false)

//   const { addressList, selectedAddressId, deliveryDetails, formData } =
//     useAppSelector((state) => state.delivery)

//   // Load default Lagos pickup station on component mount
//   useEffect(() => {
//     const loadDefaultPickupStation = async () => {
//       if (!defaultStationLoaded) {
//         try {
//           // console.log('Loading default Lagos pickup stations for form...')
//           const response = await fetchPickupStations({ region: 'Rivers' })
//           const stations = response?.data || []

//           // console.log('Default Lagos stations found for form:', stations)

//           if (stations.length > 0) {
//             const defaultStation = stations[0]
//             const postCode = getPostCodeFromStation(defaultStation)

//             // console.log('Setting default pickup station:', defaultStation)
//             // console.log('PostCode for default station:', postCode)

//             // Create default pickup data for both store and fulfillment center
//             const defaultPickupData: DeliveryOptionData = {
//               deliveryAddress: `${defaultStation.name}, ${defaultStation.address}`,
//               state: defaultStation.state,
//               postCode: postCode,
//               id: defaultStation._id,
//               fulfilled: true,
//               geolocation: {
//                 latitude: defaultStation.geolocation.latitude,
//                 longitude: defaultStation.geolocation.longitude,
//               },
//             }

//             // Set default for both pickup options
//             dispatch(
//               deliveryActions.updateFormDeliveryOption({
//                 optionKey: 'storePickup',
//                 data: defaultPickupData,
//               })
//             )

//             dispatch(
//               deliveryActions.updateFormDeliveryOption({
//                 optionKey: 'fulfillmentCenterPickup',
//                 data: defaultPickupData,
//               })
//             )

//             // console.log('Default pickup station set successfully')
//           }
//         } catch (err) {
//           console.error('Error loading default pickup station:', err)
//         } finally {
//           setDefaultStationLoaded(true)
//         }
//       }
//     }

//     loadDefaultPickupStation()
//   }, [defaultStationLoaded, dispatch])

//   // Initialize form data from redux state if available
//   useEffect(() => {
//     // console.log('Current deliveryDetails:', deliveryDetails)
//     // console.log(' Current formData:', formData)

//     if (
//       deliveryDetails &&
//       !formData.expressDelivery.fulfilled &&
//       !formData.batchDelivery.fulfilled &&
//       !formData.storePickup.fulfilled &&
//       !formData.fulfillmentCenterPickup.fulfilled
//     ) {
//       // console.log('Initializing form data from deliveryDetails')

//       const uiType = mapToUIDeliveryType(deliveryDetails.deliveryMethod.type)

//       // console.log('Mapped UI type:', uiType)
//       // console.log(
//       //   'Delivery method category:',
//       //   deliveryDetails.deliveryMethod.category
//       // )

//       // Create updated form data based on delivery details
//       const updatedFormData = {
//         selectedType: uiType as UIDeliveryType,
//         expressDelivery: { ...formData.expressDelivery },
//         batchDelivery: { ...formData.batchDelivery },
//         storePickup: { ...formData.storePickup },
//         fulfillmentCenterPickup: { ...formData.fulfillmentCenterPickup },
//       }

//       if (deliveryDetails.deliveryMethod.category === 'home') {
//         // console.log('Setting up home delivery data')

//         const addressParts =
//           deliveryDetails.deliveryAddress.addressString.split(', ')
//         const state = addressParts.length >= 3 ? addressParts[2] : ''

//         updatedFormData.expressDelivery = {
//           deliveryAddress: deliveryDetails.deliveryAddress.addressString,
//           state: state,
//           postCode: deliveryDetails.deliveryAddress.postCode,
//           fulfilled: deliveryDetails.deliveryMethod.type === 'express',
//         }

//         updatedFormData.batchDelivery = {
//           deliveryAddress: deliveryDetails.deliveryAddress.addressString,
//           state: state,
//           postCode: deliveryDetails.deliveryAddress.postCode,
//           fulfilled: deliveryDetails.deliveryMethod.type === 'batch',
//         }

//         // console.log('Home delivery data set:', {
//         //   express: updatedFormData.expressDelivery,
//         //   batch: updatedFormData.batchDelivery,
//         // })
//       } else if (deliveryDetails.deliveryMethod.category === 'pickup') {
//         // console.log('Setting up pickup delivery data')
//         // console.log(
//         //   'Pickup location data:',
//         //   deliveryDetails.deliveryMethod.pickupLocation
//         // )

//         // Get postCode from pickupLocation or extract from address
//         const pickupPostCode =
//           deliveryDetails.deliveryMethod.pickupLocation?.postCode ||
//           deliveryDetails.deliveryAddress.postCode ||
//           ''

//         // console.log('Pickup postCode determined:', pickupPostCode)

//         if (deliveryDetails.deliveryMethod.type === 'storePickup') {
//           updatedFormData.storePickup = {
//             deliveryAddress: deliveryDetails.deliveryAddress.addressString,
//             state: deliveryDetails.deliveryMethod.pickupLocation?.state,
//             postCode: pickupPostCode,
//             fulfilled: true,
//           }
//           // console.log('Store pickup data set:', updatedFormData.storePickup)
//         } else {
//           updatedFormData.fulfillmentCenterPickup = {
//             deliveryAddress: deliveryDetails.deliveryAddress.addressString,
//             state: deliveryDetails.deliveryMethod.pickupLocation?.state,
//             postCode: pickupPostCode,
//             fulfilled: true,
//           }
//           // console.log(
//           //   ' Fulfillment center pickup data set:',
//           //   updatedFormData.fulfillmentCenterPickup
//           // )
//         }
//       }

//       // console.log('Updating Redux with form data:', updatedFormData)
//       // Update Redux store with the form data
//       dispatch(deliveryActions.setFormData(updatedFormData))

//       // Load delivery note if available from orderDetails
//       if (deliveryDetails.orderDetails?.orderNote) {
//         // console.log(
//         //   'Setting delivery note:',
//         //   deliveryDetails.orderDetails.orderNote
//         // )
//         setDeliveryNote(deliveryDetails.orderDetails.orderNote)
//       }
//     }
//   }, [deliveryDetails, formData, dispatch])

//   // Update form data when selected address changes
//   useEffect(() => {
//     if (selectedAddressId && addressList.length > 0) {
//       const selectedAddress = addressList.find(
//         (addr) => addr.id === selectedAddressId
//       )

//       if (selectedAddress) {
//         const fullAddress = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`

//         const expressDelivery = {
//           deliveryAddress: fullAddress,
//           fulfilled: true,
//           postCode: selectedAddress.postCode,
//           state: selectedAddress.state,
//         }

//         const batchDelivery = {
//           deliveryAddress: fullAddress,
//           fulfilled: true,
//           postCode: selectedAddress.postCode,
//           state: selectedAddress.state,
//         }

//         // Updating the Redux store with the home delivery options
//         dispatch(
//           deliveryActions.updateFormDeliveryOption({
//             optionKey: 'expressDelivery',
//             data: expressDelivery,
//           })
//         )

//         dispatch(
//           deliveryActions.updateFormDeliveryOption({
//             optionKey: 'batchDelivery',
//             data: batchDelivery,
//           })
//         )
//       }
//     }
//   }, [selectedAddressId, addressList, dispatch])

//   const getDeliveryOptionKey = (
//     type: UIDeliveryType
//   ): keyof Omit<typeof formData, 'selectedType'> => {
//     switch (type) {
//       case 'Express delivery':
//         return 'expressDelivery'
//       case 'Batch delivery':
//         return 'batchDelivery'
//       case 'Store pick up':
//         return 'storePickup'
//       case 'Fulfilment Center pick up':
//         return 'fulfillmentCenterPickup'
//     }
//   }

//   const getCurrentOptionData = (): DeliveryOptionData => {
//     const key = getDeliveryOptionKey(formData?.selectedType)
//     return (
//       formData?.[key] ?? {
//         deliveryAddress: '',
//         state: '',
//         postCode: '',
//         fulfilled: false,
//       }
//     )
//   }

//   const handleDeliveryTypeChange = (type: string) => {
//     dispatch(deliveryActions.updateFormSelectedType(type as UIDeliveryType))
//   }

//   const handleAddressSelect = (addressId: string) => {
//     dispatch(deliveryActions.setSelectedAddress(addressId))
//   }

//   const handleDeliveryNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDeliveryNote(e.target.value)
//   }

//   const openPickupModal = (type: 'store' | 'fulfillment') => {
//     setPickupType(type)
//     setPickupModalOpen(true)
//   }

//   const handleSelectPickupLocation = (center: FulfillmentCenter) => {
//     // console.log('Selected pickup center:', center)

//     const key =
//       pickupType === 'store' ? 'storePickup' : 'fulfillmentCenterPickup'

//     //  the postCode from the center data
//     const postCode = center.postCode || ''
//     const centerId = center.id || ''

//     // console.log(' PostCode from pickup center:', postCode)
//     // console.log('ID from pickup center:', centerId)

//     const pickupData: DeliveryOptionData = {
//       deliveryAddress: `${center.name}, ${center.address}`,
//       fulfilled: true,
//       postCode: postCode,
//       state: center.state,
//       id: centerId,
//       geolocation: center.geolocation
//         ? {
//             latitude: center.geolocation.latitude,
//             longitude: center.geolocation.longitude,
//           }
//         : undefined,
//     }

//     // console.log('Pickup data being saved:', pickupData)

//     //This will trigger the deliveryDetails update
//     dispatch(
//       deliveryActions.updateFormDeliveryOption({
//         optionKey: key,
//         data: pickupData,
//       })
//     )

//     // Close the modal
//     setPickupModalOpen(false)
//   }

//   const handleSubmit = () => {
//     const currentData = getCurrentOptionData()

//     if (!currentData.fulfilled) return

//     // Update Redux store with final delivery details
//     const storeType = mapDeliveryType(formData.selectedType)
//     const category = getDeliveryCategory(storeType)

//     const deliveryMethod: DeliveryMethod = {
//       type: storeType,
//       category: category,
//       ...(category === 'pickup' && {
//         pickupLocation: {
//           name: currentData.deliveryAddress.split(', ')[0],
//           address: currentData.deliveryAddress.substring(
//             currentData.deliveryAddress.indexOf(', ') + 2
//           ),
//           state: currentData.state,
//           id: currentData.id ?? '',
//           postCode: currentData.postCode,
//           geolocation: {
//             latitude: currentData?.geolocation?.latitude ?? 0,
//             longitude: currentData?.geolocation?.longitude ?? 0,
//           },
//         },
//       }),
//     }

//     dispatch(deliveryActions.setDeliveryMethod(deliveryMethod))

//     // Save delivery note to orderNote if provided
//     if (deliveryNote.trim() !== '') {
//       dispatch(deliveryActions.updateOrderNote(deliveryNote))
//     }

//     const searchParams = new URLSearchParams({
//       step: '2',
//       vendorId: vendorId || '',
//       shopmate: isShopmate.toString(),
//     })

//     router.push(
//       isShopmate
//         ? `/checkout/shopmate?${searchParams.toString()}`
//         : `/checkout?${searchParams.toString()}`
//     )
//   }

//   return (
//     <section className='max-w-6xl flex flex-col gap-6 mx-auto p-4 w-full'>
//       <RadioGroup
//         label={
//           <div className='flex gap-4 rounded-2xl p-4 pr-8 bg-white shadow-sm'>
//             <span className='md:text-lg size-8 font-semibold flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-300'>
//               A
//             </span>
//             <div className='flex flex-col gap-4 flex-1'>
//               <h2 className='md:text-lg font-semibold'>
//                 Home delivery? Choose delivery option
//               </h2>
//               <hr />
//             </div>
//           </div>
//         }
//         value={formData?.selectedType || 'Delivery method not selected'}
//         onValueChange={handleDeliveryTypeChange}
//         color='success'
//         classNames={radioGroupClassNames}
//       >
//         <CustomRadio
//           value='Express delivery'
//           description={
//             <>
//               <p className='text-sm font-medium'>
//                 Items in the cart are delivered to you immediately. An extra fee
//                 of N500 is paid for this option.
//               </p>
//               <div className='flex items-baseline justify-between flex-col gap-3'>
//                 {addressList.length > 0 ? (
//                   <>
//                     <p className='text-sm mt-[2.5px] max-w-[85%]'>
//                       <span className='font-medium'>Address | </span>
//                       {formData?.expressDelivery.deliveryAddress ||
//                         'No address selected'}
//                     </p>
//                     <DeliveryListDropdown
//                       addresses={addressList}
//                       selectedAddressId={selectedAddressId}
//                       onSelectAddress={handleAddressSelect}
//                     />
//                   </>
//                 ) : (
//                   <Button
//                     className='text-sm p-3 px-8 bg-[#FEA610] text-white border border-[#FEA610] font-medium rounded-xl w-fit'
//                     onPress={() =>
//                       router.push('/account/profile/edit/delivery-address/add')
//                     }
//                   >
//                     Add your delivery address
//                   </Button>
//                 )}
//               </div>
//             </>
//           }
//           classNames={radioClassNames}
//         >
//           Express delivery
//         </CustomRadio>

//         <CustomRadio
//           value='Batch delivery'
//           description={
//             <>
//               <p className='text-sm font-medium'>
//                 Items in the cart are delivered to you during batch delivery
//                 hours. (Delivery time 12pm and 4pm)
//               </p>
//               <div className='flex items-baseline justify-between flex-col gap-3'>
//                 {addressList.length > 0 ? (
//                   <>
//                     <p className='text-sm mt-[2.5px] max-w-[85%]'>
//                       <span className='font-medium'>Address | </span>
//                       {formData?.batchDelivery.deliveryAddress ||
//                         'No address selected'}
//                     </p>
//                     <DeliveryListDropdown
//                       addresses={addressList}
//                       selectedAddressId={selectedAddressId}
//                       onSelectAddress={handleAddressSelect}
//                     />
//                   </>
//                 ) : (
//                   <Button
//                     className='text-sm p-3 px-8 bg-[#FEA610] text-white border border-[#FEA610] font-medium rounded-xl w-fit'
//                     onPress={() =>
//                       router.push('/account/profile/edit/delivery-address/add')
//                     }
//                   >
//                     Add your delivery address
//                   </Button>
//                 )}
//               </div>
//             </>
//           }
//           classNames={radioClassNames}
//         >
//           Batch delivery
//         </CustomRadio>
//       </RadioGroup>

//       <RadioGroup
//         label={
//           <div className='flex gap-4 shadow-sm rounded-2xl p-4 pr-8 bg-white'>
//             <span className='md:text-lg size-8 font-semibold flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-300'>
//               B
//             </span>
//             <div className='flex flex-col gap-4 flex-1'>
//               <h2 className='md:text-lg font-semibold'>
//                 Pickup? Choose Pickup option
//               </h2>
//               <hr />
//             </div>
//           </div>
//         }
//         value={formData?.selectedType || 'Delivery method not selected'}
//         onValueChange={handleDeliveryTypeChange}
//         color='success'
//         classNames={radioGroupClassNames}
//       >
//         <CustomRadio
//           value='Store pick up'
//           description={
//             <>
//               <p className='text-sm font-medium'>
//                 Pickup items at the store. Select your state to see available
//                 stations.
//               </p>
//               {formData?.storePickup.deliveryAddress ? (
//                 <div className='flex items-start justify-between flex-col gap-3'>
//                   <p className='text-sm max-w-[85%]'>
//                     <span className='font-medium'>Pickup Station | </span>
//                     {formData?.storePickup.deliveryAddress ||
//                       'No store selected'}
//                   </p>
//                   <Button
//                     className='text-sm p-3 px-8 bg-transparent text-green-500 border border-green-700 font-medium rounded-xl w-fit'
//                     onPress={() => openPickupModal('store')}
//                   >
//                     Edit
//                   </Button>
//                 </div>
//               ) : (
//                 <Button
//                   className='text-sm p-3 px-8 bg-transparent text-[#FEA610] border border-[#FEA610] font-medium rounded-xl w-fit'
//                   onPress={() => openPickupModal('store')}
//                 >
//                   Select a pickup station
//                 </Button>
//               )}
//             </>
//           }
//           classNames={radioClassNames}
//         >
//           Store pickup
//         </CustomRadio>

//         <CustomRadio
//           value='Fulfilment Center pick up'
//           description={
//             <>
//               <p className='text-sm font-medium'>
//                 Pickup items in the cart at our pickup stations near you. A
//                 pickup fee of N200 is incurred.
//               </p>
//               {formData?.fulfillmentCenterPickup.deliveryAddress ? (
//                 <div className='flex items-start justify-between flex-col gap-3'>
//                   <p className='text-sm max-w-[85%]'>
//                     <span className='font-medium'>Pickup station | </span>
//                     {formData?.fulfillmentCenterPickup.deliveryAddress ||
//                       'No pickup station selected'}
//                   </p>
//                   <Button
//                     className='text-sm p-3 px-8 bg-transparent text-green-500 border border-green-700 font-medium rounded-xl w-fit'
//                     onPress={() => openPickupModal('fulfillment')}
//                   >
//                     Edit
//                   </Button>
//                 </div>
//               ) : (
//                 <Button
//                   className='text-sm p-3 px-8 bg-transparent text-[#FEA610] border border-[#FEA610] font-medium rounded-xl w-fit'
//                   onPress={() => openPickupModal('fulfillment')}
//                 >
//                   Select a pickup station
//                 </Button>
//               )}
//             </>
//           }
//           classNames={radioClassNames}
//         >
//           Pickup station
//         </CustomRadio>
//       </RadioGroup>

//       {/* Delivery Note section - Only shown when isShopmate is false */}
//       {!isShopmate && (
//         <div className='flex gap-4 shadow-sm rounded-2xl p-4 pr-8 bg-white'>
//           {/* <span className="md:text-lg size-8 font-semibold flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-300">
//             C
//           </span> */}
//           <div className='flex flex-col gap-4 flex-1'>
//             <h2 className='md:text-lg font-semibold'>Delivery Notes</h2>
//             <hr />
//             <Textarea
//               placeholder='Add any special instructions for delivery (optional)'
//               value={deliveryNote}
//               onChange={handleDeliveryNoteChange}
//               className='w-full'
//               minRows={3}
//               maxRows={5}
//               variant='bordered'
//             />
//           </div>
//         </div>
//       )}

//       <PickupStations
//         open={pickupModalOpen}
//         onOpenChange={setPickupModalOpen}
//         onSelectStation={handleSelectPickupLocation}
//       />

//       <Button
//         size='lg'
//         isDisabled={!getCurrentOptionData().fulfilled}
//         className='p-4 max-w-2xl w-full bg-[#FEA610] text-white font-semibold rounded-2xl mx-auto'
//         onPress={handleSubmit}
//       >
//         Continue
//       </Button>
//     </section>
//   )
// }

// export default DeliveryForm

'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupProps, RadioProps } from '@nextui-org/react'
import CustomRadio from '../General/CustomRadio'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { Button, Textarea } from '@nextui-org/react'
import PickupStations from './PickupStation'
import {
  DeliveryType,
  DeliveryMethod,
  deliveryActions,
  DeliveryOptionData,
} from '@/redux-store/store-slices/DeliverySlice'
import DeliveryListDropdown from '../AccountPages/DeliveryListDropdown'
import { useSession } from 'next-auth/react'
import { fetchPickupStations } from '@/lib/server-actions/pickup'
import { PickupStation } from '@/lib/types'

// Map UI delivery types to store delivery types
const mapDeliveryType = (uiType: string): DeliveryType => {
  switch (uiType) {
    case 'Express delivery':
      return 'express'
    case 'Batch delivery':
      return 'batch'
    case 'Store pick up':
      return 'storePickup'
    case 'Fulfilment Center pick up':
      return 'fulfillmentCenterPickup'
    default:
      return 'express'
  }
}

// Map store delivery types to UI delivery types
const mapToUIDeliveryType = (storeType: DeliveryType): string => {
  switch (storeType) {
    case 'express':
      return 'Express delivery'
    case 'batch':
      return 'Batch delivery'
    case 'storePickup':
      return 'Store pick up'
    case 'fulfillmentCenterPickup':
      return 'Fulfilment Center pick up'
    default:
      return 'Express delivery'
  }
}

// Get delivery category from type
const getDeliveryCategory = (type: DeliveryType): 'home' | 'pickup' => {
  return type === 'express' || type === 'batch' ? 'home' : 'pickup'
}

// Helper function to extract postal code from pickup station data
const getPostCodeFromStation = (station: PickupStation): string => {
  // First try to get from pickupStationAgent
  if (station.pickupStationAgent?.postCode) {
    return station.pickupStationAgent.postCode
  }

  const nigerianPostCodeMatch = station.address.match(/\b\d{6}\b/)
  if (nigerianPostCodeMatch) return nigerianPostCodeMatch[0]

  const generalPostCodeMatch = station.address.match(/\b[A-Z0-9]{3,8}\b$/i)
  if (generalPostCodeMatch) return generalPostCodeMatch[0]

  return ''
}

type UIDeliveryType =
  | 'Express delivery'
  | 'Batch delivery'
  | 'Store pick up'
  | 'Fulfilment Center pick up'

type FulfillmentCenter = {
  name: string
  address: string
  city?: string
  // region?: string
  state?: string
  id: string
  postCode?: string
  geolocation: {
    latitude: number
    longitude: number
  }
}

type Props = {
  isShopmate: boolean
  vendorId?: string
  persistFormData?: boolean
}

const radioGroupClassNames: RadioGroupProps['classNames'] = {
  wrapper: 'flex-nowrap flex-col md:flex-row',
}

const radioClassNames: RadioProps['classNames'] = {
  base: 'w-full max-w-full flex-row justify-start items-start data-[selected=true]:border-green-500 hover:bg-content1',
  label: 'font-semibold -mt-1',
  description: 'flex-1 flex flex-col justify-between gap-4 text-black',
  labelWrapper: 'gap-4 flex-1',
}

const disabledRadioClassNames: RadioProps['classNames'] = {
  base: 'w-full max-w-full flex-row justify-start items-start opacity-50 cursor-not-allowed',
  label: 'font-semibold -mt-1',
  description: 'flex-1 flex flex-col justify-between gap-4 text-gray-400',
  labelWrapper: 'gap-4 flex-1',
}

const DeliveryForm = ({
  isShopmate,
  vendorId,
  persistFormData = true,
}: Props) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pickupModalOpen, setPickupModalOpen] = useState(false)
  const [pickupType, setPickupType] = useState<'store' | 'fulfillment'>('store')
  const [deliveryNote, setDeliveryNote] = useState('')
  const [defaultStationLoaded, setDefaultStationLoaded] = useState(false)

  const { addressList, selectedAddressId, deliveryDetails, formData } =
    useAppSelector((state) => state.delivery)

  // Load default Lagos pickup station on component mount
  useEffect(() => {
    const loadDefaultPickupStation = async () => {
      if (!defaultStationLoaded) {
        try {
          // console.log('Loading default Lagos pickup stations for form...')
          const response = await fetchPickupStations({ region: 'Rivers' })
          const stations = response?.data || []

          // console.log('Default Lagos stations found for form:', stations)

          if (stations.length > 0) {
            const defaultStation = stations[0]
            const postCode = getPostCodeFromStation(defaultStation)

            // console.log('Setting default pickup station:', defaultStation)
            // console.log('PostCode for default station:', postCode)

            // Create default pickup data for both store and fulfillment center
            const defaultPickupData: DeliveryOptionData = {
              deliveryAddress: `${defaultStation.name}, ${defaultStation.address}`,
              state: defaultStation.state,
              postCode: postCode,
              id: defaultStation._id,
              fulfilled: true,
              geolocation: {
                latitude: defaultStation.geolocation.latitude,
                longitude: defaultStation.geolocation.longitude,
              },
            }

            // Set default for both pickup options
            dispatch(
              deliveryActions.updateFormDeliveryOption({
                optionKey: 'storePickup',
                data: defaultPickupData,
              })
            )

            dispatch(
              deliveryActions.updateFormDeliveryOption({
                optionKey: 'fulfillmentCenterPickup',
                data: defaultPickupData,
              })
            )

            // console.log('Default pickup station set successfully')
          }
        } catch (err) {
          console.error('Error loading default pickup station:', err)
        } finally {
          setDefaultStationLoaded(true)
        }
      }
    }

    loadDefaultPickupStation()
  }, [defaultStationLoaded, dispatch])

  // Initialize form data from redux state if available
  useEffect(() => {
    // console.log('Current deliveryDetails:', deliveryDetails)
    // console.log(' Current formData:', formData)

    if (
      deliveryDetails &&
      !formData.expressDelivery.fulfilled &&
      !formData.batchDelivery.fulfilled &&
      !formData.storePickup.fulfilled &&
      !formData.fulfillmentCenterPickup.fulfilled
    ) {
      // console.log('Initializing form data from deliveryDetails')

      const uiType = mapToUIDeliveryType(deliveryDetails.deliveryMethod.type)

      // console.log('Mapped UI type:', uiType)
      // console.log(
      //   'Delivery method category:',
      //   deliveryDetails.deliveryMethod.category
      // )

      // Create updated form data based on delivery details
      const updatedFormData = {
        selectedType: uiType as UIDeliveryType,
        expressDelivery: { ...formData.expressDelivery },
        batchDelivery: { ...formData.batchDelivery },
        storePickup: { ...formData.storePickup },
        fulfillmentCenterPickup: { ...formData.fulfillmentCenterPickup },
      }

      if (deliveryDetails.deliveryMethod.category === 'home') {
        // console.log('Setting up home delivery data')

        const addressParts =
          deliveryDetails.deliveryAddress.addressString.split(', ')
        const state = addressParts.length >= 3 ? addressParts[2] : ''

        updatedFormData.expressDelivery = {
          deliveryAddress: deliveryDetails.deliveryAddress.addressString,
          state: state,
          postCode: deliveryDetails.deliveryAddress.postCode,
          fulfilled: deliveryDetails.deliveryMethod.type === 'express',
        }

        updatedFormData.batchDelivery = {
          deliveryAddress: deliveryDetails.deliveryAddress.addressString,
          state: state,
          postCode: deliveryDetails.deliveryAddress.postCode,
          fulfilled: deliveryDetails.deliveryMethod.type === 'batch',
        }

        // console.log('Home delivery data set:', {
        //   express: updatedFormData.expressDelivery,
        //   batch: updatedFormData.batchDelivery,
        // })
      } else if (deliveryDetails.deliveryMethod.category === 'pickup') {
        // console.log('Setting up pickup delivery data')
        // console.log(
        //   'Pickup location data:',
        //   deliveryDetails.deliveryMethod.pickupLocation
        // )

        // Get postCode from pickupLocation or extract from address
        const pickupPostCode =
          deliveryDetails.deliveryMethod.pickupLocation?.postCode ||
          deliveryDetails.deliveryAddress.postCode ||
          ''

        // console.log('Pickup postCode determined:', pickupPostCode)

        if (deliveryDetails.deliveryMethod.type === 'storePickup') {
          updatedFormData.storePickup = {
            deliveryAddress: deliveryDetails.deliveryAddress.addressString,
            state: deliveryDetails.deliveryMethod.pickupLocation?.state,
            postCode: pickupPostCode,
            fulfilled: true,
          }
          // console.log('Store pickup data set:', updatedFormData.storePickup)
        } else {
          updatedFormData.fulfillmentCenterPickup = {
            deliveryAddress: deliveryDetails.deliveryAddress.addressString,
            state: deliveryDetails.deliveryMethod.pickupLocation?.state,
            postCode: pickupPostCode,
            fulfilled: true,
          }
          // console.log(
          //   ' Fulfillment center pickup data set:',
          //   updatedFormData.fulfillmentCenterPickup
          // )
        }
      }

      // console.log('Updating Redux with form data:', updatedFormData)
      // Update Redux store with the form data
      dispatch(deliveryActions.setFormData(updatedFormData))

      // Load delivery note if available from orderDetails
      if (deliveryDetails.orderDetails?.orderNote) {
        // console.log(
        //   'Setting delivery note:',
        //   deliveryDetails.orderDetails.orderNote
        // )
        setDeliveryNote(deliveryDetails.orderDetails.orderNote)
      }
    }
  }, [deliveryDetails, formData, dispatch])

  // Update form data when selected address changes
  useEffect(() => {
    if (selectedAddressId && addressList.length > 0) {
      const selectedAddress = addressList.find(
        (addr) => addr.id === selectedAddressId
      )

      if (selectedAddress) {
        const fullAddress = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`

        const expressDelivery = {
          deliveryAddress: fullAddress,
          fulfilled: true,
          postCode: selectedAddress.postCode,
          state: selectedAddress.state,
        }

        const batchDelivery = {
          deliveryAddress: fullAddress,
          fulfilled: true,
          postCode: selectedAddress.postCode,
          state: selectedAddress.state,
        }

        // Updating the Redux store with the home delivery options
        dispatch(
          deliveryActions.updateFormDeliveryOption({
            optionKey: 'expressDelivery',
            data: expressDelivery,
          })
        )

        dispatch(
          deliveryActions.updateFormDeliveryOption({
            optionKey: 'batchDelivery',
            data: batchDelivery,
          })
        )
      }
    }
  }, [selectedAddressId, addressList, dispatch])

  const getDeliveryOptionKey = (
    type: UIDeliveryType
  ): keyof Omit<typeof formData, 'selectedType'> => {
    switch (type) {
      case 'Express delivery':
        return 'expressDelivery'
      case 'Batch delivery':
        return 'batchDelivery'
      case 'Store pick up':
        return 'storePickup'
      case 'Fulfilment Center pick up':
        return 'fulfillmentCenterPickup'
    }
  }

  const getCurrentOptionData = (): DeliveryOptionData => {
    const key = getDeliveryOptionKey(formData?.selectedType)
    return (
      formData?.[key] ?? {
        deliveryAddress: '',
        state: '',
        postCode: '',
        fulfilled: false,
      }
    )
  }

  const handleDeliveryTypeChange = (type: string) => {
    // Prevent selection of 'Store pick up'
    if (type === 'Store pick up') {
      return
    }
    dispatch(deliveryActions.updateFormSelectedType(type as UIDeliveryType))
  }

  const handleAddressSelect = (addressId: string) => {
    dispatch(deliveryActions.setSelectedAddress(addressId))
  }

  const handleDeliveryNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryNote(e.target.value)
  }

  const openPickupModal = (type: 'store' | 'fulfillment') => {
    setPickupType(type)
    setPickupModalOpen(true)
  }

  const handleSelectPickupLocation = (center: FulfillmentCenter) => {
    // console.log('Selected pickup center:', center)

    const key =
      pickupType === 'store' ? 'storePickup' : 'fulfillmentCenterPickup'

    //  the postCode from the center data
    const postCode = center.postCode || ''
    const centerId = center.id || ''

    // console.log(' PostCode from pickup center:', postCode)
    // console.log('ID from pickup center:', centerId)

    const pickupData: DeliveryOptionData = {
      deliveryAddress: `${center.name}, ${center.address}`,
      fulfilled: true,
      postCode: postCode,
      state: center.state,
      id: centerId,
      geolocation: center.geolocation
        ? {
            latitude: center.geolocation.latitude,
            longitude: center.geolocation.longitude,
          }
        : undefined,
    }

    // console.log('Pickup data being saved:', pickupData)

    //This will trigger the deliveryDetails update
    dispatch(
      deliveryActions.updateFormDeliveryOption({
        optionKey: key,
        data: pickupData,
      })
    )

    // Close the modal
    setPickupModalOpen(false)
  }

  const handleSubmit = () => {
    const currentData = getCurrentOptionData()

    if (!currentData.fulfilled) return

    // Update Redux store with final delivery details
    const storeType = mapDeliveryType(formData.selectedType)
    const category = getDeliveryCategory(storeType)

    const deliveryMethod: DeliveryMethod = {
      type: storeType,
      category: category,
      ...(category === 'pickup' && {
        pickupLocation: {
          name: currentData.deliveryAddress.split(', ')[0],
          address: currentData.deliveryAddress.substring(
            currentData.deliveryAddress.indexOf(', ') + 2
          ),
          state: currentData.state,
          id: currentData.id ?? '',
          postCode: currentData.postCode,
          geolocation: {
            latitude: currentData?.geolocation?.latitude ?? 0,
            longitude: currentData?.geolocation?.longitude ?? 0,
          },
        },
      }),
    }

    dispatch(deliveryActions.setDeliveryMethod(deliveryMethod))

    // Save delivery note to orderNote if provided
    if (deliveryNote.trim() !== '') {
      dispatch(deliveryActions.updateOrderNote(deliveryNote))
    }

    const searchParams = new URLSearchParams({
      step: '2',
      vendorId: vendorId || '',
      shopmate: isShopmate.toString(),
    })

    router.push(
      isShopmate
        ? `/checkout/shopmate?${searchParams.toString()}`
        : `/checkout?${searchParams.toString()}`
    )
  }

  return (
    <section className='max-w-6xl flex flex-col gap-6 mx-auto p-4 w-full'>
      <RadioGroup
        label={
          <div className='flex gap-4 shadow-sm rounded-2xl p-4 pr-8 bg-white'>
            <span className='md:text-lg size-8 font-semibold flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-300'>
              A
            </span>
            <div className='flex flex-col gap-4 flex-1'>
              <h2 className='md:text-lg font-semibold'>
                Pickup? Choose Pickup option
              </h2>
              <hr />
            </div>
          </div>
        }
        value={formData?.selectedType || 'Delivery method not selected'}
        onValueChange={handleDeliveryTypeChange}
        color='success'
        classNames={radioGroupClassNames}
      >
        <CustomRadio
          value='Fulfilment Center pick up'
          description={
            <>
              <p className='text-sm font-medium'>
                Pickup items in the cart at our pickup stations near you. A
                pickup fee of N200 is incurred.
              </p>
              {formData?.fulfillmentCenterPickup.deliveryAddress ? (
                <div className='flex items-start justify-between flex-col gap-3'>
                  <p className='text-sm max-w-[85%]'>
                    <span className='font-medium'>Pickup station | </span>
                    {formData?.fulfillmentCenterPickup.deliveryAddress ||
                      'No pickup station selected'}
                  </p>
                  <Button
                    className='text-sm p-3 px-8 bg-transparent text-green-500 border border-green-700 font-medium rounded-xl w-fit'
                    onPress={() => openPickupModal('fulfillment')}
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <Button
                  className='text-sm p-3 px-8 bg-transparent text-[#FEA610] border border-[#FEA610] font-medium rounded-xl w-fit'
                  onPress={() => openPickupModal('fulfillment')}
                >
                  Select a pickup station
                </Button>
              )}
            </>
          }
          classNames={radioClassNames}
        >
          Pickup station
        </CustomRadio>

        <CustomRadio
          value='Store pick up'
          description={
            <>
              <p className='text-sm font-medium'>
                Pickup items at the store. Select your state to see available
                stations.
              </p>
              {formData?.storePickup.deliveryAddress ? (
                <div className='flex items-start justify-between flex-col gap-3'>
                  <p className='text-sm max-w-[85%]'>
                    <span className='font-medium'>Pickup Station | </span>
                    {formData?.storePickup.deliveryAddress ||
                      'No store selected'}
                  </p>
                  <Button
                    className='text-sm p-3 px-8 bg-transparent text-gray-400 border border-gray-400 font-medium rounded-xl w-fit cursor-not-allowed'
                    isDisabled={true}
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <Button
                  className='text-sm p-3 px-8 bg-transparent text-gray-400 border border-gray-400 font-medium rounded-xl w-fit cursor-not-allowed'
                  isDisabled={true}
                >
                  Select a pickup station
                </Button>
              )}
            </>
          }
          classNames={disabledRadioClassNames}
          isDisabled={true}
        >
          Store pickup
        </CustomRadio>
      </RadioGroup>

      <RadioGroup
        label={
          <div className='flex gap-4 rounded-2xl p-4 pr-8 bg-white shadow-sm'>
            <span className='md:text-lg size-8 font-semibold flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-300'>
              B
            </span>
            <div className='flex flex-col gap-4 flex-1'>
              <h2 className='md:text-lg font-semibold'>
                Home delivery? Choose delivery option
              </h2>
              <hr />
            </div>
          </div>
        }
        value={formData?.selectedType || 'Delivery method not selected'}
        onValueChange={handleDeliveryTypeChange}
        color='success'
        classNames={radioGroupClassNames}
      >
        <CustomRadio
          value='Express delivery'
          description={
            <>
              <p className='text-sm font-medium'>
                Items in the cart are delivered to you immediately. An extra fee
                of N500 is paid for this option.
              </p>
              <div className='flex items-baseline justify-between flex-col gap-3'>
                {addressList.length > 0 ? (
                  <>
                    <p className='text-sm mt-[2.5px] max-w-[85%]'>
                      <span className='font-medium'>Address | </span>
                      {formData?.expressDelivery.deliveryAddress ||
                        'No address selected'}
                    </p>
                    <DeliveryListDropdown
                      addresses={addressList}
                      selectedAddressId={selectedAddressId}
                      onSelectAddress={handleAddressSelect}
                    />
                  </>
                ) : (
                  <Button
                    className='text-sm p-3 px-8 bg-[#FEA610] text-white border border-[#FEA610] font-medium rounded-xl w-fit'
                    onPress={() =>
                      router.push('/account/profile/edit/delivery-address/add')
                    }
                  >
                    Add your delivery address
                  </Button>
                )}
              </div>
            </>
          }
          classNames={radioClassNames}
        >
          Express delivery
        </CustomRadio>

        <CustomRadio
          value='Batch delivery'
          description={
            <>
              <p className='text-sm font-medium'>
                Items in the cart are delivered to you during batch delivery
                hours. (Delivery time 12pm and 4pm)
              </p>
              <div className='flex items-baseline justify-between flex-col gap-3'>
                {addressList.length > 0 ? (
                  <>
                    <p className='text-sm mt-[2.5px] max-w-[85%]'>
                      <span className='font-medium'>Address | </span>
                      {formData?.batchDelivery.deliveryAddress ||
                        'No address selected'}
                    </p>
                    <DeliveryListDropdown
                      addresses={addressList}
                      selectedAddressId={selectedAddressId}
                      onSelectAddress={handleAddressSelect}
                    />
                  </>
                ) : (
                  <Button
                    className='text-sm p-3 px-8 bg-[#FEA610] text-white border border-[#FEA610] font-medium rounded-xl w-fit'
                    onPress={() =>
                      router.push('/account/profile/edit/delivery-address/add')
                    }
                  >
                    Add your delivery address
                  </Button>
                )}
              </div>
            </>
          }
          classNames={radioClassNames}
        >
          Batch delivery
        </CustomRadio>
      </RadioGroup>

      {/* Delivery Note section - Only shown when isShopmate is false */}
      {!isShopmate && (
        <div className='flex gap-4 shadow-sm rounded-2xl p-4 pr-8 bg-white'>
          {/* <span className="md:text-lg size-8 font-semibold flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-300">
            C
          </span> */}
          <div className='flex flex-col gap-4 flex-1'>
            <h2 className='md:text-lg font-semibold'>Delivery Notes</h2>
            <hr />
            <Textarea
              placeholder='Add any special instructions for delivery (optional)'
              value={deliveryNote}
              onChange={handleDeliveryNoteChange}
              className='w-full'
              minRows={3}
              maxRows={5}
              variant='bordered'
            />
          </div>
        </div>
      )}

      <PickupStations
        open={pickupModalOpen}
        onOpenChange={setPickupModalOpen}
        onSelectStation={handleSelectPickupLocation}
      />

      <Button
        size='lg'
        isDisabled={!getCurrentOptionData().fulfilled}
        className='p-4 max-w-2xl w-full bg-[#FEA610] text-white font-semibold rounded-2xl mx-auto'
        onPress={handleSubmit}
      >
        Continue
      </Button>
    </section>
  )
}

export default DeliveryForm
