import { enrichCartProductSeries } from "@/lib/cartCompatibility";
import { clampCartQuantity } from "@/lib/cartUtils";
import type { CartLine } from "@/types/cart";

const STORAGE_KEY = "electrofit-cart";

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as CartLine;
  return (
    typeof line.lineId === "string" &&
    typeof line.quantity === "number" &&
    line.quantity > 0 &&
    line.product != null &&
    typeof line.product.id === "number" &&
    typeof line.product.name === "string" &&
    typeof line.product.sku === "string"
  );
}

function sanitizeCartLines(parsed: unknown): CartLine[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isCartLine).map((line) => ({
    ...line,
    quantity: clampCartQuantity(line.quantity),
    product: enrichCartProductSeries(line.product),
  }));
}

export function loadCartFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sanitizeCartLines(JSON.parse(raw));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveCartToStorage(items: CartLine[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
