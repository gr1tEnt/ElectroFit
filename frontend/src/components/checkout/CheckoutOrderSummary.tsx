"use client";

import { lineSubtotal, lineUnitPrice } from "@/lib/cartUtils";
import type { CartLine } from "@/types/cart";

interface CheckoutOrderSummaryProps {
  items: CartLine[];
  subtotal: number;
}

export function CheckoutOrderSummary({ items, subtotal }: CheckoutOrderSummaryProps) {
  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Order summary</h2>
      <p className="mt-1 text-sm text-muted">{items.length} line item(s)</p>

      <ul className="mt-5 max-h-80 space-y-3 overflow-y-auto pr-1">
        {items.map((line) => {
          const unit = lineUnitPrice(line.product);
          const lineTotal = lineSubtotal(line);
          return (
            <li
              key={line.lineId}
              className="flex items-start justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{line.product.name}</p>
                <p className="font-mono text-[11px] text-muted">{line.product.sku}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {line.quantity} × €{unit.toFixed(2)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-ink">€{lineTotal.toFixed(2)}</p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted">
          <dt>Subtotal</dt>
          <dd className="font-medium text-ink">€{subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between text-muted">
          <dt>Shipping</dt>
          <dd className="font-medium text-emerald-700">Free</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd className="text-brand-700">€{subtotal.toFixed(2)}</dd>
        </div>
      </dl>
    </div>
  );
}
