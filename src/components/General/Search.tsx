// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { RiSearchLine } from "react-icons/ri";
// import { Spinner } from "@nextui-org/spinner";
// import qs from "query-string";
// import { Products } from "@/lib/types";
// import { getProducts, getProductsByVendor } from "@/lib/server-actions/product";
// import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
// import { getCategories } from "@/lib/server-actions/category";
// import { getVendors } from "@/lib/server-actions/vendor";

// type PropsType = {
//   classNames?: {
//     wrapper?: string;
//     input?: string;
//     button?: string;
//   };
//   searchFor: "product" | "store" | "vendorProduct";
//   addFilter?: boolean;
//   q?: string;
//   placeholder: string;
//   // category?: string;
// };

// function useProductSearch(
//   showSuggestions: boolean,
//   query: string,
//   searchFor: "product" | "store" | "vendorProduct",
//   id: string
// ) {
//   const [products, setProducts] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchProducts = async () => {
//       if (!showSuggestions) return;

//       setIsLoading(true);
//       setError(null);
//       try {
//         const [response] =
//           searchFor === "vendorProduct"
//             ? await Promise.all([getProductsByVendor(id)])
//             : await Promise.all([getProducts()]);
//         if (isMounted) {
//           const normalizedProducts = Array.isArray(response?.data)
//             ? response?.data
//             : response?.data?.products ?? [];
//           setProducts(normalizedProducts);
//           // setProducts(
//           //   searchFor === "vendorProduct"
//           //     ? response?.data ?? []
//           //     : response?.data?.products ?? []
//           // );
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err as Error);
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchProducts();
//     // console.log("dd", products);
//     return () => {
//       isMounted = false;
//     };
//   }, [showSuggestions]);

//   const suggestions = useSearchSuggestions({
//     items: products,
//     searchTerm: query,
//     searchKeys: ["name"],
//     limit: 10,
//     transformResult: (product) => ({
//       id: product._id,
//       text: product.name,
//       price: product.price,
//     }),
//   });

//   return { suggestions, isLoading, error };
// }

// function useStoreSearch(showSuggestions: boolean, query: string) {
//   const [stores, setStores] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchCategories = async () => {
//       if (!showSuggestions) return;

//       setIsLoading(true);
//       setError(null);

//       try {
//         const [response] = await Promise.all([getVendors()]);

//         if (isMounted) {
//           setStores(response?.data || []);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err as Error);
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchCategories();
//     return () => {
//       isMounted = false;
//     };
//   }, [showSuggestions]);
//   const suggestions = useSearchSuggestions({
//     items: stores,
//     searchTerm: query,
//     searchKeys: ["name"],
//     limit: 10,
//     transformResult: (store) => ({
//       id: store._id,
//       text: store.name,
//       description: store.description,
//     }),
//   });

//   return { suggestions, isLoading, error };
// }

// const Search = ({ classNames, searchFor, q, placeholder }: PropsType) => {
//   const pathname = usePathname().split("/")[2];
//   // console.log(pathname.split("/")[]);
//   // const route = useRouter();
//   // const { id } = route.query;
//   const [query, setQuery] = useState(q || "");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const suggestionsRef = useRef<HTMLDivElement>(null);
//   // console.log("qq", query);
//   const { suggestions, isLoading, error } =
//     searchFor === "store"
//       ? useStoreSearch(showSuggestions, query)
//       : useProductSearch(showSuggestions, query, searchFor, pathname);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         suggestionsRef.current &&
//         !suggestionsRef.current.contains(event.target as Node)
//       ) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => setQuery(q || ""), [q]);

//   const handleSearch = (searchQuery: string = query) => {
//     if (!searchQuery.trim()) return;
//     setShowSuggestions(false);
//     searchFor === "store"
//       ? router.push(`/store/${encodeURIComponent(searchQuery)}`)
//       : router.push(`/?query=${encodeURIComponent(searchQuery)}`);
//   };

//   return (
//     <div className={`relative ${classNames?.wrapper}`}>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           searchFor === "store"
//             ? handleSearch(suggestions[0].id)
//             : handleSearch();
//         }}
//         className="flex"
//       >
//         <div className="relative flex-1">
//           <input
//             type="search"
//             id="product-search"
//             className={`block p-4 w-full text-md outline-none border-0 rounded-l-lg ${classNames?.input}`}
//             placeholder={placeholder}
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               setShowSuggestions(true);
//             }}
//             onFocus={() => setShowSuggestions(true)}
//             aria-label={`Search for ${searchFor}`}
//             autoComplete="off"
//           />

//           {isLoading && (
//             <div className="absolute right-4 top-1/2 -translate-y-1/2">
//               <Spinner size="sm" />
//             </div>
//           )}
//         </div>

//         <button
//           type="submit"
//           className={`flex justify-center items-center text-white rounded-r-lg px-6 space-x-2 bg-primary-300 hover:bg-primary-600 transition-colors ${classNames?.button}`}
//           aria-label="Search"
//         >
//           <RiSearchLine size={24} />
//           <span className="hidden md:inline">Search</span>
//         </button>
//       </form>

//       {error && (
//         <div className="absolute w-full mt-1 p-2 bg-red-50 text-red-600 rounded-lg border border-red-200">
//           Error loading suggestions. Please try again.
//         </div>
//       )}

