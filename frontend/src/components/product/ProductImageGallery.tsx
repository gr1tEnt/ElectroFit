"use client";

import { productImageSrc } from "@/lib/productUtils";
import { useEffect, useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
        <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const mainSrc = productImageSrc(images[activeIndex] ?? images[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainSrc}
          alt={alt}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3" aria-label="Product image thumbnails">
          {images.map((url, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={`${url}-${index}`}
                type="button"
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-pressed={selected}
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-xl border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  selected
                    ? "border-brand-600 ring-2 ring-brand-100"
                    : "border-border opacity-80 hover:border-brand-300 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productImageSrc(url)}
                  alt=""
                  className="h-20 w-28 object-cover sm:h-24 sm:w-32"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
