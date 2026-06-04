import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export function SmartSelectLoadingSkeleton() {
  return (
    <section className="py-4">
      <div className="text-center">
        <Skeleton className="mx-auto h-6 w-64" />
        <Skeleton className="mx-auto mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
