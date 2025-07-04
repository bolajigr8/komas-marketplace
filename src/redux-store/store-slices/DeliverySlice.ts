// 'use client'

// import { PayloadAction, createSlice } from '@reduxjs/toolkit'
// import { PURGE } from 'redux-persist'

// export type DeliveryAddress = {
//   id: string
//   firstName: string
//   lastName: string
//   emailAddress: string
//   phoneNumber: string
//   houseNumber: string
//   address: string
//   city: string
//   state: string
//   country: string
//   postCode: string
//   isDefault: boolean
// }

// export type DeliveryType =
//   | 'express'
//   | 'batch'
//   | 'storePickup'
//   | 'fulfillmentCenterPickup'
// export type DeliveryCategory = 'home' | 'pickup'

// export type DeliveryMethod = {
//   type: DeliveryType
//   category: DeliveryCategory
//   pickupLocation?: {
//     name: string
//     address: string
//     state?: string
//     postCode?: string
//     id: string
//     geolocation: {
//       latitude: number
//       longitude: number
//     }
//   }
// }

// export type OrderOwner = {
//   name: string
//   email: string
//   phoneNumber: string
// }

// export type OrderDetails = {
//   owner: OrderOwner
//   orderNote: string
// }

// export type DeliveryDetails = {
//   deliveryAddress: {
//     addressString: string
//     postCode: string
//   }
//   deliveryMethod: DeliveryMethod
//   orderDetails?: OrderDetails
// }

// export type DeliveryOptionData = {
//   deliveryAddress: string
//   state?: string
//   postCode: string
//   id?: string
//   geolocation?: {
//     latitude: number
//     longitude: number
//   }
//   fulfilled: boolean
// }

// export type DeliveryFormData = {
//   selectedType:
//     | 'Express delivery'
//     | 'Batch delivery'
//     | 'Store pick up'
//     | 'Fulfilment Center pick up'
//   expressDelivery: DeliveryOptionData
//   batchDelivery: DeliveryOptionData
//   storePickup: DeliveryOptionData
//   fulfillmentCenterPickup: DeliveryOptionData
// }

// type InitialState = {
//   addressList: DeliveryAddress[]
//   selectedAddressId: string | null
//   deliveryDetails: DeliveryDetails | null
//   formData: DeliveryFormData
// }

// const defaultFormData: DeliveryFormData = {
//   selectedType: 'Express delivery',
//   expressDelivery: { deliveryAddress: '', fulfilled: false, postCode: '' },
//   batchDelivery: { deliveryAddress: '', fulfilled: false, postCode: '' },
//   storePickup: {
//     deliveryAddress: '',
//     fulfilled: false,
//     postCode: '',
//     id: '',
//     geolocation: { latitude: 0, longitude: 0 },
//   },
//   fulfillmentCenterPickup: {
//     deliveryAddress: '',
//     fulfilled: false,
//     postCode: '',
//     id: '',
//     geolocation: { latitude: 0, longitude: 0 },
//   },
// }

// const defaultOrderDetails: OrderDetails = {
//   owner: {
//     name: '',
//     email: '',
//     phoneNumber: '',
//   },
//   orderNote: '',
// }

// const initialState: InitialState = {
//   addressList: [],
//   selectedAddressId: null,
//   deliveryDetails: null,
//   formData: defaultFormData,
// }

// const sortAddresses = (addresses: DeliveryAddress[]): DeliveryAddress[] => {
//   return [...addresses].sort(
//     (a, b) => Number(b.isDefault) - Number(a.isDefault)
//   )
// }

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

// // Get delivery category from type
// const getDeliveryCategory = (type: DeliveryType): 'home' | 'pickup' => {
//   return type === 'express' || type === 'batch' ? 'home' : 'pickup'
// }

