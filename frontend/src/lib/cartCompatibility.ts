import type { CartLine } from "@/types/cart";
import type { Product } from "@/types/product";

export interface CartSeriesCompatibilityResult {
  hasRisk: boolean;
  series: string[];
}

function inferSeriesFromSku(sku: string): string | null {
  const upper = sku.trim().toUpperCase();
  if (!upper) return null;

  if (
    upper.includes("-VL-") ||
    upper.startsWith("FRM-VL") ||
    upper.startsWith("SKT-VL") ||
    upper.startsWith("SW-VL")
  ) {
    return "Valena Life";
  }

  if (
    upper.includes("-AF-") ||
    upper.startsWith("FRM-AF") ||
    upper.startsWith("SKT-AF") ||
    upper.startsWith("SW-AF")
  ) {
    return "Asfora";
  }

  return null;
}

export function resolveProductSeries(product: Product): string | null {
  const fromField = product.seriesName?.trim();
  if (fromField) return fromField;

  const attrs = product.detailedAttributes;
  const fromAttrs = attrs?.Series?.trim() ?? attrs?.["Серія"]?.trim();
  if (fromAttrs) return fromAttrs;

  return inferSeriesFromSku(product.sku);
}

export function enrichCartProductSeries(product: Product): Product {
  if (product.seriesName?.trim()) return product;

  const inferred = resolveProductSeries(product);
  if (!inferred) return product;

  return { ...product, seriesName: inferred };
}

export function isModularCartProduct(product: Product): boolean {
  return product.type === "MECHANISM" || product.type === "FRAME";
}

export function formatSeriesList(series: string[]): string {
  if (series.length === 0) return "";
  if (series.length === 1) return series[0];
  if (series.length === 2) return `${series[0]} та ${series[1]}`;
  return `${series.slice(0, -1).join(", ")} та ${series[series.length - 1]}`;
}

export function checkCartSeriesCompatibility(items: CartLine[]): CartSeriesCompatibilityResult {
  const seriesSet = new Set<string>();

  for (const line of items) {
    if (!isModularCartProduct(line.product)) continue;
    const series = resolveProductSeries(line.product);
    if (series) seriesSet.add(series);
  }

  const series = Array.from(seriesSet).sort((a, b) => a.localeCompare(b, "uk"));

  return {
    hasRisk: series.length > 1,
    series,
  };
}
