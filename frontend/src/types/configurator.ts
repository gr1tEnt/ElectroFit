import type { Product } from "@/types/product";

export interface ConfiguratorSet {
  frame: Product;
  mechanism: Product;
  mechanismQuantity: number;
  brandName: string;
  seriesName: string;
  setPrice: number;
}

export const BLOCK_SIZE_OPTIONS = [1, 2, 3, 4, 5] as const;
export type BlockSize = (typeof BLOCK_SIZE_OPTIONS)[number];
