export type ProductType = "MECHANISM" | "FRAME";

export type IpRating = "IP20" | "IP44" | "IP54" | "IP55" | "IP65";

export interface TechnicalSpec {
  id: number;
  ipRating: IpRating;
  maxAmps: number;
  hasChildProtection: boolean;
  hasGrounding: boolean;
  framePostsCount: number | null;
  compatibleRoomTypes: string[];
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  imageUrls?: string[];
  type: ProductType;
  lowVoltage: boolean;
  brandName: string | null;
  seriesName: string | null;
  categoryName: string | null;
  technicalSpec?: TechnicalSpec | null;
  ipRating: IpRating | null;
  maxAmps: number | null;
  hasChildProtection: boolean | null;
  hasGrounding: boolean | null;
  framePostsCount: number | null;
  compatibleRoomTypes?: string[];
}

export interface CatalogFilters {
  brand: string;
  series: string;
  ipRatings: IpRating[];
  minAmps: number;
  maxAmps: number;
  childProtectionOnly: boolean;
}

export const IP_RATING_VALUES: Record<IpRating, number> = {
  IP20: 20,
  IP44: 44,
  IP54: 54,
  IP55: 55,
  IP65: 65,
};

export const ALL_IP_RATINGS: IpRating[] = ["IP20", "IP44", "IP54", "IP55", "IP65"];

export const DEFAULT_FILTERS: CatalogFilters = {
  brand: "",
  series: "",
  ipRatings: [],
  minAmps: 0,
  maxAmps: 32,
  childProtectionOnly: false,
};
