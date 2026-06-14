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
          `Не знайдено відповідного комплекту рамки на ${posts} позиції та розеток. Додайте товари з категорією «Розетки» та однаковою серією бренду.`,
        );
      }
    } catch (err) {
      setSets([]);
      setError(getErrorMessage(err, "Не вдалося завантажити дані конфігуратора"));
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
        setMechanismError(getErrorMessage(err, "Не вдалося завантажити механізми"));
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
    toastAddedSet(`Модульний комплект (${selectedSlots.length}-позиційна ${selectedSet.seriesName})`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <div className="mb-6 text-center md:mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 sm:text-sm">
          Модульна система
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">Конфігуратор рамок</h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          Оберіть розмір рамки, а потім комбінуйте різні механізми одного бренду та серії в кожній
          позиції.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-base font-semibold text-ink md:text-lg">Що вам потрібно?</h2>
        <p className="mt-1 text-sm text-muted">Оберіть кількість позицій для механізмів у вашій рамці.</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-5 md:grid-cols-5">
          {BLOCK_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setBlockSize(size)}
              className={`min-h-11 rounded-xl border-2 px-3 py-3 text-center transition md:px-4 md:py-4 ${
                blockSize === size
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-border hover:border-brand-300"
              }`}
            >
              <span className="block text-xl font-bold md:text-2xl">{size}</span>
              <span className="mt-1 block text-xs font-medium">
                {size === 1 ? "позиція" : "позиції"}
              </span>
            </button>
          ))}
        </div>

        {blockSize === 3 && (
          <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
            Обрано: <strong>3-позиційна рамка</strong> — наприклад, 1 розетка + 1 вимикач + 1 USB в одній
            серії Valena Life.
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
              <label className="text-sm font-medium text-ink">Бренд / серія</label>
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

          <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm md:p-5">
            <ul className="space-y-2 text-slate-700">
              <li>
                <span className="font-medium">Рамка:</span> 1× {selectedSet.frame.name} (
                {selectedSet.frame.sku}) — €{selectedSet.frame.price.toFixed(2)}
              </li>
              {mechanismSummary.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span className="font-medium">Механізм:</span> {quantity}× {product.name} (
                  {product.sku}) — €{(product.price * quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            {setPrice != null && !Number.isNaN(setPrice) && (
              <p className="mt-4 text-base font-bold text-ink md:text-lg">Ціна комплекту: €{setPrice.toFixed(2)}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="min-h-11 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700 md:py-4 md:text-base"
          >
            Додати повний комплект до кошика
          </button>

          <p className="text-center text-sm text-muted">
            <a href="/cart" className="font-medium text-brand-600 hover:underline">
              Переглянути кошик ({itemCount} шт.)
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
