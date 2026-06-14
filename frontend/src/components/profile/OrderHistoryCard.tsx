"use client";

import { getErrorMessage } from "@/lib/apiError";
import { exportOrderToPdf } from "@/lib/exportOrderPdf";
import { resolveOrderLines } from "@/lib/orderHistoryUtils";
import type { OrderHistoryItem } from "@/types/auth";
import { useMemo, useState } from "react";

interface OrderHistoryCardProps {
  order: OrderHistoryItem;
  customerName: string;
}

function formatTotal(item: OrderHistoryItem): string {
  const symbol = item.currency === "EUR" ? "€" : "$";
  return `${symbol}${item.total.toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatUnit(price: number, currency: string): string {
  const symbol = currency === "EUR" ? "€" : "$";
  return `${symbol}${price.toFixed(2)}`;
}

function formatSku(line: { sku: string; productId?: number }): string {
  if (line.sku) {
    return line.sku;
  }
  if (line.productId != null) {
    return `ID ${line.productId}`;
  }
  return "—";
}

export function OrderHistoryCard({ order, customerName }: OrderHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const orderId = order.orderNumber.replace(/^ORD-/, "");
  const lines = useMemo(() => resolveOrderLines(order), [order]);
  const orderForExport = useMemo(
    () => ({ ...order, items: lines }),
    [order, lines],
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportOrderToPdf(orderForExport, customerName);
    } catch (err) {
      window.alert(getErrorMessage(err, "Не вдалося експортувати PDF замовлення."));
    } finally {
      setExporting(false);
    }
  };

  return (
    <li className="rounded-xl border border-border bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-slate-50/80"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">
            Замовлення №{orderId}: {order.summary}
          </p>
          <p className="mt-1 text-sm text-muted">
            Оформлено {formatDate(order.placedAt)} · Разом: {formatTotal(order)}
          </p>
        </div>
        <span
          className="mt-1 shrink-0 text-muted transition-transform"
          aria-hidden
          style={{ transform: expanded ? "rotate(180deg)" : undefined }}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border bg-slate-50/50 px-4 pb-4 pt-3">
          {lines.length === 0 ? (
            <p className="text-sm text-muted">Для цього замовлення немає записаних позицій.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-3 py-2">Товар</th>
                    <th className="px-3 py-2" title="Stock Keeping Unit — унікальний код товару">
                      SKU
                    </th>
                    <th className="px-3 py-2 text-center">К-сть</th>
                    <th className="px-3 py-2 text-right">За од.</th>
                    <th className="px-3 py-2 text-right">Сума</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr
                      key={`${line.productId ?? line.sku}-${index}`}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-3 py-2 font-medium text-ink">{line.name}</td>
                      <td className="px-3 py-2 font-mono text-xs text-muted">
                        {formatSku(line)}
                      </td>
                      <td className="px-3 py-2 text-center">{line.quantity}</td>
                      <td className="px-3 py-2 text-right">
                        {formatUnit(line.unitPrice, order.currency)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {formatUnit(line.lineTotal, order.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">Разом: {formatTotal(order)}</p>
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={exporting || lines.length === 0}
              className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 disabled:opacity-50"
            >
              {exporting ? "Створення…" : "Експортувати замовлення в PDF"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
