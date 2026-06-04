"use client";

import { ModularSetPreview } from "@/components/configurator/ModularSetPreview";
import { useCart } from "@/context/CartContext";
import { fetchConfiguratorSets } from "@/lib/api";
import {
  BLOCK_SIZE_OPTIONS,
  type BlockSize,
  type ConfiguratorSet,
} from "@/types/configurator";
import { useCallback, useEffect, useState } from "react";

export function Configurator() {
  const { addFullSet, itemCount } = useCart();
  const [blockSize, setBlockSize] = useState<BlockSize>(3);
  const [sets, setSets] = useState<ConfiguratorSet[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const loadSets = useCallback(async (posts: BlockSize) => {
    setLoading(true);
    setError(null);
    setAdded(false);
    try {
      const results = await fetchConfiguratorSets(posts, "Sockets");
      setSets(results);
      setSelectedIndex(0);
      if (results.length === 0) {
        setError(
          `No matching ${posts}-post frame and socket set found. Add products with category "Sockets" and matching brand series.`,
        );
      }
    } catch (err) {
      setSets([]);
      setError(err instanceof Error ? err.message : "Failed to load configurator data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSets(blockSize);
  }, [blockSize, loadSets]);

  const selectedSet = sets[selectedIndex] ?? null;

  const handleAddToCart = () => {
    if (!selectedSet) return;
    addFullSet(selectedSet);
    setAdded(true);
  };

  const setPrice =
    selectedSet &&
    (typeof selectedSet.setPrice === "number"
      ? selectedSet.setPrice
      : Number(selectedSet.setPrice));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Modular system
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Configurator</h1>
        <p className="mt-2 text-muted">
          Combine a frame and identical socket mechanisms from the same brand and series.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">What do you need?</h2>
        <p className="mt-1 text-sm text-muted">Select the number of sockets in your block.</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {BLOCK_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setBlockSize(size)}
              className={`rounded-xl border-2 px-4 py-4 text-center transition ${
                blockSize === size
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-border hover:border-brand-300"
              }`}
            >
              <span className="block text-2xl font-bold">{size}</span>
              <span className="mt-1 block text-xs font-medium">
                {size === 1 ? "socket" : "sockets"}
              </span>
            </button>
          ))}
        </div>

        {blockSize === 3 && (
          <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
            Selected: <strong>I need a block of 3 sockets</strong> — we&apos;ll find a 3-post frame
            and 3 matching mechanisms.
          </p>
        )}
      </section>

      {loading && (
        <div className="mt-8 flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      {selectedSet && !loading && (
        <div className="mt-8 space-y-6">
          {sets.length > 1 && (
            <div>
              <label className="text-sm font-medium text-ink">Brand / series</label>
              <select
                value={selectedIndex}
                onChange={(e) => {
                  setSelectedIndex(Number(e.target.value));
                  setAdded(false);
                }}
                className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
              >
                {sets.map((set, index) => (
                  <option key={index} value={index}>
                    {set.brandName} — {set.seriesName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <ModularSetPreview set={selectedSet} />

          <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm">
            <ul className="space-y-2 text-slate-700">
              <li>
                <span className="font-medium">Frame:</span> 1× {selectedSet.frame.name} (
                {selectedSet.frame.sku})
              </li>
              <li>
                <span className="font-medium">Mechanisms:</span> {selectedSet.mechanismQuantity}×{" "}
                {selectedSet.mechanism.name} ({selectedSet.mechanism.sku})
              </li>
            </ul>
            {setPrice != null && !Number.isNaN(setPrice) && (
              <p className="mt-4 text-lg font-bold text-ink">Set price: €{setPrice.toFixed(2)}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-xl bg-brand-600 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-brand-700"
          >
            Add full set to cart
          </button>

          {added && (
            <p className="text-center text-sm font-medium text-emerald-700">
              Added to cart — {itemCount} item{itemCount !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
      )}
    </div>
  );
}
