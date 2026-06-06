"use client";

import { useCart } from "@/context/CartContext";
import { BrandLink } from "@/components/catalog/BrandLink";
import { ProductImage } from "@/components/product/ProductImage";
import { isFrameProduct } from "@/lib/productUtils";
import { lineUnitPrice } from "@/lib/cartUtils";
import { toastAddedToCart } from "@/lib/toast";
import type { Product } from "@/types/product";
import type { MouseEvent } from "react";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { addProduct } = useCart();
  const isFrame = isFrameProduct(product);
  const price = lineUnitPrice(product);
  const primaryImage = product.imageUrl ?? product.imageUrls?.[0] ?? null;

  const handleOpenQuickView = () => {
    onSelect?.(product);
  };

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    addProduct(product, 1);
    toastAddedToCart(product.name);
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
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        onSelect ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" : ""
      }`}
    >
      <div className="relative">
        <ProductImage
          src={primaryImage}
          alt={product.name}
          containerClassName="rounded-t-2xl border-b border-gray-100 bg-white p-4"
        />

        {isFrame && product.framePostsCount != null && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow">
            {product.framePostsCount}-post frame
          </span>
        )}

        {product.ipRating && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
            {product.ipRating}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
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
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-ink group-hover:text-brand-700">
          {product.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted">{product.sku}</p>

        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          {!isFrame && product.maxAmps != null && (
            <li className="rounded-md bg-slate-100 px-2 py-0.5">{product.maxAmps} A max</li>
          )}
          {!isFrame && product.hasChildProtection && (
            <li className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700">
              Child protection
            </li>
          )}
          {product.categoryName && (
            <li className="rounded-md bg-slate-100 px-2 py-0.5">{product.categoryName}</li>
          )}
        </ul>

        <div className="mt-auto space-y-3 pt-4">
          <div className="flex items-end justify-between">
            <p className="text-lg font-bold text-ink">€{price.toFixed(2)}</p>
            <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
              {product.type}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-lg border border-brand-600 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            onMouseDown={(e) => e.stopPropagation()}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