// const deliverySlice = createSlice({
//   name: 'delivery',
//   initialState,
//   reducers: {
//     setDeliveryAddressList: (
//       state,
//       action: PayloadAction<DeliveryAddress[]>
//     ) => {
//       state.addressList = action.payload
//       const defaultAddress = action.payload.find((addr) => addr.isDefault)
//       if (defaultAddress) {
//         state.selectedAddressId = defaultAddress.id
//       } else if (action.payload.length > 0) {
//         state.selectedAddressId = action.payload[0].id
//       }
//     },
//     addDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
//       const addressExists = state.addressList.some(
//         (addr) =>
//           addr.houseNumber === action.payload.houseNumber &&
//           addr.address === action.payload.address &&
//           addr.city === action.payload.city &&
//           addr.state === action.payload.state &&
//           addr.postCode === action.payload.postCode
//       )

//       if (!addressExists) {
//         if (action.payload.isDefault) {
//           state.addressList = state.addressList.map((addr) => ({
//             ...addr,
//             isDefault: false,
//           }))
//           state.selectedAddressId = action.payload.id
//         } else if (state.addressList.length === 0) {
//           action.payload.isDefault = true
//           state.selectedAddressId = action.payload.id
//         }
//         state.addressList.push(action.payload)
//       }
//     },
//     editDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
//       if (action.payload.isDefault) {
//         state.addressList = state.addressList.map((addr) => ({
//           ...addr,
//           isDefault: addr.id === action.payload.id,
//         }))
//         state.selectedAddressId = action.payload.id
//       }
//       state.addressList = state.addressList.map((addr) =>
//         addr.id === action.payload.id ? action.payload : addr
//       )
//     },
//     removeDeliveryAddress: (state, action: PayloadAction<string>) => {
//       const addressToRemove = state.addressList.find(
//         (addr) => addr.id === action.payload
//       )
//       state.addressList = state.addressList.filter(
//         (addr) => addr.id !== action.payload
//       )

//       if (addressToRemove?.isDefault && state.addressList.length > 0) {
//         state.addressList[0].isDefault = true
//         state.selectedAddressId = state.addressList[0].id
//       }

//       if (state.selectedAddressId === action.payload) {
//         const newDefault = state.addressList.find((addr) => addr.isDefault)
//         state.selectedAddressId =
//           newDefault?.id ||
//           (state.addressList.length > 0 ? state.addressList[0].id : null)
//       }
//     },
//     setSelectedAddress: (state, action: PayloadAction<string>) => {
//       state.selectedAddressId = action.payload

//       // Update delivery details if delivery method is home delivery
//       if (
//         state.deliveryDetails &&
//         state.deliveryDetails.deliveryMethod.category === 'home' &&
//         state.selectedAddressId
//       ) {
//         const selectedAddress = state.addressList.find(
//           (addr) => addr.id === state.selectedAddressId
//         )
//         if (selectedAddress) {
//           const addressString = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
//           state.deliveryDetails.deliveryAddress = {
//             addressString,
//             postCode: selectedAddress.postCode,
//           }

//           // Also update the form data
//           if (selectedAddress) {
//             const fullAddress = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`

//             // Update both home delivery options with the selected address
//             state.formData.expressDelivery = {
//               deliveryAddress: fullAddress,
//               fulfilled: true,
//               postCode: selectedAddress.postCode,
//               state: selectedAddress.state,
//             }

//             state.formData.batchDelivery = {
//               deliveryAddress: fullAddress,
//               fulfilled: true,
//               postCode: selectedAddress.postCode,
//               state: selectedAddress.state,
//             }
//           }
//         }
//       }
//     },
//     setDefaultAddress: (state, action: PayloadAction<string>) => {
//       state.addressList = sortAddresses(
//         state.addressList.map((addr) => ({
//           ...addr,
//           isDefault: addr.id === action.payload,
//         }))
//       )
//       state.selectedAddressId = action.payload
//     },

//     // In your DeliverySlice.ts, replace the setDeliveryMethod reducer with this fixed version:

//     // In your DeliverySlice.ts, replace the setDeliveryMethod reducer with this fixed version:

//     setDeliveryMethod: (state, action: PayloadAction<DeliveryMethod>) => {
//       const deliveryMethod = action.payload
//       let addressString = ''
//       let postCode = ''

