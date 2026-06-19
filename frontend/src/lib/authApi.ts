import { getAuthToken } from "@/lib/authStorage";
import { apiFetch } from "@/lib/httpClient";
import { getRoleFromToken } from "@/lib/jwtUtils";
import type { AuthSession, AuthUser, OrderHistoryItem, UserRole } from "@/types/auth";

interface AuthResponseDto {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  role?: string;
}

interface UserProfileDto {
  id: number;
  email: string;
  fullName: string;
  role?: string;
}

function normalizeRole(value: unknown, token: string): UserRole {
  if (value === "ADMIN" || value === "USER") {
    return value;
  }
  return getRoleFromToken(token);
}

function toSession(dto: AuthResponseDto): AuthSession {
  return {
    token: dto.token,
    user: {
      userId: dto.userId,
      email: dto.email,
      fullName: dto.fullName,
      role: normalizeRole(dto.role, dto.token),
    },
  };
}

export async function registerUser(payload: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthSession> {
  const dto = await apiFetch<AuthResponseDto>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return toSession(dto);
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const dto = await apiFetch<AuthResponseDto>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return toSession(dto);
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiFetch<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordWithPin(payload: {
  email: string;
  pin: string;
  newPassword: string;
}): Promise<void> {
  await apiFetch<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const dto = await apiFetch<UserProfileDto>("/api/auth/me");
  const token = getAuthToken() ?? "";
  return {
    userId: dto.id,
    email: dto.email,
    fullName: dto.fullName,
    role: normalizeRole(dto.role, token),
  };
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export async function fetchOrderHistory(): Promise<OrderHistoryItem[]> {
  const items = await apiFetch<
    {
      orderNumber: string;
      summary: string;
      total: number | string;
      currency: string;
      placedAt: string;
      items: {
        productId?: number;
        name: string;
        sku: string;
        quantity: number;
        unitPrice: number | string;
        lineTotal: number | string;
      }[];
    }[]
  >("/api/profile/orders");

  return items.map((item) => ({
    orderNumber: item.orderNumber,
    summary: item.summary,
    total: toNumber(item.total),
    currency: item.currency,
    placedAt: item.placedAt,
    items: (item.items ?? []).map((line) => ({
      productId: line.productId,
      name: line.name,
      sku: line.sku?.trim() ?? "",
      quantity: line.quantity,
      unitPrice: toNumber(line.unitPrice),
      lineTotal: toNumber(line.lineTotal),
    })),
  }));
}
