export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface OrderHistoryLine {
  productId?: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderHistoryItem {
  orderNumber: string;
  summary: string;
  total: number;
  currency: string;
  placedAt: string;
  items: OrderHistoryLine[];
}
