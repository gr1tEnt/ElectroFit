import { apiFetch } from "@/lib/httpClient";
import type { AdminStats, CreateProductPayload } from "@/types/admin";
import type { Product } from "@/types/product";

export async function fetchAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/api/admin/stats");
}

export async function fetchAllProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products");
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
