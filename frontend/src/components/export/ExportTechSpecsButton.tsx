"use client";

import { getErrorMessage } from "@/lib/apiError";
import { exportTechSpecsToExcel } from "@/lib/exportTechSpecsToExcel";
import type { Product } from "@/types/product";
import { useCallback, useState } from "react";

interface ExportTechSpecsButtonProps {
  products: Product[];
  className?: string;
}

export function ExportTechSpecsButton({ products, className = "" }: ExportTechSpecsButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await exportTechSpecsToExcel(products);
    } catch (err) {
      window.alert(getErrorMessage(err, "Не вдалося завантажити Excel. Спробуйте ще раз."));
    } finally {
      setExporting(false);
    }
  }, [products]);

  return (
    <button
      type="button"
      onClick={() => void handleExport()}
      disabled={exporting || products.length === 0}
      className={
        className ||
        "rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {exporting ? "Завантаження…" : "Завантажити в Excel (.xlsx)"}
    </button>
  );
}
