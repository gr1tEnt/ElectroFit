"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface BrandLinkProps {
  brandName: string;
  /** Called before navigation (e.g. close a modal). */
  onNavigate?: () => void;
  className?: string;
  children?: ReactNode;
}

export function BrandLink({ brandName, onNavigate, className = "", children }: BrandLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNavigate?.();
    router.push(`/catalog?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer transition-colors hover:text-blue-600 hover:underline ${className}`}
    >
      {children ?? brandName}
    </button>
  );
}
