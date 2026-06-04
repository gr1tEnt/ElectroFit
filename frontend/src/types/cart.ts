import type { Product } from "@/types/product";

export type CartLineSource = "catalog" | "modular-set";

export interface CartLine {
  lineId: string;
  product: Product;
  quantity: number;
  source: CartLineSource;
  bundleId?: string;
  bundleLabel?: string;
}

export interface SubmitOrderPayload {
  customerName: string;
  email: string;
  items: {
    productId: number;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface OrderConfirmation {
  orderId: string;
  message: string;
  total: number;
}
