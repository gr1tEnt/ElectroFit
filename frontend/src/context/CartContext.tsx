"use client";

import { loadCartFromStorage, saveCartToStorage } from "@/lib/cartStorage";
import { cartSubtotal, lineSubtotal, newBundleId, newLineId } from "@/lib/cartUtils";
import type { ConfiguratorSet } from "@/types/configurator";
import type { CartLine } from "@/types/cart";
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

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  addProduct: (product: Product, quantity?: number) => void;
  addFullSet: (set: ConfiguratorSet) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCartToStorage(items);
    }
  }, [items, hydrated]);

  const addProduct = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const catalogLine = prev.find(
        (line) => line.product.id === product.id && line.source === "catalog" && !line.bundleId,
      );
      if (catalogLine) {
        return prev.map((line) =>
          line.lineId === catalogLine.lineId
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [
        ...prev,
        {
          lineId: newLineId(),
          product,
          quantity,
          source: "catalog",
        },
      ];
    });
  }, []);

  const addFullSet = useCallback((set: ConfiguratorSet) => {
    const bundleId = newBundleId();
    const bundleLabel = `Modular set (${set.mechanismQuantity}× ${set.mechanism.name})`;

    setItems((prev) => {
      const next = [...prev];
      addSetLine(next, set.frame, 1, bundleId, bundleLabel);
      addSetLine(next, set.mechanism, set.mechanismQuantity, bundleId, bundleLabel);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((line) => line.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((line) => (line.lineId === lineId ? { ...line, quantity } : line)),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((line) => line.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );

  const subtotal = useMemo(() => cartSubtotal(items), [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addProduct,
      addFullSet,
      updateQuantity,
      removeLine,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      addProduct,
      addFullSet,
      updateQuantity,
      removeLine,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function addSetLine(
  lines: CartLine[],
  product: Product,
  quantity: number,
  bundleId: string,
  bundleLabel: string,
) {
  const existing = lines.find(
    (line) => line.product.id === product.id && line.bundleId === bundleId,
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    lines.push({
      lineId: newLineId(),
      product,
      quantity,
      source: "modular-set",
      bundleId,
      bundleLabel,
    });
  }
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
