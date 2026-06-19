import Link from "next/link";

export function ForbiddenPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-ink">403</h1>
      <p className="mt-4 text-lg text-muted">Доступ заборонено</p>
      <Link href="/" className="mt-6 text-sm font-semibold text-brand-600 hover:underline">
        ← На головну
      </Link>
    </div>
  );
}
