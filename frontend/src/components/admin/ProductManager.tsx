"use client";

import { CreateProductModal } from "@/components/admin/CreateProductModal";
import { getErrorMessage } from "@/lib/apiError";
import { deleteProduct, fetchAllProducts } from "@/lib/adminApi";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
      />
    </svg>
  );
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await fetchAllProducts();
      setProducts(data.map((product) => ({ ...product, price: Number(product.price) })));
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося завантажити товари"));
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const handleProductSaved = useCallback(
    async (updatedProduct?: Product) => {
      if (updatedProduct) {
        setProducts((prev) => {
          const exists = prev.some((product) => product.id === updatedProduct.id);
          if (exists) {
            return prev.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product,
            );
          }
          return [updatedProduct, ...prev];
        });
        await loadProducts(false);
      } else {
        await loadProducts(true);
      }
    },
    [loadProducts],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Видалити «${product.name}» (${product.sku})? Цю дію не можна скасувати.`,
    );
    if (!confirmed) return;

    setDeletingId(product.id);
    setError(null);
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося видалити товар"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Керування товарами</h2>
          <p className="mt-1 text-slate-400">
            {loading ? "Завантаження…" : `${products.length} товарів у каталозі`}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          + Додати товар
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Назва</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Бренд</th>
                <th className="px-4 py-3 font-medium">Категорія</th>
                <th className="px-4 py-3 font-medium text-right">Ціна</th>
                <th className="px-4 py-3 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-800" />
                    </td>
                  </tr>
                ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    Товарів ще немає. Додайте перший товар.
                  </td>
                </tr>
              )}
              {!loading &&
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-800/80 transition hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{product.sku}</td>
                    <td className="px-4 py-3 text-slate-300">{product.brandName ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-300">{product.categoryName ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-white">
                      €
                      {(typeof product.price === "number"
                        ? product.price
                        : Number(product.price)
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800/60 p-2 text-slate-200 transition hover:bg-slate-700 hover:text-white"
                          aria-label={`Редагувати ${product.name}`}
                          title="Редагувати товар"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20 hover:text-red-200 disabled:opacity-50"
                          aria-label={`Видалити ${product.name}`}
                          title="Видалити товар"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateProductModal
        open={modalOpen}
        editingProduct={editingProduct}
        onClose={closeModal}
        onSaved={handleProductSaved}
      />
    </div>
  );
}
