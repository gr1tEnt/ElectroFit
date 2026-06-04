import type { IpRating, ProductType } from "@/types/product";

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  lowVoltage: boolean;
  imageUrl?: string;
  brandName: string;
  seriesName: string;
  categoryName: string;
  ipRating: IpRating;
  maxAmps: number;
  hasChildProtection: boolean;
  hasGrounding: boolean;
  framePostsCount?: number;
  compatibleRoomTypes: string[];
}

export const ROOM_TYPE_OPTIONS = [
  { value: "BEDROOM", label: "Bedroom" },
  { value: "LIVING_ROOM", label: "Living room" },
  { value: "KIDS_ROOM", label: "Kids room" },
  { value: "BATHROOM", label: "Bathroom" },
  { value: "KITCHEN", label: "Kitchen" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "GARAGE", label: "Garage" },
] as const;

export const IP_RATING_OPTIONS: IpRating[] = ["IP20", "IP44", "IP54", "IP55", "IP65"];

export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "MECHANISM", label: "Mechanism" },
  { value: "FRAME", label: "Frame" },
];
