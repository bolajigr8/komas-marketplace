import Image from "next/image";
import React from "react";

const CheckoutProgressBar = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center gap-3 p-4 -mb-6">
    {[1, 2, 3].map((step, index) => (
      <React.Fragment key={index}>
        <div
          className={`size-10 flex items-center justify-center border rounded-full font-bold md:text-lg transition-colors
            ${
              currentStep >= step
                ? "border-black text-black bg-gray-50"
                : "border-gray-300 text-gray-300"
            }`}
          aria-current={currentStep === step ? "step" : undefined}
        >
          {step}
        </div>
        {index < 2 && (
          <Image
            src={"/Icons/Vector 55.svg"}
            alt=""
            height={20}
            width={40}
            aria-hidden="true"
            className={`transition-opacity ${
              currentStep > step ? "opacity-100" : "opacity-50"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default CheckoutProgressBar;
