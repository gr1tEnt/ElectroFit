import { ProductImageWithFallback } from "@/components/product/ProductImage";
import { productImageSrc } from "@/lib/productUtils";
import type { Product } from "@/types/product";

interface ModularSetPreviewProps {
  frame: Product;
  slots: Product[];
  brandName: string;
  seriesName: string;
  onSlotClick: (slotIndex: number) => void;
}

export function ModularSetPreview({
  frame,
  slots,
  brandName,
  seriesName,
  onSlotClick,
}: ModularSetPreviewProps) {
  const compact = slots.length >= 5;

  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-gradient-to-b from-white to-brand-50/40 p-6">
      <div className="mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Ваш модульний комплект
        </p>
        <p className="mt-1 text-sm text-muted">
          Натисніть на позицію, щоб змінити механізм — комбінуйте розетки, вимикачі, USB-порти тощо.
        </p>
      </div>

      <div className="mx-auto flex max-w-lg flex-col items-stretch gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          {slots.map((product, slotIndex) => (
            <MechanismSlot
              key={`${product.id}-${slotIndex}`}
              product={product}
              slotIndex={slotIndex}
              compact={compact}
              onChange={() => onSlotClick(slotIndex)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-brand-400">
          <span className="h-px flex-1 bg-brand-200" />
          <span className="text-xs font-medium">встановлюється в</span>
          <span className="h-px flex-1 bg-brand-200" />
        </div>

        <FrameSlot frame={frame} posts={slots.length} />
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        {brandName} · {seriesName}
      </p>
    </div>
  );
}

function MechanismSlot({
  product,
  slotIndex,
  compact = false,
  onChange,
}: {
  product: Product;
  slotIndex: number;
  compact?: boolean;
  onChange: () => void;
}) {
  const cardSize = compact ? "w-20" : "w-24";
  const imageSize = compact ? "h-20 w-20" : "h-24 w-24";

  return (
    <button
      type="button"
      onClick={onChange}
      className={`group relative flex shrink-0 flex-col items-center rounded-xl border border-border bg-white p-2 shadow-sm transition hover:border-brand-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:p-3 ${cardSize}`}
      aria-label={`Змінити механізм у позиції ${slotIndex + 1}: ${product.name}`}
    >
      <span className="absolute right-1 top-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
        Змінити
      </span>

      <div className={`flex items-center justify-center rounded-lg bg-white p-2 ${imageSize}`}>
        <ProductImageWithFallback
          src={productImageSrc(product.imageUrl ?? product.imageUrls?.[0] ?? "")}
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-2 text-center text-xs font-medium text-ink">Позиція {slotIndex + 1}</p>
      <p className="line-clamp-2 text-center text-[10px] leading-tight text-muted">{product.name}</p>
    </button>
  );
}

function FrameSlot({ frame, posts }: { frame: Product; posts: number }) {
  return (
    <div className="rounded-xl border-2 border-brand-600 bg-white p-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <FrameIcon posts={posts} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
            {posts}-позиційна рамка
          </span>
          <p className="mt-1 font-semibold text-ink">{frame.name}</p>
          <p className="font-mono text-xs text-muted">{frame.sku}</p>
        </div>
      </div>
    </div>
  );
}

function FrameIcon({ posts }: { posts: number }) {
  return (
    <svg className="h-10 w-10" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="4" width="36" height="16" rx="2" />
      {Array.from({ length: posts }).map((_, i) => (
        <rect
          key={i}
          x={4 + i * (32 / posts)}
          y="8"
          width={32 / posts - 2}
          height="8"
          rx="1"
          fill="currentColor"
          opacity={0.25}
        />
      ))}
    </svg>
  );
}
