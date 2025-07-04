import { getCartProducts } from "@/lib/server-actions/product";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientCart = dynamic(
  () =>
    import("@/components/CartPage/ClientCart").then((mod) => mod.ClientCart),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Cart",
  description: "Your KOMAS500 cart",
};

export default async function CartPage() {
  return <ClientCart />;
}
