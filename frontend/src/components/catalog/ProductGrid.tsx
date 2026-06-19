import { ProductCard } from "@/components/catalog/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  onResetFilters?: () => void;
}

function SearchEmptyIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
      <path strokeLinecap="round" d="M8 11h6M11 8v6" opacity="0.35" />
    </svg>
  );
}

export function ProductGrid({ products, onProductSelect, onResetFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="На жаль, за вашим запитом нічого не знайдено."
        description="Спробуйте змінити пошуковий запит або скиньте фільтри, щоб побачити більше товарів у каталозі."
        icon={<SearchEmptyIcon />}
      >
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Скинути фільтри
          </button>
        )}
      </EmptyState>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onProductSelect}
        />
      ))}
    </div>
  );
}
