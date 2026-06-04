import type { OrderConfirmation, SubmitOrderPayload } from "@/types/cart";
import type { ConfiguratorSet } from "@/types/configurator";
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

export interface SmartSelectPayload {
  roomType: string;
  nearWater: boolean;
  hasChildren: boolean;
}

export async function fetchSmartSelectProducts(
  payload: SmartSelectPayload,
): Promise<Product[]> {
  const url = `${API_BASE}/api/products/smart-select`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      detail || `Smart select failed (${response.status})`,
    );
  }

  return response.json();
}

export async function fetchConfiguratorSets(
  postsCount: number,
  category = "Sockets",
): Promise<ConfiguratorSet[]> {
  const search = new URLSearchParams({
    postsCount: String(postsCount),
    category,
  });
  const url = `${API_BASE}/api/products/configurator?${search}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Configurator request failed (${response.status})`);
  }
  return response.json();
}

export async function submitOrder(payload: SubmitOrderPayload): Promise<OrderConfirmation> {
  const url = `${API_BASE}/api/orders`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Order submission failed (${response.status})`);
  }

  return response.json();
}
