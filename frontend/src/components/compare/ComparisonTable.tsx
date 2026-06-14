"use client";

import { ExportTechSpecsButton } from "@/components/export/ExportTechSpecsButton";
import { ProductImageWithFallback } from "@/components/product/ProductImage";
import {
  COMPARE_DIFF_CELL_CLASS,
  COMPARE_DIFF_ROW_CLASS,
  COMPARE_ROWS,
  formatComparePrice,
  getCompareValue,
  rowValuesDiffer,
} from "@/lib/compareDisplay";
import { primaryProductImagePath } from "@/lib/productUtils";
import type { Product } from "@/types/product";

interface ComparisonTableProps {
  products: Product[];
  onRemove: (productId: number) => void;
}

export function ComparisonTable({ products, onRemove }: ComparisonTableProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportTechSpecsButton products={products} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-slate-50">
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-[11rem] border-r border-border bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted"
            >
              Характеристика
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                scope="col"
                className="min-w-[12rem] border-l border-border/60 px-4 py-3 text-left align-top first:border-l-0"
              >
                <div className="space-y-2">
                  <p className="line-clamp-2 font-semibold text-ink">{product.name}</p>
                  <p className="font-mono text-xs text-muted">{product.sku}</p>
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Видалити
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => {
            const differs = rowValuesDiffer(products, row.key);
            const rowClass = differs ? COMPARE_DIFF_ROW_CLASS : "bg-white";
            const stickyClass = differs ? COMPARE_DIFF_CELL_CLASS : "bg-white";

            return (
              <tr key={row.key} className={`border-b border-border last:border-b-0 ${rowClass}`}>
                <th
                  scope="row"
                  className={`sticky left-0 z-10 border-r border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 ${stickyClass}`}
                >
                  {row.label}
                </th>
                {products.map((product) => (
                  <td
                    key={`${product.id}-${row.key}`}
                    className={`border-l border-border/60 px-4 py-3 align-top text-slate-700 first:border-l-0 ${
                      differs ? "bg-blue-50/60" : ""
                    }`}
                  >
                    {row.key === "photo" ? (
                      <div className="mx-auto h-24 w-28 rounded-lg border border-gray-100 bg-white p-2">
                        <ProductImageWithFallback
                          src={primaryProductImagePath(product)}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : row.key === "price" ? (
                      <span className="font-semibold text-ink">{formatComparePrice(product)}</span>
                    ) : (
                      getCompareValue(product, row.key)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