//       // Set address details based on delivery method
//       if (deliveryMethod.category === 'home' && state.selectedAddressId) {
//         const selectedAddress = state.addressList.find(
//           (addr) => addr.id === state.selectedAddressId
//         )
//         if (selectedAddress) {
//           addressString = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
//           postCode = selectedAddress.postCode
//         }
//       } else if (
//         deliveryMethod.category === 'pickup' &&
//         deliveryMethod.pickupLocation
//       ) {
//         addressString = `${deliveryMethod.pickupLocation.name}, ${deliveryMethod.pickupLocation.address}`
//         postCode = deliveryMethod.pickupLocation.postCode || ''

//         console.log('🏪 Setting pickup delivery method:', {
//           addressString,
//           postCode,
//           pickupLocation: deliveryMethod.pickupLocation,
//         })
//       }

//       // Preserve existing orderDetails if present
//       const existingOrderDetails = state.deliveryDetails?.orderDetails

//       state.deliveryDetails = {
//         deliveryAddress: {
//           addressString,
//           postCode,
//         },
//         deliveryMethod,
//         orderDetails: existingOrderDetails || defaultOrderDetails,
//       }

//       console.log('Final deliveryDetails:', state.deliveryDetails)
//     },

//     // New action for setting order details
//     setOrderDetails: (state, action: PayloadAction<OrderDetails>) => {
//       if (state.deliveryDetails) {
//         state.deliveryDetails.orderDetails = action.payload
//       } else {
//         // Create new deliveryDetails with default values if it doesn't exist
//         state.deliveryDetails = {
//           deliveryAddress: {
//             addressString: '',
//             postCode: '',
//           },
//           deliveryMethod: {
//             type: 'express',
//             category: 'home',
//           },
//           orderDetails: action.payload,
//         }
//       }
//     },
//     // Update just the order note
//     updateOrderNote: (state, action: PayloadAction<string>) => {
//       if (state.deliveryDetails?.orderDetails) {
//         state.deliveryDetails.orderDetails.orderNote = action.payload
//       } else if (state.deliveryDetails) {
//         state.deliveryDetails.orderDetails = {
//           ...defaultOrderDetails,
//           orderNote: action.payload,
//         }
//       }
//     },
//     // Update just the order owner details
//     updateOrderOwner: (state, action: PayloadAction<OrderOwner>) => {
//       if (state.deliveryDetails?.orderDetails) {
//         state.deliveryDetails.orderDetails.owner = action.payload
//       } else if (state.deliveryDetails) {
//         state.deliveryDetails.orderDetails = {
//           owner: action.payload,
//           orderNote: '',
//         }
//       }
//     },
//     updatePickupLocation: (
//       state,
//       action: PayloadAction<{
//         name: string
//         address: string
//         state?: string
//         id: string
//         geolocation: { latitude: number; longitude: number }
//       }>
//     ) => {
//       if (
//         state.deliveryDetails &&
//         state.deliveryDetails.deliveryMethod.category === 'pickup'
//       ) {
//         state.deliveryDetails.deliveryMethod.pickupLocation = action.payload
//         state.deliveryDetails.deliveryAddress.addressString = `${action.payload.name}, ${action.payload.address}`
//       }
//     },

//     // Form data specific reducers
//     setFormData: (state, action: PayloadAction<DeliveryFormData>) => {
//       state.formData = action.payload
//     },
//     updateFormSelectedType: (
//       state,
//       action: PayloadAction<DeliveryFormData['selectedType']>
//     ) => {
//       state.formData.selectedType = action.payload
//     },

//     updateFormDeliveryOption: (
//       state,
//       action: PayloadAction<{
//         optionKey: keyof Omit<DeliveryFormData, 'selectedType'>
//         data: DeliveryOptionData
//       }>
//     ) => {
//       if (!state.formData) {
//         state.formData = { ...defaultFormData }
//       }

//       const { optionKey, data } = action.payload
//       state.formData[optionKey] = data

