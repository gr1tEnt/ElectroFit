"use client";

import { CartCompatibilityAlert } from "@/components/cart/CartCompatibilityAlert";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { ExportEstimateButton } from "@/components/cart/ExportEstimateButton";
import { ExportTechSpecsButton } from "@/components/export/ExportTechSpecsButton";
import { useCart } from "@/context/CartContext";
import { useCartSeriesCompatibility } from "@/hooks/useCartSeriesCompatibility";
import Link from "next/link";
import { useMemo } from "react";

export function CartView() {
  const { items, subtotal, itemCount } = useCart();
  const compatibility = useCartSeriesCompatibility(items);
  const cartProducts = useMemo(() => {
    const seen = new Set<number>();
    return items
      .map((line) => line.product)
      .filter((product) => {
        if (seen.has(product.id)) return false;
        seen.add(product.id);
        return true;
      });
  }, [items]);

  if (itemCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-lg font-semibold text-ink">Ваш кошик порожній</p>
        <p className="mt-2 text-sm text-muted">
          Додайте товари з каталогу або зберіть модульний комплект у конфігураторі рамок.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalog"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Переглянути каталог
          </Link>
          <Link
            href="/configurator"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Відкрити конфігуратор рамок
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {compatibility.hasRisk && <CartCompatibilityAlert series={compatibility.series} />}
      <ul className="space-y-3">
        {items.map((line) => (
          <CartLineItem key={line.lineId} line={line} />
        ))}
      </ul>
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4">
        <span className="font-medium text-ink">Проміжна сума</span>
        <span className="text-xl font-bold text-ink">€{subtotal.toFixed(2)}</span>
      </div>
      <ExportEstimateButton items={items} />
      <div className="flex justify-end">
        <ExportTechSpecsButton products={cartProducts} />
      </div>
      <Link
        href="/checkout"
        className="block w-full rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
      >
        Перейти до оформлення замовлення
      </Link>
    </div>
  );
}
