export interface CategoryFilters {
  sortBy: string;
  priceRange: string[];
  brands: string[];
  colors: string[];
  shipsFrom: string[];
  ratings: string[];
  features: string[];
  // Category-specific filters
  batteryProperties?: string[];
  powerMode?: string[];
  operatingVoltage?: string[];
  wireless?: boolean;
  material?: string[];
  rechargeable?: boolean;
  operatingSystem?: string[];
}

export const ELECTRONICS_FILTERS = {
  sortOptions: [
    { value: 'featured', label: 'Featured' },
    { value: 'topSales', label: 'Top Sales' },
    { value: 'mostRecent', label: 'Most Recent' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' }
  ],
  priceRanges: [
    { value: '0-50', label: 'Under ₦50' },
    { value: '50-200', label: 'From ₦50 to ₦200' },
    { value: '200-500', label: 'From ₦200 to ₦500' },
    { value: '500-1000', label: 'From ₦500 to ₦1000' },
    { value: '1000+', label: 'Above ₦1000' }
  ],
  ratings: ['5', '4 & up', '3 & up'],
  shipsFrom: ['United States', 'China', 'Japan', 'South Korea'],
  operatingSystems: ['Android', 'iOS', 'Windows', 'macOS', 'Linux'],
  batteryCapacity: ['2000-3000mAh', '3000-4000mAh', '4000-5000mAh', '5000mAh+'],
  features: [
    'Bluetooth',
    'WiFi',
    'NFC',
    '5G',
    'Wireless Charging',
    'Fast Charging',
    'Water Resistant'
  ]
} as const;