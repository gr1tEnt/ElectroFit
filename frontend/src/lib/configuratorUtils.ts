import { isFrameProduct } from "@/lib/productUtils";
import type { Product } from "@/types/product";

/** Monoblock double sockets cannot occupy a single modular frame slot. */
export function isDoublePostMechanism(product: Pick<Product, "sku" | "name" | "description" | "detailedAttributes">): boolean {
  const sku = product.sku?.toUpperCase() ?? "";
  if (sku.endsWith("-2P")) {
    return true;
  }

  const searchableText = [
    product.name,
    product.description,
    ...Object.entries(product.detailedAttributes ?? {}).flatMap(([key, value]) => [key, value]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes("double socket") || /\bdouble\b/.test(searchableText);
}

/**
 * Only single-post mechanisms from the matching brand/series may fill a frame slot.
 * Excludes frames, double sockets, and any cross-series products.
 */
export function isValidModularSlotMechanism(
  product: Product,
  brandName: string,
  seriesName: string,
): boolean {
  if (product.type !== "MECHANISM") {
    return false;
  }
  if (isFrameProduct(product)) {
    return false;
  }
  if (product.framePostsCount != null && product.framePostsCount > 0) {
    return false;
  }
  if (isDoublePostMechanism(product)) {
    return false;
  }

  const brand = brandName.trim().toLowerCase();
  const series = seriesName.trim().toLowerCase();
  if (product.brandName?.trim().toLowerCase() !== brand) {
    return false;
  }
  if (product.seriesName?.trim().toLowerCase() !== series) {
    return false;
  }

  return true;
}

export function filterModularSlotMechanisms(
  products: Product[],
  brandName: string,
  seriesName: string,
): Product[] {
  return products.filter((product) => isValidModularSlotMechanism(product, brandName, seriesName));
}