//       {showSuggestions && suggestions && suggestions.length > 0 && (
//         <div
//           ref={suggestionsRef}
//           className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[300px] overflow-y-auto"
//         >
//           {suggestions.map((suggestion) => (
//             <button
//               key={suggestion.id}
//               className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between gap-2"
//               onClick={() =>
//                 searchFor === "store"
//                   ? handleSearch(suggestion.id)
//                   : handleSearch(suggestion.text)
//               }
//             >
//               <div className="flex items-center gap-2">
//                 <RiSearchLine className="text-gray-400" />
//                 <span>{suggestion.text}</span>
//               </div>
//               {searchFor === "product" && suggestion.price && (
//                 <span className="text-gray-500">
//                   ₦{suggestion.price.toLocaleString()}
//                 </span>
//               )}
//               {searchFor === "store" && suggestion.description && (
//                 <span className="text-gray-500 text-sm truncate max-w-[200px]">
//                   {suggestion.description}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       )}

//       {showSuggestions &&
//         !isLoading &&
//         !error &&
//         suggestions &&
//         suggestions.length === 0 &&
//         query.length >= 2 && (
//           <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-gray-500">
//             {searchFor === "store" ? "No store found" : "No products found"}
//           </div>
//         )}
//     </div>
//   );
// };

// export default Search;

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { RiSearchLine } from "react-icons/ri";
import { Spinner } from "@nextui-org/spinner";
import qs from "query-string";
import { Products } from "@/lib/types";
import { getProducts, getProductsByVendor } from "@/lib/server-actions/product";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { getCategories } from "@/lib/server-actions/category";
import { getVendors } from "@/lib/server-actions/vendor";

type PropsType = {
  classNames?: {
    wrapper?: string;
    input?: string;
    button?: string;
  };
  searchFor: "product" | "store" | "vendorProduct";
  addFilter?: boolean;
  q?: string;
  placeholder: string;
  // category?: string;
};

function useProductSearch(
  showSuggestions: boolean,
  query: string,
  searchFor: "product" | "store" | "vendorProduct",
  id: string
) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (!showSuggestions) return;

      setIsLoading(true);
      setError(null);
      try {
        const [response] =
          searchFor === "vendorProduct"
            ? await Promise.all([getProductsByVendor(id)])
            : await Promise.all([getProducts()]);
        if (isMounted) {
          const normalizedProducts = Array.isArray(response?.data)
            ? response?.data
            : response?.data?.products ?? [];
          setProducts(normalizedProducts);
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

function useStoreSearch(showSuggestions: boolean, query: string) {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      if (!showSuggestions) return;

      setIsLoading(true);
      setError(null);

      try {
        const [response] = await Promise.all([getVendors()]);

        if (isMounted) {
          setStores(response?.data || []);
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

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [showSuggestions]);
  const suggestions = useSearchSuggestions({
    items: stores,
    searchTerm: query,
    searchKeys: ["name"],
    limit: 10,
    transformResult: (store) => ({
      id: store._id,
      text: store.name,
      description: store.description,
    }),
  });

  return { suggestions, isLoading, error };
}

const Search = ({ classNames, searchFor, q, placeholder }: PropsType) => {
  const pathname = usePathname().split("/")[2];
  const [query, setQuery] = useState(q || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Always call both hooks, but only use the results from the one we need
  const productSearchResult = useProductSearch(
    showSuggestions,
    query,
    searchFor,
    pathname
  );
  const storeSearchResult = useStoreSearch(showSuggestions, query);

  // Select which results to use based on searchFor
  const { suggestions, isLoading, error } =
    searchFor === "store" ? storeSearchResult : productSearchResult;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => setQuery(q || ""), [q]);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    searchFor === "store"
      ? router.push(`/store/${encodeURIComponent(searchQuery)}`)
      : router.push(`/?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className={`relative ${classNames?.wrapper}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchFor === "store"
            ? handleSearch(suggestions[0]?.id)
            : handleSearch();
        }}
        className="flex"
      >
        <div className="relative flex-1">
          <input
            type="search"
            id="product-search"
            className={`block p-4 w-full text-md outline-none border-0 rounded-l-lg ${classNames?.input}`}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            aria-label={`Search for ${searchFor}`}
            autoComplete="off"
          />

          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`flex justify-center items-center text-white rounded-r-lg px-6 space-x-2 bg-primary-300 hover:bg-primary-600 transition-colors ${classNames?.button}`}
          aria-label="Search"
        >
          <RiSearchLine size={24} />
          <span className="hidden md:inline">Search</span>
        </button>
      </form>

      {error && (
        <div className="absolute w-full mt-1 p-2 bg-red-50 text-red-600 rounded-lg border border-red-200">
          Error loading suggestions. Please try again.
        </div>
      )}

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[300px] overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between gap-2"
              onClick={() =>
                searchFor === "store"
                  ? handleSearch(suggestion.id)
                  : handleSearch(suggestion.text)
              }
            >
              <div className="flex items-center gap-2">
                <RiSearchLine className="text-gray-400" />
                <span>{suggestion.text}</span>
              </div>
              {searchFor === "product" && suggestion.price && (
                <span className="text-gray-500">
                  ₦{suggestion.price.toLocaleString()}
                </span>
              )}
              {searchFor === "store" && suggestion.description && (
                <span className="text-gray-500 text-sm truncate max-w-[200px]">
                  {suggestion.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {showSuggestions &&
        !isLoading &&
        !error &&
        suggestions &&
        suggestions.length === 0 &&
        query.length >= 2 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-gray-500">
            {searchFor === "store" ? "No store found" : "No products found"}
          </div>
        )}
    </div>
  );
};

export default Search;
