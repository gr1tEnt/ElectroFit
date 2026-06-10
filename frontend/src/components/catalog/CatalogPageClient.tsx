"use client";

import { CatalogSearchBar } from "@/components/catalog/CatalogSearchBar";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal";
import {
  CatalogLoadingSkeleton,
  CatalogSidebarSkeleton,
} from "@/components/ui/CatalogLoadingSkeleton";
import {
  countActiveFilters,
  filterProducts,
  getAmpsBounds,
  getUniqueBrands,
  getUniqueSeries,
} from "@/lib/filters";
import { getErrorMessage } from "@/lib/apiError";
import { fetchProducts } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { DEFAULT_FILTERS, type CatalogFilters, type Product } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function CatalogPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandFromUrl = searchParams.get("brand") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 300);
  const loadRequestRef = useRef(0);
  const initialLoadDoneRef = useRef(false);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.brand === brandFromUrl) {
        return prev;
      }
      return { ...prev, brand: brandFromUrl, series: "" };
    });
  }, [brandFromUrl]);

  const handleFiltersChange = useCallback(
    (next: CatalogFilters) => {
      setFilters(next);
      if (next.brand) {
        router.replace(`/catalog?brand=${encodeURIComponent(next.brand)}`);
      } else if (brandFromUrl) {
        router.replace("/catalog");
      }
    },
    [router, brandFromUrl],
  );

  const loadProducts = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    const isInitialLoad = !initialLoadDoneRef.current;
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await fetchProducts({
        brand: filters.brand || undefined,
        series: filters.series || undefined,
        search: debouncedSearch || undefined,
      });
      if (requestId !== loadRequestRef.current) {
        return;
      }
      setProducts(data);
    } catch (err) {
      if (requestId !== loadRequestRef.current) {
        return;
      }
      setError(getErrorMessage(err, "Не вдалося завантажити каталог"));
      setProducts([]);
    } finally {
      if (requestId === loadRequestRef.current) {
        initialLoadDoneRef.current = true;
        setLoading(false);
      }
    }
  }, [filters.brand, filters.series, debouncedSearch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const ampsBounds = useMemo(() => getAmpsBounds(products), [products]);
  const [ampsInitialized, setAmpsInitialized] = useState(false);

  useEffect(() => {
    setAmpsInitialized(false);
  }, [debouncedSearch, filters.brand, filters.series]);

  useEffect(() => {
    if (!ampsInitialized && products.length > 0) {
      setFilters((prev) => ({
        ...prev,
        minAmps: ampsBounds.min,
        maxAmps: ampsBounds.max,
      }));
      setAmpsInitialized(true);
    }
  }, [products, ampsBounds.min, ampsBounds.max, ampsInitialized]);

  const brands = useMemo(() => getUniqueBrands(products), [products]);
  const series = useMemo(
    () => getUniqueSeries(products, filters.brand),
    [products, filters.brand],
  );

  const filtered = useMemo(
    () => filterProducts(products, filters, debouncedSearch),
    [products, filters, debouncedSearch],
  );
  const activeFilterCount = countActiveFilters(filters, ampsBounds);

  const handleReset = () => {
    router.replace("/catalog");
    setSearchQuery("");
    loadRequestRef.current += 1;
    setAmpsInitialized(false);
    setFilters({
      ...DEFAULT_FILTERS,
      minAmps: ampsBounds.min,
      maxAmps: ampsBounds.max,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Професіоналам
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Каталог товарів</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Переглядайте механізми та рамки з глибокою технічною фільтрацією — клас IP, ампераж і
          функції безпеки для відповідних монтажів.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {loading ? (
          <CatalogSidebarSkeleton />
        ) : (
          <CatalogSidebar
            filters={filters}
            brands={brands}
            series={series}
            ampsBounds={ampsBounds}
            onChange={handleFiltersChange}
            onReset={handleReset}
          />
        )}

        <section className="min-w-0 flex-1">
          <CatalogSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />

          <div className="mb-4 mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {loading
                ? "Завантаження каталогу…"
                : `${filtered.length} з ${products.length} товарів`}
              {debouncedSearch && !loading && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  відповідає &ldquo;{debouncedSearch}&rdquo;
                </span>
              )}
              {activeFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {activeFilterCount === 1
                    ? "1 активний фільтр"
                    : `${activeFilterCount} активних фільтрів`}
                </span>
              )}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
              <span className="block text-xs text-red-600/80 mt-1">
                Переконайтеся, що Spring Boot API працює на {process.env.NEXT_PUBLIC_API_URL}
              </span>
            </div>
          )}

          {loading ? (
            <CatalogLoadingSkeleton />
          ) : (
            <ProductGrid
              products={filtered}
              onProductSelect={setSelectedProduct}
            />
          )}
        </section>
      </div>

      <ProductQuickViewModal
        isOpen={selectedProduct != null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}
