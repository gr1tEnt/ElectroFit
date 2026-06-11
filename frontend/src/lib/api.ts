import { apiFetch } from "@/lib/httpClient";
import { filterModularSlotMechanisms } from "@/lib/configuratorUtils";
import type { OrderConfirmation, SubmitOrderPayload } from "@/types/cart";
import type { ConfiguratorSet } from "@/types/configurator";
import type { Product } from "@/types/product";

export async function fetchProducts(params?: {
  brand?: string;
  series?: string;
  category?: string;
  search?: string;
  type?: Product["type"];
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.brand) search.set("brand", params.brand);
  if (params?.series) search.set("series", params.series);
  if (params?.category) search.set("category", params.category);
  if (params?.search) search.set("search", params.search);
  if (params?.type) search.set("type", params.type);

  const query = search.toString();
  return apiFetch<Product[]>(`/api/products${query ? `?${query}` : ""}`);
}

export async function fetchProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`);
}

export interface SmartSelectPayload {
  roomType: string;
  nearWater: boolean;
  hasChildren: boolean;
}

export async function fetchSmartSelectProducts(
  payload: SmartSelectPayload,
): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products/smart-select", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function fetchConfiguratorSets(
  postsCount: number,
  category = "Sockets",
): Promise<ConfiguratorSet[]> {
  const search = new URLSearchParams({
    postsCount: String(postsCount),
    category,
  });
  return apiFetch<ConfiguratorSet[]>(`/api/products/configurator?${search}`);
}

export async function fetchSeriesMechanisms(brand: string, series: string): Promise<Product[]> {
  const products = await fetchProducts({ brand, series, type: "MECHANISM" });
  return filterModularSlotMechanisms(products, brand, series);
}

export async function submitOrder(payload: SubmitOrderPayload): Promise<OrderConfirmation> {
  return apiFetch<OrderConfirmation>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
