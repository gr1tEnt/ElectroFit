"use client";

import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { BrandLink } from "@/components/catalog/BrandLink";
import { ProductImage } from "@/components/product/ProductImage";
import { CatalogStarRating } from "@/components/ui/CatalogStarRating";
import { isFrameProduct, productGalleryUrls } from "@/lib/productUtils";
import { lineUnitPrice } from "@/lib/cartUtils";
import { toastAddedToCart } from "@/lib/toast";
import type { Product, ProductType } from "@/types/product";
import type { MouseEvent } from "react";

const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  MECHANISM: "Механізм",
  FRAME: "Рамка",
};

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { addProduct } = useCart();
  const { isInCompare, addToCompare, removeFromCompare, canAddToCompare } = useCompare();
  const isFrame = isFrameProduct(product);
  const price = lineUnitPrice(product);
  const primaryImage = productGalleryUrls(product)[0] ?? null;
  const inCompare = isInCompare(product.id);
  const compareDisabled = !inCompare && !canAddToCompare(product.id);

  const handleOpenQuickView = () => {
    onSelect?.(product);
  };

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    addProduct(product, 1);
    toastAddedToCart(product.name);
  };

  const handleCompareToggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
      return;
    }
    addToCompare(product);
  };

  return (
    <article
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? handleOpenQuickView : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenQuickView();
              }
            }
          : undefined
      }
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl ${
        onSelect ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" : ""
      }`}
    >
      <div className="relative">
        <ProductImage
          src={primaryImage}
          alt={product.name}
          containerClassName="rounded-t-xl border-b border-gray-100 bg-white p-2 sm:rounded-t-2xl sm:p-4"
        />

        {isFrame && product.framePostsCount != null && (
          <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
            {product.framePostsCount}-постова рамка
          </span>
        )}

        {product.ipRating && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
            {product.ipRating}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <p className="line-clamp-1 text-[10px] font-medium uppercase tracking-wide text-muted sm:text-xs">
          {product.brandName ? (
            <BrandLink brandName={product.brandName} className="text-muted hover:text-blue-600" />
          ) : null}
          {product.seriesName ? (
            <>
              {product.brandName ? " · " : ""}
              {product.seriesName}
            </>
          ) : null}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-ink group-hover:text-brand-700 sm:mt-1 sm:text-base">
          {product.name}
        </h3>
        <CatalogStarRating
          className="mt-1 sm:mt-1.5"
          averageRating={product.averageRating ?? 0}
          reviewCount={product.reviewCount ?? 0}
        />

        <ul className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-2">
          {!isFrame && product.maxAmps != null && (
            <li className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 sm:px-2 sm:text-xs">
              до {product.maxAmps} А
            </li>
          )}
          {!isFrame && product.hasChildProtection && (
            <li className="hidden rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700 sm:list-item sm:px-2 sm:text-xs">
              Дитячий захист
            </li>
          )}
          {product.categoryName && (
            <li className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 sm:px-2 sm:text-xs">
              {product.categoryName}
            </li>
          )}
        </ul>

        <div className="mt-auto space-y-2 pt-2.5 sm:space-y-3 sm:pt-4">
          <div className="flex items-end justify-between gap-1">
            <p className="text-base font-bold text-ink sm:text-lg">€{price.toFixed(2)}</p>
            <span className="shrink-0 rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 sm:px-2 sm:py-1 sm:text-xs">
              {PRODUCT_TYPE_LABELS[product.type]}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-lg border border-brand-600 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 sm:py-2 sm:text-sm"
            onMouseDown={(e) => e.stopPropagation()}
          >
            Додати до кошика
          </button>
          <button
            type="button"
            onClick={handleCompareToggle}
            disabled={compareDisabled}
            className={`w-full rounded-lg px-1 py-1.5 text-[10px] font-semibold leading-snug transition sm:px-2 sm:py-2 sm:text-sm sm:leading-normal ${
              inCompare
                ? "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                : compareDisabled
                  ? "cursor-not-allowed border border-border bg-slate-50 text-slate-400"
                  : "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {inCompare ? "Видалити з порівняння" : "Додати до порівняння"}
          </button>
        </div>
      </div>
    </article>
  );
}
