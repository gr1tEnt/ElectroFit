"use client";

import { loadCompareFromStorage, saveCompareToStorage } from "@/lib/compareStorage";
import {
  toastCompareLimitReached,
  toastCompareRemoved,
  toastCompareAdded,
} from "@/lib/toast";
import type { Product } from "@/types/product";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const MAX_COMPARE_PRODUCTS = 4;

interface CompareContextValue {
  products: Product[];
  count: number;
  isInCompare: (productId: number) => boolean;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  canAddToCompare: (productId: number) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProducts(loadCompareFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCompareToStorage(products);
    }
  }, [products, hydrated]);

  const isInCompare = useCallback(
    (productId: number) => products.some((product) => product.id === productId),
    [products],
  );

  const canAddToCompare = useCallback(
    (productId: number) =>
      isInCompare(productId) || products.length < MAX_COMPARE_PRODUCTS,
    [isInCompare, products.length],
  );

  const addToCompare = useCallback((product: Product) => {
    if (products.some((item) => item.id === product.id)) {
      return;
    }
    if (products.length >= MAX_COMPARE_PRODUCTS) {
      toastCompareLimitReached();
      return;
    }

    setProducts((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      if (prev.length >= MAX_COMPARE_PRODUCTS) {
        return prev;
      }
      return [...prev, product];
    });

    toastCompareAdded(product.id, product.name);
  }, [products]);

  const removeFromCompare = useCallback((productId: number) => {
    const removed = products.find((item) => item.id === productId);
    if (!removed) {
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== productId));
    toastCompareRemoved(removed.id, removed.name);
  }, [products]);

  const clearCompare = useCallback(() => {
    setProducts([]);
  }, []);

  const value = useMemo<CompareContextValue>(
    () => ({
      products,
      count: products.length,
      isInCompare,
      addToCompare,
      removeFromCompare,
      clearCompare,
      canAddToCompare,
    }),
    [products, isInCompare, addToCompare, removeFromCompare, clearCompare, canAddToCompare],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