//       // If this is a pickup option, update the delivery method too
//       if (
//         optionKey === 'storePickup' ||
//         optionKey === 'fulfillmentCenterPickup'
//       ) {
//         const storeType = mapDeliveryType(
//           optionKey === 'storePickup'
//             ? 'Store pick up'
//             : 'Fulfilment Center pick up'
//         )
//         const category = getDeliveryCategory(storeType)

//         // Parse the address to get name and address separately
//         const addressParts = data.deliveryAddress.split(', ')
//         const name = addressParts[0]
//         const address = addressParts.slice(1).join(', ')

//         const deliveryMethod: DeliveryMethod = {
//           type: storeType,
//           category: category,
//           pickupLocation: {
//             name: name,
//             address: address,
//             state: data.state,
//             postCode: data.postCode || '', // ← Ensure postCode is always set
//             id: data.id || '', // ← Ensure id is always set
//             geolocation: {
//               latitude: data.geolocation?.latitude ?? 0,
//               longitude: data.geolocation?.longitude ?? 0,
//             },
//           },
//         }

//         console.log('🚚 Created deliveryMethod with postCode:', {
//           postCode: data.postCode,
//           pickupLocation: deliveryMethod.pickupLocation,
//         })

//         // Update both the delivery method and delivery details
//         if (data.fulfilled) {
//           // Preserve existing orderDetails if present
//           const existingOrderDetails = state.deliveryDetails?.orderDetails

//           console.log('🔧 Updating deliveryDetails with:', {
//             addressString: data.deliveryAddress,
//             postCode: data.postCode,
//             deliveryMethod,
//           })

//           state.deliveryDetails = {
//             deliveryAddress: {
//               addressString: data.deliveryAddress,
//               postCode: data.postCode || '', // ← Ensure postCode is properly set
//             },
//             deliveryMethod,
//             orderDetails: existingOrderDetails || defaultOrderDetails,
//           }

//           console.log('✅ Updated deliveryDetails:', state.deliveryDetails)
//         }
//       }
//     },

//     clearDeliveryDetails: (state) => {
//       state.deliveryDetails = null
//     },
//     clearFormData: (state) => {
//       state.formData = defaultFormData
//     },
//     clearAddressList: (state) => {
//       state.addressList = []
//       state.selectedAddressId = null
//     },
//     // Clear only order details
//     clearOrderDetails: (state) => {
//       if (state.deliveryDetails) {
//         state.deliveryDetails.orderDetails = defaultOrderDetails
//       }
//     },
//   },
//   // Handle Redux Persist purge action
//   extraReducers: (builder) => {
//     builder.addCase(PURGE, () => initialState)
//   },
// })

// export const deliveryActions = deliverySlice.actions
// export default deliverySlice.reducer

'use client'

import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

export type DeliveryAddress = {
  id: string
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  houseNumber: string
  address: string
  city: string
  state: string
  country: string
  postCode: string
  isDefault: boolean
}

export type DeliveryType =
  | 'express'
  | 'batch'
  | 'storePickup'
  | 'fulfillmentCenterPickup'
export type DeliveryCategory = 'home' | 'pickup'

export type DeliveryMethod = {
  type: DeliveryType
  category: DeliveryCategory
  pickupLocation?: {
    name: string
    address: string
    state?: string
    postCode: string
    id: string
    geolocation: {
      latitude: number
      longitude: number
    }
  }
}

export type OrderOwner = {
  name: string
  email: string
  phoneNumber: string
}

export type OrderDetails = {
  owner: OrderOwner
  orderNote: string
}

export type DeliveryDetails = {
  deliveryAddress: {
    addressString: string
    postCode: string
  }
  deliveryMethod: DeliveryMethod
  orderDetails?: OrderDetails
}

export type DeliveryOptionData = {
  deliveryAddress: string
  state?: string
  postCode: string
  id?: string
  geolocation?: {
    latitude: number
    longitude: number
  }
  fulfilled: boolean
}

