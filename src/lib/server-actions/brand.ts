'use server'

import { customFetch } from ".";
import { Brand, FetchResult } from "../types";

export const getBrands = async (
  query?: string
): Promise<FetchResult<Brand[] | null>> => {
  try {
    const res = await customFetch(
      `/product/brand${query ? `?name=${query}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await res.json();
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to fetch brands",
      data: null,
    };
  }
};

export const getBrandById = async (
  brandId: string
): Promise<FetchResult<Brand | null>> => {
  try {
    const res = await customFetch(`/product/brand/${brandId}`, {
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
      message: "Failed to fetch brand",
      data: null,
    };
  }
};