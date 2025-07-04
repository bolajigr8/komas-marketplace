import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "query-string";
import { Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateDiscountPrice = (
  price: number,
  percentage: number
): number => {
  return (price * (100 - percentage)) / 100;
};

export const formatNumber = (number: number): string => {
  // format with commas
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function to check if all input values in a nested object are filled
export const areAllFieldsFilled = (values: any) => {
  for (const key in values) {
    if (typeof values[key] === "object" && values[key] !== null) {
      if (!areAllFieldsFilled(values[key])) {
        return false;
      }
    } else if (values[key]?.trim() === "") {
      return false;
    }
  }
  return true;
};

export const formatCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/\s/g, "").replace(/(.{4})/g, "$1 ");
};

export const hideCardNumber = (cardNumber: string): string => {
  const number = cardNumber.split(" ").join("");
  return `XXXX-${number.slice(-4)}`;
};

export const generateRandomId = (length: number = 10): string => {
  // Define the characters to choose from: letters and digits
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  // Generate a random string of the specified length
  Array.from({ length }).forEach((_) => {
    randomId += characters[Math.floor(Math.random() * characters.length)];
  });

  return randomId;
};

export const numberToOrdinal = (num: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const suffix = num % 100 >= 11 && num % 100 <= 13 ? "th" : suffixes[num % 10];

  const numberWords: { [key: number]: string } = {
    1: "Default",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
    8: "Eighth",
    9: "Ninth",
    10: "Tenth",
    11: "Eleventh",
    12: "Twelfth",
  };

  return numberWords[num] || `${num}${suffix}`;
};

export const formUrlQuery = ({
  params,
  keys,
  values,
}: {
  params: string;
  keys: string[];
  values: string[];
}) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key, index) => {
    currentUrl[key] = values[index];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: {
  params: string;
  keysToRemove: string[];
}) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const divideIntoArrays = <T>({
  data,
  itemsPerArray,
}: {
  data: T[];
  itemsPerArray: number;
}): T[][] => {
  // Initialize an empty array to store arrays
  const arrays = [];

  // Iterate through the data in batches of 'itemsPerArray'
  for (let i = 0; i < data.length; i += itemsPerArray) {
    // Push a slice of 'data' representing an array into the 'arrays' array
    arrays.push(data.slice(i, i + itemsPerArray));
  }

  // Return the array of arrays
  return arrays;
};

export const divideProductsByCategory = (
  products: Product[]
): { [key: string]: Product[] } => {
  const productsByCategories = products.reduce(
    (acc: { [key: string]: Product[] }, product) => {
      const categoryId =
        typeof product.category === "string"
          ? product.category
          : product.category._id;

      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }

      acc[categoryId].push(product);

      return acc;
    },
    {} as {}
  );

  return productsByCategories;
};


export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};