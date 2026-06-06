"use client";

import { DetailedSpecificationsAccordion } from "@/components/product/DetailedSpecificationsAccordion";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { useCart } from "@/context/CartContext";
import { fetchProductById } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiError";
import { lineUnitPrice } from "@/lib/cartUtils";
import { isWaterResistant, productGalleryUrlsWithFallback, resolveProductSpec, isFrameProduct, filterDetailedAttributesForProduct } from "@/lib/productUtils";
import { toastAddedToCart } from "@/lib/toast";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState, type ReactNode } from "react";

interface ProductQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

function SpecBadge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function QuickViewSpecBadges({ product }: { product: Product }) {
  const spec = resolveProductSpec(product);
  const waterResistant = isWaterResistant(spec.ipRating);
  const isFrame = isFrameProduct(product);

  return (
    <div className="flex flex-wrap gap-2">
      {spec.ipRating && waterResistant && (
        <SpecBadge className="bg-brand-100 text-brand-800">
          {spec.ipRating} Water Resistant
        </SpecBadge>
      )}
      {spec.ipRating && !waterResistant && (
        <SpecBadge className="bg-slate-100 text-slate-800">{spec.ipRating}</SpecBadge>
      )}
      {!isFrame && spec.maxAmps != null && (
        <SpecBadge className="bg-slate-100 text-slate-700">{spec.maxAmps} A max</SpecBadge>
      )}
      {!isFrame && spec.hasChildProtection && (
        <SpecBadge className="bg-emerald-100 text-emerald-800">Child Protection</SpecBadge>
      )}
      {!isFrame && spec.hasGrounding && (
        <SpecBadge className="bg-teal-50 text-teal-800">PE Grounding</SpecBadge>
      )}
      {!isFrame && spec.hasGrounding === false && (
        <SpecBadge className="bg-amber-100 text-amber-900">No PE grounding</SpecBadge>
      )}
      {!isFrame && product.lowVoltage && (
        <SpecBadge className="bg-violet-100 text-violet-800">SELV / Low voltage</SpecBadge>
      )}
      {isFrame && spec.framePostsCount != null && (
        <SpecBadge className="bg-accent/15 text-amber-950">
          {spec.framePostsCount}-post frame
        </SpecBadge>
      )}
    </div>
  );
}

export function ProductQuickViewModal({ isOpen, onClose, product }: ProductQuickViewModalProps) {
  const { addProduct } = useCart();
  const [details, setDetails] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDetails = useCallback(async (id: number, fallback: Product) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchProductById(id);
      setDetails(data);
    } catch (err) {
      setLoadError(getErrorMessage(err, "Could not load product details"));
      setDetails(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !product) {
      setDetails(null);
      setLoadError(null);
      return;
    }
    setDetails(product);
    loadDetails(product.id, product);
  }, [isOpen, product, loadDetails]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  const display = details ?? product;
  const price = lineUnitPrice(display);
  const images = productGalleryUrlsWithFallback(display);

  const handleAddToCart = () => {
    addProduct(display, 1);
    toastAddedToCart(display.name);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close quick view"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative z-10 max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md transition hover:bg-slate-100 hover:text-ink"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-5 sm:p-8">
          {loading && !details?.imageUrls?.length && (
            <p className="mb-4 text-center text-sm text-muted">Loading product details…</p>
          )}
          {loadError && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{loadError}</p>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            <ProductImageGallery images={images} alt={display.name} imageFit="contain" />

            <div className="min-w-0 pt-2 md:pt-0">
              <p className="text-sm font-medium uppercase tracking-wide text-muted">
                {display.brandName}
                {display.seriesName ? (
                  <>
                    <span className="text-border"> · </span>
                    <span className="text-brand-700">{display.seriesName}</span>
                  </>
                ) : null}
              </p>

              <h2 id="quick-view-title" className="mt-2 pr-10 text-xl font-bold text-ink sm:text-2xl">
                {display.name}
              </h2>

              <p className="mt-1 font-mono text-xs text-muted">{display.sku}</p>

              <p className="mt-4 text-2xl font-bold text-ink">€{price.toFixed(2)}</p>

              {display.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{display.description}</p>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
              >
                Add to cart
              </button>

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Technical specifications
                </h3>
                <div className="mt-3">
                  <QuickViewSpecBadges product={display} />
                </div>
              </div>
            </div>
          </div>

          <DetailedSpecificationsAccordion
            attributes={filterDetailedAttributesForProduct(display, display.detailedAttributes)}
          />
        </div>
      </div>
    </div>
  );
}
