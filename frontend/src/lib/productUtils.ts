import { IP_RATING_VALUES, type IpRating, type Product } from "@/types/product";

export function productGalleryUrls(product: Product): string[] {
  if (product.imageUrls?.length) {
    return product.imageUrls;
  }
  if (product.imageUrl) {
    return [product.imageUrl];
  }
  return [];
}

export function ipRatingNumeric(ip: IpRating | null | undefined): number | null {
  if (!ip) return null;
  return IP_RATING_VALUES[ip] ?? null;
}

export function isWaterResistant(ip: IpRating | null | undefined): boolean {
  const value = ipRatingNumeric(ip);
  return value != null && value >= 44;
}

export function resolveProductSpec(product: Product) {
  const spec = product.technicalSpec;
  return {
    ipRating: spec?.ipRating ?? product.ipRating,
    maxAmps: spec?.maxAmps ?? product.maxAmps,
    hasChildProtection: spec?.hasChildProtection ?? product.hasChildProtection,
    hasGrounding: spec?.hasGrounding ?? product.hasGrounding,
    framePostsCount: spec?.framePostsCount ?? product.framePostsCount,
    compatibleRoomTypes: spec?.compatibleRoomTypes ?? product.compatibleRoomTypes ?? [],
  };
}
