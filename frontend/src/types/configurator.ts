import type { Product } from "@/types/product";

export interface ConfiguratorSet {
  frame: Product;
  mechanism: Product;
  mechanismQuantity: number;
  brandName: string;
  seriesName: string;
  setPrice: number;
}

export interface ConfiguratorAssembly {
  frame: Product;
  slots: Product[];
  brandName: string;
  seriesName: string;
}

export const BLOCK_SIZE_OPTIONS = [1, 2, 3, 4, 5] as const;
export type BlockSize = (typeof BLOCK_SIZE_OPTIONS)[number];

export function computeAssemblyPrice(frame: Product, slots: Product[]): number {
  return frame.price + slots.reduce((sum, mechanism) => sum + mechanism.price, 0);
}

export function summarizeMechanisms(slots: Product[]): { product: Product; quantity: number }[] {
  const grouped = new Map<number, { product: Product; quantity: number }>();
  for (const product of slots) {
    const existing = grouped.get(product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      grouped.set(product.id, { product, quantity: 1 });
    }
  }
  return Array.from(grouped.values());
}
