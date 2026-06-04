"use client";

import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
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
import { DEFAULT_FILTERS, type CatalogFilters, type Product } from "@/types/product";
import { useCallback, useEffect, useMemo, useState } from "react";

export function CatalogPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({
        brand: filters.brand || undefined,
        series: filters.series || undefined,
      });
      setProducts(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load catalog"));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.brand, filters.series]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const ampsBounds = useMemo(() => getAmpsBounds(products), [products]);
  const [ampsInitialized, setAmpsInitialized] = useState(false);

  useEffect(() => {
    if (!ampsInitialized && products.length > 0) {
      setFilters((prev) => ({
        ...prev,
        minAmps: ampsBounds.min,
        maxAmps: ampsBounds.max,
      }));
      setAmpsInitialized(true);
    }
  }, [products.length, ampsBounds.min, ampsBounds.max, ampsInitialized]);

  const brands = useMemo(() => getUniqueBrands(products), [products]);
  const series = useMemo(
    () => getUniqueSeries(products, filters.brand),
    [products, filters.brand],
  );

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);
  const activeFilterCount = countActiveFilters(filters, ampsBounds);

  const handleReset = () => {
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
          Professionals
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Product catalog</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Browse mechanisms and frames with deep technical filtering — IP rating, amperage, and
          safety features for compliant installations.
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
            onChange={setFilters}
            onReset={handleReset}
          />
        )}

        <section className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {loading ? "Loading catalog…" : `${filtered.length} of ${products.length} products`}
              {activeFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
                </span>
              )}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
              <span className="block text-xs text-red-600/80 mt-1">
                Ensure the Spring Boot API is running at {process.env.NEXT_PUBLIC_API_URL}
              </span>
            </div>
          )}

          {loading ? <CatalogLoadingSkeleton /> : <ProductGrid products={filtered} />}
        </section>
      </div>
    </div>
  );
}
