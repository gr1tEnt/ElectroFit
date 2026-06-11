import { apiFetch } from "@/lib/httpClient";
import type {
  AdminStats,
  CreateProductPayload,
  CreateSupportMessagePayload,
  DashboardStats,
  SupportMessage,
} from "@/types/admin";
import type { Product } from "@/types/product";

export async function fetchAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/api/admin/stats");
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/api/admin/dashboard/stats");
}

export async function fetchAllProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products");
}

export async function createProduct(
  payload: CreateProductPayload,
  imageFile?: File | null,
): Promise<Product> {
  const formData = new FormData();
  formData.append(
    "product",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );
  if (imageFile) {
    formData.append("image", imageFile);
  }

  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: formData,
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return apiFetch<void>(`/api/products/${id}`, { method: "DELETE" });
}

export async function fetchSupportMessages(): Promise<SupportMessage[]> {
  return apiFetch<SupportMessage[]>("/api/admin/support-messages");
}

export async function resolveSupportMessage(id: number): Promise<void> {
  return apiFetch<void>(`/api/admin/support-messages/${id}`, { method: "DELETE" });
}

export async function submitSupportMessage(
  payload: CreateSupportMessagePayload,
): Promise<SupportMessage> {
  return apiFetch<SupportMessage>("/api/support", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
