"use client";

import { getImageSrc } from "@/lib/server-actions";
import { getCategories } from "@/lib/server-actions/category";
import { getCartProducts } from "@/lib/server-actions/product";
import { getUser } from "@/lib/server-actions/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useRevalidateQuery = () => {
  const queryClient = useQueryClient();
  return (...keys: string[]) =>
    queryClient.invalidateQueries({ queryKey: [...keys] });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => (await getUser()).data,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60,
    retry: 3,
  });
};

export const useImage = ({
  fileName,
  folderName,
}: {
  fileName: string;
  folderName: string;
}) => {
  return useQuery({
    queryKey: [fileName, folderName, "image"],
    queryFn: async () => await getImageSrc({ fileName, folderName }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60,
    retry: 3,
    enabled: !!fileName && !!folderName,
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ["searchSuggestions", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const response = await api.get(`/search-endpoint?q=${query}`);
      return response.data;
    },
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60,
  });
};
export const useGetCategories = (query?: string) => {
  return useQuery({
    queryKey: ["categories", query],
    queryFn: async () => await getCategories(query),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60,
    retry: 3,
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => (await getCartProducts()).data,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60,
    retry: 3,
  });
};
