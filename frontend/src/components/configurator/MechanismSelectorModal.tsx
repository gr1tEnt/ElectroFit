"use client";

import { ProductImageWithFallback } from "@/components/product/ProductImage";
import { productImageSrc } from "@/lib/productUtils";
import type { Product } from "@/types/product";
import { useEffect } from "react";

interface MechanismSelectorModalProps {
  open: boolean;
  slotIndex: number | null;
  brandName: string;
  seriesName: string;
  currentProduct: Product | null;
  mechanisms: Product[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export function MechanismSelectorModal({
  open,
  slotIndex,
  brandName,
  seriesName,
  currentProduct,
  mechanisms,
  loading,
  error,
  onClose,
  onSelect,
}: MechanismSelectorModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || slotIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mechanism-selector-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        aria-label="Close mechanism selector"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
        <div className="border-b border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Change slot</p>
          <h2 id="mechanism-selector-title" className="mt-1 text-lg font-bold text-ink">
            Slot {slotIndex + 1} — pick a mechanism
          </h2>
          <p className="mt-1 text-sm text-muted">
            {brandName} · {seriesName}. All mechanisms from this series fit the same frame.
          </p>
        </div>

        <div className="overflow-y-auto px-3 py-3">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            </div>
          )}

          {error && !loading && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
          )}

          {!loading && !error && mechanisms.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-muted">
              No compatible single-post mechanisms found for {brandName} {seriesName}.
            </p>
          )}

          {!loading && !error && mechanisms.length > 0 && (
            <ul className="space-y-2">
              {mechanisms.map((mechanism) => {
                const selected = currentProduct?.id === mechanism.id;
                return (
                  <li key={mechanism.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(mechanism)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition hover:border-brand-400 hover:bg-brand-50/40 ${
                        selected
                          ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100"
                          : "border-border bg-white"
                      }`}
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-2">
                        <ProductImageWithFallback
                          src={productImageSrc(
                            mechanism.imageUrl ?? mechanism.imageUrls?.[0] ?? "",
                          )}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-ink">{mechanism.name}</p>
                        <p className="mt-0.5 font-mono text-xs text-muted">{mechanism.sku}</p>
                        {mechanism.categoryName && (
                          <p className="mt-1 text-xs text-muted">{mechanism.categoryName}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-sm font-bold text-brand-700">
                        €{mechanism.price.toFixed(2)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
