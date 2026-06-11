import { Suspense } from "react";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import { CatalogLoadingSkeleton, CatalogSidebarSkeleton } from "@/components/ui/CatalogLoadingSkeleton";

function CatalogPageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-9 w-64 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <CatalogSidebarSkeleton />
        <div className="min-w-0 flex-1">
          <CatalogLoadingSkeleton />
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogPageClient />
    </Suspense>
  );
}
