import type { IpRating, ProductType } from "@/types/product";

export interface AdminStats {
  totalProducts: number;
  unresolvedInquiries: number;
  totalBrands: number;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "SHIPPED";

export const ORDER_STATUS_OPTIONS: OrderStatus[] = ["PENDING", "COMPLETED", "SHIPPED"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Очікує",
  COMPLETED: "Виконано",
  SHIPPED: "Відправлено",
};

export interface RecentOrder {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface MonthlySales {
  month: string;
  revenue: number;
}

export interface DashboardStats {
  totalRevenue: number;
  recentOrders: RecentOrder[];
  salesChartData: MonthlySales[];
}

export type SupportTicketStatus = "OPEN" | "RESOLVED";

export interface SupportMessage {
  id: number;
  fullName: string;
  email: string;
  inquiryType: string;
  message: string;
  status: SupportTicketStatus;
  createdAt: string;
}

export interface SupportReplyPayload {
  replyMessage: string;
}

export interface CreateSupportMessagePayload {
  fullName: string;
  email: string;
  inquiryType: string;
  message: string;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  lowVoltage: boolean;
  imageUrl?: string;
  imageUrls?: string[];
  brandName: string;
  seriesName: string;
  categoryName: string;
  ipRating: IpRating;
  maxAmps: number;
  hasChildProtection: boolean;
  hasGrounding: boolean;
  framePostsCount?: number;
  compatibleRoomTypes: string[];
  detailedAttributes?: Record<string, string>;
}

export const CATEGORY_OPTIONS = [
  { value: "Sockets", label: "Розетки" },
  { value: "Switches", label: "Вимикачі" },
  { value: "Frames", label: "Рамки" },
  { value: "Accessories", label: "Аксесуари" },
] as const;

export const FRAME_POST_OPTIONS = [1, 2, 3, 4, 5] as const;

export const ROOM_TYPE_OPTIONS = [
  { value: "BEDROOM", label: "Спальня" },
  { value: "LIVING_ROOM", label: "Вітальня" },
  { value: "KIDS_ROOM", label: "Дитяча" },
  { value: "BATHROOM", label: "Ванна" },
  { value: "KITCHEN", label: "Кухня" },
  { value: "OUTDOOR", label: "Вулиця" },
  { value: "GARAGE", label: "Гараж" },
] as const;

export const IP_RATING_OPTIONS: IpRating[] = ["IP20", "IP44", "IP54", "IP55", "IP65"];

export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "MECHANISM", label: "Механізм" },
  { value: "FRAME", label: "Рамка" },
];
