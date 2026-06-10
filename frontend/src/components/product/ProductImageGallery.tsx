"use client";

import { ProductImageWithFallback } from "@/components/product/ProductImage";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  productImageSrc,
  resolveProductImageUrl,
} from "@/lib/productUtils";
import { useEffect, useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  /** Use "contain" in quick view so the full product is visible without cropping. */
  imageFit?: "cover" | "contain";
}

export function ProductImageGallery({
  images,
  alt,
  imageFit = "cover",
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryImages =
    images.length > 0 ? images : [PRODUCT_IMAGE_PLACEHOLDER];

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const isContain = imageFit === "contain";
  const mainSrc = resolveProductImageUrl(galleryImages[activeIndex] ?? galleryImages[0]);

  return (
    <div className="space-y-4">
      <div
        className={
          isContain
            ? "rounded-2xl border border-gray-100 bg-white p-6"
            : "overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
        }
      >
        <div className={isContain ? "aspect-[4/3] w-full" : undefined}>
          <ProductImageWithFallback
            src={mainSrc}
            alt={alt}
            className={
              isContain
                ? "h-full w-full object-contain"
                : "aspect-[4/3] w-full object-cover"
            }
          />
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div className="flex flex-wrap gap-3" aria-label="Мініатюри зображень товару">
          {galleryImages.map((url, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={`${url}-${index}`}
                type="button"
                aria-label={`Переглянути зображення ${index + 1} з ${galleryImages.length}`}
                aria-pressed={selected}
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-xl border-2 bg-white p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  selected
                    ? "border-brand-600 ring-2 ring-brand-100"
                    : "border-border opacity-80 hover:border-brand-300 hover:opacity-100"
                }`}
              >
                <ProductImageWithFallback
                  src={productImageSrc(url)}
                  alt=""
                  className="h-20 w-28 object-contain sm:h-24 sm:w-32"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
