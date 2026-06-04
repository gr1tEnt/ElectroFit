import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Electrical accessories for professionals
        </h1>
        <p className="mt-4 text-lg text-muted">
          Sockets, switches, frames, and mechanisms — filter by IP rating, amperage, and safety
          specs.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/configurator"
            className="inline-flex rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700"
          >
            Modular configurator
          </Link>
          <Link
            href="/smart-select"
            className="inline-flex rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50"
          >
            Smart Selector
          </Link>
          <Link
            href="/catalog"
            className="inline-flex rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50"
          >
            Professional catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
