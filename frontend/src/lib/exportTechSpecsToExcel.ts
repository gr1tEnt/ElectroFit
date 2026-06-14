import { formatComparePrice, getCompareValue } from "@/lib/compareDisplay";
import type { Product } from "@/types/product";

const COLUMN_KEYS = [
  "Назва",
  "Артикул",
  "Категорія",
  "Ціна",
  "Клас захисту IP",
  "Номінальний струм (А)",
  "Робоча напруга (В)",
  "Наявність заземлення",
  "Захисні шторки",
  "Матеріал",
  "Спосіб монтажу",
] as const;

type TechSpecColumn = (typeof COLUMN_KEYS)[number];

const COLUMN_MIN_WIDTHS: Record<TechSpecColumn, number> = {
  Назва: 42,
  Артикул: 18,
  Категорія: 14,
  Ціна: 10,
  "Клас захисту IP": 16,
  "Номінальний струм (А)": 20,
  "Робоча напруга (В)": 18,
  "Наявність заземлення": 22,
  "Захисні шторки": 16,
  Матеріал: 16,
  "Спосіб монтажу": 18,
};

function buildTechSpecRow(product: Product): Record<TechSpecColumn, string> {
  return {
    Назва: getCompareValue(product, "name"),
    Артикул: product.sku.trim(),
    Категорія: getCompareValue(product, "category"),
    Ціна: formatComparePrice(product),
    "Клас захисту IP": getCompareValue(product, "ip"),
    "Номінальний струм (А)": getCompareValue(product, "maxAmps"),
    "Робоча напруга (В)": getCompareValue(product, "voltage"),
    "Наявність заземлення": getCompareValue(product, "grounding"),
    "Захисні шторки": getCompareValue(product, "childProtection"),
    Матеріал: getCompareValue(product, "material"),
    "Спосіб монтажу": getCompareValue(product, "mounting"),
  };
}

function buildColumnWidths(rows: Record<TechSpecColumn, string>[]) {
  return COLUMN_KEYS.map((header) => {
    const contentMax = Math.max(
      header.length,
      ...rows.map((row) => (row[header] ?? "").length),
    );
    return {
      wch: Math.max(COLUMN_MIN_WIDTHS[header], Math.min(contentMax + 2, 60)),
    };
  });
}

export async function exportTechSpecsToExcel(products: Product[]): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Експорт Excel доступний лише в браузері.");
  }
  if (products.length === 0) {
    throw new Error("Немає товарів для експорту технічних параметрів.");
  }

  const XLSX = await import("xlsx");
  const rows = products.map(buildTechSpecRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = buildColumnWidths(rows);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Технічні параметри");
  XLSX.writeFile(workbook, "electrofit_tech_specs.xlsx");
}
