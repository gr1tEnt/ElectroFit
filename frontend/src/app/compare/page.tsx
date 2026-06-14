import { ComparePageClient } from "@/components/compare/ComparePageClient";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">Порівняння товарів</h1>
      <p className="mt-2 text-muted">
        Порівняйте до 4 товарів за ключовими характеристиками в одній таблиці.
      </p>
      <div className="mt-8">
        <ComparePageClient />
      </div>
    </div>
  );
}
