import { ProductImageWithFallback } from "@/components/product/ProductImage";
import { productImageSrc } from "@/lib/productUtils";
import type { ConfiguratorSet } from "@/types/configurator";

interface ModularSetPreviewProps {
  set: ConfiguratorSet;
}

export function ModularSetPreview({ set }: ModularSetPreviewProps) {
  const slots = Array.from({ length: set.mechanismQuantity }, (_, i) => i);

  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-gradient-to-b from-white to-brand-50/40 p-6">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        Your modular assembly
      </p>

      <div className="mx-auto flex max-w-lg flex-col items-stretch gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          {slots.map((slot) => (
            <MechanismSlot
              key={slot}
              product={set.mechanism}
              label={`Socket ${slot + 1}`}
              compact={set.mechanismQuantity >= 5}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-brand-400">
          <span className="h-px flex-1 bg-brand-200" />
          <span className="text-xs font-medium">fits into</span>
          <span className="h-px flex-1 bg-brand-200" />
        </div>

        <FrameSlot frame={set.frame} posts={set.mechanismQuantity} />
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        {set.brandName} · {set.seriesName}
      </p>
    </div>
  );
}

function MechanismSlot({
  product,
  label,
  compact = false,
}: {
  product: ConfiguratorSet["mechanism"];
  label: string;
  compact?: boolean;
}) {
  const cardSize = compact ? "w-20" : "w-24";
  const imageSize = compact ? "h-20 w-20" : "h-24 w-24";

  return (
    <div
      className={`flex shrink-0 flex-col items-center rounded-xl border border-border bg-white p-2 shadow-sm sm:p-3 ${cardSize}`}
    >
      <div
        className={`flex items-center justify-center rounded-lg bg-white p-2 ${imageSize}`}
      >
        <ProductImageWithFallback
          src={productImageSrc(product.imageUrl ?? product.imageUrls?.[0])}
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-2 text-center text-xs font-medium text-ink">{label}</p>
      <p className="line-clamp-1 text-center text-[10px] text-muted">{product.name}</p>
    </div>
  );
}

function FrameSlot({
  frame,
  posts,
}: {
  frame: ConfiguratorSet["frame"];
  posts: number;
}) {
  return (
    <div className="rounded-xl border-2 border-brand-600 bg-white p-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <FrameIcon posts={posts} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
            {posts}-post frame
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
