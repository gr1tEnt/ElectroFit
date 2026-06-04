import {
  ALL_IP_RATINGS,
  type CatalogFilters,
  IP_RATING_VALUES,
  type Product,
} from "@/types/product";

export function getAmpsBounds(products: Product[]): { min: number; max: number } {
  const amps = products
    .map((p) => p.maxAmps)
    .filter((value): value is number => value != null);
  if (amps.length === 0) return { min: 0, max: 32 };
  return { min: Math.min(...amps), max: Math.max(...amps) };
}

export function getUniqueBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brandName).filter(Boolean) as string[])].sort();
}

export function getUniqueSeries(products: Product[], brand: string): string[] {
  return [
    ...new Set(
      products
        .filter((p) => !brand || p.brandName === brand)
        .map((p) => p.seriesName)
        .filter(Boolean) as string[],
    ),
  ].sort();
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  return products.filter((product) => {
    if (filters.brand && product.brandName !== filters.brand) return false;
    if (filters.series && product.seriesName !== filters.series) return false;

    if (filters.ipRatings.length > 0) {
      if (!product.ipRating) return false;
      const productValue = IP_RATING_VALUES[product.ipRating];
      const minRequired = Math.min(...filters.ipRatings.map((r) => IP_RATING_VALUES[r]));
      if (productValue < minRequired) return false;
    }

    if (product.maxAmps != null) {
      if (product.maxAmps < filters.minAmps || product.maxAmps > filters.maxAmps) {
        return false;
      }
    }

    if (filters.childProtectionOnly && !product.hasChildProtection) {
      return false;
    }

    return true;
  });
}

export function countActiveFilters(filters: CatalogFilters, bounds: { min: number; max: number }): number {
  let count = 0;
  if (filters.brand) count++;
  if (filters.series) count++;
  if (filters.ipRatings.length > 0) count++;
  if (filters.childProtectionOnly) count++;
  if (filters.minAmps > bounds.min || filters.maxAmps < bounds.max) count++;
  return count;
}

export { ALL_IP_RATINGS };
