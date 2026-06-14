"use client";

import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { useCompare, MAX_COMPARE_PRODUCTS } from "@/context/CompareContext";
import Link from "next/link";

function compareCountLabel(count: number): string {
  if (count === 1) return "1 товар у порівнянні";
  if (count >= 2 && count <= 4) return `${count} товари у порівнянні`;
  return `${count} товарів у порівнянні`;
}

export function ComparePageClient() {
  const { products, count, removeFromCompare, clearCompare } = useCompare();

  if (count === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-ink">Немає товарів для порівняння</p>
        <p className="mt-2 text-sm text-muted">
          Додайте до {MAX_COMPARE_PRODUCTS} товарів з каталогу, щоб порівняти характеристики.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {compareCountLabel(count)} · максимум {MAX_COMPARE_PRODUCTS}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/catalog"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Додати ще товари
          </Link>
          <button
            type="button"
            onClick={clearCompare}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            Очистити порівняння
          </button>
        </div>
      </div>

      {count === 1 && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Додайте ще один товар, щоб побачити відмінності між характеристиками.
        </p>
      )}

      <ComparisonTable products={products} onRemove={removeFromCompare} />

      <p className="text-xs text-muted">
        Рядки з блакитним фоном показують характеристики, що відрізняються між товарами.
      </p>
    </div>
  );
}
