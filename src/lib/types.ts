export type Products = Product[]

export interface Item {
  id: number
  imageUrl: string
  name: string
  itemCount: number
}

export interface FetchResult<T> {
  statusCode: number
  message: string
  hasError: boolean
  data: T
}

export type CategoriesResponse = FetchResult<Category[]>

export type ProductsResponse = FetchResult<{
  page: number
  perPage: number
  totalProductCount: number
  products: Product[]
} | null>

export type RegisterResponse = FetchResult<null>

export type LoginResponse = FetchResult<{
  accessToken: string
  refreshToken: string
  roles: any[]
  userType: string
} | null>

export type VerifyUserResponse = FetchResult<{
  accessToken: string
  refreshToken: string
}>

export type User = {
  _id?: string
  profileUrl: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  gender: 'male' | 'female' | ''
  dateOfBirth: string
  address: string
  postCode: string
  state: string
  country: string
  geolocation?: {
    latitude: number
    longitude: number
  }
  userRoleType: string[]
  cart?: string[]
  orders?: string[]
  shopmateId?: string
}
export interface BaseData {
  _id: string
  name: string
  description: string
  image?: string[] | string | undefined
  createdAt: string
  updatedAt: string
  __v: number
}

// Variant interface - REMOVED variantId since you're only using _id
export interface ProductVariant {
  _id: string
  color: string
  size: string
  name?: string
  quantity: number
  price: string
  images: string[]
  // Removed variantId - only use _id for variant identification
}

// Updated Product interface with variants
export interface Product extends BaseData {
  price: number
  id?: string
  priceWithMarkup: number
  length: number
  breadth: number
  width: number
  quantity: number
  region: string
  isDeleted: boolean
  images: string[] | string
  category: Category | string
  brand: Brand | string
  vendor: Vendor | string
  isLive: boolean
  sku: string
  tags: string[]
  status: string
  rating?: number
  reviews?: number
  discount?: number
  salesCount?: number
  isApproved?: string
  // REMOVED selectedVariant - this should not be part of the base Product interface
  // since variants are handled separately in the cart structure
  variants?: ProductVariant[] // Variants array remains
}

export interface Category extends Omit<BaseData, 'image'> {
  imageUrl: string
}

export interface Brand extends BaseData {}

export interface Vendor extends BaseData {
  address: string
  noOfStaff: string
  email: string
  isDeleted: boolean
  logo: string
  products: string[] | Product[]
  productCategories: string[] | Category[]
}

// export interface CartItem extends Omit<BaseData, 'name' | 'description'> {
//   userId: string
//   product: Product
//   quantity: number
//   length: string
//   breadth: string
// }

// CORRECTED CartItem interface to match the actual cart structure from your API response
export interface CartItem {
  userId?: string
  _id?: string
  product: Product // Product without selectedVariant
  variant?: ProductVariant // ADDED: Separate variant object (matches your cart API structure)
  quantity: number
  length?: string
  breadth?: string
  createdAt?: string
  updatedAt?: string
}

export interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
}

// pickup stations

export type PickupStationAgent = {
  _id: string
  fullName: string
  emailAddress: string
  profileUrl: string
  address: string
  country: string
  postCode: string
  state: string
  gender: string
  phoneNumber: string
}

// Type for a single pickup station
export type PickupStation = {
  _id: string
  name: string
  city: string
  state: string
  address: string
  phoneNumber: string
  email: string
  region: string
  isDeleted: boolean
  geolocation: Geolocation
  pickupStationAgent: PickupStationAgent
  createdAt: string
  updatedAt: string
  __v: number
}

// Type for the response when fetching multiple pickup stations
export type PickupStationsResponse = FetchResult<PickupStation[] | null>

// for shopmate

export interface Geolocation {
  latitude: number
  longitude: number
}

export interface ShopmateAdmin {
  _id: string
  fullName: string
  emailAddress: string
  profileUrl: string
  address: string
  country: string
  postCode: string
  state: string
  gender: string
  phoneNumber: string
}

