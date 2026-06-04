"use client";

import { CreateProductModal } from "@/components/admin/CreateProductModal";
import { fetchAllProducts } from "@/lib/adminApi";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Product manager</h2>
          <p className="mt-1 text-slate-400">
            {loading ? "Loading…" : `${products.length} products in catalog`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400"
        >
          + Create product
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Series</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Rooms</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-800" />
                    </td>
                  </tr>
                ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    No products yet. Create your first product.
                  </td>
                </tr>
              )}
              {!loading &&
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-800/80 transition hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{product.sku}</td>
                    <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                    <td className="px-4 py-3 text-slate-300">{product.brandName ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-300">{product.seriesName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-xs">
                        {product.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{product.ipRating ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex max-w-[200px] flex-wrap gap-1">
                        {(product.compatibleRoomTypes ?? []).slice(0, 3).map((room) => (
                          <span
                            key={room}
                            className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-300"
                          >
                            {room}
                          </span>
                        ))}
                        {(product.compatibleRoomTypes?.length ?? 0) > 3 && (
                          <span className="text-[10px] text-slate-500">
                            +{product.compatibleRoomTypes!.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-white">
                      €
                      {(typeof product.price === "number"
                        ? product.price
                        : Number(product.price)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadProducts}
      />
    </div>
  );
}
