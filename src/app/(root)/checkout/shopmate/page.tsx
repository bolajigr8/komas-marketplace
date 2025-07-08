import ShopmateForm from "@/components/CheckoutPage/ShopmateForm";
import { fetchShopmateAgents } from "@/lib/server-actions/shopmate";
import { Metadata } from "next";
import React from "react";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Shopmate Checkout",
  description: "Shopmate Checkout",
};

const schema = z.object({
  shopmate: z.coerce.boolean().optional(),
  vendorId: z.string().optional(),
});

type PropsType = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const ShopmateCheckoutPage = async ({ searchParams }: PropsType) => {
  const { data } = schema.safeParse(searchParams);

  const { data: shopmate } = await fetchShopmateAgents();
  // console.log(shopmateAgents) shopmateAgents={shopmate}

  return (
    <main className="w-full p-4 py-10 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Shopmate Checkout Form</h2>
          <p className="text-sm text-gray-500">
            Please fill in the details below to complete the checkout process.
          </p>
          <ShopmateForm vendorId={data?.vendorId} />
        </div>
      </div>
    </main>
  );
};

export default ShopmateCheckoutPage;
