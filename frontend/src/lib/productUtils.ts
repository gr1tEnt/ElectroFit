import { getApiBase } from "@/lib/httpClient";
import { IP_RATING_VALUES, type IpRating, type Product } from "@/types/product";

export const PRODUCT_IMAGE_PLACEHOLDER = "/images/products/Valena-Life-singlesocket-IP20.jpg";

const UPLOADED_PRODUCT_IMAGE =
  /\/images\/products\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\./i;

export function productGalleryUrls(product: Product): string[] {
  if (product.imageUrls?.length) {
    return product.imageUrls;
  }
  if (product.imageUrl) {
    return [product.imageUrl];
  }
  return [];
}

export function productGalleryUrlsWithFallback(product: Product): string[] {
  const urls = productGalleryUrls(product);
  return urls.length > 0 ? urls : [PRODUCT_IMAGE_PLACEHOLDER];
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

export function resolveProductImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === "") {
    return productImageSrc(PRODUCT_IMAGE_PLACEHOLDER);
  }
  const path = productImageSrc(url.trim());
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (UPLOADED_PRODUCT_IMAGE.test(path)) {
    return `${getApiBase()}${path}`;
  }
  return path;
}

export function ipRatingNumeric(ip: IpRating | null | undefined): number | null {
  if (!ip) return null;
  return IP_RATING_VALUES[ip] ?? null;
}

export function isWaterResistant(ip: IpRating | null | undefined): boolean {
  const value = ipRatingNumeric(ip);
  return value != null && value >= 44;
}

/** Decorative frames are passive covers — not active electrical components. */
export function isFrameProduct(product: Pick<Product, "type" | "categoryName">): boolean {
  return product.type === "FRAME" || product.categoryName?.toLowerCase() === "frames";
}

const FRAME_DETAILED_SPEC_KEYS = new Set([
  "series",
  "mounting",
  "material",
  "dimensions",
  "ip rating",
  "module capacity",
  "operating temperature",
]);

/** Frames show physical/design attributes only — no rated current, voltage, or standards. */
export function filterDetailedAttributesForProduct(
  product: Pick<Product, "type" | "categoryName">,
  attributes?: Record<string, string> | null,
): Record<string, string> | undefined {
  if (!attributes) {
    return undefined;
  }
  if (!isFrameProduct(product)) {
    return attributes;
  }

  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (FRAME_DETAILED_SPEC_KEYS.has(key.toLowerCase())) {
      filtered[key] = value;
    }
  }
  return filtered;
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
