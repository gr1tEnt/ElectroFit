import { checkCartSeriesCompatibility } from "@/lib/cartCompatibility";
import type { CartLine } from "@/types/cart";
import { useMemo } from "react";

export function useCartSeriesCompatibility(items: CartLine[]) {
  return useMemo(() => checkCartSeriesCompatibility(items), [items]);
}
