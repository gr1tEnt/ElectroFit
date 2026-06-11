import type { OrderHistoryItem, OrderHistoryLine } from "@/types/auth";

/** Fallback when API returns summary but empty items (older API or fetch glitch). */
export function resolveOrderLines(order: OrderHistoryItem): OrderHistoryLine[] {
  if (order.items.length > 0) {
    return order.items;
  }

  const parsed: OrderHistoryLine[] = [];
  const pattern = /(\d+)x\s+([^,]+)/g;
  let match = pattern.exec(order.summary);
  while (match) {
    parsed.push({
      name: match[2].trim(),
      sku: "",
      quantity: Number.parseInt(match[1], 10),
      unitPrice: 0,
      lineTotal: 0,
    });
    match = pattern.exec(order.summary);
  }

  if (parsed.length === 0) {
    return [];
  }

  const qtySum = parsed.reduce((sum, line) => sum + line.quantity, 0);
  if (qtySum > 0 && order.total > 0) {
    return parsed.map((line) => {
      const share = (line.quantity / qtySum) * order.total;
      const unitPrice = line.quantity > 0 ? share / line.quantity : 0;
      return {
        ...line,
        unitPrice,
        lineTotal: share,
      };
    });
  }

  return parsed;
}
