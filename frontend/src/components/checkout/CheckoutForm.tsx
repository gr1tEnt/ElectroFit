"use client";

import { CartLineItem } from "@/components/cart/CartLineItem";
import { useCart } from "@/context/CartContext";
import { submitOrder } from "@/lib/api";
import { lineUnitPrice } from "@/lib/cartUtils";
import type { OrderConfirmation } from "@/types/cart";
import Link from "next/link";
import { useState } from "react";

export function CheckoutForm() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await submitOrder({
        customerName: customerName.trim(),
        email: email.trim(),
        items: items.map((line) => ({
          productId: line.product.id,
          sku: line.product.sku,
          name: line.product.name,
          quantity: line.quantity,
          unitPrice: lineUnitPrice(line.product),
        })),
      });
      setConfirmation(result);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit order");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white">
          ✓
        </span>
        <h2 className="mt-4 text-2xl font-bold text-emerald-900">Order submitted</h2>
        <p className="mt-2 text-emerald-800">{confirmation.message}</p>
        <p className="mt-4 font-mono text-sm text-emerald-700">
          Order ID: {confirmation.orderId}
        </p>
        <p className="mt-2 text-lg font-semibold text-emerald-900">
          Total paid: €{confirmation.total.toFixed(2)}
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-lg font-semibold text-ink">Nothing to checkout</p>
        <Link href="/catalog" className="mt-4 inline-block text-brand-600 hover:underline">
          Go to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h2 className="text-lg font-semibold text-ink">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {items.map((line) => (
            <CartLineItem key={line.lineId} line={line} />
          ))}
        </ul>
        <div className="mt-6 flex justify-between rounded-xl bg-brand-50 px-5 py-4">
          <span className="text-lg font-semibold text-ink">Total</span>
          <span className="text-2xl font-bold text-brand-700">€{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-ink">Your details</h2>
        <p className="mt-1 text-sm text-muted">We&apos;ll confirm your order by email.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="name"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : `Submit order — €${subtotal.toFixed(2)}`}
        </button>

        <Link
          href="/cart"
          className="mt-3 block text-center text-sm text-muted hover:text-brand-600"
        >
          Back to cart
        </Link>
      </form>
    </div>
  );
}
