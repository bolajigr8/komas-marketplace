import { Product } from "@/lib/types";

export interface CartLocalStorage{
    quantity: number,
    product: Product
}