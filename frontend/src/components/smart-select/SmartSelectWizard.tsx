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
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ROOM_IDS: RoomId[] = ["BATHROOM", "KITCHEN", "BEDROOM", "KIDS_ROOM", "OUTDOOR"];

function parseRoomParam(value: string | null): RoomId | null {
  if (value && ROOM_IDS.includes(value as RoomId)) {
    return value as RoomId;
  }
  return null;
}

export function SmartSelectWizard() {
  const searchParams = useSearchParams();
  const roomFromUrlApplied = useRef(false);
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
      setError(getErrorMessage(err, "Щось пішло не так"));
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

  useEffect(() => {
    if (roomFromUrlApplied.current) {
      return;
    }
    const roomParam = parseRoomParam(searchParams.get("room"));
    if (!roomParam) {
      return;
    }
    roomFromUrlApplied.current = true;
    handleRoomSelect(roomParam);
    setStep(2);
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <div className="mb-4 text-center md:mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 sm:text-sm">
          Для початківців
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">Розумний підбір</h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          Відповідайте на кілька простих запитань, і ми підберемо товари, безпечні для вашого простору.
        </p>
      </div>

      <WizardProgress currentStep={step} />

      {step === 1 && (
        <section>
          <h2 className="text-lg font-semibold text-ink md:text-xl">Крок 1 — Оберіть кімнату</h2>
          <p className="mt-1 text-sm text-muted">Де ви встановлюватимете електричні аксесуари?</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ROOM_OPTIONS.map((option) => {
              const selected = room === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleRoomSelect(option.id)}
                  className={`flex min-h-11 items-center gap-3 rounded-2xl border-2 p-4 text-left transition md:gap-4 md:p-5 ${
                    selected
                      ? "border-brand-600 bg-brand-50 shadow-md"
                      : "border-border bg-white hover:border-brand-300 hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                      selected ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"
                    }`}
                  >
                    <RoomIcon room={option.id} className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{option.label}</p>
                    <p className="mt-1 text-sm text-muted">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={!room}
              onClick={() => setStep(2)}
              className="min-h-11 w-full rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              Продовжити
            </button>
          </div>
        </section>
      )}

      {step === 2 && room && (
        <section>
          <h2 className="text-lg font-semibold text-ink md:text-xl">Крок 2 — Ще кілька деталей</h2>
          <p className="mt-1 text-sm text-muted">
            Обрано: <strong>{ROOM_LABELS[room]}</strong>
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">
            {room === "BATHROOM" && (
              <div>
                <h3 className="font-medium text-ink">
                  Чи буде це ближче ніж 60&nbsp;см до води?
                </h3>
                <p className="mt-1 text-sm text-muted">
                  У зонах 1–2 біля ванни або душу потрібні лише аксесуари з низькою напругою.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ChoiceButton
                    selected={nearWater}
                    onClick={() => setNearWater(true)}
                    label="Так, у межах 60 см"
                  />
                  <ChoiceButton
                    selected={!nearWater}
                    onClick={() => setNearWater(false)}
                    label="Ні, далі (зона 3)"
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
                  <h3 className="font-semibold">Захист від дітей увімкнено</h3>
                  <p className="mt-1 text-sm text-emerald-800">
                    Для дитячих кімнат ми автоматично вимагаємо товари з захистом від дітей.
                  </p>
                </div>
              </div>
            )}

            {room !== "BATHROOM" && room !== "KIDS_ROOM" && (
              <div>
                <h3 className="font-medium text-ink">Чи є в домогосподарстві діти?</h3>
                <p className="mt-1 text-sm text-muted">
                  Необов&apos;язково — за потреби включимо безпечні для дітей товари.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ChoiceButton
                    selected={hasChildren}
                    onClick={() => setHasChildren(true)}
                    label="Так"
                  />
                  <ChoiceButton
                    selected={!hasChildren}
                    onClick={() => setHasChildren(false)}
                    label="Ні"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-11 w-full rounded-xl border border-border px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={runSmartSelect}
              className="min-h-11 w-full rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
            >
              Знайти безпечні товари
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
              title="Немає безпечних товарів для цієї конфігурації"
              description="З міркувань безпеки ми не рекомендуємо таку конфігурацію. Оберіть IP44 або вище."
            >
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-amber-400 bg-white px-5 py-3 text-sm font-semibold text-amber-950 hover:bg-amber-50"
              >
                Змінити відповіді
              </button>
              <button
                type="button"
                onClick={resetWizard}
                className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Почати спочатку
              </button>
              <Link
                href="/catalog"
                className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Переглянути каталог
              </Link>
            </EmptyState>
          ) : (
            <>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center md:p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-lg text-white md:h-12 md:w-12 md:text-xl">
                  ✓
                </span>
                <h2 className="mt-4 text-lg font-bold text-emerald-900 md:text-xl">
                  Ці товари безпечні для обраного середовища
                </h2>
                <p className="mt-2 text-sm text-emerald-800">
                  Рекомендації для <strong>{ROOM_LABELS[room]}</strong>
                  {room === "BATHROOM" && (
                    <>
                      {" "}
                      — {nearWater ? "у межах 60 см від води (низька напруга)" : "зона 3 (IP44+)"}
                    </>
                  )}
                  {hasChildrenForApi && " · потрібен захист від дітей"}
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
                  Почати спочатку
                </button>
                <Link
                  href="/catalog"
                  className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Переглянути весь каталог
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
      className={`min-h-11 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition ${
        selected
          ? "border-brand-600 bg-brand-50 text-brand-700"
          : "border-border bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
