import type { Product } from "@/types/product";

const STORAGE_KEY = "electrofit-compare";

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Product;
  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.sku === "string" &&
    typeof product.price === "number"
  );
}

function sanitizeProducts(parsed: unknown): Product[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isProduct);
}

export function loadCompareFromStorage(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sanitizeProducts(JSON.parse(raw));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveCompareToStorage(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
