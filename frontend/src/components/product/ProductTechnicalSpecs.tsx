import { isWaterResistant, resolveProductSpec, isFrameProduct } from "@/lib/productUtils";
import { ROOM_LABELS, type RoomId } from "@/types/smartSelect";
import type { Product } from "@/types/product";import type { ReactNode } from "react";

interface ProductTechnicalSpecsProps {
  product: Product;
}

function SpecRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand-700">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
      </div>
    </li>
  );
}

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export function ProductTechnicalSpecs({ product }: ProductTechnicalSpecsProps) {
  const spec = resolveProductSpec(product);
  const waterResistant = isWaterResistant(spec.ipRating);
  const isFrame = isFrameProduct(product);

  const hasAnySpec =
    spec.ipRating != null ||
    (!isFrame &&
      (spec.maxAmps != null ||
        spec.hasChildProtection != null ||
        spec.hasGrounding != null ||
        product.lowVoltage)) ||
    (isFrame && spec.framePostsCount != null);

  if (!hasAnySpec) {
    return null;
  }

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-ink">Технічні характеристики</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {spec.ipRating && (
          <Badge className="bg-slate-800 text-white">{spec.ipRating}</Badge>
        )}
        {waterResistant && (
          <Badge className="bg-brand-100 text-brand-700">Вологостійкий</Badge>
        )}
        {!isFrame && spec.hasChildProtection && (
          <Badge className="bg-emerald-100 text-emerald-800">Дитячий захист</Badge>
        )}
        {!isFrame && product.lowVoltage && (
          <Badge className="bg-violet-100 text-violet-800">SELV / низька напруга</Badge>
        )}
        {!isFrame && spec.hasGrounding === false && (
          <Badge className="bg-amber-100 text-amber-900">Без заземлення PE</Badge>
        )}
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {spec.ipRating && (
          <SpecRow
            label="Клас IP"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
            }
            value={
              <span>
                {spec.ipRating}
                {waterResistant && (
                  <span className="ml-2 font-normal text-brand-600">— підходить для зон бризок</span>
                )}
              </span>
            }
          />
        )}

        {!isFrame && spec.maxAmps != null && (
          <SpecRow
            label="Максимальний ампераж"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            value={`${spec.maxAmps} A`}
          />
        )}

        {!isFrame && spec.hasChildProtection != null && (
          <SpecRow
            label="Дитячий захист"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
            value={spec.hasChildProtection ? "Зі шторками / захищений" : "Стандартна розетка"}
          />
        )}

        {!isFrame && spec.hasGrounding != null && (
          <SpecRow
            label="Заземлення"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
            value={spec.hasGrounding ? "З захисним заземленням (PE)" : "Без PE (SELV або спеціальне використання)"}
          />
        )}

        {isFrame && spec.framePostsCount != null && (
          <SpecRow
            label="Розмір рамки"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
                />
              </svg>
            }
            value={`${spec.framePostsCount}-постова модульна рамка`}
          />
        )}
      </ul>

      {spec.compatibleRoomTypes.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          Підходить для:{" "}
          <span className="font-medium text-ink">
            {spec.compatibleRoomTypes
              .map((room) => ROOM_LABELS[room as RoomId] ?? room.replace(/_/g, " ").toLowerCase())
              .join(", ")}
          </span>
        </p>
      )}    </section>
  );
}
