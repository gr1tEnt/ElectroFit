"use client";

import { getErrorMessage } from "@/lib/apiError";
import { exportEstimateToPdf } from "@/lib/exportEstimatePdf";
import type { CartLine } from "@/types/cart";
import { useCallback, useState } from "react";

interface ExportEstimateButtonProps {
  items: CartLine[];
}

export function ExportEstimateButton({ items }: ExportEstimateButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await exportEstimateToPdf(items);
    } catch (err) {
      window.alert(getErrorMessage(err, "Не вдалося створити PDF. Спробуйте ще раз."));
    } finally {
      setExporting(false);
    }
  }, [items]);

  return (
    <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Професійна функція</p>
          <p className="mt-1 text-sm text-muted">
            Завантажте друковану кошторисну оцінку для клієнта або проєктної документації.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={exporting}
          className="shrink-0 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50 disabled:cursor-wait disabled:opacity-60"
        >
          {exporting ? "Створення…" : "Експорт кошторису в PDF"}
        </button>
      </div>
    </div>
  );
}
