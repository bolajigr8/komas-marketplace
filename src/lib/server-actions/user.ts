'use server'

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from ".";
import { FetchResult, User } from "../types";

export const getUser = async (): Promise<FetchResult<User | null>> => {
  try {
    const res = await fetchWithAuth("/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    return await res.json();
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to fetch user",
      data: null,
    };
  }
};

export const updateUser = async (
  data: Partial<User>
): Promise<FetchResult<User | null>> => {
  try {
    const res = await fetchWithAuth("/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to update user",
      data: null,
    };
  }
};


export const searchUser = async (email: string): Promise<FetchResult<User | null>> => {
  try {
    const res = await fetchWithAuth(`/user/search?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    return await res.json();
  } catch (error: any) {
    return {
      statusCode: error.code,
      hasError: true,
      message: "Failed to fetch user",
      data: null,
    };
  }
};