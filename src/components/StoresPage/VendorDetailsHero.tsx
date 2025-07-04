"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Search from "../General/Search";

type PropsType = {
  query?: string;
  category?: string;
  logo: string;
  name: string;
  description?: string;
};

const VendorDetailsHero = ({
  query,
  category,
  logo,
  name,
  description,
}: PropsType) => {
  // Use client-side only state for dynamic content
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative">
      <div className="absolute inset-0 h-56 rounded-xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800 opacity-90">
          {isClient && (
            <Image
              src={`/api/images/vendor/${logo}`}
              alt={name}
              fill
              className="object-cover mix-blend-overlay opacity-30"
            />
          )}
        </div>
      </div>

      <div className="relative pt-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {isClient && (
                <Image
                  src={`/api/images/vendor/${logo}`}
                  alt={name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div className="text-center md:text-left md:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
            {description && (
              <p className="text-gray-200 mb-3 max-w-xl">{description}</p>
            )}
            <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <span className="text-white text-sm ml-2">4.8 (328 reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          {isClient && (
            <Search
              searchFor="vendorProduct"
              q={query}
              classNames={{
                wrapper: "shadow-lg rounded-xl border-0 bg-white/95",
              }}
              placeholder="Search products in this store..."
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default VendorDetailsHero;
