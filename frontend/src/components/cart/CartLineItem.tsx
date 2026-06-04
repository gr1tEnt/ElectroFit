"use client";

import { useCart } from "@/context/CartContext";
import { lineSubtotal, lineUnitPrice } from "@/lib/cartUtils";
import type { CartLine } from "@/types/cart";

interface CartLineItemProps {
  line: CartLine;
}

export function CartLineItem({ line }: CartLineItemProps) {
  const { updateQuantity, removeLine } = useCart();
  const unit = lineUnitPrice(line.product);

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        {line.bundleLabel && (
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {line.bundleLabel}
          </p>
        )}
        <p className="font-semibold text-ink">{line.product.name}</p>
        <p className="font-mono text-xs text-muted">{line.product.sku}</p>
        <p className="mt-1 text-xs text-muted">
          {line.source === "modular-set" ? "From configurator" : "From catalog"} · €
          {unit.toFixed(2)} each
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-border">
          <button
            type="button"
            onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
            className="px-3 py-1.5 text-lg text-slate-600 hover:bg-slate-50"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center text-sm font-medium">{line.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
            className="px-3 py-1.5 text-lg text-slate-600 hover:bg-slate-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <p className="w-20 text-right font-semibold text-ink">€{lineSubtotal(line).toFixed(2)}</p>
        <button
          type="button"
          onClick={() => removeLine(line.lineId)}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
