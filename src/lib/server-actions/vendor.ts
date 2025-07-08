'use server'

import { customFetch } from ".";
import { FetchResult, Vendor } from "../types";

export const getVendors = async (): Promise<FetchResult<Vendor[] | null>> => {
  try {
    const res = await customFetch("/vendor", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to fetch vendors",
      data: null,
    };
  }
};

export const getVendorById = async (
  vendorId: string
): Promise<FetchResult<Vendor | null>> => {
  try {
    const res = await customFetch(`/vendor/${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to fetch vendor",
      data: null,
    };
  }
};

export const getVendorsByCategory = async (categoryId: string): Promise<FetchResult<Vendor[] | null>> => {
  try {
    const res = await getVendors()

    return {
      ...res,
      data: res.data?.filter((vendor) =>
        vendor.productCategories?.some((category) =>
          typeof category === "string"
            ? category === categoryId
            : category._id === categoryId
        )
      ) || null,
    };
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to fetch vendors",
      data: null,
    }
  }
}

export const getVendorsByName = async ({ query, categoryId }: { query: string, categoryId?: string}): Promise<FetchResult<Vendor[] | null>> => {
  try {
    const res = categoryId ? await getVendorsByCategory(categoryId) : await getVendors()

    return {
      ...res,
      data: res.data?.filter((vendor) => vendor.name.toLowerCase().includes(query.toLowerCase())) || null,
    }
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to fetch vendors",
      data: null,
    }
  }
}