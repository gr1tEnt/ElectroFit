"use client";

import { MechanismSelectorModal } from "@/components/configurator/MechanismSelectorModal";
import { ModularSetPreview } from "@/components/configurator/ModularSetPreview";
import { useCart } from "@/context/CartContext";
import { getErrorMessage } from "@/lib/apiError";
import { fetchConfiguratorSets, fetchSeriesMechanisms } from "@/lib/api";
import { toastAddedSet } from "@/lib/toast";
import type { Product } from "@/types/product";
import {
  BLOCK_SIZE_OPTIONS,
  computeAssemblyPrice,
  summarizeMechanisms,
  type BlockSize,
  type ConfiguratorSet,
} from "@/types/configurator";
import { useCallback, useEffect, useMemo, useState } from "react";

export function Configurator() {
  const { addFullSet, itemCount } = useCart();
  const [blockSize, setBlockSize] = useState<BlockSize>(3);
  const [sets, setSets] = useState<ConfiguratorSet[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectorSlotIndex, setSelectorSlotIndex] = useState<number | null>(null);
  const [availableMechanisms, setAvailableMechanisms] = useState<Product[]>([]);
  const [loadingMechanisms, setLoadingMechanisms] = useState(false);
  const [mechanismError, setMechanismError] = useState<string | null>(null);

  const loadSets = useCallback(async (posts: BlockSize) => {
    setLoading(true);
    setError(null);
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
      setError(getErrorMessage(err, "Failed to load configurator data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSets(blockSize);
  }, [blockSize, loadSets]);

  const selectedSet = sets[selectedIndex] ?? null;

  useEffect(() => {
    if (!selectedSet) {
      setSelectedSlots([]);
      return;
    }
    setSelectedSlots(
      Array.from({ length: selectedSet.mechanismQuantity }, () => selectedSet.mechanism),
    );
    setSelectorSlotIndex(null);
  }, [selectedSet]);

  const setPrice = useMemo(() => {
    if (!selectedSet || selectedSlots.length === 0) return null;
    return computeAssemblyPrice(selectedSet.frame, selectedSlots);
  }, [selectedSet, selectedSlots]);

  const mechanismSummary = useMemo(
    () => summarizeMechanisms(selectedSlots),
    [selectedSlots],
  );

  const openSlotSelector = useCallback(
    async (slotIndex: number) => {
      if (!selectedSet) return;
      setSelectorSlotIndex(slotIndex);
      setMechanismError(null);
      setLoadingMechanisms(true);
      try {
        const mechanisms = await fetchSeriesMechanisms(
          selectedSet.brandName,
          selectedSet.seriesName,
        );
        setAvailableMechanisms(mechanisms);
      } catch (err) {
        setAvailableMechanisms([]);
        setMechanismError(getErrorMessage(err, "Failed to load mechanisms"));
      } finally {
        setLoadingMechanisms(false);
      }
    },
    [selectedSet],
  );

  const handleSelectMechanism = (product: Product) => {
    if (selectorSlotIndex === null) return;
    setSelectedSlots((prev) => {
      const next = [...prev];
      next[selectorSlotIndex] = product;
      return next;
    });
    setSelectorSlotIndex(null);
  };

  const handleAddToCart = () => {
    if (!selectedSet || selectedSlots.length === 0) return;
    addFullSet({
      frame: selectedSet.frame,
      slots: selectedSlots,
      brandName: selectedSet.brandName,
      seriesName: selectedSet.seriesName,
    });
    toastAddedSet(`Modular set (${selectedSlots.length}-post ${selectedSet.seriesName})`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Modular system
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Configurator</h1>
        <p className="mt-2 text-muted">
          Pick a frame size, then mix different mechanisms from the same brand and series in each
          slot.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">What do you need?</h2>
        <p className="mt-1 text-sm text-muted">Select how many mechanism slots your frame has.</p>

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
                {size === 1 ? "slot" : "slots"}
              </span>
            </button>
          ))}
        </div>

        {blockSize === 3 && (
          <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
            Selected: <strong>3-post frame</strong> — e.g. 1 socket + 1 switch + 1 USB in the same
            Valena Life series.
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

      {selectedSet && !loading && selectedSlots.length > 0 && (
        <div className="mt-8 space-y-6">
          {sets.length > 1 && (
            <div>
              <label className="text-sm font-medium text-ink">Brand / series</label>
              <select
                value={selectedIndex}
                onChange={(e) => {
                  setSelectedIndex(Number(e.target.value));
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

          <ModularSetPreview
            frame={selectedSet.frame}
            slots={selectedSlots}
            brandName={selectedSet.brandName}
            seriesName={selectedSet.seriesName}
            onSlotClick={(slotIndex) => void openSlotSelector(slotIndex)}
          />

          <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm">
            <ul className="space-y-2 text-slate-700">
              <li>
                <span className="font-medium">Frame:</span> 1× {selectedSet.frame.name} (
                {selectedSet.frame.sku}) — €{selectedSet.frame.price.toFixed(2)}
              </li>
              {mechanismSummary.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span className="font-medium">Mechanism:</span> {quantity}× {product.name} (
                  {product.sku}) — €{(product.price * quantity).toFixed(2)}
                </li>
              ))}
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

          <p className="text-center text-sm text-muted">
            <a href="/cart" className="font-medium text-brand-600 hover:underline">
              View cart ({itemCount} items)
            </a>
          </p>
        </div>
      )}

      <MechanismSelectorModal
        open={selectorSlotIndex !== null}
        slotIndex={selectorSlotIndex}
        brandName={selectedSet?.brandName ?? ""}
        seriesName={selectedSet?.seriesName ?? ""}
        currentProduct={selectorSlotIndex != null ? selectedSlots[selectorSlotIndex] ?? null : null}
        mechanisms={availableMechanisms}
        loading={loadingMechanisms}
        error={mechanismError}
        onClose={() => setSelectorSlotIndex(null)}
        onSelect={handleSelectMechanism}
      />
    </div>
  );
}
