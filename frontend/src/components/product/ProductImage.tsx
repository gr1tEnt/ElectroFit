"use client";

import {
  PRODUCT_IMAGE_PLACEHOLDER,
  productImageSrc,
  resolveProductImageUrl,
} from "@/lib/productUtils";
import { useEffect, useState } from "react";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function ProductImage({
  src,
  alt,
  className = "h-full w-full object-contain",
  containerClassName = "rounded-t-2xl border-b border-gray-100 bg-white p-4",
}: ProductImageProps) {
  const placeholderSrc = productImageSrc(PRODUCT_IMAGE_PLACEHOLDER);
  const [currentSrc, setCurrentSrc] = useState(() => resolveProductImageUrl(src));

  useEffect(() => {
    setCurrentSrc(resolveProductImageUrl(src));
  }, [src]);

  const handleError = () => {
    setCurrentSrc((prev) => (prev === placeholderSrc ? prev : placeholderSrc));
  };

  return (
    <div className={containerClassName}>
      <div className="aspect-[4/3] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={alt}
          onError={handleError}
          className={className}
        />
      </div>
    </div>
  );
}

interface ProductImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

/** Image with onError fallback; for gallery thumbnails and inline uses. */
export function ProductImageWithFallback({
  src,
  alt,
  className,
}: ProductImageWithFallbackProps) {
  const placeholderSrc = productImageSrc(PRODUCT_IMAGE_PLACEHOLDER);
  const [currentSrc, setCurrentSrc] = useState(() => resolveProductImageUrl(src));

  useEffect(() => {
    setCurrentSrc(resolveProductImageUrl(src));
  }, [src]);

  const handleError = () => {
    setCurrentSrc((prev) => (prev === placeholderSrc ? prev : placeholderSrc));
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={currentSrc} alt={alt} onError={handleError} className={className} />
  );
}
