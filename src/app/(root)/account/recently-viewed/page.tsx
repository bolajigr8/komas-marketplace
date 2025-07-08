import FilterSelect from '@/components/AccountPages/FilterSelect';
import { foods } from "@/data/topSellingProducts/topsellingProduct";
import ProductCard from '@/components/General/ProductCard';
import { Metadata } from 'next';
import React from 'react'
import { VscSettings } from 'react-icons/vsc';

export const metadata: Metadata = {
  title: 'Recently viewed',
  description: 'Recently viewed products',
}

const RecentlyViewed = () => {
  return (
    <main className="flex-1 md:bg-white py-8 px-4 md:px-6">
      <div className="flex h-full flex-col gap-6 overflow-y-auto custom-scrollbar ![--thumb-color:#9c9a9a] ![--scrollbar-width:5px]">
        <div className="flex flex-col">
          <div className="flex flex-wrap md:items-center justify-between gap-2">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">Recently viewed</h2>
              <p className="text-sm font-semibold md:hidden">
                Products you viewed recently appears here
              </p>
            </div>
            <div className="ml-auto">
              <FilterSelect />
            </div>
          </div>
          <p
            aria-hidden
            className="text-sm font-semibold hidden md:block"
          >
            Products you viewed recently appears here
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-2 lg:p-6 rounded-xl lg:border">
          {[...foods, ...foods].splice(0, 8).map((food, index) => (
            <ProductCard
              key={index}
              product={food}
              showCartBtn
              className="md:border"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default RecentlyViewed