"use client";

import type { ConfiguratorSet } from "@/types/configurator";
import type { Product } from "@/types/product";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  addFullSet: (set: ConfiguratorSet) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  const addFullSet = useCallback((set: ConfiguratorSet) => {
    setItems((prev) => {
      const next = [...prev];
      addOrIncrement(next, set.frame, 1);
      addOrIncrement(next, set.mechanism, set.mechanismQuantity);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, itemCount, addFullSet, clearCart }),
    [items, itemCount, addFullSet, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function addOrIncrement(lines: CartLine[], product: Product, quantity: number) {
  const existing = lines.find((line) => line.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    lines.push({ product, quantity });
  }
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
