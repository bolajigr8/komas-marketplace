import { getProducts } from "@/lib/server-actions/product";
import { useEffect, useState } from "react";
import { useSearchSuggestions } from "./useSearchSuggestions";
import { Product } from "@/lib/types";

function useProductSearch(showSuggestions: boolean, query: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (!showSuggestions) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getProducts();
        if (isMounted) {
          setProducts(response?.data?.products || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [showSuggestions]);

  const suggestions = useSearchSuggestions({
    items: products,
    searchTerm: query,
    searchKeys: ["name"],
    limit: 10,
    transformResult: (product) => ({
      id: product._id,
      text: product.name,
      price: product.price,
    }),
  });

  return { suggestions, isLoading, error };
}