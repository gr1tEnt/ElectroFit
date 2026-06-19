import type { CartLine } from "@/types/cart";
import type { Product } from "@/types/product";

export const MIN_CART_QUANTITY = 1;
export const MAX_CART_QUANTITY = 99;

export function clampCartQuantity(quantity: number): number {
  return Math.min(MAX_CART_QUANTITY, Math.max(MIN_CART_QUANTITY, Math.round(quantity)));
}

export function lineUnitPrice(product: Product): number {
  return typeof product.price === "number" ? product.price : Number(product.price);
}

export function lineSubtotal(line: CartLine): number {
  return lineUnitPrice(line.product) * line.quantity;
}

export function cartSubtotal(items: CartLine[]): number {
  return items.reduce((sum, line) => sum + lineSubtotal(line), 0);
}

export function newLineId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function newBundleId(): string {
  return `bundle-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
