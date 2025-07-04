// import React from "react";
// import LocationSelector from "@/components/HomePage/LocationSelector";
// import PartnerStoresList from "@/components/StoresPage/PartnerStoreList";
// import { Metadata } from "next";
// import { schema } from "../page";
// import StoresHeroSection from "@/components/StoresPage/StoresHeroSection";
// import { divideIntoArrays, formUrlQuery } from "@/lib/utils";
// import StoresPaginationControls from "@/components/StoresPage/StoresPaginationControls";
// import {
//   getVendors,
//   getVendorsByCategory,
//   getVendorsByName,
// } from "@/lib/server-actions/vendor";
// import { getCategoryById } from "@/lib/server-actions/category";
// import { useRouter, useSearchParams } from "next/navigation";

// type PropsType = {
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// };

// export const revalidate = 1800;

// export default async function Stores({ searchParams }: PropsType) {
//   const { data } = schema.safeParse(searchParams);

//   const [vendorsRes, categoryRes, vendorsByCategoryRes, vendorsByNameRes] =
//     await Promise.all([
//       getVendors(),
//       getCategoryById(data?.category || ""),
//       getVendorsByCategory(data?.category || ""),
//       getVendorsByName({
//         query: data?.query || "",
//         categoryId: data?.category,
//       }),
//     ]);

//   if (vendorsRes.hasError) throw new Error(vendorsRes.message);

//   const vendorPages = data?.query
//     ? divideIntoArrays({
//         data: vendorsByNameRes.data || [],
//         itemsPerArray: 24,
//       })
//     : data?.category
//     ? divideIntoArrays({
//         data: vendorsByCategoryRes.data || [],
//         itemsPerArray: 24,
//       })
//     : divideIntoArrays({
//         data: vendorsRes.data || [],
//         itemsPerArray: 24,
//       });

//   const currentPage = vendorPages[data?.page || 0] || [];

//   const router = useRouter();

//   const params = useSearchParams();

//   const handlePageChange = (page: number) => {
//     const newUrl = formUrlQuery({
//       params: params.toString(),
//       keys: ["page"],
//       values: [page.toString()],
//     });

//     router.push(newUrl);
//   };

//   return (
//     <main className="mt-4 w-full h-full min-h-[70vh]">
//       <LocationSelector />
//       <StoresHeroSection query={data?.query} category={data?.category} />
//       <section className="max-w-6xl mx-auto px-4 mt-20">
//         <h2 className="text-2xl mb-4 font-semibold">
//           {categoryRes.data?.name && data?.query
//             ? `Search results for ${data.query.toLowerCase()} in ${categoryRes.data.name.toLowerCase()}`
//             : categoryRes.data?.name
//             ? `Available stores to buy ${categoryRes.data.name.toLowerCase()}`
//             : data?.query
//             ? `Search results for ${data.query.toLowerCase()}`
//             : "Available stores in Komas500"}
//         </h2>
//         <div
//           className="mb-10 py-24 md:py-32 h-full rounded-xl text-center"
//           style={{
//             backgroundImage: `url(/Images/Home/stores/storebg.png)`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <p className="text-white text-[40px] font-semibold">Komas500 Store</p>
//         </div>
//         <div
//           className={`mb-20 ${
//             !currentPage.length &&
//             "w-full h-[200px] rounded-md bg-gray-100 flex items-center justify-center"
//           }`}
//         >
//           {currentPage.length ? (
//             <>
//               <PartnerStoresList
//                 stores={currentPage}
//                 className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
//               />
//               <div className="mt-6 w-full flex justify-center">
//                 <StoresPaginationControls
//                   //   pageCount={vendorPages.length}
//                   currentPage={data?.page || 0}
//                     totalPages={}
//                   onPageChange={handlePageChange}
//                 />
//               </div>
//             </>
//           ) : (
//             <p className="text-center">No vendors found</p>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }

// export function generateMetadata({ searchParams }: PropsType): Metadata {
//   const { data } = schema.safeParse(searchParams);