export type DeliveryFormData = {
  selectedType:
    | 'Express delivery'
    | 'Batch delivery'
    | 'Store pick up'
    | 'Fulfilment Center pick up'
  expressDelivery: DeliveryOptionData
  batchDelivery: DeliveryOptionData
  storePickup: DeliveryOptionData
  fulfillmentCenterPickup: DeliveryOptionData
}

type InitialState = {
  addressList: DeliveryAddress[]
  selectedAddressId: string | null
  deliveryDetails: DeliveryDetails | null
  formData: DeliveryFormData
}

const defaultFormData: DeliveryFormData = {
  selectedType: 'Express delivery',
  expressDelivery: { deliveryAddress: '', fulfilled: false, postCode: '' },
  batchDelivery: { deliveryAddress: '', fulfilled: false, postCode: '' },
  storePickup: {
    deliveryAddress: '',
    fulfilled: false,
    postCode: '',
    id: '',
    geolocation: { latitude: 0, longitude: 0 },
  },
  fulfillmentCenterPickup: {
    deliveryAddress: '',
    fulfilled: false,
    postCode: '',
    id: '',
    geolocation: { latitude: 0, longitude: 0 },
  },
}

const defaultOrderDetails: OrderDetails = {
  owner: {
    name: '',
    email: '',
    phoneNumber: '',
  },
  orderNote: '',
}

const initialState: InitialState = {
  addressList: [],
  selectedAddressId: null,
  deliveryDetails: null,
  formData: defaultFormData,
}

const sortAddresses = (addresses: DeliveryAddress[]): DeliveryAddress[] => {
  return [...addresses].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault)
  )
}

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

