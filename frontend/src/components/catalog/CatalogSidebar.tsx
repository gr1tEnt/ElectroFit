"use client";

import {
  ALL_IP_RATINGS,
  type CatalogFilters,
  IP_RATING_VALUES,
  type IpRating,
} from "@/types/product";

interface CatalogSidebarProps {
  filters: CatalogFilters;
  brands: string[];
  series: string[];
  ampsBounds: { min: number; max: number };
  onChange: (filters: CatalogFilters) => void;
  onReset: () => void;
}

export function CatalogSidebar({
  filters,
  brands,
  series,
  ampsBounds,
  onChange,
  onReset,
}: CatalogSidebarProps) {
  const toggleIp = (rating: IpRating) => {
    const next = filters.ipRatings.includes(rating)
      ? filters.ipRatings.filter((r) => r !== rating)
      : [...filters.ipRatings, rating];
    onChange({ ...filters, ipRatings: next });
  };

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="sticky top-20 rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Технічні фільтри
          </h2>
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
          >
            Скинути
          </button>
        </div>

        <div className="space-y-6">
          <FilterSection label="Бренд">
            <select
              value={filters.brand}
              onChange={(e) =>
                onChange({ ...filters, brand: e.target.value, series: "" })
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Усі бренди</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </FilterSection>

          <FilterSection label="Серія">
            <select
              value={filters.series}
              onChange={(e) => onChange({ ...filters, series: e.target.value })}
              disabled={!filters.brand && series.length === 0}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-50"
            >
              <option value="">Усі серії</option>
              {series.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FilterSection>

          <FilterSection label="Клас IP (мін.)">
            <p className="mb-2 text-xs text-muted">
              Оберіть мінімальний рівень захисту; показуються товари з відповідним або вищим класом.
            </p>
            <div className="space-y-2">
              {ALL_IP_RATINGS.map((rating) => (
                <label
                  key={rating}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.ipRatings.includes(rating)}
                    onChange={() => toggleIp(rating)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium">{rating}</span>
                  <span className="text-xs text-muted">≥ {IP_RATING_VALUES[rating]}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection label={`Ампераж (${filters.minAmps}–${filters.maxAmps} А)`}>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted">Мінімум</label>
                <input
                  type="range"
                  min={ampsBounds.min}
                  max={ampsBounds.max}
                  value={filters.minAmps}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      minAmps: Math.min(Number(e.target.value), filters.maxAmps),
                    })
                  }
                  className="w-full accent-brand-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Максимум</label>
                <input
                  type="range"
                  min={ampsBounds.min}
                  max={ampsBounds.max}
                  value={filters.maxAmps}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      maxAmps: Math.max(Number(e.target.value), filters.minAmps),
                    })
                  }
                  className="w-full accent-brand-600"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection label="Дитячий захист">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.childProtectionOnly}
                onChange={(e) =>
                  onChange({ ...filters, childProtectionOnly: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm">Лише з дитячим захистом</span>
            </label>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
        {label}
      </h3>
      {children}
    </div>
  );
}