//   return data?.query && data.category
//     ? {
//         title: `Search Result - ${data.query} - ${data.category}`,
//         description: `Search results for ${data.query} on ${data.category}`,
//       }
//     : data?.query
//     ? {
//         title: `Search Result - ${data.query}`,
//         description: `Search results for ${data.query}`,
//       }
//     : data?.category
//     ? {
//         title: `Browse - ${data.category}`,
//         description: `Browse ${data.category} products`,
//       }
//     : {
//         title: "Our Stores",
//         description: "Browse our partner stores",
//       };
// }

import React from "react";
import { Metadata } from "next";
import { Filter, Search } from "lucide-react";

import LocationSelector from "@/components/HomePage/LocationSelector";
import PartnerStoresList from "@/components/StoresPage/PartnerStoreList";
import StoresHeroSection from "@/components/StoresPage/StoresHeroSection";
// import { StoresPagination } from "./StoresPagination";
import { divideIntoArrays } from "@/lib/utils";
import {
  getVendors,
  getVendorsByCategory,
  getVendorsByName,
} from "@/lib/server-actions/vendor";
import { getCategoryById } from "@/lib/server-actions/category";
import { schema } from "../page";
import { Vendor } from "@/lib/types";
import StoresPagination from "@/components/StoresPage/StoresPagination";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface StoresProps {
  searchParams: SearchParams;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const revalidate = 1800;

export default async function Stores({ searchParams }: StoresProps) {
  const { data } = schema.safeParse(searchParams);

  const [vendorsRes, categoryRes, vendorsByCategoryRes, vendorsByNameRes] =
    await Promise.all([
      getVendors(),
      getCategoryById(data?.category || ""),
      getVendorsByCategory(data?.category || ""),
      getVendorsByName({
        query: data?.query || "",
        categoryId: data?.category,
      }),
    ] as const);

  if (vendorsRes.hasError) throw new Error(vendorsRes.message);

  const determineVendors = (): Vendor[] => {
    if (data?.query && vendorsByNameRes.data) return vendorsByNameRes.data;
    if (data?.category && vendorsByCategoryRes.data)
      return vendorsByCategoryRes.data;
    return vendorsRes.data || [];
  };

  const vendorPages = divideIntoArrays({
    data: determineVendors(),
    itemsPerArray: 24,
  });

  const currentPage = vendorPages[data?.page || 0] || [];

  const getPageTitle = (): string => {
    if (categoryRes.data?.name && data?.query) {
      return `Results for "${data.query}" in ${categoryRes.data.name}`;
    }
    if (categoryRes.data?.name) {
      return `Stores in ${categoryRes.data.name}`;
    }
    if (data?.query) {
      return `Search results for "${data.query}"`;
    }
    return "All Stores";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <LocationSelector />
            <nav className="hidden md:flex space-x-8">
              <NavLink href="/category">Categories</NavLink>
              <NavLink href="/deals">Today's Deals</NavLink>
              <NavLink href="/featured">Featured Stores</NavLink>
            </nav>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:px-8">
          <StoresHeroSection query={data?.query} category={data?.category} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 max-sm:flex-col max-sm:gap-4 max-sm:items-start">
          <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <select className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50">
              <option value="featured">Sort by: Featured</option>
              <option value="rating">Rating: High to Low</option>
              <option value="distance">Distance: Near to Far</option>
            </select>
          </div>
        </div>

        <div
          className={`${
            !currentPage.length
              ? "flex justify-center items-center h-64 bg-gray-100 rounded-lg"
              : ""
          }`}
        >
          {currentPage.length ? (
            <div>
              <div>
                <PartnerStoresList
                  stores={currentPage}
                  className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                />
              </div>
              <StoresPagination
                currentPage={data?.page || 0}
                totalPages={vendorPages.length}
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <Search className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No stores found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
  >
    {children}
  </a>
);

export function generateMetadata({ searchParams }: StoresProps): Metadata {
  const { data } = schema.safeParse(searchParams);

  if (data?.query && data.category) {
    return {
      title: `Search Result - ${data.query} - ${data.category}`,
      description: `Search results for ${data.query} on ${data.category}`,
    };
  }

  if (data?.query) {
    return {
      title: `Search Result - ${data.query}`,
      description: `Search results for ${data.query}`,
    };
  }

  if (data?.category) {
    return {
      title: `Browse - ${data.category}`,
      description: `Browse ${data.category} products`,
    };
  }

  return {
    title: "Our Stores",
    description: "Browse our partner stores",
  };
}
