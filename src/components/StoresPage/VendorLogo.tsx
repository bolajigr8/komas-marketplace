import React from "react";
import Search from "../General/Search";
import ServerImageRender from "../General/ServerImageRender";
import Image from "next/image";

type PropsType = {
  query?: string;
  category?: string;
  logo: string;
};

const VendorLogo = ({ logo, query, category }: PropsType) => {
  return (
    <div
      className={`mt-4 w-full md:w-[calc(100%-280px)] h-[400px] md:rounded-r-xl relative overflow-hidden flex flex-col justify-end items-center`}
    >
      {logo ? (
        <ServerImageRender
          folderName="vendor"
          src={logo}
          alt={logo}
          height={500}
          width={500}
          className="absolute inset-0 object-cover"
        />
      ) : (
        <Image
          src="/Images/Home/Vector.png"
          alt="vector"
          width={500}
          height={500}
          className="absolute inset-0 object-cover"
        />
      )}
      <div className="inline-block relative py-14">
        <Search searchFor="product" q={query} placeholder="" />
      </div>
    </div>
  );
};

export default VendorLogo;
