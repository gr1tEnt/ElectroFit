import { productGalleryUrls, resolveProductImageUrl, resolveProductSpec } from "@/lib/productUtils";
import type { Product } from "@/types/product";

export const COMPARE_MISSING = "Не вказано";

export type CompareRowKey =
  | "photo"
  | "name"
  | "price"
  | "category"
  | "ip"
  | "series"
  | "maxAmps"
  | "voltage"
  | "grounding"
  | "childProtection"
  | "material"
  | "mounting";

export interface CompareRow {
  key: CompareRowKey;
  label: string;
}

export const COMPARE_ROWS: CompareRow[] = [
  { key: "photo", label: "Фото" },
  { key: "name", label: "Назва" },
  { key: "price", label: "Ціна" },
  { key: "category", label: "Категорія" },
  { key: "ip", label: "Клас захисту IP" },
  { key: "series", label: "Серія" },
  { key: "maxAmps", label: "Номінальний струм (А)" },
  { key: "voltage", label: "Робоча напруга (В)" },
  { key: "grounding", label: "Наявність заземлення" },
  { key: "childProtection", label: "Захисні шторки" },
  { key: "material", label: "Матеріал" },
  { key: "mounting", label: "Спосіб монтажу" },
];

const CATEGORY_LABELS: Record<string, string> = {
  Sockets: "Розетки",
  Switches: "Вимикачі",
  Frames: "Рамки",
  Accessories: "Аксесуари",
};

const MATERIAL_LABELS: Record<string, string> = {
  "abs + pc": "ABS + PC",
  thermoplastic: "Термопластик",
  "termoplastic": "Термопластик",
  glass: "Скло",
  metal: "Метал",
  steel: "Сталь",
  aluminum: "Алюміній",
};

function getDetailedAttribute(product: Product, ...keys: string[]): string | null {
  const attrs = product.detailedAttributes;
  if (!attrs) return null;
  for (const key of keys) {
    const match = Object.entries(attrs).find(([attrKey]) => attrKey.toLowerCase() === key.toLowerCase());
    if (match?.[1]?.trim()) {
      return match[1].trim();
    }
  }
  return null;
}

export function translateCategoryName(name: string | null | undefined): string {
  if (!name?.trim()) return "—";
  return CATEGORY_LABELS[name.trim()] ?? name.trim();
}

export function formatBooleanUk(value: boolean | null | undefined): string {
  if (value === true) return "Так";
  if (value === false) return "Ні";
  return COMPARE_MISSING;
}

export function translateMounting(value: string | null | undefined): string {
  if (!value?.trim()) return COMPARE_MISSING;
  const lower = value.toLowerCase();
  if (
    lower.includes("вбудован") ||
    lower.includes("zapušt") ||
    lower.includes("zapust") ||
    lower.includes("recess") ||
    lower.includes("flush") ||
    lower.includes("hidden") ||
    lower.includes("built-in")
  ) {
    return "Прихований";
  }
  if (
    lower.includes("наклад") ||
    lower.includes("surface") ||
    lower.includes("overlay") ||
    lower.includes("external")
  ) {
    return "Накладний";
  }
  return value.trim();
}

export function translateMaterial(value: string | null | undefined): string {
  if (!value?.trim()) return COMPARE_MISSING;
  const lower = value.toLowerCase();
  for (const [needle, label] of Object.entries(MATERIAL_LABELS)) {
    if (lower.includes(needle)) {
      return label;
    }
  }
  return value.trim();
}

export function translateVoltage(value: string | null | undefined, lowVoltage: boolean): string {
  if (value?.trim()) {
    return value
      .replace(/\bV\b/gi, "В")
      .replace(/\bAC\b/gi, "зм.")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (lowVoltage) return "12 В SELV";
  return COMPARE_MISSING;
}

export function formatNominalCurrent(product: Product): string {
  const fromAttribute = getDetailedAttribute(product, "Rated Current", "rated current");
  if (fromAttribute) {
    return fromAttribute.replace(/\bA\b/gi, " А").replace(/\s+/g, " ").trim();
  }

  const spec = resolveProductSpec(product);
  if (spec.maxAmps != null) {
    return `${spec.maxAmps} А`;
  }

  return COMPARE_MISSING;
}

export function getCompareValue(product: Product, key: CompareRowKey): string {
  const spec = resolveProductSpec(product);

  switch (key) {
    case "photo": {
      const primary = productGalleryUrls(product)[0];
      return primary ? resolveProductImageUrl(primary) : COMPARE_MISSING;
    }
    case "name":
      return product.name.trim();
    case "price":
      return product.price.toFixed(2);
    case "category":
      return translateCategoryName(product.categoryName);
    case "ip":
      return (spec.ipRating ?? "").trim() || COMPARE_MISSING;
    case "series":
      return (product.seriesName ?? getDetailedAttribute(product, "Series") ?? "").trim() || COMPARE_MISSING;
    case "maxAmps":
      return formatNominalCurrent(product);
    case "voltage":
      return translateVoltage(
        getDetailedAttribute(product, "Voltage", "voltage"),
        product.lowVoltage,
      );
    case "grounding":
      return formatBooleanUk(spec.hasGrounding);
    case "childProtection":
      return formatBooleanUk(spec.hasChildProtection);
    case "material":
      return translateMaterial(getDetailedAttribute(product, "Material", "material"));
    case "mounting":
      return translateMounting(getDetailedAttribute(product, "Mounting", "mounting"));
    default:
      return COMPARE_MISSING;
  }
}

export function rowValuesDiffer(products: Product[], key: CompareRowKey): boolean {
  if (products.length < 2) return false;
  const values = products.map((product) => getCompareValue(product, key));
  return new Set(values).size > 1;
}

export function formatComparePrice(product: Product): string {
  return `€${product.price.toFixed(2)}`;
}

export const COMPARE_DIFF_ROW_CLASS = "bg-blue-50";
export const COMPARE_DIFF_CELL_CLASS = "bg-blue-50/80";
