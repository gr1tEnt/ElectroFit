"use client";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal";
import { RoomIcon } from "@/components/smart-select/RoomIcon";
import { WizardProgress } from "@/components/smart-select/WizardProgress";
import { EmptyState } from "@/components/ui/EmptyState";
import { SmartSelectLoadingSkeleton } from "@/components/ui/SmartSelectLoadingSkeleton";
import { getErrorMessage } from "@/lib/apiError";
import { fetchSmartSelectProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import {
  ROOM_LABELS,
  ROOM_OPTIONS,
  type RoomId,
} from "@/types/smartSelect";
import Link from "next/link";
import { useState } from "react";

export function SmartSelectWizard() {
  const [step, setStep] = useState(1);
  const [room, setRoom] = useState<RoomId | null>(null);
  const [nearWater, setNearWater] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const hasChildrenForApi = room === "KIDS_ROOM" || hasChildren;

  const runSmartSelect = async () => {
    if (!room) return;

    setStep(3);
    setLoading(true);
    setError(null);

    try {
      const results = await fetchSmartSelectProducts({
        roomType: room,
        nearWater: room === "BATHROOM" ? nearWater : false,
        hasChildren: hasChildrenForApi,
      });
      setProducts(results);
      setStep(4);
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong"));
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (selected: RoomId) => {
    setRoom(selected);
    if (selected === "KIDS_ROOM") {
      setHasChildren(true);
    } else {
      setHasChildren(false);
    }
    if (selected !== "BATHROOM") {
      setNearWater(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setRoom(null);
    setNearWater(false);
    setHasChildren(false);
    setProducts([]);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          For beginners
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Smart Selector</h1>
        <p className="mt-2 text-muted">
          Answer a few simple questions and we&apos;ll recommend products safe for your space.
        </p>
      </div>

      <WizardProgress currentStep={step} />

      {step === 1 && (
        <section>
          <h2 className="text-xl font-semibold text-ink">Step 1 — Choose the room</h2>
          <p className="mt-1 text-sm text-muted">Where will you install the electrical accessories?</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ROOM_OPTIONS.map((option) => {
              const selected = room === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleRoomSelect(option.id)}
                  className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition ${
                    selected
                      ? "border-brand-600 bg-brand-50 shadow-md"
                      : "border-border bg-white hover:border-brand-300 hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                      selected ? "bg-brand-600 text-white" : "bg-slate-100 text-brand-600"
                    }`}
                  >
                    <RoomIcon room={option.id} className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{option.label}</p>
                    <p className="mt-1 text-sm text-muted">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={!room}
              onClick={() => setStep(2)}
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 2 && room && (
        <section>
          <h2 className="text-xl font-semibold text-ink">Step 2 — A few more details</h2>
          <p className="mt-1 text-sm text-muted">
            Selected: <strong>{ROOM_LABELS[room]}</strong>
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            {room === "BATHROOM" && (
              <div>
                <h3 className="font-medium text-ink">
                  Will it be closer than 60&nbsp;cm to water?
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Zones 1–2 near baths or showers require low-voltage accessories only.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ChoiceButton
                    selected={nearWater}
                    onClick={() => setNearWater(true)}
                    label="Yes, within 60 cm"
                  />
                  <ChoiceButton
                    selected={!nearWater}
                    onClick={() => setNearWater(false)}
                    label="No, further away (Zone 3)"
                  />
                </div>
              </div>
            )}

            {room === "KIDS_ROOM" && (
              <div className="flex gap-4 rounded-xl bg-emerald-50 p-4 text-emerald-900">
                <span className="text-2xl" aria-hidden>
                  ✓
                </span>
                <div>
                  <h3 className="font-semibold">Child protection enabled</h3>
                  <p className="mt-1 text-sm text-emerald-800">
                    We automatically require products with child protection for kids rooms.
                  </p>
                </div>
              </div>
            )}

            {room !== "BATHROOM" && room !== "KIDS_ROOM" && (
              <div>
                <h3 className="font-medium text-ink">Any children in the household?</h3>
                <p className="mt-1 text-sm text-muted">
                  Optional — we&apos;ll include child-safe products if needed.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ChoiceButton
                    selected={hasChildren}
                    onClick={() => setHasChildren(true)}
                    label="Yes"
                  />
                  <ChoiceButton
                    selected={!hasChildren}
                    onClick={() => setHasChildren(false)}
                    label="No"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={runSmartSelect}
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Find safe products
            </button>
          </div>
        </section>
      )}

      {step === 3 && loading && <SmartSelectLoadingSkeleton />}

      {step === 4 && room && (
        <section>
          {products.length === 0 ? (
            <EmptyState
              variant="warning"
              title="No safe products for this setup"
              description="For safety reasons, we do not recommend this configuration. Please choose IP44 or higher."
            >
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-amber-400 bg-white px-5 py-3 text-sm font-semibold text-amber-950 hover:bg-amber-50"
              >
                Change my answers
              </button>
              <button
                type="button"
                onClick={resetWizard}
                className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Start over
              </button>
              <Link
                href="/catalog"
                className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Browse catalog
              </Link>
            </EmptyState>
          ) : (
            <>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-xl text-white">
                  ✓
                </span>
                <h2 className="mt-4 text-xl font-bold text-emerald-900">
                  These items are safe for your selected environment
                </h2>
                <p className="mt-2 text-sm text-emerald-800">
                  Recommendations for <strong>{ROOM_LABELS[room]}</strong>
                  {room === "BATHROOM" && (
                    <>
                      {" "}
                      — {nearWater ? "within 60 cm of water (low voltage)" : "Zone 3 (IP44+)"}
                    </>
                  )}
                  {hasChildrenForApi && " · child protection required"}
                </p>
              </div>

              <div className="mt-8">
                <ProductGrid
                  products={products}
                  onProductSelect={setSelectedProduct}
                />
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={resetWizard}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-slate-600 hover:bg-white"
                >
                  Start over
                </button>
                <Link
                  href="/catalog"
                  className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Browse full catalog
                </Link>
              </div>
            </>
          )}
        </section>
      )}

      <ProductQuickViewModal
        isOpen={selectedProduct != null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 px-5 py-3 text-sm font-semibold transition ${
        selected
          ? "border-brand-600 bg-brand-50 text-brand-700"
          : "border-border bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
