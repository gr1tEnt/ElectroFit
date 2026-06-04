import type { CartLine } from "@/types/cart";

const STORAGE_KEY = "electrofit-cart";

export function loadCartFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartLine[];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartLine[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
