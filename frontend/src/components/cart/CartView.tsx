"use client";

import { CartLineItem } from "@/components/cart/CartLineItem";
import { ExportEstimateButton } from "@/components/cart/ExportEstimateButton";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export function CartView() {
  const { items, subtotal, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-lg font-semibold text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-muted">
          Add products from the catalog or build a modular set in the configurator.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalog"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse catalog
          </Link>
          <Link
            href="/configurator"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Open configurator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((line) => (
          <CartLineItem key={line.lineId} line={line} />
        ))}
      </ul>
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4">
        <span className="font-medium text-ink">Subtotal</span>
        <span className="text-xl font-bold text-ink">€{subtotal.toFixed(2)}</span>
      </div>
      <ExportEstimateButton items={items} />
      <Link
        href="/checkout"
        className="block w-full rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
