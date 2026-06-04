import type { AdminStats, CreateProductPayload } from "@/types/admin";
import type { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function fetchAdminStats(): Promise<AdminStats> {
  const response = await fetch(`${API_BASE}/api/admin/stats`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load admin stats (${response.status})`);
  }
  return response.json();
}

export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`);
  }
  return response.json();
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const response = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Failed to create product (${response.status})`);
  }

  return response.json();
}
