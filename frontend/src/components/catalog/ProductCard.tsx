import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isFrame = product.type === "FRAME";
  const price =
    typeof product.price === "number"
      ? product.price
      : Number(product.price);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {isFrame && product.framePostsCount != null && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow">
            {product.framePostsCount}-post frame
          </span>
        )}

        {product.ipRating && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
            {product.ipRating}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {product.brandName}
          {product.seriesName ? ` · ${product.seriesName}` : ""}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-ink group-hover:text-brand-700">
          {product.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted">{product.sku}</p>

        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          {product.maxAmps != null && (
            <li className="rounded-md bg-slate-100 px-2 py-0.5">{product.maxAmps} A max</li>
          )}
          {product.hasChildProtection && (
            <li className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700">
              Child protection
            </li>
          )}
          {product.categoryName && (
            <li className="rounded-md bg-slate-100 px-2 py-0.5">{product.categoryName}</li>
          )}
        </ul>

        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="text-lg font-bold text-ink">€{price.toFixed(2)}</p>
          <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
            {product.type}
          </span>
        </div>
      </div>
    </article>
  );
}
