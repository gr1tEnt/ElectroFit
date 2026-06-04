import type { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function fetchProducts(params?: {
  brand?: string;
  series?: string;
  category?: string;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.brand) search.set("brand", params.brand);
  if (params?.series) search.set("series", params.series);
  if (params?.category) search.set("category", params.category);

  const query = search.toString();
  const url = `${API_BASE}/api/products${query ? `?${query}` : ""}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`);
  }
  return response.json();
}