// Get delivery category from type
const getDeliveryCategory = (type: DeliveryType): 'home' | 'pickup' => {
  return type === 'express' || type === 'batch' ? 'home' : 'pickup'
}

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliveryAddressList: (
      state,
      action: PayloadAction<DeliveryAddress[]>
    ) => {
      state.addressList = action.payload
      const defaultAddress = action.payload.find((addr) => addr.isDefault)
      if (defaultAddress) {
        state.selectedAddressId = defaultAddress.id
      } else if (action.payload.length > 0) {
        state.selectedAddressId = action.payload[0].id
      }
    },
    addDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      const addressExists = state.addressList.some(
        (addr) =>
          addr.houseNumber === action.payload.houseNumber &&
          addr.address === action.payload.address &&
          addr.city === action.payload.city &&
          addr.state === action.payload.state &&
          addr.postCode === action.payload.postCode
      )

      if (!addressExists) {
        if (action.payload.isDefault) {
          state.addressList = state.addressList.map((addr) => ({
            ...addr,
            isDefault: false,
          }))
          state.selectedAddressId = action.payload.id
        } else if (state.addressList.length === 0) {
          action.payload.isDefault = true
          state.selectedAddressId = action.payload.id
        }
        state.addressList.push(action.payload)
      }
    },
    editDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      if (action.payload.isDefault) {
        state.addressList = state.addressList.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload.id,
        }))
        state.selectedAddressId = action.payload.id
      }
      state.addressList = state.addressList.map((addr) =>
        addr.id === action.payload.id ? action.payload : addr
      )
    },
    removeDeliveryAddress: (state, action: PayloadAction<string>) => {
      const addressToRemove = state.addressList.find(
        (addr) => addr.id === action.payload
      )
      state.addressList = state.addressList.filter(
        (addr) => addr.id !== action.payload
      )

      if (addressToRemove?.isDefault && state.addressList.length > 0) {
        state.addressList[0].isDefault = true
        state.selectedAddressId = state.addressList[0].id
      }

      if (state.selectedAddressId === action.payload) {
        const newDefault = state.addressList.find((addr) => addr.isDefault)
        state.selectedAddressId =
          newDefault?.id ||
          (state.addressList.length > 0 ? state.addressList[0].id : null)
      }
    },
    setSelectedAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload

      // Update delivery details if delivery method is home delivery
      if (
        state.deliveryDetails &&
        state.deliveryDetails.deliveryMethod.category === 'home' &&
        state.selectedAddressId
      ) {
        const selectedAddress = state.addressList.find(
          (addr) => addr.id === state.selectedAddressId
        )
        if (selectedAddress) {
          const addressString = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
          state.deliveryDetails.deliveryAddress = {
            addressString,
            postCode: selectedAddress.postCode,
          }

          // Also update the form data
          if (selectedAddress) {
            const fullAddress = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`

            // Update both home delivery options with the selected address
            state.formData.expressDelivery = {
              deliveryAddress: fullAddress,
              fulfilled: true,
              postCode: selectedAddress.postCode,
              state: selectedAddress.state,
            }

            state.formData.batchDelivery = {
              deliveryAddress: fullAddress,
              fulfilled: true,
              postCode: selectedAddress.postCode,
              state: selectedAddress.state,
            }
          }
        }
      }
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.addressList = sortAddresses(
        state.addressList.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload,
        }))
      )
      state.selectedAddressId = action.payload
    },

    // FIXED: Enhanced setDeliveryMethod reducer
    setDeliveryMethod: (state, action: PayloadAction<DeliveryMethod>) => {
      const deliveryMethod = action.payload
      let addressString = ''
      let postCode = ''

      console.log('setDeliveryMethod called with:', deliveryMethod)

      // Set address details based on delivery method
      if (deliveryMethod.category === 'home' && state.selectedAddressId) {
        const selectedAddress = state.addressList.find(
          (addr) => addr.id === state.selectedAddressId
        )
        if (selectedAddress) {
          addressString = `${selectedAddress.houseNumber} ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
          postCode = selectedAddress.postCode
        }
      } else if (
        deliveryMethod.category === 'pickup' &&
        deliveryMethod.pickupLocation
      ) {
        addressString = `${deliveryMethod.pickupLocation.name}, ${deliveryMethod.pickupLocation.address}`
        postCode = deliveryMethod.pickupLocation.postCode || ''

        console.log('Setting pickup delivery method:', {
          addressString,
          postCode: deliveryMethod.pickupLocation.postCode,
          fullPickupLocation: deliveryMethod.pickupLocation,
        })
      }

      // Preserve existing orderDetails if present
      const existingOrderDetails = state.deliveryDetails?.orderDetails

      state.deliveryDetails = {
        deliveryAddress: {
          addressString,
          postCode,
        },
        deliveryMethod,
        orderDetails: existingOrderDetails || defaultOrderDetails,
      }

      console.log(
        'Final deliveryDetails after setDeliveryMethod:',
        state.deliveryDetails
      )
    },

    // New action for setting order details
    setOrderDetails: (state, action: PayloadAction<OrderDetails>) => {
      if (state.deliveryDetails) {
        state.deliveryDetails.orderDetails = action.payload
      } else {
        // Create new deliveryDetails with default values if it doesn't exist
        state.deliveryDetails = {
          deliveryAddress: {
            addressString: '',
            postCode: '',
          },
          deliveryMethod: {
            type: 'express',
            category: 'home',
          },
          orderDetails: action.payload,
        }
      }
    },
    // Update just the order note
    updateOrderNote: (state, action: PayloadAction<string>) => {
      if (state.deliveryDetails?.orderDetails) {
        state.deliveryDetails.orderDetails.orderNote = action.payload
      } else if (state.deliveryDetails) {
        state.deliveryDetails.orderDetails = {
          ...defaultOrderDetails,
          orderNote: action.payload,
        }
      }
    },
    // Update just the order owner details
    updateOrderOwner: (state, action: PayloadAction<OrderOwner>) => {
      if (state.deliveryDetails?.orderDetails) {
        state.deliveryDetails.orderDetails.owner = action.payload
      } else if (state.deliveryDetails) {
        state.deliveryDetails.orderDetails = {
          owner: action.payload,
          orderNote: '',
        }
      }
    },
    updatePickupLocation: (
      state,
      action: PayloadAction<{
        name: string
        address: string
        state?: string
        postCode?: string
        id: string
        geolocation: { latitude: number; longitude: number }
      }>
    ) => {
      console.log('updatePickupLocation called with:', action.payload)
      if (
        state.deliveryDetails &&
        state.deliveryDetails.deliveryMethod.category === 'pickup'
      ) {
        // Update the pickup location
        state.deliveryDetails.deliveryMethod.pickupLocation = {
          ...action.payload,
          postCode: action.payload.postCode || '',
        }

        // Update the delivery address
        state.deliveryDetails.deliveryAddress.addressString = `${action.payload.name}, ${action.payload.address}`
        state.deliveryDetails.deliveryAddress.postCode =
          action.payload.postCode || ''

        console.log('🔄 Updated pickup location:', {
          pickupLocation: action.payload,
          updatedDeliveryAddress: state.deliveryDetails.deliveryAddress,
        })
      }
    },

    // Form data specific reducers
    setFormData: (state, action: PayloadAction<DeliveryFormData>) => {
      state.formData = action.payload
    },
    updateFormSelectedType: (
      state,
      action: PayloadAction<DeliveryFormData['selectedType']>
    ) => {
      state.formData.selectedType = action.payload
    },

    // FIXED: Enhanced updateFormDeliveryOption reducer
    updateFormDeliveryOption: (
      state,
      action: PayloadAction<{
        optionKey: keyof Omit<DeliveryFormData, 'selectedType'>
        data: DeliveryOptionData
      }>
    ) => {
      if (!state.formData) {
        state.formData = { ...defaultFormData }
      }

      const { optionKey, data } = action.payload

      console.log('updateFormDeliveryOption called:', { optionKey, data })

      state.formData[optionKey] = data

      // If this is a pickup option, update the delivery method too
      if (
        optionKey === 'storePickup' ||
        optionKey === 'fulfillmentCenterPickup'
      ) {
        const storeType = mapDeliveryType(
          optionKey === 'storePickup'
            ? 'Store pick up'
            : 'Fulfilment Center pick up'
        )
        const category = getDeliveryCategory(storeType)

        // Parse the address to get name and address separately
        const addressParts = data.deliveryAddress.split(', ')
        const name = addressParts[0]
        const address = addressParts.slice(1).join(', ')

        const deliveryMethod: DeliveryMethod = {
          type: storeType,
          category: category,
          pickupLocation: {
            name: name,
            address: address,
            state: data.state,
            postCode: data.postCode, // ← Make sure this is passed correctly
            id: data.id || '',
            geolocation: {
              latitude: data.geolocation?.latitude ?? 0,
              longitude: data.geolocation?.longitude ?? 0,
            },
          },
        }

        console.log('Created deliveryMethod in updateFormDeliveryOption:', {
          postCode: data.postCode,
          deliveryMethod,
        })

        // Update both the delivery method and delivery details
        if (data.fulfilled) {
          // Use the setDeliveryMethod logic
          const existingOrderDetails = state.deliveryDetails?.orderDetails

          state.deliveryDetails = {
            deliveryAddress: {
              addressString: data.deliveryAddress,
              postCode: data.postCode, // ← Ensure this is set correctly
            },
            deliveryMethod,
            orderDetails: existingOrderDetails || defaultOrderDetails,
          }

          console.log(
            'Updated deliveryDetails in updateFormDeliveryOption:',
            state.deliveryDetails
          )
        }
      }
    },

    clearDeliveryDetails: (state) => {
      state.deliveryDetails = null
    },
    clearFormData: (state) => {
      state.formData = defaultFormData
    },
    clearAddressList: (state) => {
      state.addressList = []
      state.selectedAddressId = null
    },
    // Clear only order details
    clearOrderDetails: (state) => {
      if (state.deliveryDetails) {
        state.deliveryDetails.orderDetails = defaultOrderDetails
      }
    },
  },
  // Handle Redux Persist purge action
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState)
  },
})

export const deliveryActions = deliverySlice.actions
export default deliverySlice.reducer
