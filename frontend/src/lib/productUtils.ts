import { IP_RATING_VALUES, type IpRating, type Product } from "@/types/product";

export function productGalleryUrls(product: Product): string[] {
  if (product.imageUrls?.length) {
    return product.imageUrls.map(productImageSrc);
  }
  if (product.imageUrl) {
    return [productImageSrc(product.imageUrl)];
  }
  return [];
}

/** Encode local /images/... paths so spaces and special chars load correctly. */
export function productImageSrc(path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) {
    return encodeURI(path);
  }
  return `${path.slice(0, lastSlash + 1)}${encodeURIComponent(path.slice(lastSlash + 1))}`;
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