export interface Shopmate {
  geolocation: Geolocation
  _id: string
  shopId: string
  admin: ShopmateAdmin
  staff: any[]
  name: string
  description: string
  address: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type ShopmatesResponse = FetchResult<Shopmate[] | null>

// end of sopmate

// order
// Type for Order Tracking
export type OrderTracking = {
  shipped: boolean
  pending: boolean
  processing: boolean
  collected: boolean
  pickupCenter: boolean
  completed: boolean
  returned: boolean
}

// Type for Delivery Address
export type DeliveryAddress = {
  addressString: string
  geoLocation: [string, string]
  postCode: string
}

// Type for Buyer or Rider
export type BuyerOrRider = {
  _id: string
  fullName: string
  emailAddress: string
  profileUrl: string
  address: string
  country: string
  postCode: string
  state: string
  gender: string
  phoneNumber: string
}

// Type for Product in Order
export type OrderProduct = {
  productID: Product & {
    isApproved: boolean
    category: Category
    brand: Brand
    vendor: string
  }
  status: string
  vendorID: Vendor
  quantity: number
  price: number
  name?: string
  description?: string
  length: string
  breadth: string
  returned: boolean
  _id: string
}

// Type for Payment Reference
export type PaymentRef = Record<string, string>

// Type for Pickup Station in Order
export type OrderPickupStation = {
  _id: string
  name: string
  address: string
}

// Type for Order Data
export type OrderData = {
  tracking: OrderTracking
  deliveryAddress: DeliveryAddress
  _id: string
  buyer: BuyerOrRider
  rider?: BuyerOrRider // Optional in case the order does not have a rider yet
  products: OrderProduct[]
  status: string
  paymentRef: PaymentRef
  paymentMethod: string
  deliveryFee: number
  taxFee: number
  discountedPrice?: number
  totalAmount: number
  orderNotes?: string // Optional if no notes were added
  deliveryAddressType: string
  delivery_code: string
  deliveryPlace?: string // Optional in case it's not specified
  pickupStation?: OrderPickupStation // Optional if the order is not for pickup
  deliveryCode: string
  orderId: string
  createdAt: string
  updatedAt: string
  __v: number
  driverCode?: string // Optional if no driver code is assigned
  vendorCode?: string // Optional if no vendor code is assigned
  deliveryMethod?: ApiDeliveryMethod // Optional if no delivery method is specified
}

export type DeliveryType =
  | 'Home Delivery Express'
  | 'Home Delivery Batch'
  | 'Shopmate method'
  | 'Pickup Station'

export type DeliveryCategory = 'home' | 'pickup'
// Delivery Method
// export type DeliveryMethod = {
//   _id: string;
//   deliveryType: string;
//   fee: number;
//   driverEarning?: number;
//   pickupstationEarning?: number;
//   createdBy: string;
//   updatedBy?: string | null;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// };

export interface DeliveryMethod {
  id: string
  fee: number
  earnings: {
    driver: number
    pickupStation: number
  }
  type: DeliveryType
  category: DeliveryCategory
  pickupLocation?: {
    name: string
    address: string
    state?: string
    id: string
    geolocation: {
      latitude: number
      longitude: number
    }
  }
}

export interface OrderOwner {
  name: string
  email: string
  phoneNumber: string
}

export interface OrderDetails {
  owner: OrderOwner
  orderNote: string
}

export interface DeliveryDetails {
  deliveryAddress: {
    addressString: string
    postCode: string
  }
  deliveryMethod: DeliveryMethod
  orderDetails?: OrderDetails
}

export interface DeliveryOptionData {
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

export interface DeliveryFormData {
  selectedType: DeliveryType
  expressDelivery: DeliveryOptionData
  batchDelivery: DeliveryOptionData
  storePickup: DeliveryOptionData
  fulfillmentCenterPickup: DeliveryOptionData
}

export interface ApiDeliveryMethod {
  _id: string
  deliveryType: string
  fee: number
  driverEarning?: number
  pickupstationEarning?: number
  createdBy: string
  updatedBy?: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

// Type for Orders Response
export type OrdersResponse = FetchResult<OrderData | null>

export type DeliveryMethodResponse = FetchResult<ApiDeliveryMethod[] | null>

export interface ApiResponse<T> {
  statusCode: number
  message: string
  hasError: boolean
  data: T
}

// promo code
export interface ApiPromoCode {
  _id: string
  code: string
  discountType: string
  discountValue: number

  orderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usedCount?: number
  isActive: boolean
  expiresAt?: string
  createdBy: string
  updatedBy?: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

export type PromoCodeResponse = FetchResult<ApiPromoCode | null>
