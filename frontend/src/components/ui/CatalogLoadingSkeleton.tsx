import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export function CatalogSidebarSkeleton() {
  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <Skeleton className="mb-5 h-4 w-32" />
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function CatalogLoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
